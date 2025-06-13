import { EventDataType } from "../../types/myTypes";
import CardButton from "../button/CardButton";
import moment from "moment";

interface Props {
  eventItem: EventDataType;
  hideButton?: boolean;
  height?: string;
}

const EventsCard = ({ eventItem, hideButton, height }: Props) => {
  return (
    <div
      className={`relative w-full border rounded-md  ${
        height ? height : "h-[250px]"
      }  my-2`}
    >
      <img
        src={eventItem.bannerUrl}
        className=" z-[-1] absolute rounded-xl top-0 left-0 bottom-0 right-0 w-full max-w-full h-full object-cover max-h-[inherit]"
        alt="news-image"
      />

      <div
        className={`w-full absolute bottom-0 flex items-center justify-between rounded-b-xl gap-3 z-[3]  text-sm text-white bg-primary-dark2 ${
          height ? "px-2 py-[6px]" : "px-5 py-4"
        }`}
      >
        <div className="">
          <p
            className={`line-clamp-1 text-white font-medium my-1 break-all  ${
              height ? "text-[13px]" : "text-[15px]"
            }`}
          >
            {eventItem.details}
          </p>

          <span className="flex items-center gap-2 ">
            <span
              className={`text-neutral-2  line-clamp-1 ${
                height ? "text-xs" : "text-sm"
              }`}
            >
              {moment(eventItem.date).format("MMMM Do YYYY")}
            </span>
            <span
              className={`text-neutral-2  line-clamp-1 ${
                height ? "text-xs" : "text-sm"
              }`}
            >
              {eventItem.startTime}
            </span>
          </span>
        </div>
        {!hideButton && (
          <CardButton text="View" path={`/event/${eventItem._id}`} />
        )}
      </div>
    </div>
  );
};

export default EventsCard;
