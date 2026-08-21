import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowUturnLeft } from "react-icons/hi2";

interface PageHeaderProps {
  title: string;
  /** The muted line under the title. Every mockup screen has one. */
  subtitle?: string;
  /** Right-hand slot — a CTA, a filter, a count. */
  action?: ReactNode;
  className?: string;
}

/** Title + muted subtitle. The opening pair of every screen in the mockups. */
export const PageHeader = ({ title, subtitle, action, className = "" }: PageHeaderProps) => (
  <div className={`flex flex-wrap items-start justify-between gap-4 mb-6 ${className}`}>
    <div className="min-w-0">
      <h2 className="text-[26px] leading-tight font-semibold text-ink">{title}</h2>
      {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

interface BackLinkProps {
  /** Where to go. Defaults to browser history. */
  to?: string;
  label?: string;
  className?: string;
}

/** The "← Go back" affordance that opens every detail page. */
export const BackLink = ({ to, label = "Go back", className = "" }: BackLinkProps) => {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => (to ? navigate(to) : navigate(-1))} className={`inline-flex items-center gap-3 text-ink hover:text-org-primary mb-4 ${className}`}>
      <HiArrowUturnLeft className="w-5 h-5" />
      <span className="text-[15px]">{label}</span>
    </button>
  );
};

export default PageHeader;
