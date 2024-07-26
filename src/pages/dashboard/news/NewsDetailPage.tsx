import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import CircleLoader from "../../../components/loaders/CircleLoader";
import EventGrid from "../../../components/grid/EventGrid";
import Toast from "../../../components/toast/Toast";
import { fetchAllUserNews, likeDislikeNews } from "../../../api/news/news-api";
import NewsCard from "../../../components/cards/NewsCard";
import NewsComment from "../../../components/cards/NewsComment";
import { useState, useEffect } from "react";

import { NewsCommentDetails } from "../../../types/myTypes";

const NewsDetailPage = () => {
  const { notifyUser } = Toast();
  const { newsId } = useParams();
  const { data, isLoading, isError } = useQuery<{ data: NewsCommentDetails[] }, Error>('news', fetchAllUserNews);
  const newsItem = data?.data?.find((item: NewsCommentDetails) => item.id.toString() === newsId);

  const queryClient = useQueryClient();
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  useEffect(() => {
    if (newsItem) {
      setHasLiked(newsItem.likes > 0);
      setHasDisliked(newsItem.dislikes !== null && newsItem.dislikes > 0);
    }
  }, [newsItem]);

  const likeDislikeMutation = useMutation<{ data: NewsCommentDetails[] }, Error, { id: number; like: boolean; dislike: boolean }>(
    ({ id, like, dislike }) => likeDislikeNews(id, like, dislike),
    {
      onSuccess: (data) => {
        const updatedNewsItem = data.data[0];
        setHasLiked(updatedNewsItem.likes > 0);
        setHasDisliked(updatedNewsItem.dislikes !== null && updatedNewsItem.dislikes > 0);
        queryClient.invalidateQueries('news');
      },
    }
  );

  const handleLike = () => {
    const id = parseInt(newsId || '0', 10);
    setHasLiked(!hasLiked);
    setHasDisliked(false);
    likeDislikeMutation.mutate({
      id,
      like: !hasLiked,
      dislike: false
    });
  };

  const handleDislike = () => {
    const id = parseInt(newsId || '0', 10);
    setHasDisliked(!hasDisliked);
    setHasLiked(false);
    likeDislikeMutation.mutate({
      id,
      like: false,
      dislike: !hasDisliked
    });
  };

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    return notifyUser("An error occurred while fetching publication details", "error");
  }

  if (data) {
    return (
      <main>
        <div className="grid grid-cols-4 space-x-7">
          <div className="col-span-3">
            <BreadCrumb title="News" />
            <div className="relative">
              <img
                src={newsItem?.image}
                className="w-full object-cover max-h-[40vh] top-0 bottom-0 left-0 right-0 rounded-md border"
                alt=""
              />
            </div>
            <div className="col-span-1 mt-6">
              <h3 className="font-semibold my-2">{newsItem?.name}</h3>
              <div dangerouslySetInnerHTML={{ __html: `${newsItem?.body}` }}></div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className={`px-2 py-1 rounded-md ${hasLiked ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={handleLike}
              >
                Like
              </button>
              <button
                className={`px-2 py-1 rounded-md ${hasDisliked ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={handleDislike}
              >
                Dislike
              </button>
            </div>
            <div>
              <button className="px-3 w-[240px] my-4 py-2 bg-primary-blue text-white border border-white h-[40px] rounded-md hover:bg-white hover:text-primary-blue hover:border-primary-blue">
                Download Publication
              </button>
            </div>
            <div>
              <NewsComment newsId={parseInt(newsId || '0', 10)} />
            </div>
          </div>
          <div className="col-span-1">
            <SeeAll title="Others" />
            <EventGrid numberOfItemsToShow={3} />
            <div className="space-y-3">
              {[...data?.data].splice(0, 2).map((newsItem, index) => (
                <NewsCard hidePostDetails={true} key={index} newsItem={newsItem} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
};

export default NewsDetailPage;
