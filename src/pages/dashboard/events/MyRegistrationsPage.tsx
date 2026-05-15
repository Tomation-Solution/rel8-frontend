import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { fetchMyRegistrations } from "../../../api/events/events-api";
import dummyImage from "../../../assets/images/dummy.jpg";

const statusColors: Record<string, string> = {
  registered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  pending: "bg-yellow-100 text-yellow-700",
};

const paymentColors: Record<string, string> = {
  free: "bg-blue-50 text-blue-600",
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  unpaid: "bg-red-100 text-red-500",
};

const MyRegistrationsPage = () => {
  const navigate = useNavigate();
  const { notifyUser } = Toast();

  const { data, isLoading, isError } = useQuery("myEventRegistrations", fetchMyRegistrations, {
    retry: 1,
    staleTime: 30_000,
    onError: () => notifyUser("Failed to load your registrations", "error"),
  });

  if (isLoading) return <CircleLoader />;

  const registrations: any[] = Array.isArray(data) ? data : [];

  return (
    <main>
      <BreadCrumb title="My Event Registrations" />

      {registrations.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-400 text-base">You have not registered for any events yet.</p>
          <button onClick={() => navigate("/events")} className="mt-4 text-org-primary text-sm underline">
            Browse Events
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {registrations.map((reg: any, i: number) => {
            const ev = reg.eventId ?? {};
            const eventId = ev._id || reg.eventId;
            const title = ev.details || ev.name || "Event";
            const banner = ev.bannerUrl || ev.image || dummyImage;
            const date = ev.date ? new Date(ev.date).toLocaleDateString() : "—";
            const time = ev.time ?? "—";
            const address = ev.address ?? "";
            const registeredAt = reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : "—";

            const statusLabel = reg.status ?? "registered";
            const paymentLabel = reg.paymentStatus ?? "free";

            return (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                {/* Banner thumbnail */}
                <img src={banner} alt={title} className="w-full sm:w-40 h-36 sm:h-auto object-cover shrink-0" />

                {/* Info */}
                <div className="p-4 flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 text-base leading-tight">{title}</h3>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[statusLabel] ?? "bg-gray-100 text-gray-600"}`}>{statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}</span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${paymentColors[paymentLabel] ?? "bg-gray-100 text-gray-600"}`}>{paymentLabel.charAt(0).toUpperCase() + paymentLabel.slice(1)}</span>
                    </div>

                    <div className="text-xs text-gray-500 space-y-0.5 mt-2">
                      <p>
                        📅 {date} at {time}
                      </p>
                      {address && <p>📍 {address}</p>}
                      <p>Registered: {registeredAt}</p>
                    </div>
                  </div>

                  {eventId && (
                    <button onClick={() => navigate(`/event/${eventId}`)} className="mt-3 self-start text-sm text-org-primary font-medium hover:underline">
                      View Event →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyRegistrationsPage;
