import apiTenant from "../baseApi";

export const fetchAllNotifications = async () =>{
    const response = await apiTenant.get(`/latestupdate/member_lastest_updates/`);
    return response.data.results
}
