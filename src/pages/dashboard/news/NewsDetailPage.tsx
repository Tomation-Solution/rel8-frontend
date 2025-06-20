import { useParams } from "react-router-dom";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useQuery } from "react-query";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { fetchSingleNews } from "../../../api/news/news-api";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { toast } from "react-toastify";
import Avatar from "../../../components/avatar/Avatar";
import avatarImage from "../../../assets/images/avatar-1.jpg";
import { useState } from "react";
import { useAppContext } from "../../../context/authContext";
import apiTenant from "../../../api/baseApi";
import moment from "moment";

// types/newsTypes.ts
import { MomentInput } from "moment";

type NewsCommentType = {
  id: string;
  content: string;
  createdAt: MomentInput;
  updatedAt?: MomentInput;
  member?: {
    id: string;
    full_name: string;
    photo_url?: string;
  };
};
type NewsResponseType = {
  _id: string;
  topic: string;
  content: string;
  bannerUrl: string;
  likes: string[]; // Array of user IDs who liked the news
  comments: NewsCommentType[];
  createdAt: MomentInput;
  updatedAt?: MomentInput;
  // Add any other fields that might come from your API
};

const NewsDetailPage = () => {
  const { newsId } = useParams();
  const { user } = useAppContext();
  const [commentText, setCommentText] = useState("");

  const token = localStorage.getItem("token");

  const {
    data: newsItem,
    isLoading,
    refetch,
  } = useQuery<NewsResponseType>(
    ["news", newsId],
    () => fetchSingleNews(newsId),
    {
      enabled: !!newsId,
    }
  );

  console.log(newsItem?.likes, "News Item Data");

  const handleLike = async () => {
    try {
      const response = await apiTenant.post(
        `api/content/news/${newsId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        console.log(response.data, "Like Response");
        // toast.success("You liked this news!", { autoClose: 2000 });
        refetch();
      }
    } catch (error) {
      toast.error("Error liking the news", { autoClose: 2000 });
    }
  };

  // const downloadPublication = () => {
  //   toast.info("Download functionality coming soon", { autoClose: 2000 });
  // };

  const handleCommentSubmit = async () => {
    if (!commentText) {
      toast.error("Please input text", { autoClose: 2000 });
    }

    try {
      const response = await apiTenant.post(
        `api/content/news/${newsId}/comments`,
        { content: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setCommentText("");

        console.log(response.data, "Comment Response");
        refetch();
      }
    } catch (error) {
      toast.error("Error submitting the comment", { autoClose: 2000 });
      setCommentText("");
    }
  };

  if (isLoading) return <CircleLoader />;

  return (
    <main>
      <div className="grid md:grid-cols-4 md:gap-10 gap-[50px] px-5">
        <div className="col-span-3">
          <BreadCrumb title="News" />
          <div className="relative">
            <img
              src={newsItem?.bannerUrl}
              className="w-full object-cover max-h-[40vh] rounded-md border"
              alt="News banner"
            />
          </div>
          <div className="col-span-1 mt-6">
            <div className="mb-3">
              <h3 className="font-semibold my-2">{newsItem?.topic}</h3>
            </div>
            <div className="text-sm text-justify">{newsItem?.content}</div>
          </div>

          {/* Like/Dislike Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              className="px-2 py-1 rounded-md bg-gray-200"
              onClick={handleLike}
            >
              {newsItem?.likes?.includes(user?._id as string) ? (
                <AiFillLike className="text-primary-blue" />
              ) : (
                <AiOutlineLike className="text-gray-500" />
              )}
            </button>
          </div>

          {/* Download Button */}
          {/* <div>
            <button
              className="px-3 w-[240px] my-4 py-2 bg-primary-blue text-white border border-white h-[40px] rounded-md hover:bg-white hover:text-primary-blue hover:border-primary-blue"
              onClick={downloadPublication}
            >
              Download Publication
            </button>
          </div> */}

          {/* Comments Section */}
          <div className="mt-10">
            <h3 className="font-semibold text-xl">Comments</h3>

            {/* Comment Input */}
            {user && (
              <div className="h-[100px] flex items-center gap-2 my-4">
                <div className="rounded-full">
                  <Avatar imageUrl={user.profile_image || avatarImage} />
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full h-[50px] border-2 border-gray-300 rounded-md p-2"
                    placeholder="Write a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <button
                  className="bg-primary-blue text-white px-4 h-[50px] rounded-md"
                  onClick={handleCommentSubmit}
                >
                  Post
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="comments-container">
              {newsItem && newsItem?.comments?.length > 0 ? (
                newsItem?.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-2 mb-4 items-center"
                  >
                    {/* <div className="rounded-md">
                      <Avatar
                        imageUrl={comment.member.photo_url || avatarImage}
                      />
                    </div> */}
                    <div className="flex flex-col gap-1">
                      <p className="text-textColor font-light text-md">
                        {comment.content}
                      </p>
                      <p className="text-gray-500 font-light text-[12px]">
                        {moment(comment.createdAt).startOf("minutes").fromNow()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center text-[20px]">
                  No comments yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewsDetailPage;
