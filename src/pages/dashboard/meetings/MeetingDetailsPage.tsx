import meetingImage from "../../../assets/images/meeting-image.png";
import eventsIcon from "../../../assets/icons/calendar.png";
import clockIcon from "../../../assets/icons/clock.png";
import avatarImage from "../../../assets/images/avatar-1.jpg";
import LocationIcon from "../../../assets/icons/location.png";
import AttachmentIcon from "../../../assets/icons/attachment.png";
import SeeAll from "../../../components/SeeAll";
import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchUserMeetingById } from "../../../api/meetings/api-meetings";
import CircleLoader from "../../../components/loaders/CircleLoader";

const MeetingDetailsPage = () => {
  const { meetingId } = useParams();
  const { data, isLoading, isError } = useQuery("meetingDetails",fetchUserMeetingById,{

  });

  const meetingItem = data?.data?.find((item:any) => item.id.toString() === meetingId);
  console.log(meetingItem)

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError || !data?.data?.[0]) {
    return <div className="text-center py-10 text-red-500">Meeting not found or an error occurred.</div>;
  }

  const formattedEventDate = new Date(meetingItem.event_date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="grid grid-cols-1 md:grid-cols-4 gap-5 text-textColor px-4 sm:px-2 md:px-4">
      {/* Main Content */}
      <div className="col-span-1 md:col-span-3">
        <BreadCrumb title={meetingItem.name} />

        {/* Image Section */}
        <img
          src={meetingItem.image || meetingImage}
          className="w-full h-[200px] md:h-[300px] object-cover rounded-lg"
          alt={meetingItem.name}
        />

        {/* Event Date and Organizer Section */}
        <div className="my-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="flex items-center gap-2 text-sm bg-neutral-3 text-textColor p-2 rounded-md">
            <img src={eventsIcon} className="w-5 h-5" alt="Event Date" />
            <img src={clockIcon} className="w-5 h-5" alt="" />
            <span>{formattedEventDate}</span>
          </span>

          <div className="flex items-center gap-2">
            <img
              src={meetingItem.organiserImage || avatarImage}
              alt={meetingItem.organiserName}
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <h3 className="text-base font-medium">{meetingItem.organiserName}</h3>
              <p className="text-sm text-gray-500">{meetingItem.organiserDetails}</p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 bg-neutral-3 rounded-md">
          <h4 className="font-semibold mb-2">Details</h4>
          <p className="text-sm">{meetingItem.details}</p>
        </div>

        {/* Additional Information */}
        <div className="mt-5">
          <h4 className="font-semibold mb-2">Additional Information</h4>

          {meetingItem.meeting_docs ? (
            <a
              href={meetingItem.meeting_docs}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primaryBlue mb-2"
            >
              <img src={AttachmentIcon} alt="Attachment" className="w-5 h-5" />
              <span>Download Attachment</span>
            </a>
          ) : (
            <p className="text-sm text-gray-500">No attachment available.</p>
          )}

          {meetingItem.addresse && (
            <div className="flex items-center gap-2 bg-neutral-3 p-2 rounded-md text-sm">
              <img src={LocationIcon} alt="Location" className="w-5 h-5" />
              <span>{meetingItem.addresse}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-1">
        <SeeAll title="Other Meetings" />
        <EventGrid numberOfItemsToShow={4} heightOfCard="h-[170px]" />
      </div>
    </main>
  );
};

export default MeetingDetailsPage;
