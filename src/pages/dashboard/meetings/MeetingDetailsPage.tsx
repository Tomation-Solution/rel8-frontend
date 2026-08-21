import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FiEdit3, FiCalendar, FiClock, FiMapPin, FiLink, FiUser, FiDownload } from "react-icons/fi";

import { fetchUserMeetingById } from "../../../api/meetings/api-meetings";
import { BackLink, Button, Card, EmptyState, InfoChip, PageHeader, StatusPill } from "../../../components/ui";
import RemindMeButton from "./RemindMeButton";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { formatDate, isPast } from "../../../utils/dates";

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: meeting, isLoading, isError } = useQuery(["meetingDetails", id], () => fetchUserMeetingById(id), { enabled: !!id });

  if (isLoading) {
    return (
      <div className="py-20 grid place-items-center">
        <CircleLoader />
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <>
        <BackLink />
        <PageHeader title="Meeting's Details" />
        <EmptyState icon={MdOutlineCalendarMonth} title="Meeting not found" description="This meeting may have been removed." action={<Button onClick={() => navigate("/meeting")}>Back to meetings</Button>} />
      </>
    );
  }

  const past = isPast(meeting.event_date);
  const when = meeting.event_date ? new Date(meeting.event_date) : null;
  // Meetings have no separate `time` field — the clock is part of `event_date`.
  const time = when ? when.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";
  const isVirtual = !!meeting.url;

  return (
    <>
      <BackLink />
      <PageHeader title="Meeting's Details" subtitle="See the details of upcoming meetings here..." />

      <div className="max-w-4xl flex flex-col gap-6">
        <Card className="overflow-hidden">
          <div className="relative">
            {meeting.image ? (
              <img src={meeting.image} alt="" className={`w-full h-64 sm:h-96 object-cover ${past ? "grayscale-[35%]" : ""}`} />
            ) : (
              <div className="w-full h-64 sm:h-96 bg-org-tint/50 grid place-items-center">
                <MdOutlineCalendarMonth className="w-24 h-24 text-org-primary/25" />
              </div>
            )}
            <StatusPill label={past ? "Past" : "New"} tone={past ? "past" : "brand"} className="!rounded-none absolute top-0 right-0 !px-4 !py-1.5" />
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-3 content-start">
              <InfoChip icon={FiEdit3} label="Meetings Name" value={meeting.name} />
              <InfoChip icon={FiCalendar} label="Meeting's Date" value={formatDate(meeting.event_date)} />
              <InfoChip icon={FiClock} label="Meeting's Time" value={time} />
            </div>

            <div className="grid gap-3 content-start">
              <InfoChip icon={FiMapPin} label="Location" value={isVirtual ? "Virtual" : "Physical"} />
              {meeting.url && (
                <InfoChip
                  icon={FiLink}
                  label="Meeting Link"
                  value={
                    <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {meeting.url}
                    </a>
                  }
                />
              )}
              {meeting.addresse && <InfoChip icon={FiMapPin} label="Address" value={meeting.addresse} />}

              <div className="flex flex-wrap gap-3">
                <RemindMeButton meetingId={String(id)} meetingDate={meeting.event_date} size="md" variant="primary" />
                {meeting.url && !past && (
                  <a
                    href={meeting.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm px-4 py-2.5 bg-white border border-org-primary text-org-primary hover:bg-org-tint transition-colors"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            </div>
          </div>
        </Card>

        {meeting.details && (
          <div>
            <h3 className="text-[18px] font-semibold text-org-primary mb-3">Meeting&rsquo;s Details</h3>
            <Card className="p-6">
              <p className="text-[15px] text-ink whitespace-pre-line leading-relaxed">{meeting.details}</p>
            </Card>
          </div>
        )}

        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {meeting.organiserImage ? (
              <img src={meeting.organiserImage} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            ) : (
              <span className="w-12 h-12 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
                <FiUser className="w-6 h-6 text-org-primary/60" />
              </span>
            )}
            <div className="min-w-0">
              <p className="text-[15px] text-ink truncate">
                Organizer: <span className="text-org-primary font-medium">{meeting.organiserName || "Not available"}</span>
              </p>
              <p className="text-sm text-muted">{meeting.organiserDetails || "Organizer Details Not Available."}</p>
            </div>
          </div>

          {meeting.meeting_docs && (
            <a
              href={meeting.meeting_docs}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm px-4 py-2.5 border border-hairline text-ink hover:border-org-primary hover:text-org-primary transition-colors flex-shrink-0"
            >
              <FiDownload className="w-4 h-4" />
              Download Meeting&rsquo;s Attachment
            </a>
          )}
        </Card>
      </div>
    </>
  );
};

export default MeetingDetailsPage;
