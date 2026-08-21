import { ButtonHTMLAttributes, ElementType, ReactNode, createElement } from "react";

export type ButtonVariant = "primary" | "outline" | "muted" | "ghost" | "danger" | "success";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children?: ReactNode;
  /** Legacy prop — some older call sites pass the label instead of children. */
  text?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** react-icons component, rendered before the label. */
  icon?: ElementType;
  /** Renders `icon` after the label instead. */
  iconRight?: ElementType;
  isLoading?: boolean;
  fullWidth?: boolean;
  htmlType?: "button" | "submit" | "reset";
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-org-primary text-white hover:bg-org-primary-hover disabled:bg-org-primary/50",
  outline: "bg-white text-org-primary border border-org-primary hover:bg-org-tint",
  // The "Due Paid" / "Past" state — present but visibly done with.
  muted: "bg-muted text-white hover:bg-muted/90",
  ghost: "bg-transparent text-org-primary hover:bg-org-tint",
  danger: "bg-status-danger text-white hover:bg-status-danger/90",
  success: "bg-status-success text-white hover:bg-status-success/90",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-[15px] px-6 py-3 gap-2",
};

const Button = ({ children, text, variant = "primary", size = "md", icon, iconRight, isLoading = false, fullWidth = false, htmlType = "button", className = "", disabled, ...rest }: ButtonProps) => (
  <button
    type={htmlType}
    disabled={disabled || isLoading}
    className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    {...rest}
  >
    {isLoading ? (
      <>
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        Loading
      </>
    ) : (
      <>
        {icon && createElement(icon, { className: "w-4 h-4 flex-shrink-0" })}
        {children ?? text}
        {iconRight && createElement(iconRight, { className: "w-4 h-4 flex-shrink-0" })}
      </>
    )}
  </button>
);

export default Button;
