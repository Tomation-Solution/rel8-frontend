import apiTenant from "../baseApi";

export const fetchUserPublications = async () =>{
    const response = await apiTenant.get(`/api/content/publications`);
    return response.data
}

/**
 * Publication comments.
 *
 * These pointed at `/publication/publicationview__comment/` — a Django route this backend
 * does not mount — and publications had no comment support server-side at all. Both now
 * exist, mirroring the news comment endpoints, so a comment reads the same shape either
 * way: `{ _id, userId: { name, email, imageUrl }, content, createdAt }`.
 *
 * Deleting needs the publication id as well as the comment id, since comments are
 * subdocuments rather than a collection of their own.
 */

export interface PublicationComment {
    _id: string;
    userId?: { _id: string; name?: string; email?: string; imageUrl?: string } | string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

export const fetchPublicationsComments = async (id: string | null): Promise<PublicationComment[]> => {
    if (!id) return [];
    const response = await apiTenant.get(`/api/content/publication/${id}/comments`);
    return response.data;
};

export const postPublicationComment = async (comment: string, publicationId: string) => {
    const response = await apiTenant.post(`/api/content/publication/${publicationId}/comments`, { content: comment });
    return response.data;
};

export const deletePublicationComment = async (publicationId: string, commentId: string) => {
    const response = await apiTenant.delete(`/api/content/publication/${publicationId}/comments/${commentId}`);
    return response.data;
};

// Toggle like for a publication
export const togglePublicationLike = async (publicationId: string) => {
    const response = await apiTenant.post(`/api/content/publication/${publicationId}/like`);
    return response.data;
};