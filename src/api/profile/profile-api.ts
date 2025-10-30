import apiTenant from "../baseApi";

export const fetchUserProfile = async (): Promise<any> =>{
    const response = await apiTenant.get(`/api/members/profile`);
    return response.data
}

