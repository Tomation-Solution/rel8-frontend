import apiTenant from "./baseApi";

export interface PaystackInitResponse {
  authorizationUrl: string;
  reference: string;
  accessCode?: string;
}

export interface PaystackVerifyResponse {
  message: string;
  status?: string;
  data?: any;
}

/** Initialize a due payment via Paystack */
export const initializeDuePayment = async (memberDueId: string): Promise<PaystackInitResponse> => {
  const response = await apiTenant.post(`/api/paystack/initialize/due/${memberDueId}`);
  return response.data;
};

/** Initialize a project contribution via Paystack */
export const initializeProjectPayment = async (projectId: string, amount: number): Promise<PaystackInitResponse> => {
  const response = await apiTenant.post(`/api/paystack/initialize/project/${projectId}`, { amount });
  return response.data;
};

/** Initialize a service payment via Paystack */
export const initializeServicePayment = async (serviceId: string): Promise<PaystackInitResponse> => {
  const response = await apiTenant.post(`/api/paystack/initialize/service/${serviceId}`);
  return response.data;
};

/** Verify a Paystack payment by reference */
export const verifyPaystackPayment = async (reference: string): Promise<PaystackVerifyResponse> => {
  const response = await apiTenant.get(`/api/paystack/verify/${reference}`);
  return response.data;
};
