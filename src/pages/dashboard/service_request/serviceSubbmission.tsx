
import { useForm,useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation, useQuery } from "react-query";
import Toast from "../../../components/toast/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceDetail, memberServiceSubmission } from "../../../api/serviceRequestApi";
import CircleLoader from "../../../components/loaders/CircleLoader";
import InputWithLabel from "../../../components/form/InputWithLabel";
import Button from "../../../components/button/Button";


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
    const {id:service_id} = useParams()
    const navigate = useNavigate()
    const { 
        register,setValue, 
        handleSubmit,control,
        formState: { errors },
      } = useForm<FormI>({ resolver: yupResolver(schema) });

      const { fields:fields_subbission, append:fields_subbissionAppend, remove:fields_subbissionRemove } = useFieldArray({
        name: "fields_subbission",
        control,
      });
      const { fields:file_submission, append:file_submissionAppend, remove:file_submissionRemove } = useFieldArray({
        name: "file_submission",
        control,
      });

      const { notifyUser } = Toast();


      const {isLoading,data} = useQuery(['getServiceDetail',service_id],()=>getServiceDetail({service_id:typeof service_id==='string'?service_id:'-1'}),{
        'enabled':typeof service_id==='string'?true:false,
        refetchOnWindowFocus:false,
        'onSuccess':(data:ServiceType)=>{
            console.log(data)
            if(typeof service_id =='string'){
                setValue('custom_service',service_id)
            }
            
            setValue('fields_subbission',data.fields_subbission.fields.map((d,index)=>({
                'name':d,
                // 'value':typeof edit=='string'?d
                'value':''
            })))

            setValue('file_submission',data.file_subbission.fields.map((d,index)=>({
                'file':'',
                'name_of_file':d
            })))
        }
    })
    const {isLoading:submitting, mutate} = useMutation(memberServiceSubmission,{
        'onSuccess':(d)=>{
                notifyUser('Our Staff would reach out to you soon','success')
                navigate(`/service-requests/${d.id}`)

        }
    })
      const onSubmit=(data:FormI)=>{
        // console.log(data)
        const form= new FormData()
        //we get all the files and rename it
        data.file_submission.map((file,index)=>{
            console.log(file.file)
            console.log(file.file[0])
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
                    {(isLoading||submitting)&&<CircleLoader />}
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