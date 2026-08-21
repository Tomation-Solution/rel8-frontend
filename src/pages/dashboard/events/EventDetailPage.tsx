import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FiEdit3, FiCalendar, FiClock, FiMapPin, FiTag, FiUser, FiDownload } from "react-icons/fi";

import { fetchAllUserEvents, fetchMyRegistrations, unregisterFromEvent } from "../../../api/events/events-api";
import { declareEventPayment, startEventRegistration, supportsMethod, type PaymentCheckout, type PaymentMethod } from "../../../api/paystack-api";
import PaymentMethodChoice from "../../../components/payments/PaymentMethodChoice";
import { defaultMethod } from "../../../components/payments/defaultMethod";
import BankTransferPanel from "../../../components/payments/BankTransferPanel";

import { BackLink, Button, Card, EmptyState, InfoChip, PageHeader, StatusPill } from "../../../components/ui";
import MediaCard from "../../../components/ui/MediaCard";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { formatCardDateTime, formatDate, isPast } from "../../../utils/dates";
import { formatMoney, useCurrencySymbol } from "../../../utils/currency";
import { eventIsPaid, eventLocationKind, eventPrice, eventTitle, isPastEvent } from "./eventFields";

const deadlinePassed = (deadline?: string) => !!deadline && isPast(deadline);

/* ------------------------------------------------------------------- Registration -- */

interface RegistrationPanelProps {
  event: any;
  myRegistrations: any[];
  currencySymbol: string;
  onRegister: (method?: PaymentMethod) => void;
  onCancel: () => void;
  registerLoading: boolean;
  cancelLoading: boolean;
}

/**
 * The mockup draws a single "Pay Now" beside the Type chip. That cannot express what the
 * backend actually models — a capacity, a deadline, a choice of payment method, and the
 * ability to cancel an unpaid registration — so those live here, in the design language,
 * and the chip above only states the price. See REDESIGN.md M5.
 */
const RegistrationPanel = ({ event, myRegistrations, currencySymbol, onRegister, onCancel, registerLoading, cancelLoading }: RegistrationPanelProps) => {
  const [payMethod, setPayMethod] = useState<PaymentMethod | null>(null);

  if (!event.requiresRegistration) return null;

  const myReg = myRegistrations.find((r: any) => (r.eventId?._id || r.eventId) === (event._id || event.id));
  const isRegistered = myReg?.status === "registered";
  const alreadyPaid = myReg?.paymentStatus === "paid";
  const isFull = event.registrationCapacity != null && event.registrationCapacity <= 0;
  const pastDeadline = deadlinePassed(event.registrationDeadline);
  const price = eventPrice(event);
  const isPaidEvent = eventIsPaid(event);
  const effectiveMethod: PaymentMethod = payMethod && supportsMethod(event.paymentConfig, payMethod) ? payMethod : defaultMethod(event.paymentConfig);

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-[18px] font-semibold text-ink mb-4">Registration</h3>

      <div className="flex flex-wrap gap-2 mb-5">
        {isPaidEvent ? <StatusPill label={formatMoney(price, currencySymbol)} tone="brand" /> : <StatusPill label="Free" tone="success" />}
        {event.registrationDeadline && <StatusPill label={pastDeadline ? "Registration closed" : `Deadline: ${formatDate(event.registrationDeadline)}`} tone={pastDeadline ? "danger" : "warning"} />}
        {event.registrationCapacity != null && <StatusPill label={event.registrationCapacity > 0 ? `${event.registrationCapacity} spot${event.registrationCapacity === 1 ? "" : "s"} left` : "Full"} tone="neutral" />}
        {isRegistered && <StatusPill label="Registered" tone="success" />}
      </div>

      {!isRegistered && isPaidEvent && (
        <div className="mb-5">
          <PaymentMethodChoice config={event.paymentConfig} value={effectiveMethod} onChange={setPayMethod} disabled={registerLoading} />
        </div>
      )}

      {isRegistered ? (
        !alreadyPaid && (
          <Button variant="danger" isLoading={cancelLoading} onClick={onCancel}>
            Cancel Registration
          </Button>
        )
      ) : (
        <Button isLoading={registerLoading} disabled={pastDeadline || isFull} onClick={() => onRegister(isPaidEvent ? effectiveMethod : undefined)}>
          {isPaidEvent ? `Pay Now — ${formatMoney(price, currencySymbol)}` : "Register"}
        </Button>
      )}
    </Card>
  );
};

