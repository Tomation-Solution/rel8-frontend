import apiTenant from "../baseApi";

export const fetchUserDues = async () => {
  const response = await apiTenant.get(`/api/dues/memberdues/`);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await apiTenant.get(`/api/members/profile`);
  return response.data;
};

export const updateUserProfile = async (_userId: string, profileData: FormData) => {
  // PUT /api/members/profile — token-authenticated, no userId in path
  const response = await apiTenant.put(`/api/members/profile`, profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
