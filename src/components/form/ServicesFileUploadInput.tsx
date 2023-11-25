import { BsUpload } from "react-icons/bs";

interface Props {
    // register: (options: RegisterOptions) => void;
    register?:any;
    text:string;
    name:string,
    // placeHolder?:string    
    // defaultValue?: string ;
    // disabled?:boolean;
    onClick?:()=>void;
    ref:any;

  }

const ServicesFileUploadInput = ({name,register,text,ref,onClick}:Props) => {
  return (

    <div className="border border-gray-300 border-dashed relative group p-6 rounded-md w-full ">
    
         <label
         
         className="flex items-center justify-between  cursor-pointer"
         onClick={onClick}
     >
       <small>{text}</small>
         <BsUpload className="text-textColor w-5 h-5" />
     </label>

   
 
       <input  ref={ref} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"  id={`#${name}`}   type="file" name={name}  {...register(`${name}`,{ required: true })} />

  </div>
  )
}

export default ServicesFileUploadInput