import { ReactNode } from "react";
import StatusPill from "./StatusPill";
import { PillTone } from "./statusTone";

interface MediaCardProps {
  image?: string | null;
  title: string;
  /** "17/06/2026 | 10:00 AM". A node, so a card can stack an organiser line under it. */
  meta?: ReactNode;
  /** Body copy, clamped to three lines. */
  excerpt?: string;
  /** Corner badge — "New" / "Past". */
  badge?: string;
  badgeTone?: PillTone;
  /** Second chip beside the title (a contribution's Pending/Verified, say). */
  status?: string | null;
  /** Buttons. In the tinted-footer layout they sit to the right of the title. */
  actions?: ReactNode;
  /** Anything below the actions — an author strip, like/comment counts. */
  footer?: ReactNode;
  /**
   * "tint": title/date/CTA sit in a lavender footer beside each other (Events, Meetings).
   * "plain": white body, actions stacked underneath (News, Publications, Projects).
   */
  layout?: "tint" | "plain";
  onClick?: () => void;
  className?: string;
}

const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="%23F1F2F4"/></svg>');

/**
 * The image-topped card behind Events, Meetings, News, Publications, Gallery and Projects.
 * Six bespoke card components collapse into this one.
 */
const MediaCard = ({ image, title, meta, excerpt, badge, badgeTone, status, actions, footer, layout = "plain", onClick, className = "" }: MediaCardProps) => {
  const dimmed = badgeTone === "past";

  return (
    <article className={`bg-white rounded-xl border border-hairline overflow-hidden flex flex-col ${onClick ? "cursor-pointer" : ""} ${className}`} onClick={onClick}>
      <div className="relative">
        <img src={image || FALLBACK} alt="" className={`w-full h-48 object-cover ${dimmed ? "grayscale-[35%]" : ""}`} />
        {badge && <StatusPill label={badge} tone={badgeTone ?? "brand"} className="!rounded-none absolute top-0 right-0 !px-3 !py-1" />}
      </div>

      <div className={`flex-1 flex flex-col ${layout === "tint" ? "bg-org-tint p-4" : "p-4"}`}>
        {layout === "tint" ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[17px] font-medium text-org-primary truncate">{title}</h3>
              {meta && <p className="text-xs text-ink mt-0.5">{meta}</p>}
            </div>
            {actions && <div className="flex flex-col gap-2 flex-shrink-0">{actions}</div>}
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[17px] font-medium text-org-primary">{title}</h3>
              {status && <StatusPill status={status} className="flex-shrink-0" />}
            </div>
            {meta && <p className="text-xs text-ink mt-1">{meta}</p>}
            {excerpt && <p className="text-sm text-muted mt-2 line-clamp-3">{excerpt}</p>}
            {actions && <div className="mt-4 flex flex-col gap-2">{actions}</div>}
          </>
        )}
        {footer && <div className="mt-auto pt-3">{footer}</div>}
      </div>
    </article>
  );
};

/** Responsive 3-up grid the card pages all share. */
export const MediaCardGrid = ({ children, className = "" }: { children: ReactNode; className?: string }) => <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 ${className}`}>{children}</div>;

export default MediaCard;
