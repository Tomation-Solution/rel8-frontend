import apiTenant from "../baseApi";

export const fetchAllGalleryData = async (page = 1) => {
    const response = await apiTenant.get(`/extras/gallery_version2/?not_chapters=True&pages=${page}`);
    return response.data;
};
export const fetchGalleryItem = async (id:string|null) =>{
    if (id){

        const response = await apiTenant.get(`/extras/gallery_version2/${id}/`);
        return response.data
    }
}

