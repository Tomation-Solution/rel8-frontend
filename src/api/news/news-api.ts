import apiTenant from "../baseApi";

export const fetchAllUserNews = async () => {
  const response = await apiTenant.get(`api/content/news`);
  return response.data;
};

export const fetchSingleNews = async (id: any) => {
  const response = await apiTenant.get(`api/content/news/${id}`);
  return response.data;
};
// Fetch comments for a specific news item
export const fetchNewsComments = async (id: string | null) => {
  if (id) {
    const response = await apiTenant.get(
      `/news/newsview__comment/?news_id=${id}`
    );
    return response.data;
  }
};

// Post a comment for a specific news item
export const postNewsComment = async (comment: string, newsId: number) => {
  const requestBody = {
    comment: comment,
    news: newsId,
  };

  const response = await apiTenant.post(
    `/news/newsview__comment/`,
    requestBody
  );
  return response.data;
};

// Delete a comment by its ID
export const deleteNewsComment = async (commentId: number) => {
  const response = await apiTenant.delete(
    `/news/newsview__comment/${commentId}/`
  );
  return response.data;
};

// Like or dislike a news item
export const likeDislikeNews = async (
  id: number,
  like: boolean,
  dislike: boolean
) => {
  const requestBody = {
    id: id,
    like: like,
    dislike: dislike,
  };

  const response = await apiTenant.patch(`/news/getyournews/`, requestBody);
  return response.data;
};
