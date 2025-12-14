import { NewsResponseType } from "../../types/myTypes";
import apiTenant from "../baseApi";

export const fetchAllUserNews = async ():Promise<any> =>{
    const response = await apiTenant.get(`/api/content/news`);
    return response.data
}

export const fetchNewsById = async (id: string):Promise<any> =>{
    const response = await apiTenant.get(`/api/content/news/${id}`);
    return response.data
}

// Fetch comments for a specific news item
export const fetchNewsComments = async (id:string|null) =>{
    if (id){
        const response = await apiTenant.get(`/api/content/news/${id}/comments`);
        return response.data
    }
}

// Post a comment for a specific news item
export const postNewsComment = async (comment: string, newsId: string) => {
    const requestBody = {
        content: comment
    };

    const response = await apiTenant.post(`/api/content/news/${newsId}/comments`, requestBody);
    return response.data;
};

// Delete a comment by its ID
export const deleteNewsComment = async (newsId: string, commentId: string) => {
    const response = await apiTenant.delete(`/api/content/news/${newsId}/comments/${commentId}`);
    return response.data;
};

// Like or dislike a news item
export const likeDislikeNews = async (id: string) => {
    const response = await apiTenant.post(`/api/content/news/${id}/like`);
    return response.data;
};

// Dislike or undislike a news item
export const dislikeNews = async (id: string) => {
    const response = await apiTenant.post(`/api/content/news/${id}/dislike`);
    return response.data;
};