import { Link } from "react-router-dom";
import { NotificationDataType } from "../../types/myTypes";
import { formatPostedAt, relativeTime } from "../../utils/dates";
import { notificationIcon, notificationLink } from "./notificationMeta";
import { htmlToText } from "../../utils/html";

interface NotificationRowProps {
  item: NotificationDataType;
  /**
   * Home shows "2 Days ago"; the Notifications page shows the full
   * "Date Posted: 17/06/2025 @03:28 PM".
   */
  stamp?: "relative" | "posted";
}

/** One notification: tinted icon, title, clamped body, right-aligned timestamp. */
const NotificationRow = ({ item, stamp = "relative" }: NotificationRowProps) => {
  const Icon = notificationIcon(item);

  return (
    <Link to={notificationLink(item)} className="flex items-start gap-4 rounded-xl border border-hairline px-4 py-3 hover:border-org-primary/40 hover:bg-org-tint/40 transition-colors">
      <span className="w-10 h-10 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
        <Icon className="w-5 h-5 text-org-primary" />
      </span>

      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-semibold text-ink truncate">{item.title}</span>
        <span className="block text-xs text-muted line-clamp-2 mt-0.5">{htmlToText(item.message || "")}</span>
      </span>

      <span className="hidden sm:flex items-center gap-2 flex-shrink-0 pt-1">
        <span className="w-2 h-2 rounded-full bg-status-success" />
        <span className="text-xs text-muted whitespace-nowrap">{stamp === "posted" ? formatPostedAt(item.createdAt) : relativeTime(item.createdAt)}</span>
      </span>
    </Link>
  );
};

export default NotificationRow;
