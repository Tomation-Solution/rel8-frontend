import apiTenant from "../baseApi";

export async function  supportInCash(projectId:any,data:{"amount":number,"remark":string}) {
    // const response = await apiTenant.post(`/dues/process_payment/fund_a_project/${projectId}/`, );
    const response = await apiTenant.post(`/dues/process_payment/fund_a_project/${projectId}/`, {...data});
    return response.data;
}
// export async function  supportInCash(projectId:any,data:{"amount":number,"remark":string}) {
//     // const response = await apiTenant.post(`/dues/process_payment/fund_a_project/${projectId}/`, );
//     const response = await apiTenant.post(`/extras/member_support_project_cash/support_in_cash/`, {...data});
//     return response.data;
// }
export async function  supportInKind(data:{"heading":string,"about":string,"delivery_date":string,project:number}) {
    const response = await apiTenant.post(`/extras/member_support_project_kind/support_in_kind/`, {...data});
    console.log(response.data)
    return response.data;
}