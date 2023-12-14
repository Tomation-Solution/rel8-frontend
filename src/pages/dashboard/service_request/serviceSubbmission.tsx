
import { useForm,useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation, useQuery } from "react-query";
import Toast from "../../../components/toast/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { getMemberServiceSubmission, getServiceDetail, memberServiceSubmission } from "../../../api/serviceRequestApi";
import CircleLoader from "../../../components/loaders/CircleLoader";
import InputWithLabel from "../../../components/form/InputWithLabel";
import Button from "../../../components/button/Button";
import { useQuery as useCustomQuery } from "../../../utils/extra_functions";

const schema = yup.object({
    'custom_service':yup.string().required(),
    'fields_subbission':yup.array().of(yup.object({
        'name':yup.string().required(),
        'value':yup.string().required(),
    })),
    file_submission:yup.array().of(yup.object({
        'name_of_file':yup.string().required(),
        'file':yup.mixed(),
        

    }))
})
type FormI =  yup.InferType<typeof schema>



const ServiceSubbmission =()=>{
    const {id:service_id ,} = useParams();
    const navigate = useNavigate();
    const query= useCustomQuery();
    const member_submission_id = query.get('member_submission_id')
    console.log({member_submission_id})
    const { 
        register,setValue, 
        handleSubmit,control,
        // formState: { errors },
      } = useForm<FormI>({ resolver: yupResolver(schema) });

      const { fields:fields_subbission, 
        // append:fields_subbissionAppend, remove:fields_subbissionRemove
     } = useFieldArray({
        name: "fields_subbission",
        control,
      });
      const { fields:file_submission, 
        // append:file_submissionAppend, remove:file_submissionRemove
     } = useFieldArray({
        name: "file_submission",
        control,
      });

      const { notifyUser } = Toast();


      const {isLoading,} = useQuery(['getServiceDetail',service_id],()=>getServiceDetail({service_id:typeof service_id==='string'?service_id:'-1'}),{
        'enabled':typeof service_id==='string'?true:false,
        refetchOnWindowFocus:false,
        'onSuccess':(data)=>{
            console.log(data)
            if(typeof member_submission_id !=='string'){
                //if it member_submission_id  is string then it should use the update function to fetch the fields
                if(typeof service_id =='string'){
                    setValue('custom_service',service_id)
                }
                
                setValue('fields_subbission',data.fields_subbission.fields.map((d,)=>({
                    'name':d,
                    // 'value':typeof edit=='string'?d
                    'value':''
                })))
    
                setValue('file_submission',data.file_subbission.fields.map((d,)=>({
                    'file':'',
                    'name_of_file':d
                })))
            }
        }
    })

    const {isLoading:gettingMemberServiceSubmission,} = useQuery(['getMemberServiceSubmission',member_submission_id],()=>getMemberServiceSubmission({member_submission_id:typeof member_submission_id==='string'?member_submission_id:'-1'}),{
        'enabled':typeof member_submission_id==='string'?true:false,
        refetchOnWindowFocus:false,
        'onSuccess':(data)=>{
                        setValue('custom_service',data.custom_service.toString())
            setValue('fields_subbission',data.fields_subbission.map((d,)=>({
                'name':d.name,
                'value':d.value,
                'id':d.id
            })))

            setValue('file_submission',data.files.map((d,)=>({
                'file':null,
                'name_of_file':d.name,
                'file_link':d.value
            })))
        }
    })

    const {isLoading:submitting, mutate} = useMutation(memberServiceSubmission,{
        'onSuccess':()=>{
            // console.log(d)
                notifyUser('Our Staff would reach out to you soon','success')
                navigate(`/service-requests/${service_id}`)
        }
    })
      const onSubmit=(data:FormI)=>{
        // console.log(data)
        const form= new FormData()
        //we get all the files and rename it
        data?.file_submission?.map((file,)=>{
            // console.log(file.file)
            // console.log(file.file[0])
            form.append('files',file.file[0],file.name_of_file)  
        })
    form.append('fields_subbission',JSON.stringify(data.fields_subbission))
        if(typeof service_id=='string'){
            form.append('custom_service',service_id)
        }
        mutate(form)
      }

    return (
        <div>
                    {(isLoading||gettingMemberServiceSubmission||submitting)&&<CircleLoader />}
            <form
            onSubmit={handleSubmit(onSubmit)}
            style={{'margin':'5px auto','maxWidth':'700px',
            // 'border':'1px solid red'
        }}
            >

                  {
                    fields_subbission.map((d,index)=>(
                        <div style={{'padding':'.8rem 0'}}
                        key={index}
                        >
                            <InputWithLabel
                        label={d.name}
                        register={register(`fields_subbission.${index}.value`)}
                        />
                        </div>
                    ))
                }
                {
                    file_submission.map((d,index)=>(
                    <div
                    style={{'padding':'.8rem 0'}}
                        key={index}
                    >
                        <InputWithLabel 
                        label={d.name_of_file}
                        register={register(`file_submission.${index}.file`)}
                        type='file'
                        />
                                {
                            // @ts-ignore
                            d?.file_link?
                            <a 
                            // @ts-ignore
                            href={d.file_link} target="_blank" rel="noreferrer" className="text-[blue]">view current upload</a>
                        :""
                                }
                    </div>
                    ))
                }
                <Button 
                // style={{'width':'250px','margin':'0 auto'}}
                className="w-[250px] mx-autp"
                
                text='Submit' />
            </form>

        </div>
    )
}

export default ServiceSubbmission