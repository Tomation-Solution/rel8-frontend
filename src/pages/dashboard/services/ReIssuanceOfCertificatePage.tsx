import { useRef } from 'react'
import BreadCrumb from '../../../components/breadcrumb/BreadCrumb'
import { useForm } from 'react-hook-form';
import FormError from '../../../components/form/FormError';
import Button from '../../../components/button/Button';
import ServicesFileUploadInput from '../../../components/form/ServicesFileUploadInput';

export type ReIssuanceCertificateFormFields = {
    membership_recipt: string;
    note: string;
   
  };


const ReIssuanceOfCertificatePage = () => {

    const membershipReceiptInputRef = useRef<HTMLInputElement | null>(null);

    const handleMembershipReceiptClick = () => {
        if ( membershipReceiptInputRef.current) {
           membershipReceiptInputRef.current.click();
        }
      };

    const { register, handleSubmit, formState: { errors } } = useForm<ReIssuanceCertificateFormFields>();

    const onSubmit = (data: ReIssuanceCertificateFormFields) =>{
        // mutate(data)
        // alert('dff')
        console.log('ghahhshshs',data)
      } 

  return (
    <main>
        <BreadCrumb title="Reissuance of certificate"/>
        <small>Attach requirement for reissuance of certificate</small>
        <form  className="flex flex-col w-full md:w-1/2 sm:w-3/4 my-3 gap-y-4" onSubmit={handleSubmit(onSubmit)} >
            <div>   
                {errors.membership_recipt?.type === 'required' && (<FormError message="Membership Receipt is required" />)}
                <ServicesFileUploadInput register={register} text='Attach Membership receipt' name={"membership_recipt"} ref={membershipReceiptInputRef} onClick={handleMembershipReceiptClick} />
            </div>
            
            <div>   
                {errors.note?.type === 'required' && (<FormError message="Note is required" />)}
                <textarea name="note" placeholder='Note' className='form-control h-[150px] text-sm p-2'></textarea>
            </div>
            <Button className=" w-full py-2  max-w-[200px] rounded-md" onClick={handleSubmit(onSubmit)} text="Submit" />
           
        </form>
    </main>
  )
}

export default ReIssuanceOfCertificatePage