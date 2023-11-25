

import apiTenant from "../baseApi";

export const fetchUserDues= async ()=>{
    const response = await apiTenant.get(`/dues/memberdue/`);
    return response.data
}

