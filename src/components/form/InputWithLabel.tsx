

type Prop ={
    register:any,
    label:string,
    type?:'text'|'file'|'password'
}
const InputWithLabel =( {register,label,type='text'}:Prop)=>{


    return (
        <div>
            <label htmlFor={label}>{label}</label>
                    <div className=' flex items-center flex-1 pr-2 rounded-md bg-neutral-3 text-textColor'>
            
            <input
            className='form-control' 
            label={label}
              type={type}
              {...register}
              />
        </div>
        </div>
    )
}
export default InputWithLabel