interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/** Switch with an optional label/description block to its left. */
const Toggle = ({ checked, onChange, label, description, disabled = false, className = "" }: ToggleProps) => {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled || !onChange}
      onClick={() => onChange?.(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-org-primary" : "bg-past"} ${disabled || !onChange ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );

  if (!label) return <span className={className}>{control}</span>;

  return (
    <div className={`flex items-start justify-between gap-4 py-3 ${className}`}>
      <div className="min-w-0">
        <p className="text-[15px] text-ink">{label}</p>
        {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
      </div>
      {control}
    </div>
  );
};

export default Toggle;
