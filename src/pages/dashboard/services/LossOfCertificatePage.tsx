import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import { useRef } from "react";
import ServicesFileUploadInput from "../../../components/form/ServicesFileUploadInput";
import { useForm } from "react-hook-form";
import Button from "../../../components/button/Button";
import FormError from "../../../components/form/FormError";

export type LossOfCertificateFormFields = {
  membership_recipt: string;
  certificate_afidavit:string;
  dues_recipt:string;
  financial_statement:string;
  incorporation_certficate:string;
  
};

const LossOfCertificatePage = () => {

  const membershipReceiptInputRef = useRef<HTMLInputElement | null>(null);
  const certificateInputRef = useRef<HTMLInputElement | null>(null);
  const duesReceiptInputRef = useRef<HTMLInputElement | null>(null);
  const financialStatementReceiptInputRef = useRef<HTMLInputElement | null>(null);
  const incorporationCertificateInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LossOfCertificateFormFields>();

  const handleMembershipReceiptClick = () => {
    if ( membershipReceiptInputRef.current) {
       membershipReceiptInputRef.current.click();
    }
  };
  const handleCertificateClick = () => {
    if ( certificateInputRef.current) {
       certificateInputRef.current.click();
    }
  };
  const handleduesReceiptClick = () => {
    if (  duesReceiptInputRef.current) {
        duesReceiptInputRef.current.click();
    }
  };
  const handlefinancialStatementReceiptClick = () => {
    if (  financialStatementReceiptInputRef.current) {
        financialStatementReceiptInputRef.current.click();
    }
  };
  const handleIncorporationCertificateInputRefClick = () => {
    if (  incorporationCertificateInputRef.current) {
        incorporationCertificateInputRef.current.click();
    }
  };

  const onSubmit = (data: LossOfCertificateFormFields) =>{
    // mutate(data)
    alert('dff')
    console.log('ghahhshshs',data)
  } 


  return (
    <main>
           <BreadCrumb title='Loss of Certificate' />
           <small>Attach requirement for loss of Certifcate</small>
           <div>

           <form className="flex flex-col w-full md:w-3/4  gap-y-4 py-3" onSubmit={handleSubmit(onSubmit)}  >
                  <div>
                  {errors.membership_recipt?.type === 'required' && (<FormError message="Membership Receipt is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload Membership receipt' name={"membership_recipt"} ref={membershipReceiptInputRef} onClick={handleMembershipReceiptClick} />
                  </div>
                  <div>
                  {errors.certificate_afidavit?.type === 'required' && (<FormError message="Certificate Avidavit is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload certificate loss afidavit' name={"certificate_afidavit"} ref={certificateInputRef} onClick={handleCertificateClick} />
                  </div>
                  <div>
                  {errors.dues_recipt?.type === 'required' && (<FormError message="Dues Receipt is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload all Dues' name={"dues_recipt"} ref={duesReceiptInputRef} onClick={handleduesReceiptClick} />
                  </div>
                  <div>
                  {errors.financial_statement?.type === 'required' && (<FormError message="Financialo Statement is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload Financial Statement (2 years)' name={"financial_statement"} ref={financialStatementReceiptInputRef} onClick={handlefinancialStatementReceiptClick} />
                  </div>
                  <div>
                  {errors.incorporation_certficate?.type === 'required' && (<FormError message="Incorporation Certficate is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload Incorporation Certificate' name={"incorporation_certficate"} ref={incorporationCertificateInputRef} onClick={handleIncorporationCertificateInputRefClick} />
                  </div>
                  
                  
                  <Button className=" w-full py-2  md:w-1/2" onClick={handleSubmit(onSubmit)} text="Submit" />
           </form>
              
              
            </div>
    </main>
  )
}

export default LossOfCertificatePage