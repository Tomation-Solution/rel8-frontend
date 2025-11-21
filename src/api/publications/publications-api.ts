import apiTenant from "../baseApi";

export const fetchUserPublications = async () =>{
    const response = await apiTenant.get(`/api/content/publications`);
    return response.data
}

// Fetch comments for a specific publication item
export const fetchPublicationsComments = async (id:string|null) =>{
    if (id){    
        const response = await apiTenant.get(`/publication/publicationview__comment/?publication_id=${id}`);
        return response.data
    }
}

// Post a comment for a specific news item
export const postPublicationComment = async (comment: string, newsId: string) => {
    const requestBody = {
        comment: comment,
        news: newsId
    };

    const response = await apiTenant.post(`/publication/publicationview__comment/`, requestBody);
    return response.data;
};

// Delete a comment by its ID
export const deletePublicationComment = async (commentId: number) => {
    const response = await apiTenant.delete(`/publication/publicationview__comment/${commentId}/`);
    return response.data;
};

// Toggle like for a publication
export const togglePublicationLike = async (publicationId: string) => {
    const response = await apiTenant.post(`/api/content/publication/${publicationId}/like`);
    return response.data;
};