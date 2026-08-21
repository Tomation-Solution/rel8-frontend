import { apiPublic } from "../baseApi";

/**
 * Membership applications — the "request to join" path.
 *
 * Everything here is **public**: an applicant has no account yet. That is why these use
 * `apiPublic` rather than `apiTenant`, which would attach a bearer token and, on a 401,
 * try to bounce them to a login they cannot complete.
 *
 * Backend: `applications.routes.js` (`POST /track`, mounted ahead of the admin guard),
 * `form.routes.js` (`GET /:id`, `POST /:id/submissions` — both public) and
 * `public.routes.js` (`GET /membership-form`).
 */

export type ReviewStatus = "pending" | "approved" | "rejected" | "needs_revision";
export type FormStatus = "draft" | "submitted" | "published";

export interface TrackedApplication {
  code: string;
  applicantName: string;
  applicantEmail: string;
  formTitle: string | null;
  formStatus: FormStatus;
  reviewStatus: ReviewStatus;
  submittedAt: string;
  reviewedAt: string | null;
  organization: { name: string; shortName: string; logo?: string } | null;
}

/**
 * Look up an application.
 *
 * Deliberately takes **both** the code and the email it was submitted with: a code alone
 * is the sort of thing that gets forwarded, and it would otherwise be enough to read
 * someone's application. The server returns one message for a wrong code and a wrong
 * email, so this cannot be used to confirm which email a code belongs to.
 */
export const trackApplication = async (input: { code: string; email: string }): Promise<TrackedApplication> => {
  const response = await apiPublic.post("applications/track", {
    code: input.code.trim(),
    email: input.email.trim(),
  });
  return response.data.data;
};

/** A field as the admin's form builder saved it. */
export interface FormField {
  fieldId: string;
  type: "text" | "textarea" | "number" | "email" | "date" | "dropdown" | "fileUpload" | "heading" | "subtitle" | "button" | "image";
  label?: string;
  placeholder?: string;
  required?: boolean;
  width?: string;
  textAlign?: "left" | "center" | "right";
  text?: string;
  headingSize?: "h1" | "h2" | "h3" | "h4";
  options?: string[];
  acceptedFormats?: string[];
  maxSizeMB?: number;
  buttonText?: string;
  src?: string;
  enableCharacterCount?: boolean;
  maxLength?: number;
}

export interface MembershipForm {
  _id: string;
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitButtonText?: string;
  primaryColor?: string;
}

export interface MembershipFormResponse {
  form: MembershipForm;
  applicationFeeRequired: boolean;
  organization: { name: string; shortName: string; logo?: string };
}

/**
 * The organization's application form, resolved from the host.
 *
 * 404 means this association has not opted in — `settings.membership_form_id` is unset, or
 * the chosen form was unpublished. Callers should treat that as "no join link", not as an
 * error worth showing.
 */
export const fetchMembershipForm = async (): Promise<MembershipFormResponse> => {
  const response = await apiPublic.get("public/membership-form");
  return response.data.data;
};

export interface SubmittedApplication {
  _id: string;
  code: string;
  applicantName: string;
  applicantEmail: string;
  formStatus: FormStatus;
  reviewStatus: ReviewStatus;
  submittedAt: string;
}

/**
 * Submit an application.
 *
 * `data` is keyed by `fieldId`. The server derives the applicant's name, email and phone
 * from the form's typed and labelled fields; `applicant` overrides that when the caller
 * already knows better.
 *
 * The response carries the tracking `code` — the only thing the applicant needs to find
 * this again, so it must be shown to them, not just stored.
 */
export const submitMembershipForm = async (formId: string, data: Record<string, unknown>, applicant?: { name?: string; email?: string; phone?: string }): Promise<SubmittedApplication> => {
  const response = await apiPublic.post(`forms/${formId}/submissions`, { data, applicant });
  return response.data.data;
};
