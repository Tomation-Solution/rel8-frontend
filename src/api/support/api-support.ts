import apiTenant from "../baseApi";

export async function  supportInCashs(projectId:any,data:{"amount":number,"remark":string}) {
    // const response = await apiTenant.post(`/dues/process_payment/fund_a_project/${projectId}/`, );
    const response = await apiTenant.post(`/dues/process_payment/fund_a_project/${projectId}/`, {...data});
    return response.data;
}
export async function  supportInKind(data:{"heading":string,"about":string,"delivery_date":string,project:number}) {
    const response = await apiTenant.post(`/extras/member_support_project_kind/support_in_kind/`, {...data});
    console.log(response.data)
    return response.data;
}


// export const supportInCashss = async (projectId: string | number, data: any) => {
//     try {
//         const response = await apiTenant.post(`/extras/project/payment/`, {
//             amount: data.amount,
//             project_id: projectId,
//             member_remark: data.remark,
//         });

//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

export const supportInCash = async (projectId: string | number, data: any, memberId: string | number) => {
    try {
        const response = await apiTenant.post(`/extras/project/payment/`, {
            amount: data.amount,
            project_id: projectId,
            member_remark: data.remark,
            callback_url: `${window.location.origin}/payment-success?project_id=${projectId}&amount=${data.amount}`,
            metadata: {
                member_id: memberId,
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};



// export const supportInCash = async (projectId: string | number, data: any) => {
//     try {
//         const response = await apiTenant.post(`/extras/project/payment/`, {
//             amount: data.amount,
//             project_id: projectId,
//             member_remark: data.remark,
//             callback_url: `${window.location.origin}/payment-success?project_id=${projectId}&amount=${data.amount}`,
//         });

//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };
