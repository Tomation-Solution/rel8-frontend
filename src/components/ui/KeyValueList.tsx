import { ElementType, ReactNode, createElement } from "react";

export interface KeyValueEntry {
  icon?: ElementType;
  label: string;
  value: ReactNode;
}

interface KeyValueListProps {
  entries: KeyValueEntry[];
  /**
   * "grid": icon bubble + label + value in two columns, divider between rows
   *         (the applicant dashboard).
   * "rows": right-aligned brand-coloured value on a hairline row (certificate info panel).
   */
  variant?: "grid" | "rows";
  className?: string;
}

const KeyValueList = ({ entries, variant = "grid", className = "" }: KeyValueListProps) => {
  if (variant === "rows") {
    return (
      <dl className={className}>
        {entries.map((entry, index) => (
          <div key={index} className="flex items-start justify-between gap-4 py-3 border-b border-hairline last:border-0">
            <dt className="text-sm text-ink flex-shrink-0">{entry.label}</dt>
            <dd className="text-sm font-medium text-org-primary text-right">{entry.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className={`grid grid-cols-1 md:grid-cols-2 ${className}`}>
      {entries.map((entry, index) => (
        <div key={index} className="flex items-start gap-4 px-2 py-5 border-b border-hairline md:[&:nth-last-child(-n+2)]:border-b-0 last:border-b-0 md:odd:border-r md:odd:border-r-hairline">
          {entry.icon && <div className="w-11 h-11 rounded-full bg-org-tint grid place-items-center flex-shrink-0">{createElement(entry.icon, { className: "w-5 h-5 text-org-primary" })}</div>}
          <div className="min-w-0">
            <dt className="text-[15px] font-medium text-org-primary">{entry.label}</dt>
            <dd className="text-sm text-ink mt-1">{entry.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
};

export default KeyValueList;
