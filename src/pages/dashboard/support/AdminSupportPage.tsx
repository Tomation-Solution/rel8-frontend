import { useForm } from "react-hook-form";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import TextInputWithImage from "../../../components/form/TextInputWithImage";
import FormError from "../../../components/form/FormError";
import userIconImage from "../../../assets/icons/user.png";
import Button from "../../../components/button/Button";

export type AdminSupportFormFields = {
    name:string;
    division:string;
    message:string;
  
  };


const AdminSupportPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<AdminSupportFormFields>();
    

    const onSubmit = (formData: AdminSupportFormFields) =>{
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
            {errors.division?.type === 'required' && (<FormError message="Division is required" />)}
            <TextInputWithImage   register={register}  name="division" placeHolder="Division"  />
          </div>
          
          <div>
          {errors.message?.type === 'required' && (<FormError message="Message is required" />)}
          <textarea className="form-control p-2 rounded-md h-[200px]" placeholder="message" name="message" ></textarea>
       
          </div>
          

         
         <div className="grid">
           <Button text='Submit' />
        </div>
        </form>
    </div>
</main>
  )
}

export default AdminSupportPage