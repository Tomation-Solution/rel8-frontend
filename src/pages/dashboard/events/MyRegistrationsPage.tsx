import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiMapPin, FiClock } from "react-icons/fi";

import { fetchMyRegistrations, unregisterFromEvent } from "../../../api/events/events-api";
import { BackLink, Button, Card, EmptyState, PageHeader, StatusPill } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { formatDate, formatDateTime } from "../../../utils/dates";
import { eventTitle } from "./eventFields";

/**
 * Two chips per row, and they are **different enums** — same trap as service requests.
 *
 * `EventRegistration.status` is attendance: `registered` / `pending_payment` / `cancelled`.
 * `pending_payment` (X-3/BE-14) is a place held while checkout is in flight and does NOT
 * count toward the event's capacity.
 *
 * `EventRegistration.paymentStatus` is the money, and uses the unified X-7 vocabulary.
 * Do not fold them together.
 */
const STATUS_LABEL: Record<string, string> = {
  registered: "Registered",
  pending_payment: "Not confirmed",
  cancelled: "Cancelled",
  pending: "Pending",
};

const PAYMENT_LABEL: Record<string, string> = {
  free: "Free",
  paid: "Paid",
  pending: "Awaiting payment",
  awaiting_verification: "Awaiting confirmation",
  rejected: "Not accepted",
  failed: "Payment failed",
  cancelled: "Cancelled",
  unpaid: "Not paid",
};

const MyRegistrationsPage = () => {
  const navigate = useNavigate();
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery("myEventRegistrations", fetchMyRegistrations, {
    retry: 1,
    staleTime: 30_000,
    onError: () => notifyUser("Failed to load your registrations", "error"),
  });

  const cancelMutation = useMutation((evtId: string) => unregisterFromEvent(evtId), {
    onSuccess: () => {
      notifyUser("Registration cancelled.", "success");
      queryClient.invalidateQueries("myEventRegistrations");
    },
    onError: (err: any) => {
      notifyUser(err?.response?.data?.message || "Failed to cancel registration", "error");
    },
  });

  const registrations: any[] = Array.isArray(data) ? data : [];

  return (
    <>
      <BackLink to="/events" label="Back to events" />
      <PageHeader title="My Event Registrations" subtitle="Every event you have signed up for, and where each one stands." />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : registrations.length === 0 ? (
        <EmptyState icon={FiCalendar} title="No registrations yet" description="You have not registered for any events." action={<Button onClick={() => navigate("/events")}>Browse events</Button>} />
      ) : (
        <div className="flex flex-col gap-5">
          {registrations.map((reg: any, index: number) => {
            const ev = reg.eventId ?? {};
            const eventId = ev._id || reg.eventId;
            const status = reg.status ?? "registered";
            const payment = reg.paymentStatus ?? "free";

            const canCancel = status === "registered" && payment !== "paid" && payment !== "awaiting_verification";
            const isPaidRegistration = status === "registered" && payment === "paid";
            const isCancellingThis = cancelMutation.isLoading && cancelMutation.variables === eventId;

            return (
              <Card key={reg._id ?? index} className="overflow-hidden flex flex-col sm:flex-row">
                {ev.bannerUrl || ev.image ? (
                  <img src={ev.bannerUrl || ev.image} alt="" className="w-full sm:w-48 h-40 sm:h-auto object-cover flex-shrink-0" />
                ) : (
                  <div className="w-full sm:w-48 h-40 sm:h-auto bg-org-tint/50 grid place-items-center flex-shrink-0">
                    <FiCalendar className="w-10 h-10 text-org-primary/25" />
                  </div>
                )}

                <div className="p-5 flex-1 min-w-0 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[17px] font-medium text-org-primary">{eventTitle(ev)}</h3>
                      <StatusPill status={status} label={STATUS_LABEL[status] ?? status} />
                      <StatusPill status={payment} label={PAYMENT_LABEL[payment] ?? payment} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <FiCalendar className="w-4 h-4" />
                        {formatDate(ev.date)}
                        {ev.time ? ` at ${ev.time}` : ""}
                      </span>
                      {ev.address && (
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <FiMapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{ev.address}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <FiClock className="w-4 h-4" />
                        Registered {formatDateTime(reg.registeredAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {eventId && (
                      <Button size="sm" variant="outline" onClick={() => navigate(`/event/${eventId}`)}>
                        View Event
                      </Button>
                    )}
                    {canCancel && (
                      <Button size="sm" variant="danger" isLoading={isCancellingThis} onClick={() => cancelMutation.mutate(eventId)}>
                        Unregister
                      </Button>
                    )}
                    {isPaidRegistration && <p className="text-xs text-muted italic">Paid registrations cannot be cancelled. Contact your admin.</p>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MyRegistrationsPage;
