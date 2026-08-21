import apiTenant from "../baseApi";

/**
 * Which kinds of notification a member wants.
 *
 * These are real: `Notification` now carries a `type`, and the feed endpoints exclude the
 * types a member has switched off. Before that the model was an untyped
 * `{ title, message }` broadcast, so there was nothing a preference could filter on and the
 * portal could only show a decorative toggle.
 *
 * `general` has no flag by design — it is the bucket for announcements nobody classified
 * (and for rows written before `type` existed), so it is always delivered.
 */
export interface NotificationPreferences {
  event: boolean;
  meeting: boolean;
  due: boolean;
  election: boolean;
  news: boolean;
  publication: boolean;
}

export const fetchNotificationPreferences = async (): Promise<NotificationPreferences> => {
  const response = await apiTenant.get("/api/members/notification-preferences");
  return response.data.preferences;
};

/** Accepts a partial set — only the flags supplied are written. */
export const updateNotificationPreferences = async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
  const response = await apiTenant.put("/api/members/notification-preferences", { preferences });
  return response.data.preferences;
};
