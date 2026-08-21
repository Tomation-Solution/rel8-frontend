import { ElementType, InputHTMLAttributes, TextareaHTMLAttributes, createElement, forwardRef } from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const Field = ({ label, error, children, className = "" }: FieldWrapperProps) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-sm text-ink mb-1.5">{label}</label>}
    {children}
    {error && <p className="text-xs text-status-danger mt-1">{error}</p>}
  </div>
);

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** react-icons component shown in the leading cell. */
  icon?: ElementType;
  /**
   * "inline": icon sits inside the border with a hairline divider (My Account fields).
   * "attached": icon is a separate tinted square to the left (Support forms).
   */
  iconStyle?: "inline" | "attached";
  wrapperClassName?: string;
}

/**
 * Bordered input with a leading icon. Replaces InputWithLabel / TextInputWithImage /
 * TextInputPassword — pass `type="password"` for the last of those.
 *
 * Forwards its ref so `react-hook-form`'s `{...register("name")}` spreads straight onto it.
 */
export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(({ label, error, icon, iconStyle = "inline", className = "", wrapperClassName = "", ...rest }, ref) => {
  const input = <input ref={ref} className={`flex-1 min-w-0 bg-transparent outline-none text-sm text-ink placeholder:text-muted px-3 py-3 ${className}`} {...rest} />;

  return (
    <Field label={label} error={error} className={wrapperClassName}>
      {iconStyle === "attached" ? (
        <div className="flex items-stretch gap-0">
          {icon && <div className="w-12 rounded-l-lg bg-org-tint grid place-items-center flex-shrink-0">{createElement(icon, { className: "w-5 h-5 text-org-primary" })}</div>}
          <div className={`flex-1 min-w-0 flex items-center border border-hairline bg-white focus-within:border-org-primary ${icon ? "rounded-r-lg" : "rounded-lg"}`}>{input}</div>
        </div>
      ) : (
        <div className="flex items-center rounded-lg border border-hairline bg-white focus-within:border-org-primary">
          {icon && <div className="pl-3 pr-3 py-3 border-r border-hairline flex-shrink-0">{createElement(icon, { className: "w-5 h-5 text-muted" })}</div>}
          {input}
        </div>
      )}
    </Field>
  );
});
IconInput.displayName = "IconInput";

interface IconTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

/** The tinted message box on the support forms. */
export const IconTextarea = forwardRef<HTMLTextAreaElement, IconTextareaProps>(({ label, error, className = "", wrapperClassName = "", rows = 6, ...rest }, ref) => (
  <Field label={label} error={error} className={wrapperClassName}>
    <textarea ref={ref} rows={rows} className={`w-full rounded-lg bg-org-tint px-4 py-3 text-sm text-ink placeholder:text-muted outline-none resize-y focus:ring-1 focus:ring-org-primary ${className}`} {...rest} />
  </Field>
));
IconTextarea.displayName = "IconTextarea";

export default IconInput;
