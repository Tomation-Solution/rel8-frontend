import { useForm } from "react-hook-form";
import FormError from "../../../components/form/FormError";
import TextInputWithImage from "../../../components/form/TextInputWithImage";
import userIconImage from "../../../assets/icons/user.png";
import messageIcon from '../../../assets/icons/message.png'
import Button from "../../../components/button/Button";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";

export type TechnicalSupportFormFields = {
    name:string;
    email:string;
    message:string;
  
  };

const TechnicalSupport = () => {


    const { register, handleSubmit, formState: { errors } } = useForm<TechnicalSupportFormFields>();
    

      const onSubmit = (formData: TechnicalSupportFormFields) =>{
            console.log(formData)
        //    mutate(formData)
        
      } 

    



  return (
    <main>
        <div className="className='w-full lg:w-3/4'" >
          <BreadCrumb title="Technical Support" />
          <small>We are here to help, Please let us know your challenge</small>
        <form className="flex flex-col w-full max-w-md gap-y-4 my-3" onSubmit={handleSubmit(onSubmit)} >


            <div>   
                {errors.name?.type === 'required' && (<FormError message="Name is required" />)}
                <TextInputWithImage   register={register} name="name" placeHolder="Name" image={userIconImage} />
              </div>
              
              <div>   
                {errors.email?.type === 'required' && (<FormError message="Email is required" />)}
                <TextInputWithImage inputType="email"  register={register}  name="email" placeHolder="Email" image={messageIcon} />
              </div>
              
              <div>
              {errors.message?.type === 'required' && (<FormError message="Message is required" />)}
              <textarea className="form-control p-2 text-sm rounded-md h-[200px]" placeholder="message" name="message" ></textarea>
           
              </div>
              

             
             <div className="grid">
               <Button text='Submit' />
            </div>
            </form>
        </div>
    </main>
  )
}

export default TechnicalSupport