import apiTenant from "../baseApi";

export const fetchAllGalleryData = async () =>{
    const response = await apiTenant.get(`/extras/gallery_version2/`);
    return response.data
}

// export const fetchAllGalleryDataNotChAPTER = async () =>{
//     const response = await apiTenant.get(`/extras/gallery_version2/?not_chapters=True`);
//     return response.data
// }
export const fetchGalleryItem = async (id:string|null) =>{
    if (id){

        const response = await apiTenant.get(`/extras/gallery_version2/${id}/`);
        return response.data
    }
}

