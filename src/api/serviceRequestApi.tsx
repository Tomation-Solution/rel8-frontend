import apiTenant from "./baseApi";
import type { PaymentConfig, UnifiedPayment } from "./paystack-api";

export type ServiceType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  // X-7: replaced paymentType (bank_transfer|payment_link|paystack) + paymentDetails.
  paymentConfig?: PaymentConfig;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryAddress = {
  street: string;
  city: string;
  country: string;
  state?: string;
  postalCode?: string;
  zipCode?: string;
};

export type ServiceRequestType = {
  _id: string;
  serviceId: {
    _id: string;
    name: string;
    description: string;
    price: number;
  };
  memberId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    membershipId: string;
  };
  deliveryAddress: DeliveryAddress;
  // X-7: proof, reference and confirmation time live on the Payment record now.
  paymentId?: UnifiedPayment | null;
  // "confirmed" may still appear on rows that predate the migration.
  paymentStatus: "pending" | "awaiting_verification" | "paid" | "failed" | "rejected" | "cancelled" | "confirmed";
  requestStatus: "pending" | "confirmed" | "dispatched" | "completed" | "cancelled";
  adminNotes: string | null;
  requestConfirmedAt: string | null;
  dispatchedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Get all active services for members
export const getActiveServices = async (): Promise<ServiceType[]> => {
  const resp = await apiTenant.get(`/api/services/public/active`);
  return resp.data;
};

// Get service details
export const getServiceDetail = async ({ serviceId }: { serviceId: string }): Promise<ServiceType> => {
  const resp = await apiTenant.get(`/api/services/${serviceId}`);
  return resp.data;
};

// Get member's service requests
export const getMyServiceRequests = async (): Promise<ServiceRequestType[]> => {
  const resp = await apiTenant.get(`/api/services/requests/my-requests`);
  return resp.data;
};

// Create service request with payment
export const createServiceRequest = async (data: { serviceId: string; deliveryAddress: DeliveryAddress; paymentProof?: File }): Promise<ServiceRequestType> => {
  const formData = new FormData();
  formData.append("serviceId", data.serviceId);
  formData.append("deliveryAddress", JSON.stringify(data.deliveryAddress));

  if (data.paymentProof) {
    formData.append("paymentProof", data.paymentProof);
  }

  const resp = await apiTenant.post(`/api/services/requests`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return resp.data.serviceRequest;
};

// Get single service request details
export const getServiceRequestDetail = async ({ requestId }: { requestId: string }): Promise<ServiceRequestType> => {
  const resp = await apiTenant.get(`/api/services/requests/${requestId}`);
  return resp.data;
};

// Handle service payment success callback

// Upload/replace payment proof for an existing service request
export const uploadServiceRequestPaymentProof = async (data: { requestId: string; paymentProof: File }): Promise<ServiceRequestType> => {
  const formData = new FormData();
  formData.append("paymentProof", data.paymentProof);

  const resp = await apiTenant.put(`/api/services/requests/${data.requestId}/payment-proof`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return resp.data.serviceRequest;
};
