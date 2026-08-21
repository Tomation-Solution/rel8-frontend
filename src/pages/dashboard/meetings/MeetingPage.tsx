import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";

import { fetchUserMeetings } from "../../../api/meetings/api-meetings";
import { Button, EmptyState, MediaCardGrid, PageHeader, Pagination, SearchFilterBar, StatCard, StatCardRow } from "../../../components/ui";
import MediaCard from "../../../components/ui/MediaCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import RemindMeButton from "./RemindMeButton";
import { formatCardDateTime, isPast } from "../../../utils/dates";

const PER_PAGE = 9;

const FILTERS = [
  { value: "all", label: "All Meetings" },
  { value: "new", label: "New Meetings" },
  { value: "past", label: "Past Meetings" },
];

const MeetingPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isError, isLoading } = useQuery("meetings", fetchUserMeetings, { staleTime: 5 * 60 * 1000 });

  const meetings = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const counts = useMemo(() => {
    const past = meetings.filter((m: any) => isPast(m.event_date)).length;
    return { total: meetings.length, upcoming: meetings.length - past };
  }, [meetings]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return meetings.filter((meeting: any) => {
      const past = isPast(meeting.event_date);
      if (filter === "new" && past) return false;
      if (filter === "past" && !past) return false;
      if (!needle) return true;
      return `${meeting.name ?? ""} ${meeting.organiserName ?? ""} ${meeting.addresse ?? ""}`.toLowerCase().includes(needle);
    });
  }, [meetings, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <PageHeader title="Welcome To Your Meeting" subtitle="See the details of upcoming meetings here..." />

      {/* The mockup shows two cards here, not three — meetings have no Past tile. */}
      <StatCardRow className="lg:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Meeting" value={isLoading ? "..." : counts.total} icon={MdOutlineCalendarMonth} />
        <StatCard title="New Meeting" value={isLoading ? "..." : counts.upcoming} icon={FiCheckCircle} />
      </StatCardRow>

      <SearchFilterBar search={search} onSearchChange={resetPage(setSearch)} searchPlaceholder="Search Meeting by name" filter={filter} onFilterChange={resetPage(setFilter)} filterOptions={FILTERS} className="mb-6" />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : isError ? (
        <EmptyState icon={MdOutlineCalendarMonth} title="Couldn't load meetings" description="Something went wrong reaching the server. Try again in a moment." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MdOutlineCalendarMonth}
          title={meetings.length === 0 ? "No meetings yet" : "Nothing matches that"}
          description={meetings.length === 0 ? "Meetings your association schedules will show up here." : "Try a different name, or clear the filter."}
        />
      ) : (
        <>
          <MediaCardGrid>
            {visible.map((meeting: any, index: number) => {
              const past = isPast(meeting.event_date);
              const id = meeting._id ?? meeting.id;
              return (
                <MediaCard
                  key={id ?? index}
                  layout="tint"
                  image={meeting.image}
                  title={meeting.name}
                  meta={
                    <>
                      <span className="block">{formatCardDateTime(meeting.event_date)}</span>
                      {meeting.organiserName && <span className="block text-org-primary mt-0.5">{meeting.organiserName}</span>}
                    </>
                  }
                  badge={past ? "Past" : "New"}
                  badgeTone={past ? "past" : "brand"}
                  onClick={() => navigate(`/meeting/${id}`)}
                  actions={
                    <>
                      <Button size="sm" variant={past ? "muted" : "primary"}>
                        View Details
                      </Button>
                      <RemindMeButton meetingId={id} meetingDate={meeting.event_date} size="sm" variant="outline" />
                    </>
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

export default MeetingPage;
