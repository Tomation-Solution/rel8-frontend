import { useRef } from "react";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import FormError from "../../../components/form/FormError";
import { useForm } from "react-hook-form";
import ServicesFileUploadInput from "../../../components/form/ServicesFileUploadInput";
import Button from "../../../components/button/Button";

export type DeactivationOfMembershipFormFields = {
    deactivation_letter: string;
    financial_statement:string;
    levy_recipt:string;
}
    
const DeactivationOfMembershipPage = () => {

    const deactivationLetterRequestInputRef = useRef<HTMLInputElement | null>(null);
    const levyReceiptRef = useRef<HTMLInputElement | null>(null);
    const financialStatementInputRef = useRef<HTMLInputElement | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<DeactivationOfMembershipFormFields>();

    const handleDeactivationLetterRequestClick = () => {
        if ( deactivationLetterRequestInputRef.current) {
           deactivationLetterRequestInputRef.current.click();
        }
      };
      const handleFiancialStatementClick = () => {
          if (  financialStatementInputRef.current) {
            financialStatementInputRef.current.click();
        }
    };
    const handleLevyReceiptClick = () => {
      if ( levyReceiptRef.current) {
         levyReceiptRef.current.click();
      }
    };

    const onSubmit = (data: DeactivationOfMembershipFormFields) =>{
        // mutate(data)
        alert('dff')
        console.log('ghahhshshs',data)
      } 
   
  return (
    <main>
           <BreadCrumb title='Deactivation of Membership' />
           <small>Please fill the form to move on with your request</small>
           <div>

           <form className="flex flex-col w-full md:w-3/4  gap-y-4 py-3" onSubmit={handleSubmit(onSubmit)}  >
                  <div>
                  {errors.deactivation_letter?.type === 'required' && (<FormError message="Deactivation Request( Letter) is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload Membership receipt' name={"deactivation_letter"} ref={deactivationLetterRequestInputRef} onClick={handleDeactivationLetterRequestClick} />
                  </div>
                  <div>
                  {errors.financial_statement?.type === 'required' && (<FormError message="Financial Statement is required" />)}
                  <ServicesFileUploadInput register={register} text='Submit most recent financial statement' name={"financial_statement"} ref={financialStatementInputRef} onClick={handleFiancialStatementClick} />
                  </div>
                  <div>
                  {errors.levy_recipt?.type === 'required' && (<FormError message="Levy Receipt is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload all levy recipts (Up-to-date)' name={"levy_recipt"} ref={levyReceiptRef} onClick={handleLevyReceiptClick} />
                  </div>
                 
                 
                  
                  
                  <Button className=" w-full py-2  md:w-1/2" onClick={handleSubmit(onSubmit)} text="Submit" />
           </form>
              
              
            </div>
    </main>
  )
}

export default DeactivationOfMembershipPage