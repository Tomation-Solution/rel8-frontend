import apiTenant from "../baseApi";

export const fetchAllNotifications = async () =>{
    const response = await apiTenant.get(`/api/notifications/latestupdate/member_lastest_updates/`);
    return response.data.results
}
