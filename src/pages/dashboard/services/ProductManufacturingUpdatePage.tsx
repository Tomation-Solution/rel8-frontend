import { useRef } from "react";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import { useForm } from "react-hook-form";
import ServicesFileUploadInput from "../../../components/form/ServicesFileUploadInput";
import FormError from "../../../components/form/FormError";
import Button from "../../../components/button/Button";

export type ProductManufacturingFormFields = {
  financial_statement:string;
  levy_recipt:string;
  product_update_report: string;
 
};


const ProductManufacturingUpdatePage = () => {

  const levyReceiptRef = useRef<HTMLInputElement | null>(null);
  const financialStatementInputRef = useRef<HTMLInputElement | null>(null);
  const productUpdateReportInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductManufacturingFormFields>();

  const handleProductUpdateReportInputRefClick = () => {
    if ( productUpdateReportInputRef.current) {
       productUpdateReportInputRef.current.click();
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

const onSubmit = (data: ProductManufacturingFormFields) =>{
  // mutate(data)
  // alert('dff')
  console.log('ghahhshshs',data)
} 

  return (
    <main>
           <BreadCrumb title='Product Manufacturing Update' />
           <small>Fill the below to get your request updated</small>
           <div>

           <form className="flex flex-col w-full md:w-3/4  gap-y-4 py-3" onSubmit={handleSubmit(onSubmit)}  >
                  <div>
                  {errors.financial_statement?.type === 'required' && (<FormError message="Financial Statement is required" />)}
                  <ServicesFileUploadInput register={register} text='Submit most recent financial statement' name={"financial_statement"} ref={financialStatementInputRef} onClick={handleFiancialStatementClick} />
                  </div>
                  <div>
                  {errors.levy_recipt?.type === 'required' && (<FormError message="Levy Receipt is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload all levy recipts (Up-to-date)' name={"levy_recipt"} ref={levyReceiptRef} onClick={handleLevyReceiptClick} />
                  </div>
                  <div>
                  {errors.product_update_report?.type === 'required' && (<FormError message="Product Update Report is required" />)}
                  <ServicesFileUploadInput register={register} text='Upload Product update report' name={"deactivation_letter"} ref={productUpdateReportInputRef} onClick={handleProductUpdateReportInputRefClick} />
                  </div>
                 
                 
                  
                  
                  <Button className=" w-full py-2  md:w-1/2" onClick={handleSubmit(onSubmit)} text="Submit" />
           </form>
              
              
            </div>
    </main>
  )
}

export default ProductManufacturingUpdatePage