interface Props{
    type?:"primary"|"secondary"|"outlined",
    size?:string;
    text:string;
    className?:string;
    onClick?:(e:React.MouseEvent<HTMLButtonElement>)=>void;
    isLoading?:boolean;
    textColor?:string;
    padding?:string;
    borderRadius?:string;
}

const Button = ({text,size,className,type='primary',onClick,isLoading,textColor='text-white',padding='p-3',borderRadius='rounded-[12px]'}:Props) => {
  return (
    
    <button onClick={onClick} className={`btn ${size ? size : "btn-block"} ${type === 'outlined' && "btn-Outlined"}  ${type === 'secondary' && "btnSecondary"} ${type === 'primary' && "btnPrimary" } ${textColor} ${padding} ${borderRadius} ${className}` }>
       {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin outline-none h-5 w-5 border-t-2 border-org-secondary rounded-full mr-3"></div>
          Loading
        </div>
      ) : (
        text
      )}
    </button>
  
  )
}

export default Button