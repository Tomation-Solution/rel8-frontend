import { useState } from "react";
import { useMutation } from "react-query";
import { FiBell, FiCheck } from "react-icons/fi";

import { setMeetingReminder } from "../../../api/meetings/api-meetings";
import { Button, ButtonSize, ButtonVariant } from "../../../components/ui";
import Toast from "../../../components/toast/Toast";
import { isPast } from "../../../utils/dates";
import { useAppContext } from "../../../context/authContext";

/**
 * "Remind Me To Join" — `POST /api/meetings/:id/remind`.
 *
 * REDESIGN.md §5 originally listed this as a mockup affordance with no API behind it. That
 * was wrong: the route is mounted in the backend's `src/app.js` (via `meeting.routes.js`)
 * and is `requireOrgAdminOrMember`, so a member can call it. `setMeetingReminder` upserts a
 * `MeetingReminder` keyed on (meetingId, memberId), so pressing it twice is safe.
 *
 * Two server-side rules the UI has to respect, both straight from the controller:
 *  - `minutesBefore` must be one of 5 / 10 / 15 / 30 — anything else is a 400
 *  - a reminder whose fire time is already in the past is a 400 ("Meeting is too soon"),
 *    so the button is disabled for meetings that have started or passed rather than
 *    letting the member press it and collect an error
 */

/** The only values the controller accepts. */
const MINUTES_BEFORE = 10;

interface Props {
  meetingId: string;
  meetingDate?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const RemindMeButton = ({ meetingId, meetingDate, size = "sm", variant = "outline", fullWidth = false }: Props) => {
  const { notifyUser } = Toast();
  const { organization } = useAppContext();
  const [done, setDone] = useState(false);

  // The reminder fires `MINUTES_BEFORE` ahead of the meeting, so anything closer than that
  // is already refused server-side.
  const tooLate = !meetingDate || isPast(new Date(new Date(meetingDate).getTime() - MINUTES_BEFORE * 60 * 1000));

  const mutation = useMutation(() => setMeetingReminder({ meetingId, orgId: organization?._id ?? "", minutesBefore: MINUTES_BEFORE }), {
    onSuccess: (result: any) => {
      setDone(true);
      notifyUser(result?.message || `Reminder set for ${MINUTES_BEFORE} minutes before the meeting`, "success");
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.message || "Could not set the reminder. Please try again.", "error");
    },
  });

  if (tooLate) return null;

  return (
    <Button
      size={size}
      variant={done ? "success" : variant}
      fullWidth={fullWidth}
      icon={done ? FiCheck : FiBell}
      isLoading={mutation.isLoading}
      disabled={done}
      onClick={event => {
        event.stopPropagation();
        mutation.mutate();
      }}
    >
      {done ? "Reminder Set" : "Remind Me To Join"}
    </Button>
  );
};

export default RemindMeButton;
