import apiTenant from "../baseApi";

export const fetchUserProfile = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("User ID not found in localStorage");
  }
  const response = await apiTenant.get(`api/members/${userId}`);
  return response.data;
};
