interface Props{
    message:string;
}
const FormError = ({message}:Props) => {
  return (
    <span className="my-2 text-sm text-red-500">{message}</span>
  )
}

export default FormError