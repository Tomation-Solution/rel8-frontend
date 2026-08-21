import { ElementType } from "react";
import { FiCalendar, FiBookOpen, FiBarChart2 } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { NotificationDataType } from "../../types/myTypes";

/**
 * What a notification is about, and where it points.
 *
 * The record carries `type` and `refId`. Note the history here, because it explains the
 * fallbacks: this file used to read `latest_update_table_name` / `latest_update_table_id`,
 * **fields the `Notification` model never had** — so every row fell through to the default
 * icon and linked to `/notifications`. Before *that*, the page substring-matched the title
 * (`title.includes("event")`), which broke whenever an admin worded a title differently.
 *
 * `type` is the field that actually carries this. The legacy names are still read as a
 * fallback so any row written by an older client still resolves.
 */
const typeOf = (item: NotificationDataType): string => String((item as any).type ?? (item as any).latest_update_table_name ?? "general").toLowerCase();

const refOf = (item: NotificationDataType): string | undefined => {
  const ref = (item as any).refId ?? (item as any).latest_update_table_id;
  return ref ? String(ref) : undefined;
};

export const notificationLink = (item: NotificationDataType): string => {
  const id = refOf(item);

  // Singular from the model's enum; the plural forms are the legacy table names.
  switch (typeOf(item)) {
    case "news":
      return id ? `/news/${id}/` : "/news";
    case "event":
    case "events":
      return id ? `/event/${id}` : "/events";
    case "publication":
    case "publications":
      return id ? `/publication/${id}/` : "/publications";
    case "meeting":
    case "meetings":
      return id ? `/meeting/${id}` : "/meeting";
    case "due":
    case "dues":
      return "/dues";
    case "election":
    case "elections":
      // Deliberately the list: a member landing mid-election should see what is open, and
      // an "election ended" notification has nothing useful to deep-link to.
      return "/election";
    default:
      return "/notifications";
  }
};

export const notificationIcon = (item: NotificationDataType): ElementType => {
  switch (typeOf(item)) {
    case "event":
    case "events":
      return FiCalendar;
    case "meeting":
    case "meetings":
      return MdOutlineCalendarMonth;
    case "due":
    case "dues":
      return IoWalletOutline;
    case "election":
    case "elections":
      return FiBarChart2;
    case "news":
      return HiOutlineNewspaper;
    default:
      return FiBookOpen;
  }
};
