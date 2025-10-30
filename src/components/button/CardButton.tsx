import { Link } from "react-router-dom"

interface Props{
    text:string;
    outlined?:string;
    path:string;
}


const CardButton = ({text,path}:Props) => {
  return (
    <Link to={path} className="bg-primary-blue w-fit whitespace-nowrap py-2 px-2 rounded-md text-white"  >{text}</Link>
  )
}

export default CardButton