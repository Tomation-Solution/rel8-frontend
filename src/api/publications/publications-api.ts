import apiTenant from "../baseApi";

export const fetchUserPublications = async () =>{
    const response = await apiTenant.get(`/publication/getyourpublication/`);
    return response.data
}

