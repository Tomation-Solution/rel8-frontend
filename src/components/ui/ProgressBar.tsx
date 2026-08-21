interface ProgressBarProps {
  /** 0–100. Clamped. */
  value: number;
  /** Results pages run green; a live poll runs brand purple. */
  tone?: "primary" | "success";
  className?: string;
}

/** The candidate share bar on the vote and results screens. */
const ProgressBar = ({ value, tone = "primary", className = "" }: ProgressBarProps) => {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div className={`w-full h-2 rounded-full bg-hairline overflow-hidden ${className}`}>
      <div className={`h-full rounded-full transition-all ${tone === "success" ? "bg-status-success" : "bg-org-primary"}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

export default ProgressBar;
