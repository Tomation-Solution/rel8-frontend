import { ElementType, ReactNode, createElement } from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Illustration. Falls back to a faded icon. */
  image?: string;
  icon?: ElementType;
  /** A CTA — "Check for Update". */
  action?: ReactNode;
  /** "row" puts the art beside the copy (Home's Latest Update panel). */
  layout?: "column" | "row";
  className?: string;
}

const EmptyState = ({ title, description, image, icon = FiInbox, action, layout = "column", className = "" }: EmptyStateProps) => {
  const art = image ? <img src={image} alt="" className={layout === "row" ? "w-full max-w-xs" : "w-40 mx-auto"} /> : <div className={`grid place-items-center ${layout === "row" ? "w-40 h-40" : "w-full"}`}>{createElement(icon, { className: "w-20 h-20 text-org-tint-strong" })}</div>;

  return (
    <div className={`${layout === "row" ? "flex flex-col md:flex-row items-center gap-8" : "text-center"} py-8 px-4 ${className}`}>
      <div className={layout === "row" ? "flex-shrink-0" : "mb-4"}>{art}</div>
      <div className={layout === "row" ? "min-w-0" : ""}>
        <h3 className="text-[18px] font-semibold text-ink">{title}</h3>
        {description && <p className="text-sm text-muted mt-1 max-w-sm">{description}</p>}
        {action && <div className={`mt-4 ${layout === "row" ? "" : "flex justify-center"}`}>{action}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
