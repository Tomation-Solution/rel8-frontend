import apiTenant from "../baseApi";

// Define the type for the data parameter
interface SupportData {
  name: string;
  email: string;
  message: string;
}

export const technicalSupport = async (data: SupportData) => {
  const response = await apiTenant.post(`/contactus/technical/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // console.log(response.data);
  return response.data;
};

export const adminSupport = async (data: SupportData) => {
  const response = await apiTenant.post(`/contactus/admin/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // console.log(response.data);
  return response.data;
};
