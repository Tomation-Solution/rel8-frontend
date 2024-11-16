import apiTenant from "../baseApi";

export const fetchUserMeetings = async () =>{
    const response = await apiTenant.get(`/meeting/meeting_member/`);
    return response.data
}

export const fetchUserMeetingById = async (id:any) =>{
    if(id){
        const response = await apiTenant.get(`/meeting/meeting_member/?meeting_id=${id}`);
        return response.data
    }
}