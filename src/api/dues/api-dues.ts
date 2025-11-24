import apiTenant from "../baseApi";

export const fetchAllUserDues = async () =>{
    const response = await apiTenant.get(`/api/dues/memberdues/`);
    return response.data
}


export async function  payDue(dueId:number) {
   
    const response = await apiTenant.post(`/dues/process_payment/due/${dueId}/`, );
   
    return response.data;
}