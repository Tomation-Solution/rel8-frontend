import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Draws the purple left edge the account/vote panels use. */
  accent?: boolean;
  onClick?: () => void;
}

/**
 * The surface the whole redesign is built from: white, 12px radius, one hairline border,
 * no shadow.
 */
const Card = ({ children, className = "", accent = false, onClick }: CardProps) => (
  <div onClick={onClick} className={`bg-white rounded-xl border border-hairline ${accent ? "border-l-4 border-l-org-primary" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}>
    {children}
  </div>
);

export default Card;
