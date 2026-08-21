import { ElementType } from "react";
import { FiCalendar, FiBookOpen, FiUsers, FiBarChart2 } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { NotificationDataType } from "../../types/myTypes";

/**
 * `latest_update_table_name` / `latest_update_table_id` is the only thing on a notification
 * that says what it points at — there is no href on the record.
 *
 * The page this replaced guessed the destination by substring-matching the *title*
 * ("...includes('event')"), which sent every row to a list page and broke the moment an
 * admin worded a title differently. The table name is the field that actually carries it.
 */
export const notificationLink = (item: NotificationDataType): string => {
  const id = item.latest_update_table_id;
  switch (item.latest_update_table_name) {
    case "news":
      return `/news/${id}/`;
    case "events":
      return `/event/${id}/`;
    case "publications":
      return `/publication/${id}/`;
    case "meetings":
      return `/meeting/${id}/`;
    case "dues":
      return "/dues";
    case "elections":
      return "/election";
    default:
      return "/notifications";
  }
};

export const notificationIcon = (item: NotificationDataType): ElementType => {
  switch (item.latest_update_table_name) {
    case "events":
      return FiCalendar;
    case "meetings":
      return MdOutlineCalendarMonth;
    case "dues":
      return IoWalletOutline;
    case "elections":
      return FiBarChart2;
    case "members":
      return FiUsers;
    default:
      return FiBookOpen;
  }
};
