import { ExcoMemberDataType } from "../../types/myTypes";
import profileImage from '../../assets/images/dummy.jpg';

interface Props {
  item: any;
}

const ExcosMemberCard = ({ item }: Props) => {
  return (
    <div className="bg-white my-2 border border-[#ececec] p-2 flex flex-col justify-between rounded-md">
      <img
        src={item?.imageUrl ? item.imageUrl : profileImage}
        className="w-full object-center object-cover rounded-md"
        alt=""
      />
      <div className="my-3">
        <h6 className="font-semibold">{item?.name}</h6>
        <p className="text-sm text-textColor">
          {item.exco.isExco ? item.exco.position 
            : "Position Not Available"}
        </p>
        <small className="text-xs text-primaryBlue">
          {item?.member_info && item.member_info[4]?.value
            ? item.member_info[4].value
            : "Grade Not Available"}
        </small>
        <p className="text-sm line-clamp-2 text-textColor">{item.bio}</p>
      </div>
    </div>
  );
};

export default ExcosMemberCard;
