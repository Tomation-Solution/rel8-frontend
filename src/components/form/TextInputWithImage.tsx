interface Props {
  register:any;
  name:string,
  placeHolder?:string
  image?:string;
  inputType?:'text'|'file'|'email'|'number'|'date';
  defaultValue?: string | undefined;
  disabled?:boolean;
}

const TextInputWithImage = ({register,image,name,placeHolder,inputType='text',defaultValue,disabled}:Props) => {
  
  return (
  <div className='form-group' >
    {image && (

      <label id={`#${name}`}   className="h-full min-w-[40px] ">
          <img
            className="form-control-icon"
            src={image}
            alt=""
          />
      </label>
    )}
       <input disabled={disabled} id={`#${name}`} defaultValue={defaultValue} type={inputType} className='form-control' name={name} placeholder={placeHolder} {...register(`${name}`,{ required: true })} />

  </div>
  )
}

export default TextInputWithImage