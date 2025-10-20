import apiTenant from "../baseApi";

export const fetchUserProfile = async ()=>{
    const response = await apiTenant.get(`/api/members/profile`);
    return response.data
}

