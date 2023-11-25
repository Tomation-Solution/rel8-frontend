import apiTenant from "../baseApi";

export const fetchUserProfile = async ()=>{
    const response = await apiTenant.get(`/user/profile/`);
    return response.data
}

