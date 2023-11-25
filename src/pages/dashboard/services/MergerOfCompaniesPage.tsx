import { useForm } from "react-hook-form";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import FormError from "../../../components/form/FormError";
import ServicesFileUploadInput from "../../../components/form/ServicesFileUploadInput";
import { useRef } from "react";
import Button from "../../../components/button/Button";

export type MergerofCompanyFormFields = {
  request_letter:string;
  financial_statement:string;
  due_receipt:string;
  membership_certificate:string; 
}

const MergerOfCompanies = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MergerofCompanyFormFields>();

  const requestLetterInputRef = useRef<HTMLInputElement | null>(null);
  const financialStatementInputRef = useRef<HTMLInputElement | null>(null);
  const dueReceiptRef = useRef<HTMLInputElement | null>(null);
  const incorporationCertificateInputRef = useRef<HTMLInputElement | null>(null);

  const handleRequestLetterClick = () => {
    if (  requestLetterInputRef.current) {
      requestLetterInputRef.current.click();
  }
};
const handleMembershipDueReceiptClick = () => {
  if (  dueReceiptRef.current) {
    dueReceiptRef.current.click();
}
};
const handleFinancialStatementClick = () => {
  if (  financialStatementInputRef.current) {
    financialStatementInputRef.current.click();
}
};

const handleIncorporationCertificateClick = () => {
  if (  incorporationCertificateInputRef.current) {
    incorporationCertificateInputRef.current.click();
}
};

const onSubmit = (data: MergerofCompanyFormFields) =>{
  // mutate(data)
  alert('dff')
  console.log('ghahhshshs',data)
} 

  return (
    <main>
    <BreadCrumb title='Merger of Companies' />
    <small>Attach requirement for Merger</small>
    <div>

    <form className="flex flex-col w-full md:w-3/4  gap-y-4 py-3" onSubmit={handleSubmit(onSubmit)}  >
           <div>
           {errors.request_letter?.type === 'required' && (<FormError message="Request Letter is required" />)}
           <ServicesFileUploadInput register={register} text='Upload request letter' name={"request_letter"} ref={incorporationCertificateInputRef} onClick={handleRequestLetterClick} />
           </div>
           <div>
           {errors.financial_statement?.type === 'required' && (<FormError message="Financial Statement is required" />)}
           <ServicesFileUploadInput register={register} text='Submit most recent financial statement' name={"financial_statement"} ref={financialStatementInputRef} onClick={handleFinancialStatementClick} />
           </div>
           <div>
           {errors.due_receipt?.type === 'required' && (<FormError message="Due Receipt is required" />)}
           <ServicesFileUploadInput register={register} text='Due receipt' name={"due_recipt"} ref={dueReceiptRef} onClick={handleMembershipDueReceiptClick} />
           </div>
           <div>
           {errors.membership_certificate?.type === 'required' && (<FormError message="Membership Certifcate is required" />)}
           <ServicesFileUploadInput register={register} text='Upload membership cert for both companies' name={"membership certificate"} ref={incorporationCertificateInputRef} onClick={handleIncorporationCertificateClick} />
           </div>
          

           <Button className=" w-full py-2  md:w-1/2" onClick={handleSubmit(onSubmit)} text="Submit" />
    </form>
       
       
     </div>
</main>
  )
}

export default MergerOfCompanies