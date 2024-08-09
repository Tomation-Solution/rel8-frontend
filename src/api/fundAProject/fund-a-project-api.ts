import apiTenant from "../baseApi";

export const fundAProject = async () =>{
    // const response = await apiTenant.get(`/extras/member_support_project/`);
    const response = await apiTenant.get(`/extras/admin_manage_project/`);
    console.log('fhahfbsahfsfbs',response.data.results)
    return response.data
}


