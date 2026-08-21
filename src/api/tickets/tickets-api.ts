import apiTenant, { apiTenantAxiosForm } from "../baseApi";

/**
 * Support tickets.
 *
 * `ticket.routes.js` guards everything below the webhook with
 * `requireOrgAdminOrMember`, so a member can raise a ticket and read their own. What they
 * cannot do is change status — that is the admin's call, and this client deliberately
 * exposes no update or delete.
 *
 * The Support page's Admin/Technical contact forms already create tickets through
 * `api/contactUs/contactUs.ts`; this is the same resource seen from the other end.
 */

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

/** `Ticket.supportType` is a closed enum of exactly two values — see the model. */
export type SupportType = "TECHNICAL" | "SALES";

export interface Ticket {
  _id: string;
  /** Human-readable reference, e.g. IACS-TICKET-00007. What a member quotes. */
  ticketId: string;
  subject: string;
  category: string;
  supportType: SupportType;
  description: string;
  status: TicketStatus;
  attachments?: string[];
  createdBy?: { id?: string; name?: string; email?: string } | null;
  createdByEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export const SUPPORT_TYPES: { value: SupportType; label: string }[] = [
  { value: "TECHNICAL", label: "Technical" },
  { value: "SALES", label: "General / Admin" },
];

/**
 * Categories, mirrored from the admin's `libs/constant.ts`.
 *
 * Trimmed to the ones that mean something to a member: the admin list carries HR, Payroll,
 * Attendance, Leave and Performance, which belong to a different product and would only
 * confuse someone raising a ticket about their dues.
 */
export const TICKET_CATEGORIES = [
  { value: "GENERAL", label: "General" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "FINANCE", label: "Finance / Payments" },
  { value: "COMPLAINT", label: "Complaint" },
  { value: "SUGGESTION", label: "Suggestion" },
];

export const STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const fetchMyTickets = async (): Promise<Ticket[]> => {
  const response = await apiTenant.get("/api/tickets/my-tickets");
  return response.data.data ?? [];
};

export const fetchTicketById = async (id: string): Promise<Ticket> => {
  const response = await apiTenant.get(`/api/tickets/${id}`);
  return response.data.data ?? response.data;
};

export interface NewTicket {
  subject: string;
  category: string;
  supportType: SupportType;
  description: string;
  attachments?: File[];
}

/**
 * Raise a ticket.
 *
 * Multipart because of the attachments — the field name is `attachments` and the server
 * takes at most 10 (`uploadTicket.array("attachments", 10)`). Sent through
 * `apiTenantAxiosForm`, which omits Content-Type so the browser can set the multipart
 * boundary.
 */
export const createTicket = async (input: NewTicket): Promise<Ticket> => {
  const formData = new FormData();
  formData.append("subject", input.subject);
  formData.append("category", input.category);
  formData.append("supportType", input.supportType);
  formData.append("description", input.description);
  (input.attachments ?? []).slice(0, 10).forEach(file => formData.append("attachments", file));

  const response = await apiTenantAxiosForm.post("/api/tickets", formData);
  return response.data.data ?? response.data;
};
