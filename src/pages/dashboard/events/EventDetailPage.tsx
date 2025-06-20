// import SeeAll from "../../../components/SeeAll";
import eventsIcon from "../../../assets/icons/calendar.png";
import clockIcon from "../../../assets/icons/clock.png";
import dummyOrganizerImage from "../../../assets/images/dummy.jpg";
// import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import {
  // fetchAllUserEvents,
  fetchSingleEvent,
  // registerForFreeEvent,
  // registerForPaidEvent,
} from "../../../api/events/events-api";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
import moment from "moment";
import apiTenant from "../../../api/baseApi";

// Define your event type
type EventType = {
  bannerUrl?: string;
  price: string;
  isPaid: boolean;
  details: string;
  date: string;
  _id: string;
  organizerImage: string;
  time: string;
  organizer: string;
  name: string;
  image: string;
  startDate: string;
  startTime: string;
  organiserImage?: string;
  organiser_name?: string;
  organiser_extra_info?: string;
  event_docs?: string;
  amount: string;
  is_paid_event: boolean;
  event_access?: {
    has_paid: boolean;
  };
  description?: string;
  // Add other event properties as needed
};

const EventDetailPage = () => {
  const { eventId } = useParams();
  const { notifyUser } = Toast();
  // const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch single event
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery<EventType>(["event", eventId], () => fetchSingleEvent(eventId), {
    enabled: !!eventId,
  });

  console.log(event, "Event Single");

  const handleRegisterForEvent = async () => {
    try {
      const response = await apiTenant.post(
        `api/events/register/${eventId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.url) {
        // Open in new tab and ensure it's the full URL
        const paymentUrl = response.data.url.startsWith("http")
          ? response.data.url
          : `${window.location.origin}${response.data.url}`;
        window.open(paymentUrl, "_blank");
      }
    } catch (error: any) {
      console.log("Registration error:");
      notifyUser(
        error.response.data.message ||
          "An error occurred while registering for the event",
        "error"
      );
    }
  };

  // const handleFreeEventMutation = useMutation(registerForFreeEvent, {
  //   onSuccess: (data) => {
  //     notifyUser(data.message, "success");
  //   },
  //   onError: (error: any) => {
  //     const data: any = error.response.data;
  //     notifyUser(JSON.stringify(`${data?.message.error}`), "error");
  //   },
  // });

  // const registerForPaidEventMutation = useMutation(
  //   () => registerForPaidEvent(eventId || "", parseFloat(event?.amount || "0")),
  //   {
  //     onSuccess: (data) => {
  //       const hasPaid = event?.event_access?.has_paid ?? false;

  //       if (!hasPaid) {
  //         const authorizationURL = data?.data?.data?.authorization_url;
  //         if (authorizationURL) {
  //           window.location.href = authorizationURL;
  //         } else {
  //           notifyUser("Authorization URL not found. Try again.", "error");
  //         }
  //       } else {
  //         notifyUser("Congratulations, you have paid for the event", "success");
  //         navigate(`/event/success/${eventId}`);
  //       }
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //       notifyUser(
  //         "An error occurred while registering for the event",
  //         "error"
  //       );
  //     },
  //   }
  // );

  // const handleRegisterUserForFreeEvents = () => {
  //   if (eventId) {
  //     const formData = new FormData();
  //     formData.append("event_id", eventId);
  //     handleFreeEventMutation.mutate(formData);
  //   }
  // };

  // const handleRegisterUserForPaidEvents = () => {
  // const hasPaid = event?.event_access?.has_paid ?? false;
  // if (eventId && event?.is_paid_event && !hasPaid) {
  //   registerForPaidEventMutation.mutate();
  // } else if (hasPaid) {
  //   notifyUser("You have already paid for this event", "success");
  // } else {
  //   notifyUser(
  //     "Unable to determine payment status. Please try again.",
  //     "error"
  //   );
  // }
  // };

  if (isLoading) return <CircleLoader />;
  if (isError)
    return notifyUser(
      "An error occurred while fetching event details",
      "error"
    );
  if (!event) return <div>Event not found</div>;

  return (
    <main className="grid md:grid-cols-4 md:gap-10 gap-[50px] md:px-0 px-5 text-textColor">
      <div className="col-span-3">
        <BreadCrumb title="Event's Details" />
        <div className="relative">
          <div className="relative flex items-center h-[40vh]">
            <img
              src={event.bannerUrl}
              className="w-full max-h-[40vh] border object-contain rounded-md"
              alt="Event banner"
            />
          </div>
          <div className="grid md:grid-cols-5 grid-cols-3 my-5 gap-1">
            <div className="col-span-3 flex items-center font-semibold">
              <span className="block">
                Name of event:
                <span className="font-light text-justify">
                  {" "}
                  {event.details}
                </span>
              </span>
            </div>
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 h-fit">
              <span className="flex items-center whitespace-nowrap py-3 px-2 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
                <img src={eventsIcon} className="w-6 h-6" alt="Date icon" />
                <span className="overflow-y-auto">
                  {moment(event.date).format("MMMM Do YYYY")}
                </span>
              </span>
              <span className="flex items-center whitespace-nowrap py-3 px-2 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
                <img src={clockIcon} className="w-6 h-6" alt="Time icon" />
                <span>{event.time}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-3 my-5 border-t border-b py-4">
          <div className="flex items-center gap-2">
            <img
              src={event.organizerImage || dummyOrganizerImage}
              className="w-10 h-10 rounded-full border"
              alt="Organizer"
            />
            <div>
              <h3 className="text-base">
                {event.organizer || "Not Available"}
                <span className="text-xs"> ~ Organizer</span>
              </h3>
              {/* <p className="text-sm text-neutral1">
                {event.organiser_extra_info || "Organiser Info not available"}
              </p> */}
            </div>
          </div>

          {/* <Link
            to={`${event.event_docs || "#"}`}
            className="bg-primary-blue text-center grid place-items-center text-white border border-white h-[40px] rounded-md hover:border-primary-blue"
          >
            Download Event Attachment
          </Link> */}
        </div>

        <div className="my-4">
          {event.description && (
            <div className="mb-4">
              <h3 className="font-semibold">Event Description:</h3>
              <p className="text-sm">{event.description}</p>
            </div>
          )}

          <h3 className="text-sm">
            Event Fee:{" "}
            <span className="font-bold text-sm">
              {event.price && parseFloat(event.price.toLocaleString()) > 0
                ? `₦${parseFloat(event.price).toLocaleString()}.00`
                : "Free"}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-2 my-3 text-sm">
            <button
              onClick={handleRegisterForEvent}
              className="bg-white text-primaryBlue border border-primary-blue h-[40px] rounded-md"
            >
              {event.isPaid ? "Pay for event" : "Register for free"}
            </button>
          </div>
        </div>
      </div>
      {/* <div className="md:col-span-1 col-span-3">
        <SeeAll title="Others" path="/events" />
        <EventGrid heightOfCard="h-[160px]" numberOfItemsToShow={3} />
      </div> */}
    </main>
  );
};

export default EventDetailPage;
