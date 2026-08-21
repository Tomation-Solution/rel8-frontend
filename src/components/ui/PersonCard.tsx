import { ReactNode } from "react";
import { FiUser } from "react-icons/fi";

interface PersonCardProps {
  name: string;
  /** Exco position, or "Position not available". */
  role?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  /** Corner label — "Active" / "Inactive". */
  status?: string | null;
  /** The "Chat Up" CTA. */
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/** The member/exco tile on the Environment page. */
const PersonCard = ({ name, role, email, imageUrl, status, actions, onClick, className = "" }: PersonCardProps) => {
  const isActive = String(status ?? "").toLowerCase() === "active";

  return (
    <article className={`bg-white rounded-xl border border-hairline overflow-hidden flex flex-col ${onClick ? "cursor-pointer" : ""} ${className}`} onClick={onClick}>
      <div className="relative h-44 bg-org-tint/50">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <div className="w-24 h-24 rounded-full bg-org-tint grid place-items-center">
              <FiUser className="w-12 h-12 text-org-primary/30" />
            </div>
          </div>
        )}
        {status && <span className={`absolute top-2 right-3 text-xs font-medium ${isActive ? "text-org-primary" : "text-muted"}`}>{status}</span>}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-[16px] font-medium text-org-primary truncate">{name}</h3>
        <p className="text-sm text-muted mt-0.5 truncate">{role || "Position not available"}</p>
        {email && <p className="text-sm text-muted truncate">{email}</p>}
        {actions && <div className="mt-4 flex justify-end">{actions}</div>}
      </div>
    </article>
  );
};

/** The four-up grid the Environment page uses. */
export const PersonCardGrid = ({ children, className = "" }: { children: ReactNode; className?: string }) => <div className={`grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}>{children}</div>;

export default PersonCard;
