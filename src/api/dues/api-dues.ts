import apiTenant from "../baseApi";

export const fetchAllUserDues = async () =>{
    const response = await apiTenant.get(`/dues/memberdue/`);
    return response.data
}


export async function  payDue(dueId:number) {
   
    const response = await apiTenant.post(`/dues/process_payment/due/${dueId}/`, );
   
    return response.data;
}