import apiTenant from "../baseApi";

// Fetch all gallery data with pagination
export const fetchAllGalleryData = async (page: number) => {
  const response = await apiTenant.get(`/api/content/gallery_version2/?not_chapters=True&page=${page}`);
  // if (!response.ok) {
  //     throw new Error("Failed to fetch gallery data");
  // }
  return response.data;
};

// Fetch gallery data by id
export const fetchGalleryItem = async (id: string | null) => {
  if (id) {
    const response = await apiTenant.get(`/api/content/gallery/${id}/`);
    return response.data;
  }
};
