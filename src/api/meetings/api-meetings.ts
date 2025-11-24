import apiTenant from "../baseApi";

export const fetchUserMeetings = async () => {
    const response = await apiTenant.get(`/api/meetings/`);
    return response.data
}

export const fetchUserMeetingById = async (id: any) => {
    if(id){
        const response = await apiTenant.get(`/api/meetings/${id}`);
        return response.data
    }
}

export const registerForMeeting = async (payload: any) => {
  const response = await apiTenant.post(`/meeting/meeting_member/`, payload);
  return response.data;
};
