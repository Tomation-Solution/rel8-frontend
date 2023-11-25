import apiTenant from "../baseApi";


export const fetchAllFAQ = async () =>{
    const response = await apiTenant.get(`/faq/faq/members_view_faq/`);
    return response.data
}