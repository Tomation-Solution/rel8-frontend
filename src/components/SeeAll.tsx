import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

interface Props{
    title:string;
    path?:string
}

const SeeAll = ({title,path}:Props) => {
  return (
    <div className="flex items-center justify-between mb-2 " >
        <h3 className="font-semibold text-xl" >{title}</h3>
        {path && (

        <Link to={path} className="bg-neutral-3 text-textColor flex items-center gap-[2px] py-1 px-1 rounded-md text-sm text-center" >see all  <ChevronRightIcon className="w-5  h-5" /></Link>
        )}
    </div>
  )
}

export default SeeAll