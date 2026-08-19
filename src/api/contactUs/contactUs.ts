import apiTenant from "../baseApi";

/**
 * Member support forms.
 *
 * These used to POST to `/contactus/technical/` and `/contactus/admin/` — Django routes
 * that this backend does not mount, so every submission 404'd while the form showed a
 * success state. They now create a real Ticket, which is what the admin already has a
 * queue for (`/api/tickets`, surfaced in the admin dashboard).
 *
 * `supportType` only accepts TECHNICAL or SALES, so an admin enquiry is routed as SALES
 * with a GENERAL category — that is the closest the existing enum allows without a
 * schema change, and it keeps the two streams distinguishable in the queue.
 */

export interface SupportData {
  name: string;
  email: string;
  message: string;
}

interface CreateTicketBody {
  subject: string;
  category: string;
  supportType: "TECHNICAL" | "SALES";
  description: string;
  createdByEmail?: string;
}

const createTicket = async (body: CreateTicketBody) => {
  const response = await apiTenant.post(`/api/tickets`, body, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const technicalSupport = async (data: SupportData) =>
  createTicket({
    subject: `Technical support request from ${data.name}`,
    category: "TECHNICAL",
    supportType: "TECHNICAL",
    description: data.message,
    createdByEmail: data.email,
  });

export const adminSupport = async (data: SupportData) =>
  createTicket({
    subject: `Message to the association from ${data.name}`,
    category: "GENERAL",
    supportType: "SALES",
    description: data.message,
    createdByEmail: data.email,
  });
