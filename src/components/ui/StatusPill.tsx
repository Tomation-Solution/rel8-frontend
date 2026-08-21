import { PillTone, TONES, statusTone } from "./statusTone";

interface StatusPillProps {
  /** Raw API value. Used for the colour, and for the label unless `label` is given. */
  status?: string | null;
  /** Display text — pass `PAYMENT_STATUS_LABEL[status]` for payment rows. */
  label?: string;
  tone?: PillTone;
  size?: "sm" | "md";
  className?: string;
}

const humanise = (v: string) => v.replace(/[_-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const StatusPill = ({ status, label, tone, size = "sm", className = "" }: StatusPillProps) => {
  const text = label ?? humanise(String(status ?? ""));
  if (!text) return null;
  return <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${TONES[tone ?? statusTone(status)]} ${size === "sm" ? "text-xs px-3 py-1" : "text-sm px-4 py-1.5"} ${className}`}>{text}</span>;
};

export default StatusPill;
