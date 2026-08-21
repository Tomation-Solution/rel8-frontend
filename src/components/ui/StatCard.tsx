import { ElementType, ReactNode, createElement } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

export interface StatCardProps {
  /** The muted label under the icon. */
  title: string;
  value: string | number;
  /** Small line under the value — "from 80 eligible voters". */
  subtitle?: string;
  icon?: ElementType;
  /** Turns the corner arrow into a link. Omit it and the arrow is not rendered. */
  to?: string;
  /** Election results turn the whole card green. */
  tone?: "primary" | "success";
  className?: string;
}

/**
 * Icon in a tinted circle, muted label, big brand-coloured number, and a corner arrow that
 * jumps to the full list. Used on Home, Events, Meetings, Dues, News, Gallery,
 * Publications, Elections, Vote and Results.
 */
export const StatCard = ({ title, value, subtitle, icon, to, tone = "primary", className = "" }: StatCardProps) => {
  const navigate = useNavigate();
  const accent = tone === "success" ? "text-status-success" : "text-org-primary";
  const bubble = tone === "success" ? "bg-status-success-bg" : "bg-org-tint";

  return (
    <div className={`bg-white rounded-xl border border-hairline p-5 ${className}`}>
      {icon && <div className={`w-11 h-11 rounded-full grid place-items-center mb-4 ${bubble}`}>{createElement(icon, { className: `w-5 h-5 ${accent}` })}</div>}
      <p className="text-[15px] text-ink">{title}</p>
      <div className="flex items-end justify-between gap-3 mt-1">
        <div className="min-w-0">
          <p className={`text-2xl font-semibold ${accent}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {to && (
          <button type="button" aria-label={`Open ${title}`} onClick={() => navigate(to)} className={`${accent} hover:opacity-70 flex-shrink-0`}>
            <FiArrowUpRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

/** Responsive row of stat cards — the strip that sits directly under the page header. */
export const StatCardRow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 ${className}`}>{children}</div>
);

export default StatCard;
