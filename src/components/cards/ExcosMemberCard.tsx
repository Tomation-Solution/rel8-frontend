import profileImage from '../../assets/images/dummy.jpg';

interface Props {
  item: any;
  onClick?: () => void;
}

const ExcosMemberCard = ({ item, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white my-2 border border-[#ececec] p-2 flex flex-col justify-between rounded-md text-left hover:shadow-sm transition-shadow"
    >
      <img
        src={item?.profileImage || item?.imageUrl || profileImage}
        className="w-full object-center object-cover rounded-md"
        alt=""
      />
      <div className="my-3">
        <h6 className="font-semibold">{item?.name || "Name Not Available"}</h6>
        <p className="text-sm text-textColor">
          {item?.position || "Position Not Available"}
        </p>
        {item?.email && (
          <small className="text-xs text-org-primaryBlue">
            {item.email}
          </small>
        )}
        {item?.bio && (
          <p className="text-sm line-clamp-2 text-textColor mt-2">{item.bio}</p>
        )}
      </div>
    </button>
  );
};

export default ExcosMemberCard;
