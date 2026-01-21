import apiTenant from "../baseApi";

export interface FAQItem {
    _id: string;
    question: string;
    answer: string;
    category?: string;
    order: number;
    orgId: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchAllFAQ = async () => {
    const response = await apiTenant.get(`/api/faqs`);
    return response.data;
}