/* --------------------------------------------------------------------------- Page -- */

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();
  const currencySymbol = useCurrencySymbol();

  const { data: allEvents, isLoading, isError } = useQuery("events", fetchAllUserEvents, { refetchOnMount: false, enabled: !!eventId, retry: 2 });
  const { data: myRegistrations = [] } = useQuery("myEventRegistrations", fetchMyRegistrations, { retry: 1, staleTime: 30_000 });

  const events: any[] = Array.isArray(allEvents) ? allEvents : [];
  const event = events.find((item: any) => (item._id || item.id)?.toString() === eventId);
  const isPaidEvent = eventIsPaid(event);

  // X-1/X-7: registration returns a unified `checkout` — a Paystack URL, or the
  // association's bank details plus a reference to quote. Free events return neither.
  const [checkout, setCheckout] = useState<PaymentCheckout | null>(null);
  const [pendingRegistrationId, setPendingRegistrationId] = useState<string | null>(null);
  const [declaring, setDeclaring] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [declareError, setDeclareError] = useState("");

  const registerMutation = useMutation((method?: PaymentMethod) => startEventRegistration(eventId!, method), {
    onSuccess: (result: any) => {
      const co = result?.checkout;

      if (co?.method === "paystack" && co.authorizationUrl) {
        window.location.href = co.authorizationUrl;
        return;
      }

      if (co?.method === "bank_transfer") {
        setCheckout(co);
        setPendingRegistrationId(result.registration?._id ?? null);
        setDeclared(false);
        setDeclareError("");
        queryClient.invalidateQueries("myEventRegistrations");
        return;
      }

      if (isPaidEvent) {
        // Paid event that produced no checkout — do not pretend they are registered.
        notifyUser("Payment could not be initialised. Please try again.", "error");
        return;
      }

      notifyUser(result?.message || "Successfully registered for this event!", "success");
      queryClient.invalidateQueries("myEventRegistrations");
    },
    onError: (err: any) => {
      const httpStatus = err?.response?.status;
      if (httpStatus === 409) {
        notifyUser(err?.response?.data?.message || "You're already registered for this event.", "error");
      } else if (httpStatus === 400) {
        notifyUser(err?.response?.data?.message || "Payments are not set up for this organization yet.", "error");
      } else {
        notifyUser(err?.response?.data?.message || "Failed to register for event", "error");
      }
    },
  });

  /** Member states they have made the transfer. Proof optional unless configured. */
  const handleDeclareTransfer = async ({ proof, note }: { proof?: File | null; note?: string }) => {
    if (!pendingRegistrationId) return;
    setDeclaring(true);
    setDeclareError("");
    try {
      await declareEventPayment(pendingRegistrationId, { proof, note });
      setDeclared(true);
      queryClient.invalidateQueries("myEventRegistrations");
    } catch (err: any) {
      setDeclareError(err?.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setDeclaring(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="py-20 grid place-items-center">
        <CircleLoader />
      </div>
    );
  }

  if (!event) {
    return (
      <>
        <BackLink />
        <PageHeader title="Event's Details" />
        <EmptyState icon={FiCalendar} title="Event not found" description="This event may have been removed." action={<Button onClick={() => navigate("/events")}>Back to events</Button>} />
      </>
    );
  }

  const past = isPastEvent(event);
  const others = events.filter((item: any) => (item._id || item.id)?.toString() !== eventId).slice(0, 3);
  const attachmentUrl = event.documentId || event.bannerUrl || "";

  return (
    <>
      <BackLink />
      <PageHeader title="Event's Details" subtitle="See the details of upcoming events here..." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* --------------------------------------------------------------- left column */}
        <div className="xl:col-span-2 flex flex-col gap-6 min-w-0">
          <Card className="overflow-hidden">
            <div className="relative">
              <img src={event.bannerUrl || event.image} alt="" className={`w-full h-64 sm:h-80 object-cover ${past ? "grayscale-[35%]" : ""}`} />
              <StatusPill label={past ? "Past" : "New"} tone={past ? "past" : "brand"} className="!rounded-none absolute top-0 right-0 !px-4 !py-1.5" />
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoChip icon={FiEdit3} label="Event's Name" value={eventTitle(event)} />
              <InfoChip icon={FiCalendar} label="Event's Date" value={formatDate(event.date)} />
              <InfoChip icon={FiClock} label="Event's Time" value={event.time || formatCardDateTime(event.date).split(" | ")[1] || "—"} />
              <InfoChip icon={FiTag} label="Type" value={isPaidEvent ? `Paid — ${formatMoney(eventPrice(event), currencySymbol)}` : "Free"} />
              <div className="md:col-span-2 grid gap-3">
                <InfoChip icon={FiMapPin} label="Location" value={eventLocationKind(event)} />
                {event.address && <InfoChip icon={FiMapPin} label="Address" value={event.address} />}
                {event.meetingLink && (
                  <InfoChip
                    icon={FiMapPin}
                    label="Meeting Link"
                    value={
                      <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="underline">
                        {event.meetingLink}
                      </a>
                    }
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Organiser strip */}
          <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-12 h-12 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
                <FiUser className="w-6 h-6 text-org-primary/60" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] text-ink truncate">
                  Organizer: <span className="text-org-primary font-medium">{event.organizer || "Not available"}</span>
                </p>
                <p className="text-sm text-muted">Organizer Details Not Available.</p>
              </div>
            </div>
            {attachmentUrl && (
              <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm px-4 py-2.5 border border-hairline text-ink hover:border-org-primary hover:text-org-primary transition-colors flex-shrink-0">
                <FiDownload className="w-4 h-4" />
                Download Event&rsquo;s Attachment
              </a>
            )}
          </Card>

          {event.details && (
            <Card className="p-6">
              <h3 className="text-[18px] font-semibold text-org-primary mb-3">Event&rsquo;s Details</h3>
              <p className="text-[15px] text-ink whitespace-pre-line leading-relaxed">{event.details}</p>
            </Card>
          )}

          {/* Hidden while a bank transfer is being completed, so there is one next action. */}
          {!checkout && (
            <RegistrationPanel
              event={event}
              myRegistrations={myRegistrations}
              currencySymbol={currencySymbol}
              onRegister={method => registerMutation.mutate(method)}
              onCancel={() => cancelMutation.mutate()}
              registerLoading={registerMutation.isLoading}
              cancelLoading={cancelMutation.isLoading}
            />
          )}

          {/* X-7: bank details + reference, only after registration reserves the place */}
          {checkout && (
            <div>
              <BankTransferPanel
                checkout={checkout}
                onDeclare={handleDeclareTransfer}
                declaring={declaring}
                declared={declared}
                error={declareError}
                requireProof={Boolean(event?.paymentConfig?.bankTransfer?.requireProof)}
                title="Complete your payment to confirm your place"
              />
              <Button variant="ghost" className="mt-3" onClick={() => setCheckout(null)}>
                Back to event
              </Button>
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------- right column */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-ink">Others</h3>
            <button type="button" onClick={() => navigate("/events")} className="text-sm font-medium text-org-primary hover:underline">
              See All
            </button>
          </div>

          {others.length === 0 ? (
            <EmptyState icon={FiCalendar} title="Nothing else on" description="There are no other events right now." />
          ) : (
            <div className="flex flex-col gap-5">
              {others.map((item: any) => {
                const itemPast = isPastEvent(item);
                const id = item._id ?? item.id;
                return (
                  <MediaCard
                    key={id}
                    layout="tint"
                    image={item.bannerUrl || item.image}
                    title={eventTitle(item)}
                    meta={formatCardDateTime(item.date, item.time)}
                    badge={itemPast ? "Past" : "New"}
                    badgeTone={itemPast ? "past" : "brand"}
                    onClick={() => navigate(`/event/${id}`)}
                    actions={
                      <Button size="sm" variant={itemPast ? "muted" : "primary"}>
                        View Details
                      </Button>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;
