import { useMutation, useQuery, useQueryClient } from "react-query";
import { FiBell } from "react-icons/fi";

import { fetchNotificationPreferences, updateNotificationPreferences, type NotificationPreferences } from "../../../api/notifications/preferences-api";
import { Card, Toggle } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";

/**
 * "Notification Preference" — `My Account-2.png`.
 *
 * These toggles are live. Each one maps to a `Notification.type`, and the feed endpoints
 * filter on them, so switching one off genuinely stops those notifications arriving.
 *
 * They render read-only until the current values load, so a toggle can never show a state
 * the server does not hold.
 */
const CHANNELS: { key: keyof NotificationPreferences; label: string; hint: string }[] = [
  { key: "event", label: "Events", hint: "New events published by your association." },
  { key: "meeting", label: "Meetings", hint: "Meetings scheduled, and reminders you asked for." },
  { key: "due", label: "Dues", hint: "New dues and payment deadlines." },
  { key: "election", label: "Elections", hint: "Voting opening and closing, and results." },
  { key: "news", label: "News", hint: "News your association posts." },
  { key: "publication", label: "Publications", hint: "New publications shared with members." },
];

const NotificationPreferenceTab = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = Toast();

  const { data: preferences, isLoading } = useQuery("notificationPreferences", fetchNotificationPreferences);

  const mutation = useMutation(updateNotificationPreferences, {
    /*
     * Optimistic, with a rollback. A toggle that waits for a round trip before moving feels
     * broken; one that moves and silently fails is worse. The previous value is captured so
     * a failed save puts the switch back where it was.
     */
    onMutate: async partial => {
      await queryClient.cancelQueries("notificationPreferences");
      const previous = queryClient.getQueryData<NotificationPreferences>("notificationPreferences");
      if (previous) queryClient.setQueryData("notificationPreferences", { ...previous, ...partial });
      return { previous };
    },
    onError: (_error, _partial, context: any) => {
      if (context?.previous) queryClient.setQueryData("notificationPreferences", context.previous);
      notifyUser("Could not save that preference. Please try again.", "error");
    },
    onSuccess: fresh => {
      queryClient.setQueryData("notificationPreferences", fresh);
      // The feed depends on these, so anything showing notifications is now stale.
      queryClient.invalidateQueries("notifications");
    },
  });

  return (
    <div className="max-w-2xl">
      <Card accent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <span className="w-11 h-11 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
            <FiBell className="w-5 h-5 text-org-primary" />
          </span>
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold text-ink">Notification Preference</h3>
            <p className="text-sm text-muted mt-1">Choose what you hear about. Switching one off stops those notifications appearing in your feed. General announcements from your association always come through.</p>
          </div>
        </div>

        {isLoading || !preferences ? (
          <CircleLoader />
        ) : (
          <ul className="flex flex-col divide-y divide-hairline">
            {CHANNELS.map(channel => (
              <li key={channel.key}>
                <Toggle checked={preferences[channel.key]} disabled={mutation.isLoading} onChange={next => mutation.mutate({ [channel.key]: next })} label={channel.label} description={channel.hint} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default NotificationPreferenceTab;
