import { AiOutlineEye,AiOutlineEyeInvisible } from "react-icons/ai";
import passwordIcon from "../../assets/icons/password.png";
import { useState } from "react";

interface Props {
    register:any;
    name:string,
    placeHolder?:string
    image?:boolean;
    disabled?:boolean;
  }
  
const TextInputPassWord = ({register,image,name,placeHolder,disabled}:Props) => {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  

  return (
    <div className="">
        <div className="flex items-center gap-2" >
            
    {image && (

<label  id={`#${name}`}  className="h-full min-w-[40px] ">
    <img
      className="form-control-icon"
      src={passwordIcon}
      alt=""
    />
</label>
)}
    <div className="flex items-center flex-1 pr-2 rounded-md bg-neutral-3 text-textColor">
    <input disabled={disabled}  id={`#${name}`} type={showPassword ? 'text' : 'password'} className='form-control' name={name} placeholder={placeHolder ? placeHolder : ""} {...register(`${name}`,{ required: true })} />
      
      <div className="p-2 hover:cursor-pointer" >
        {showPassword ? (
          <span><AiOutlineEyeInvisible onClick={togglePasswordVisibility} className="w-6 h-6 text-gray-600" /></span>
        ):(
          <span><AiOutlineEye onClick={togglePasswordVisibility} className="w-6 h-6 text-gray-600" /></span>
        )}
        </div>
       
    </div>
        </div>

       
       
  </div>
  
  )
}

export default TextInputPassWord