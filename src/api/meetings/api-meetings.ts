import apiTenant from "../baseApi";

export const fetchUserMeetings = async () =>{
    // const response = await apiTenant.get(`/user/memberlist-info/get_all_exco/`);
    const response = await apiTenant.get(`/meeting/meeting_member/`);
    return response.data
}