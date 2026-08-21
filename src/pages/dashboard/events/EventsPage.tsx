import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";

import { fetchAllUserEvents } from "../../../api/events/events-api";
import { Button, EmptyState, MediaCardGrid, PageHeader, Pagination, SearchFilterBar, StatCard, StatCardRow } from "../../../components/ui";
import MediaCard from "../../../components/ui/MediaCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { eventTitle, eventWhen, isPastEvent } from "./eventFields";
import { formatCardDateTime } from "../../../utils/dates";

const PER_PAGE = 9;

const FILTERS = [
  { value: "all", label: "All Events" },
  { value: "new", label: "New Events" },
  { value: "past", label: "Past Events" },
];

const EventsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isError, isLoading } = useQuery("events", fetchAllUserEvents, { staleTime: 5 * 60 * 1000 });

  const events = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const counts = useMemo(() => {
    const past = events.filter(isPastEvent).length;
    return { total: events.length, past, upcoming: events.length - past };
  }, [events]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return events.filter(event => {
      if (filter === "new" && isPastEvent(event)) return false;
      if (filter === "past" && !isPastEvent(event)) return false;
      if (!needle) return true;
      return `${eventTitle(event)} ${event.address ?? ""} ${event.organizer ?? ""}`.toLowerCase().includes(needle);
    });
  }, [events, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Welcome To Your Events"
        subtitle="See the details of upcoming events here..."
        action={
          <Link to="/events/my-registrations" className="text-sm font-medium text-org-primary hover:underline whitespace-nowrap">
            My Registrations &rarr;
          </Link>
        }
      />

      <StatCardRow>
        <StatCard title="Total Events" value={isLoading ? "..." : counts.total} icon={FiCalendar} />
        <StatCard title="New Events" value={isLoading ? "..." : counts.upcoming} icon={FiCheckCircle} />
        <StatCard title="Past Events" value={isLoading ? "..." : counts.past} icon={FiClock} />
      </StatCardRow>

      <SearchFilterBar search={search} onSearchChange={resetPage(setSearch)} searchPlaceholder="Search Event by name" filter={filter} onFilterChange={resetPage(setFilter)} filterOptions={FILTERS} className="mb-6" />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : isError ? (
        <EmptyState icon={FiCalendar} title="Couldn't load events" description="Something went wrong reaching the server. Try again in a moment." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={FiCalendar} title={events.length === 0 ? "No events yet" : "Nothing matches that"} description={events.length === 0 ? "Events your association publishes will show up here." : "Try a different name, or clear the filter."} />
      ) : (
        <>
          <MediaCardGrid>
            {visible.map((event: any, index: number) => {
              const past = isPastEvent(event);
              const id = event._id ?? event.id;
              return (
                <MediaCard
                  key={id ?? index}
                  layout="tint"
                  image={event.bannerUrl || event.image}
                  title={eventTitle(event)}
                  meta={formatCardDateTime(eventWhen(event), event.time)}
                  badge={past ? "Past" : "New"}
                  badgeTone={past ? "past" : "brand"}
                  onClick={() => navigate(`/event/${id}`)}
                  actions={
                    <Button size="sm" variant={past ? "muted" : "primary"}>
                      View Details
                    </Button>
                  }
                />
              );
            })}
          </MediaCardGrid>

          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default EventsPage;
