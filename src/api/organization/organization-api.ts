import apiTenant from "../baseApi";

export const fetchOrganizationSettings = async () => {
  const response = await apiTenant.get('/api/organizations/settings');
  return response.data;
};