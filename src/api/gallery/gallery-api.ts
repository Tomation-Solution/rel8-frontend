// import apiTenant from "../baseApi";

// // Fetch all gallery data with pagination
// export const fetchAllGalleryData = async (page = 1) => {
//     const response = await apiTenant.get(`/extras/gallery_version2/?not_chapters=True&pages=${page}`);
//     return response.data;
// };

// // Fetch gallery data by id
// export const fetchGalleryItem = async (id:string|null) =>{
//     if (id){

//         const response = await apiTenant.get(`/extras/gallery_version2/${id}/`);
//         return response.data
//     }
// }

import apiTenant from "../baseApi";

// Fetch all gallery data with pagination
export const fetchAllGalleryData = async (page = 1) => {
  const response = await apiTenant.get(`/extras/gallery_version2/?not_chapters=True&pages=${page}`);
  return response.data;
};

// Fetch gallery data by id
export const fetchGalleryItem = async (id: string | null) => {
  if (id) {
    const response = await apiTenant.get(`/extras/gallery_version2/${id}/`);
    return response.data;
  }
};
