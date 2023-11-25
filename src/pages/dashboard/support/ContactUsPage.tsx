import BreadCrumb from '../../../components/breadcrumb/BreadCrumb'
import { useForm } from 'react-hook-form';
import TextInputWithImage from '../../../components/form/TextInputWithImage';
import userIconImage from "../../../assets/icons/user.png";
import messageIcon from '../../../assets/icons/message.png'
import FormError from '../../../components/form/FormError';
import Button from '../../../components/button/Button';

export type ContactUsFormFields = {
    name:string;
    email:string;
    message:string;
  
  };

const ContactUsPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<ContactUsFormFields>();
    

      const onSubmit = (formData: ContactUsFormFields) =>{
            console.log(formData)
        //    mutate(formData)
        
      } 

  return (
    <main>
        <div className="className='w-full lg:w-3/4'" >
          <BreadCrumb title="Contact Us" />
         
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
              <textarea className="form-control p-2  rounded-md h-[200px]" placeholder="message" name="message" ></textarea>
           
              </div>
              

             
             <div className="grid">
               <Button text='Submit' />
            </div>
            </form>
        </div>
    </main>
  )
}

export default ContactUsPage