interface Props{
    authPageHeader:string;
    authPageText:string;
    className?:string;
}

const AuthPageHeader = ({authPageHeader,authPageText,className}:Props) => {
  return (
    <div  className={`grid w-full my-10 text-center ${className}`} >
           <h1 className='font-bold text-primary-blue ' >{authPageHeader}</h1>
           <p className="font-[400] text-[16px] text-textColor" > {authPageText}</p>
         </div>
  )
}

export default AuthPageHeader