import  { useRef } from 'react'
import BreadCrumb from '../../../components/breadcrumb/BreadCrumb';
import ServicesFileUploadInput from '../../../components/form/ServicesFileUploadInput';
import FormError from '../../../components/form/FormError';
import { useForm } from 'react-hook-form';
import Button from '../../../components/button/Button';

export type ChangeOfNameFormFields = {
  membership_certificate:string;
  membership_due_receipt:string;
  financial_statement:string;
  incorporation_certificate: string;
}


const onSubmit = (data: ChangeOfNameFormFields) =>{
  
  console.log('ghahhshshs',data)
} 

const ChangeOfNamePage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChangeOfNameFormFields>();

  const membershipCertificateRef = useRef<HTMLInputElement | null>(null);
  const membershipDueReceiptRef = useRef<HTMLInputElement | null>(null);
  const financialStatementInputRef = useRef<HTMLInputElement | null>(null);
  const incorporationCertificateInputRef = useRef<HTMLInputElement | null>(null);

  const handleMembershipCertificateClick = () => {
    if (  membershipCertificateRef.current) {
      membershipCertificateRef.current.click();
  }
};
const handleMembershipDueReceiptClick = () => {
  if (  membershipDueReceiptRef.current) {
    membershipDueReceiptRef.current.click();
}
};
const handleFiancialStatementClick = () => {
  if (  financialStatementInputRef.current) {
    financialStatementInputRef.current.click();
}
};

const handleIncorporationCertificateClick = () => {
  if (  incorporationCertificateInputRef.current) {
    incorporationCertificateInputRef.current.click();
}
};





  return (
    <main>
    <BreadCrumb title='Change of Name' />
    <small>Attach requirement for Change of Name</small>
    <div>

    <form className="flex flex-col w-full md:w-3/4  gap-y-4 py-3" onSubmit={handleSubmit(onSubmit)}  >
           <div>
           {errors.membership_certificate?.type === 'required' && (<FormError message="Membership Certifcate is required" />)}
           <ServicesFileUploadInput register={register} text='Attach Membership Certificate' name={"membership certificate"} ref={membershipCertificateRef} onClick={handleMembershipCertificateClick} />
           </div>
           <div>
           {errors.membership_due_receipt?.type === 'required' && (<FormError message="Membership Due Receipt is required" />)}
           <ServicesFileUploadInput register={register} text='Membership due receipt' name={"membership_due_recipt"} ref={membershipDueReceiptRef} onClick={handleMembershipDueReceiptClick} />
           </div>
           <div>
           {errors.financial_statement?.type === 'required' && (<FormError message="Financial Statement is required" />)}
           <ServicesFileUploadInput register={register} text='Upload Financial Statement (2-years)' name={"financial_statement"} ref={financialStatementInputRef} onClick={handleFiancialStatementClick} />
           </div>
           <div>
           {errors.incorporation_certificate?.type === 'required' && (<FormError message="Incorporation Certificate is required" />)}
           <ServicesFileUploadInput register={register} text='Upload Incorporation Certificate' name={"incorporation_certificate"} ref={incorporationCertificateInputRef} onClick={handleIncorporationCertificateClick} />
           </div>
          

           <Button className=" w-full py-2  md:w-1/2" onClick={handleSubmit(onSubmit)} text="Submit" />
    </form>
       
       
     </div>
</main>
  )
}

export default ChangeOfNamePage