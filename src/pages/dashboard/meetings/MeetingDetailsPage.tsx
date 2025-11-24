import meetingImage from "../../../assets/images/meeting-image.png";
import eventsIcon from "../../../assets/icons/calendar.png";
import clockIcon from "../../../assets/icons/clock.png";
import avatarImage from "../../../assets/images/avatar-1.jpg";
import LocationIcon from "../../../assets/icons/location.png";
import AttachmentIcon from "../../../assets/icons/attachment.png";
import SeeAll from "../../../components/SeeAll";
import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchUserMeetingById,
  registerForMeeting,
} from "../../../api/meetings/api-meetings";
import Button from "../../../components/button/Button";
import styled from "styled-components";

const AttendDiv = styled.div<AttendButtonProps>`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
`;

interface AttendButtonProps {
  primary: boolean;
}

const AttendLink = styled.a<{ primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  color: ${(props) => (props.primary ? "#1890ff" : "#333")};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => (props.primary ? "#40a9ff" : "#1890ff")};
    text-decoration: underline;
  }

  &::after {
    content: "→";
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translateX(4px);
  }
`;

const AttendItem = styled.button<AttendButtonProps>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: ${(props) => (props.primary ? "#1890ff" : "#f0f0f0")};
  color: ${(props) => (props.primary ? "white" : "#333")};

  &:hover {
    background-color: ${(props) => (props.primary ? "#40a9ff" : "#d9d9d9")};
  }
`;

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();

  // Fetch meeting details
  const { data, isLoading, isError, error } = useQuery(
    ["meetingDetails", id],
    () => fetchUserMeetingById(id)
  );

  // Meeting detail
  const meetingItem = data;
  console.log(meetingItem, "meeting item");
  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { full_name: "", email: "" },
  });

  // Registration mutation
  const { mutate, isLoading: isSubmitting } = useMutation(registerForMeeting, {
    onSuccess: () => {
      notifyUser("Registration successful!", "success");
      queryClient.invalidateQueries(["meetingDetails", id]);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message?.error || "An error occurred.";
      console.error(errorMessage); // For debugging
      notifyUser(errorMessage, "error");
    },
  });

  const onSubmit = (formData: any) => {
    const payload = {
      meeting: id,
      proxy_participants: [formData],
    };
    mutate(payload);
  };

  if (isLoading) return <CircleLoader />;
  if (isError || !meetingItem) {
    console.log("error", error);
    return (
      <div className="text-center py-10 text-red-500">
        Meeting not found or an error occurred.
      </div>
    );
  }

  const formattedEventDate = new Date(meetingItem.event_date).toLocaleString(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  return (
    <main className="grid grid-cols-1 md:grid-cols-4 gap-5 text-textColor px-5 sm:px-2 md:px-4">
      {/* Main Content */}
      <div className="col-span-1 md:col-span-3">
        <BreadCrumb title={meetingItem.name} />

        {/* Image Section */}
        <div className="w-full h-[200px] bg-gray-800 md:h-[400px]">
          <img
            src={meetingItem.image || meetingImage}
            className="h-full object-cover mx-auto rounded-lg"
            alt={meetingItem.name}
          />
        </div>

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
              <h3 className="text-base font-medium">
                {meetingItem.organiserName}
              </h3>
              <p className="text-sm text-gray-500">
                {meetingItem.organiserDetails}
              </p>
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
              className="flex items-center gap-2 text-org-primaryBlue mb-2"
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

        {meetingItem.is_attending ? (
          <AttendDiv primary={false}>
            <AttendItem primary={false} className="text-base font-medium">
              You have successfully registered for the event.
            </AttendItem>
            {meetingItem.url && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={meetingItem.url}
              >
                <AttendLink primary={true}>Click to join meeting</AttendLink>
              </a>
            )}
          </AttendDiv>
        ) : (
          <div className="mt-6 w-[70%] bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold">Meeting Information</h3>
            <p className="text-gray-600 mt-2">
              This meeting is scheduled for{" "}
              {meetingItem?.event_date
                ? new Date(meetingItem.event_date).toLocaleString()
                : "TBD"}
              .
              {meetingItem?.url && (
                <span className="block mt-2">
                  Join via:{" "}
                  <a
                    href={meetingItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Meeting Link
                  </a>
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="col-span-1">
        <SeeAll title="Other Events" />
        <EventGrid numberOfItemsToShow={4} heightOfCard="h-[170px]" />
      </div>
    </main>
  );
};

export default MeetingDetailsPage;
