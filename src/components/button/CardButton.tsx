import { Link } from "react-router-dom"

interface Props{
    text:string;
    outlined?:string;
    path:string;
}


const CardButton = ({text,path}:Props) => {
  return (
    <Link to={path} className="bg-org-primary w-fit whitespace-nowrap py-2 px-2 hover:text-white rounded-md text-white"  >{text}</Link>
  )
}

export default CardButton