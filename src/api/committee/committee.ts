import apiTenant from "../baseApi";

export const fetchAllCommittees = async () => {
  const response = await apiTenant.get(`api/members/`);
  // console.log(response.data)
  return response.data;
};

export const fetchCommitteeDetails = async (id: string | number) => {
  const response = await apiTenant.get(`api/members/${id}`);
  return response.data;
};
