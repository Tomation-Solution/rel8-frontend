import { useForm } from "react-hook-form";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import FormError from "../../../components/form/FormError";
import TextInputWithImage from "../../../components/form/TextInputWithImage";
import Button from "../../../components/button/Button";


export type ReIssuanceFormFormFields = {
    name_of_organisation: string;
    address: string;
    contact_person: string;
    phone_number: string;
  };

const ReIssuanceForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<ReIssuanceFormFormFields>();

    const onSubmit = (data: ReIssuanceFormFormFields) =>{
        // mutate(data)
        // alert('dff')
        console.log('ghahhshshs',data)
      } 

  return (
    <main>
        <BreadCrumb title="Reissuance Form"/>
        <small>Please fill the form to move on with your request</small>
        <form  className="flex flex-col w-full md:w-1/2 sm:w-3/4 my-3 gap-y-4" onSubmit={handleSubmit(onSubmit)} >
            <div>   
                {errors.name_of_organisation?.type === 'required' && (<FormError message="Name of Organisation is required" />)}
                <TextInputWithImage   register={register} name="name_of_organisation" placeHolder="Name of Organisation"  />
            </div>
            <div>   
                {errors.address?.type === 'required' && (<FormError message="Address is required" />)}
                <TextInputWithImage   register={register} name="address" placeHolder="Address"  />
            </div>
            <div>   
                {errors.contact_person?.type === 'required' && (<FormError message="Contact Person is required" />)}
                <TextInputWithImage   register={register} name="contact_person" placeHolder="Contact Person"  />
            </div>
            <div>   
                {errors.phone_number?.type === 'required' && (<FormError message="Phone number is required" />)}
                <TextInputWithImage   register={register} name="phone_number" placeHolder="Phone Numbet"  />
            </div>
            <Button className=" w-full py-2  max-w-[200px] rounded-md" onClick={handleSubmit(onSubmit)} text="Submit" />
           
        </form>
    </main>
  )
}

export default ReIssuanceForm