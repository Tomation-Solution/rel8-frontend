import apiTenant from "../baseApi";
import type { PaymentConfig, UnifiedPayment } from "../paystack-api";

export interface Project {
  _id: string;
  name: string;
  description: string;
  // X-7: replaced paymentType (bank_transfer|payment_link|paystack) + paymentDetails.
  // "payment_link" is gone — an external URL cannot be reconciled.
  paymentConfig?: PaymentConfig;
  banner?: string;
  banners?: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectContribution {
  _id: string;
  projectId: {
    _id: string;
    name: string;
    banners?: string[];
    banner?: string;
  };
  memberId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  contributionType: "cash" | "in_kind";
  // X-7: cash contributions carry their money on the Payment record.
  paymentId?: UnifiedPayment | null;
  paymentStatus?: string;
  inKindDescription?: string;
  amount?: number;
  /** In-kind verification only. Cash contributions are governed by paymentStatus. */
  status: "pending" | "verified" | "rejected";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all active projects
export const fetchActiveProjects = async (): Promise<Project[]> => {
  const response = await apiTenant.get("/api/projects/active");
  return response.data;
};

// Get member's contributions
export const fetchMyContributions = async (): Promise<ProjectContribution[]> => {
  const response = await apiTenant.get("/api/projects/contributions/my-contributions");
  return response.data;
};

// Create contribution
export const createContribution = async (
  data: {
    projectId: string;
    contributionType: "cash" | "in_kind";
    inKindDescription?: string;
    amount?: number;
  },
  proofOfPaymentFile?: File,
): Promise<ProjectContribution> => {
  const formData = new FormData();
  formData.append("projectId", data.projectId);
  formData.append("contributionType", data.contributionType);

  if (data.contributionType === "in_kind" && data.inKindDescription) {
    formData.append("inKindDescription", data.inKindDescription);
  }

  if (data.contributionType === "cash" && data.amount) {
    formData.append("amount", data.amount.toString());
  }

  if (proofOfPaymentFile) {
    formData.append("proofOfPayment", proofOfPaymentFile);
  }

  const response = await apiTenant.post("/api/projects/contributions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
