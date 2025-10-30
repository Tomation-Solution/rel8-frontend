import { Link } from "react-router-dom"
import { ElectionPositionDataType } from "../../types/myTypes"
// import Button from "../button/Button"

interface Props{
    item:ElectionPositionDataType
}

const ElectionPositionCard = ({item}:Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 items-center gap-3 bg-neutral-300 px-3 py-5 w-full lg:w-3/4 rounded-md my-2">
    <div className="col-span-3 gap-2">
        <span className="font-semibold text-base" >{item?.role_name}-</span>
        <span className="text-textColor text-sm w-full text-justify" >{item.role_detail} </span>
    </div>
    <div className="flex items-center gap-2" >

    <div className="col-span-1">
        
      <Link to={`/election/${item.id}`} className="bg-org-primary whitespace-nowrap text-sm outline-none px-3 py-2 text-white  border h-[40px] w-full rounded-md  border-none">
        See Contestants
      </Link>
    </div>
    <div className="col-span-1">
      <Link to={""} className="text-org-primary-blue whitespace-nowrap text-sm outline-none px-3 py-2    border h-[40px] w-full rounded-md  border-primary-blue">
      See Voting Stats
      </Link>
     
    </div>
    </div>
  </div>
  )
}

export default ElectionPositionCard