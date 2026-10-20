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

// `GET /api/faqs` answers `{ message, faqs }`. This returned that whole object, and the
// support page only accepts an array, so the FAQ section always rendered empty.
export const fetchAllFAQ = async (): Promise<FAQItem[]> => {
    const response = await apiTenant.get(`/api/faqs`);
    const body = response.data;
    if (Array.isArray(body)) return body;
    return Array.isArray(body?.faqs) ? body.faqs : [];
}