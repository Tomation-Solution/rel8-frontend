import BreadCrumb from '../../../components/breadcrumb/BreadCrumb'
import TextInputWithImage from '../../../components/form/TextInputWithImage'
import FormError from '../../../components/form/FormError'
import { useForm } from 'react-hook-form'
import Button from '../../../components/button/Button'
import { useMutation } from 'react-query'
import {  supportInKind } from '../../../api/support/api-support'
import Toast from '../../../components/toast/Toast'
import { useParams } from 'react-router-dom'


export type SupportInKindFields = {
    heading: string;
    about:string;
    delivery_date: string;
    project:number;
  };
  

  
  const SuportInKindPage = () => {
    const { projectId } = useParams();
    const { notifyUser } = Toast();

  const { mutate, isLoading } = useMutation(supportInKind, {
    onSuccess: (_data) => {
      
      notifyUser("Thank you for supporting in Kind","success");
      reset()
      
     
    },
    onError: (error:any) => {
      const data:any = error.response.data
      console.log('login-pageerror',data)
      notifyUser("An error occured while supporting us","error");
    }
    
  });


  const onSubmit = (data: SupportInKindFields) =>{
    //   console.log('testing in cash page',data)
    if (projectId){

      data.project=parseInt(projectId)
      
    }
    // console.log('suppot in kind data',data)
    mutate(data)
    
  } 
    const { register,handleSubmit,reset,  formState: { errors } } = useForm<SupportInKindFields>();
  return (
    <div>
        <BreadCrumb title="Support in Kind" />
        <form className="flex flex-col w-full max-w-md gap-y-4" onSubmit={handleSubmit(onSubmit)}  > 
            <div className='grid'>   
                {errors.heading?.type === 'required' && (<FormError message="Support Item is required" />)}
                <small>Heading</small>
                <TextInputWithImage  register={register} name="heading" placeHolder=""  />
             </div>
            <div className='grid'>   
                {errors.about?.type === 'required' && (<FormError message="about is required" />)}
                <small>About</small>
                <TextInputWithImage   register={register} name="about" placeHolder=""  />
             </div>
            <div className='grid' > 
                {errors.delivery_date?.type === 'required' && (<FormError message="Delivery Date is required" />)}
                <small>Delivery Date</small>
                <TextInputWithImage  inputType='date'  register={register} name="delivery_date" placeHolder="" />
               
             </div>
             <Button isLoading={isLoading} text='Submit' />
            </form>
    </div>
  )
}

export default SuportInKindPage