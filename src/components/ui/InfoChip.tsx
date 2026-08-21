import { ElementType, ReactNode, createElement } from "react";

interface InfoChipProps {
  icon?: ElementType;
  label: string;
  value: ReactNode;
  /** A CTA riding inside the chip — the "Pay Now" button beside "Type: Paid". */
  action?: ReactNode;
  className?: string;
}

/**
 * The lavender "Event's Date: 18/06/2026" pills on event and meeting detail pages.
 * Label is muted-ink, value is brand-coloured.
 */
export const InfoChip = ({ icon, label, value, action, className = "" }: InfoChipProps) => (
  <div className={`flex items-center gap-2 bg-org-tint rounded-lg px-3 py-2.5 text-sm ${className}`}>
    {icon && createElement(icon, { className: "w-4 h-4 text-org-primary flex-shrink-0" })}
    <span className="text-ink whitespace-nowrap">{label}:</span>
    <span className="text-org-primary font-medium min-w-0 truncate">{value}</span>
    {action && <span className="ml-auto flex-shrink-0">{action}</span>}
  </div>
);

/** Two-column chip block. */
export const InfoChipGrid = ({ children, className = "" }: { children: ReactNode; className?: string }) => <div className={`grid gap-3 grid-cols-1 md:grid-cols-2 ${className}`}>{children}</div>;

export default InfoChip;
