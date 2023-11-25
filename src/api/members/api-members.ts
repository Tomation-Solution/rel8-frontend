import apiTenant from "../baseApi";

export const fetchAllMembers = async () =>{
    const response = await apiTenant.get(`/user/memberlist-info/get_all_members/`);
    return response.data
}
export const fetchAllExcos = async () =>{
    const response = await apiTenant.get(`/user/memberlist-info/get_all_exco/`);
    return response.data
}

