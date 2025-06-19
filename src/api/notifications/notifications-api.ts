import apiTenant from "../baseApi";

export const fetchAllNotifications = async () => {
  const response = await apiTenant.get(`api/notifications`);
  return response.data;
};
