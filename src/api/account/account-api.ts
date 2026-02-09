

import apiTenant from "../baseApi";

export const fetchUserDues= async ()=>{
    const response = await apiTenant.get(`/api/dues/memberdues/`);
    return response.data
}

export const fetchUserProfile = async () => {
    const response = await apiTenant.get(`/api/members/profile`);
    return response.data;
};

export const updateUserProfile = async (userId: string, profileData: FormData) => {
    // Let the browser/axios set the Content-Type (boundary) for multipart requests.
    const response = await apiTenant.put(`/api/members/${userId}`, profileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

