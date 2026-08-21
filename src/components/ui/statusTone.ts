export type PillTone = "success" | "danger" | "warning" | "neutral" | "brand" | "past";

export const TONES: Record<PillTone, string> = {
  success: "bg-status-success-bg text-status-success",
  danger: "bg-status-danger-bg text-status-danger",
  warning: "bg-status-warning-bg text-status-warning",
  neutral: "bg-status-neutral-bg text-status-neutral",
  brand: "bg-org-tint text-org-primary",
  past: "bg-past text-white",
};

/**
 * Maps the vocabularies the API actually returns onto a colour.
 *
 * Deliberately covers three *different* enums — payment status, ServiceRequest.requestStatus
 * and ProjectContribution.status — because the pill looks the same either way. See
 * CLAUDE.md → Status vocabulary; do not let that similarity tempt you into merging the
 * enums anywhere upstream of this function.
 */
export const statusTone = (status?: string | null): PillTone => {
  const key = String(status ?? "")
    .toLowerCase()
    .replace(/[\s-]/g, "_");

  switch (key) {
    // paid / verified / done
    case "paid":
    case "approved":
    case "confirmed":
    case "verified":
    case "completed":
    case "active":
    case "valid":
    case "success":
    case "successful":
      return "success";

    // needs the member to act
    case "pending":
    case "unpaid":
    case "failed":
    case "rejected":
    case "inactive":
      return "danger";

    // waiting on an admin
    case "awaiting_verification":
    case "awaiting_confirmation":
    case "processing":
    case "dispatched":
    case "submitted":
    case "pending_payment":
      return "warning";

    case "ongoing":
    case "new":
    case "free":
      return "brand";

    case "past":
    case "concluded":
    case "closed":
      return "past";

    default:
      return "neutral";
  }
};
