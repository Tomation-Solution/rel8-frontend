import apiTenant from "../baseApi";

export const fetchAllCommittees = async () =>{
    const response = await apiTenant.get(`/auth/member/commitees`);
    // console.log(response.data)
    return response.data
}

export const fetchCommitteeDetails = async (id: string | number) => {
    const response = await apiTenant.get(`/auth/member/commitees?commitee_id=${id}`);
    return response.data;
};

