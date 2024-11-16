import { Link } from "react-router-dom";
import meetingImage from "../../assets/images/meeting-image.png";
import Button from "../button/Button";

const MeetingCard = ({ meeting, linkTo='meeting' }: any ) => {  
  const {
    name,
    event_date,
    organiserName,
    details,
    image,
    is_attending,
  } = meeting;

  const formattedDate = new Date(event_date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const truncatedDetails =
    details && details.length > 100 ? `${details.slice(0, 100)}...` : details;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 p-3 bg-neutral-3 rounded-md my-2">
      <div className="col-span-2">
        <div className="flex items-center gap-2">
          <img src={image || meetingImage} alt={name} className="w-28 h-24" />
          <div>
            <Link to={`/${linkTo}/${meeting.id}/`} >
              <h6 className="font-medium text-primary-blue hover:underline">{name}</h6>
            </Link>
            <p className="font-light">{formattedDate}</p>
            <p className="text-sm text-gray-500">{organiserName}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-700">{truncatedDetails}</p>
      </div>
      <div className="col-span-1 flex flex-col p-2 gap-2 items-center justify-center">
        {is_attending ? (
          <Button text="You're Attending" borderRadius="rounded-md" padding="py-2 px-3" />
        ) : (
          <Button text="Remind me to Join" borderRadius="rounded-md" padding="py-2 px-3" />
        )}
        <Link
          to={`/${linkTo}/${meeting.id}/`}
          className="w-full py-2 px-3 border border-primary-blue text-sm bg-[inherit] text-primaryDark rounded-md text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MeetingCard;
