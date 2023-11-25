import { ExcoMemberDataType } from "../../types/myTypes"
import profileImage from '../../assets/images/dummy.jpg'

interface Props{
    item:ExcoMemberDataType
}
const ExcosMemberCard = ({item}:Props) => {
  return (
    <div className="grid bg-white  my-2 border border-[#ececec] p-2 rounded-md" >
      <img src={item?.photo ? item.photo :profileImage } className="w-full max-w-full object-contain rounded-md" alt="" />
      <div  className="my-3">
        <h6 className="font-semibold" >{item?.full_name}</h6>
        <p className="text-sm text-textColor" >{item?.member_info[3].position_held ? item?.member_info[3].position_held : "Position Not Available"}</p>
        <small className="text-xs text-primaryBlue " >{item?.member_info[4].value ? item?.member_info[4].value : "Grade Not Available"}</small>
        <p className="text-sm line-clamp-2  text-textColor" >{item.bio}</p>
      </div>
    </div>
  )
}

export default ExcosMemberCard