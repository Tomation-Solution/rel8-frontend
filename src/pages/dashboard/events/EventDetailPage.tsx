import SeeAll from "../../../components/SeeAll";
import eventsIcon from "../../../assets/icons/calendar.png";
import clockIcon from "../../../assets/icons/clock.png";
import dummyOrganizerImage from "../../../assets/images/dummy.jpg";
import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchAllUserEvents, fetchMyRegistrations, registerForEvent, unregisterFromEvent } from "../../../api/events/events-api";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
import DownloadFileButton from "../../../components/button/DownloadFileButton";

// ── helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (price: number | string) => `₦${parseFloat(String(price)).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

const deadlinePassed = (deadline?: string) => !!deadline && new Date(deadline) < new Date();

// ── Registration section ─────────────────────────────────────────────────────

interface RegistrationPanelProps {
  event: any;
  myRegistrations: any[];
  onRegister: () => void;
  onCancel: () => void;
  registerLoading: boolean;
  cancelLoading: boolean;
}

const RegistrationPanel = ({ event, myRegistrations, onRegister, onCancel, registerLoading, cancelLoading }: RegistrationPanelProps) => {
  if (!event.requiresRegistration) return null;

  const myReg = myRegistrations.find((r: any) => (r.eventId?._id || r.eventId) === (event._id || event.id));

  const isRegistered = myReg?.status === "registered";
  const alreadyPaid = myReg?.paymentStatus === "paid";
  const isFull = event.registrationCapacity != null && event.registrationCapacity <= 0;
  const pastDeadline = deadlinePassed(event.registrationDeadline);
  const isPaidEvent = event.isPaid || event.is_paid_event;
  const price = event.price || parseFloat(event.amount || "0");

  return (
    <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-xl">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Registration</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {isPaidEvent && price > 0 ? (
          <span className="text-xs font-semibold bg-org-primary/10 text-org-primary px-3 py-1 rounded-full">{formatPrice(price)}</span>
        ) : (
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">Free</span>
        )}
        {event.registrationDeadline && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${pastDeadline ? "bg-red-100 text-red-600" : "bg-yellow-50 text-yellow-700"}`}>
            {pastDeadline ? "Registration closed" : `Deadline: ${new Date(event.registrationDeadline).toLocaleDateString()}`}
          </span>
        )}
        {event.registrationCapacity != null && (
          <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{event.registrationCapacity > 0 ? `${event.registrationCapacity} spot${event.registrationCapacity !== 1 ? "s" : ""} left` : "Full"}</span>
        )}
        {isRegistered && <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">✓ Registered</span>}
      </div>

      {isRegistered ? (
        !alreadyPaid && (
          <button onClick={onCancel} disabled={cancelLoading} className="px-5 py-2 rounded-lg border border-red-400 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
            {cancelLoading ? "Cancelling…" : "Cancel Registration"}
          </button>
        )
      ) : (
        <button
          onClick={onRegister}
          disabled={registerLoading || pastDeadline || isFull}
          className="px-6 py-2 rounded-lg bg-org-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registerLoading ? "Registering…" : isPaidEvent && price > 0 ? `Register — ${formatPrice(price)}` : "Register"}
        </button>
      )}
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();

  const {
    data: allEvents,
    isLoading,
    isError,
  } = useQuery("events", fetchAllUserEvents, {
    refetchOnMount: false,
    enabled: !!eventId,
    retry: 2,
  });

  const { data: myRegistrations = [] } = useQuery("myEventRegistrations", fetchMyRegistrations, {
    retry: 1,
    staleTime: 30_000,
  });

  const event = allEvents?.find((item: any) => (item._id || item.id)?.toString() === eventId);
  const isPaidEvent = !!(event?.isPaid && event?.price > 0);

  const registerMutation = useMutation(() => registerForEvent(eventId!), {
    onSuccess: (data: any) => {
      const authUrl = data.authorizationUrl || data.authorization_url;
      if (authUrl) {
        window.location.href = authUrl;
      } else if (isPaidEvent) {
        // Paid event but no payment URL returned — don't silently register
        notifyUser("Payment could not be initialised. Please try again.", "error");
      } else {
        notifyUser("Successfully registered for this event!", "success");
        queryClient.invalidateQueries("myEventRegistrations");
      }
    },
    onError: (err: any) => {
      notifyUser(err?.response?.data?.message || "Failed to register for event", "error");
    },
  });

  const cancelMutation = useMutation(() => unregisterFromEvent(eventId!), {
    onSuccess: () => {
      notifyUser("Registration cancelled.", "success");
      queryClient.invalidateQueries("myEventRegistrations");
    },
    onError: (err: any) => {
      notifyUser(err?.response?.data?.message || "Failed to cancel registration", "error");
    },
  });

  if (isError) notifyUser("An error occurred while fetching event detail", "error");
  if (isLoading) return <CircleLoader />;

  if (!event) {
    return (
      <main className="px-5 md:px-0">
        <BreadCrumb title="Event Details" />
        <p className="text-gray-500 py-16 text-center">Event not found.</p>
      </main>
    );
  }

  const fileUrl = event.bannerUrl || "";
  const fileName = fileUrl.split("/").at(-1) || "";

  return (
    <main className="grid md:grid-cols-4 md:gap-10 gap-[50px] md:px-0 px-5 text-textColor">
      <div className="col-span-3">
        <BreadCrumb title="Event Details" />

        {/* Banner */}
        <div className="relative">
          <div className="relative flex items-center bg-gray-200 h-[40vh]">
            <img src={event.image || event.bannerUrl} className="w-full max-h-[40vh] border object-contain rounded-md" alt="" />
          </div>

          <div className="grid md:grid-cols-5 grid-cols-3 my-5 gap-1">
            <div className="col-span-3 flex items-center font-semibold">
              <span className="block">
                Name of event: <span className="font-light">{event.name || event.details}</span>
              </span>
            </div>
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 h-fit">
              <span className="flex items-center whitespace-nowrap py-3 px-2 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
                <img src={eventsIcon} className="w-6 h-6" alt="" />
                <span className="overflow-y-auto">{event.startDate || new Date(event.date).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center whitespace-nowrap py-3 px-2 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
                <img src={clockIcon} className="w-6 h-6" alt="" />
                <span>{event.startTime || event.time}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Organiser + attachment */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-3 my-5 border-t border-b py-4">
          <div className="flex items-center gap-2">
            <img src={event.organiserImage ?? dummyOrganizerImage} className="w-10 h-10 rounded-full border" alt="" />
            <div>
              <h3 className="text-base">
                {event.organiser_name || event.organizer || "Not Available"} <span className="text-xs">~ Organizer</span>
              </h3>
              <p className="text-sm text-neutral1">{event.organiser_extra_info || "Organiser Info not available"}</p>
            </div>
          </div>
          <DownloadFileButton fileName={fileName} fileUrl={fileUrl} buttonText="Event Attachment" />
        </div>

        {/* Address */}
        {event.address && (
          <p className="text-sm text-gray-600 my-3">
            <span className="font-semibold text-gray-700">Location: </span>
            {event.address}
          </p>
        )}

        {/* Registration panel */}
        <RegistrationPanel event={event} myRegistrations={myRegistrations} onRegister={() => registerMutation.mutate()} onCancel={() => cancelMutation.mutate()} registerLoading={registerMutation.isLoading} cancelLoading={cancelMutation.isLoading} />
      </div>

      <div className="md:col-span-1 col-span-3">
        <SeeAll title="Others" path="/events" />
        <EventGrid heightOfCard="h-[160px]" numberOfItemsToShow={3} />
      </div>
    </main>
  );
};

export default EventDetailPage;
