import apiTenant from "../baseApi";

export const fetchUserDues = async () => {
  const response = await apiTenant.get(`api/dues`);
  return response.data;
};
