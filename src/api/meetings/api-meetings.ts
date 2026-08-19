import apiTenant from "../baseApi";

export const fetchUserMeetings = async () => {
  const response = await apiTenant.get(`/api/meetings/`);
  return response.data;
};

export const fetchUserMeetingById = async (id: any) => {
  if (id) {
    const response = await apiTenant.get(`/api/meetings/${id}`);
    return response.data;
  }
};

/**
 * Removed: `registerForMeeting`.
 *
 * It POSTed to `/meeting/meeting_member/` — a Django route this backend does not mount —
 * and the only caller (MeetingDetailsPage) never rendered the form that would have
 * triggered it, so it could not run. There is no meeting-attendance model or endpoint on
 * this backend either. If members should be able to register attendance or nominate a
 * proxy, that is a feature to build server-side first, not a call to repoint.
 */

export const setMeetingReminder = async ({ meetingId, orgId, minutesBefore }: { meetingId: string; orgId: string; minutesBefore: 5 | 10 | 15 | 30 }) => {
  const response = await apiTenant.post(`/api/meetings/${meetingId}/remind`, {
    orgId,
    minutesBefore,
  });
  return response.data;
};
