import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useQuery,
  useMutation, useQueryClient
  } from "react-query";
import { useParams } from "react-router-dom";
import CircleLoader from "../../../components/loaders/CircleLoader";
import EventGrid from "../../../components/grid/EventGrid";
import Toast from "../../../components/toast/Toast";
import { fetchAllUserNews,
  likeDislikeNews,
  dislikeNews
} from "../../../api/news/news-api";
import NewsCard from "../../../components/cards/NewsCard";
import NewsComment from "../../../components/cards/NewsComment";
import { useState, useEffect } from "react";
import { NewsCommentDetails } from "../../../types/myTypes";
import { toast } from "react-toastify";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const NewsDetailPage = () => {
  const { notifyUser } = Toast();
  const { newsId } = useParams();
  const queryClient = useQueryClient();
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const { data, isLoading, isError } = useQuery<NewsCommentDetails[] , Error>('news', fetchAllUserNews,{
  });
  const newsItem = data?.find((item: NewsCommentDetails) => item._id === newsId);
  const otherNewsItems = data?.filter((item: NewsCommentDetails) => item._id !== newsId);

  useEffect(() => {
    if (newsItem) {
      // Check if current user has liked or disliked this news
      const currentUserId = localStorage.getItem('userId'); // Adjust based on how you store user ID
      setHasLiked(newsItem.likes?.includes(currentUserId) || false);
      setHasDisliked(newsItem.dislikes?.includes(currentUserId) || false);
    }
  }, [newsItem]);

  console.log(newsItem)

  const formattedDate = newsItem ? new Date(newsItem.updatedAt || newsItem.createdAt || '').toLocaleDateString() : '';
  
  const likeMutation = useMutation(
    (newsId: string) => likeDislikeNews(newsId),
    {
      onSuccess: (response) => {
        setHasLiked(response.liked);
        setHasDisliked(false); // Ensure dislike is removed when liking
        queryClient.invalidateQueries('news');
        toast.success(response.liked ? "Liked!" : "Unliked!", { autoClose: 2000 });
      },
      onError: () => {
        toast.error("Failed to toggle like", { autoClose: 2000 });
      }
    }
  );

  const dislikeMutation = useMutation(
    (newsId: string) => dislikeNews(newsId),
    {
      onSuccess: (response) => {
        setHasDisliked(response.disliked);
        setHasLiked(false); // Ensure like is removed when disliking
        queryClient.invalidateQueries('news');
        toast.success(response.disliked ? "Disliked!" : "Undisliked!", { autoClose: 2000 });
      },
      onError: () => {
        toast.error("Failed to toggle dislike", { autoClose: 2000 });
      }
    }
  );

  const handleLike = () => {
    if (!newsId) return;
    likeMutation.mutate(newsId);
  };

  const handleDislike = () => {
    if (!newsId) return;
    dislikeMutation.mutate(newsId);
  };

  const downloadPublication = () => {
    if (!newsId) return;

    // If there are attachments, download the first one
    if (newsItem?.attachmentUrls && newsItem.attachmentUrls.length > 0) {
      const link = document.createElement('a');
      link.href = `/api/content/news/${newsId}/download`;
      link.download = ''; // Let the browser determine the filename from the response
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (newsItem?.bannerUrl) {
      // If no attachments, download the banner image
      const link = document.createElement('a');
      link.href = newsItem.bannerUrl;
      link.download = `${newsItem.topic || 'news'}-banner.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    return notifyUser("An error occurred while fetching news details", "error");
  }

  if (data) {
    return (
      <main>
        <div className="grid md:grid-cols-4 md:gap-10 gap-[50px] px-5">
          <div className="col-span-3">
            <BreadCrumb title="News" />
           <div className="relative flex items-center bg-gray-200 h-[40vh]">

              <img
                src={newsItem?.bannerUrl}
                className="w-full  max-h-[40vh] border object-contain rounded-md"
                // className="w-full absolute top-0 right-0 left-0 bottom-0 object-cover h-full max-h-[inheit] "
                alt=""
              />
                </div>
            <div className="col-span-1 mt-6">
              <div className="mb-3">
                <h3 className="font-semibold my-2">{newsItem?.topic || newsItem?.name}</h3>
                <p className="text-sm font-light">Date published: {formattedDate}</p>
              </div>
              <div dangerouslySetInnerHTML={{ __html: `${newsItem?.content || newsItem?.body}` }}></div>
            </div>
            <div className="flex gap-2 mt-4 items-center">
              <button
                className={`px-2 py-1 rounded-md flex items-center gap-1 ${hasLiked ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={handleLike}
              >
                <AiOutlineLike />
                <span>{newsItem?.likes?.length || 0}</span>
              </button>
              <button
                className={`px-2 py-1 rounded-md flex items-center gap-1 ${hasDisliked ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={handleDislike}
              >
                <AiOutlineDislike />
                <span>{newsItem?.dislikes?.length || 0}</span>
              </button>
            </div>
            {(newsItem?.attachmentUrls && newsItem.attachmentUrls.length > 0) || newsItem?.bannerUrl && (
              <div>
                <button
                className="px-3 w-[240px] my-4 py-2 bg-org-primary text-white border border-white h-[40px] rounded-md hover:text-org-primary-blue hover:border-primary-blue"
                onClick={downloadPublication}>
                  {newsItem?.attachmentUrls && newsItem.attachmentUrls.length > 0 ? 'Download Attachment' : 'Download Banner'}
                </button>
              </div>
            )}
            <div>
              <NewsComment comments={newsItem.comments} newsId={newsId} />
            </div>
          </div>
          <div className="md:col-span-1 col-span-3">
            <SeeAll title="Others" />
            <EventGrid numberOfItemsToShow={3} />
            <div className="space-y-3">
              {otherNewsItems?.map((newsItem, index) => (
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
