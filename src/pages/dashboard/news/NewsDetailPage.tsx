import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useQuery, 
  // useMutation, useQueryClient
 } from "react-query";
import { useParams } from "react-router-dom";
import CircleLoader from "../../../components/loaders/CircleLoader";
import EventGrid from "../../../components/grid/EventGrid";
import Toast from "../../../components/toast/Toast";
import { fetchAllUserNews 
  // likeDislikeNews 
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
  // const queryClient = useQueryClient();
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const { data, isLoading, isError } = useQuery<NewsCommentDetails[] , Error>('news', fetchAllUserNews,{
  });
  const newsItem = data?.find((item: NewsCommentDetails) => item._id === newsId);
  const otherNewsItems = data?.filter((item: NewsCommentDetails) => item._id !== newsId);

  useEffect(() => {
    if (newsItem) {
      setHasLiked(newsItem.likes.length > 0);
      setHasDisliked(false); // Backend doesn't have dislikes, only likes
    }
  }, [newsItem]);

  console.log(newsItem)

  const formattedDate = newsItem ? new Date(newsItem.updatedAt || newsItem.createdAt || '').toLocaleDateString() : '';
  
// function is underconstruction please
  // const likeDislikeMutation = useMutation<{ data: NewsCommentDetails[] }, Error, { id: number; like: boolean; dislike: boolean }>(
  //   ({ id, like, dislike }) => likeDislikeNews(id, like, dislike),
  //   {
  //     onSuccess: (data) => {
  //       const updatedNewsItem = data.data[0];
  //       setHasLiked(updatedNewsItem.likes > 0);
  //       setHasDisliked(updatedNewsItem.dislikes !== null && updatedNewsItem.dislikes > 0);
  //       queryClient.invalidateQueries('news');
  //     },
  //   }
  // );

  const handleLike = () => {
    // const id = parseInt(newsId || '0', 10);
    // setHasLiked(!hasLiked);
    // setHasDisliked(false);
    // likeDislikeMutation.mutate({
    //   id,
    //   like: !hasLiked,
    //   dislike: false
    // });
    toast.info("Like functionality coming soon", { autoClose: 2000 });
  };

  const handleDislike = () => {
    // const id = parseInt(newsId || '0', 10);
    // setHasDisliked(!hasDisliked);
    // setHasLiked(false);
    // likeDislikeMutation.mutate({
    //   id,
    //   like: false,
    //   dislike: !hasDisliked
    // });
    toast.info("Dislike functionality coming soon", { autoClose: 2000 });
  };

  const downloadPublication = () => {
    toast.info("Download functionality coming soon", { autoClose: 2000 });
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
            <div className="relative">
              <img
                src={newsItem?.bannerUrl || newsItem?.image}
                className="w-full object-cover max-h-[40vh] top-0 bottom-0 left-0 right-0 rounded-md border"
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
            <div className="flex gap-2 mt-4">
              <button
                className={`px-2 py-1 rounded-md ${hasLiked ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={handleLike}
              >
                <AiOutlineLike />
              </button>
              <button
                className={`px-2 py-1 rounded-md ${hasDisliked ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={handleDislike}
              >
                <AiOutlineDislike />
              </button>
            </div>
            <div>
              <button className="px-3 w-[240px] my-4 py-2 bg-org-primary text-white border border-white h-[40px] rounded-md hover:bg-white hover:text-org-primary-blue hover:border-primary-blue" onClick={downloadPublication}>
                Download Attachment
              </button>
            </div>
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
