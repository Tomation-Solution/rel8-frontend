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

/**
 * Removed: `fetchNewsComments`.
 *
 * It GET `/api/content/news/:id/comments`, which **is not mounted** — `content.routes.js`
 * has POST / PUT / DELETE for news comments but no GET (publications do have one). Comments
 * arrive embedded on the article: `getNewsById` populates `comments.userId` with
 * name/email/imageUrl, so `fetchNewsById` already returns everything the page needs.
 */

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