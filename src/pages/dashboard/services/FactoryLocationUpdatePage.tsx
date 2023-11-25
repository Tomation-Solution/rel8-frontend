import { useRef } from "react";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import ServicesFileUploadInput from "../../../components/form/ServicesFileUploadInput"
import { useForm } from "react-hook-form";
import FormError from "../../../components/form/FormError";
import Button from "../../../components/button/Button";

export type FactoryLocationUpdateFormFields = {
  financial_statement:string;
  dues_receipt:string;
  factory_inspection_report: string;
 
};

const FactoryLocationUpdatePage = () => {
  const duesReceiptRef = useRef<HTMLInputElement | null>(null);
  const financialStatementInputRef = useRef<HTMLInputElement | null>(null);
  const factoryInspectionReportInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FactoryLocationUpdateFormFields>();

  const handlFactoryInspectionReportInputRefClick = () => {
    if ( factoryInspectionReportInputRef.current) {
       factoryInspectionReportInputRef.current.click();
    }
  };
  const handleFiancialStatementClick = () => {
      if (  financialStatementInputRef.current) {
        financialStatementInputRef.current.click();
    }
};
const handleDuesReceiptClick = () => {
  if ( duesReceiptRef.current) {
     duesReceiptRef.current.click();
  }
};

const onSubmit = (data: FactoryLocationUpdateFormFields) =>{
  // mutate(data)
  alert('dff')
  console.log('ghahhshshs',data)
} 

  return (
    <main>
    <BreadCrumb title='Factory Location Update' />
    <small>Fill the below to get your request updated</small>
    <div>

    <form className="flex flex-col w-full md:w-3/4  gap-y-4 py-3" onSubmit={handleSubmit(onSubmit)}  >
           <div>
           {errors.financial_statement?.type === 'required' && (<FormError message="Financial Statement is required" />)}
           <ServicesFileUploadInput register={register} text='Submit most recent financial statement' name={"financial_statement"} ref={financialStatementInputRef} onClick={handleFiancialStatementClick} />
           </div>
           <div>
           {errors.dues_receipt?.type === 'required' && (<FormError message="Dues Receipt is required" />)}
           <ServicesFileUploadInput register={register} text='Upload dues recipts ' name={"dues_receipt"} ref={duesReceiptRef} onClick={handleDuesReceiptClick} />
           </div>
           <div>
           {errors.factory_inspection_report?.type === 'required' && (<FormError message="Factory Inspection Report is required" />)}
           <ServicesFileUploadInput register={register} text='Uploadfactory inspection report' name={"factory_inspection_report"} ref={factoryInspectionReportInputRef} onClick={handlFactoryInspectionReportInputRefClick} />
           </div>

           <Button className=" w-full py-2  md:w-1/2" onClick={handleSubmit(onSubmit)} text="Submit" />
    </form>
       
       
     </div>
</main>
  )
}

export default FactoryLocationUpdatePage