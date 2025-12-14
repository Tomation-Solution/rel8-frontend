import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { PublicationDataType } from "../../../types/myTypes";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchUserPublications } from "../../../api/publications/publications-api";
import CircleLoader from "../../../components/loaders/CircleLoader";
import EventGrid from "../../../components/grid/EventGrid";
import Toast from "../../../components/toast/Toast";
import PublicationCard from "../../../components/cards/PublicationCard";
import { toast } from "react-toastify";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { useState, useEffect } from "react";
import PublicationComment from "../../../components/cards/PublicationComment";
import DownloadFileButton from "../../../components/button/DownloadFileButton";
import { togglePublicationLike } from "../../../api/publications/publications-api";

const PublicationsDetailPage = () => {
  const { notifyUser } = Toast();
  const { publicationId } = useParams();
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const { data, isLoading, isError } = useQuery(
    "publications",
    fetchUserPublications,
    {
      // enabled: false,
    }
  );

  const publicationItem = data?.find((item: any) => item._id === publicationId);
  console.log("--->", data);
  const otherPublicationItems = data?.filter(
    (item: any) => item._id !== publicationId
  );

  const formattedDate = publicationItem
    ? new Date(publicationItem.updatedAt).toLocaleDateString()
    : "";
  console.log(publicationItem);
  useEffect(() => {
    if (publicationItem) {
      // Check if current user has liked this publication
      const currentUserId = localStorage.getItem("userId"); // Adjust based on how you store user ID
      setHasLiked(
        publicationItem.likes?.some(
          (like: any) => like._id === currentUserId
        ) || false
      );
      setHasDisliked(
        publicationItem.dislikes !== null && publicationItem.dislikes > 0
      );
    }
  }, [publicationItem]);

  const handleLike = async () => {
    if (!publicationId) return;

    try {
      const response = await togglePublicationLike(publicationId);
      setHasLiked(response.liked);
      // Update the publication data to reflect the new like count
      // You might need to refetch or update the local state
      toast.success(response.liked ? "Liked!" : "Unliked!", {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to toggle like", { autoClose: 2000 });
    }
  };

  const handleDislike = () => {
    toast.info("Dislike functionality coming soon", { autoClose: 2000 });
  };

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    return notifyUser(
      "An error occured while fetching publication details",
      "error"
    );
  }

  if (data) {
    const bannerUrl = publicationItem.bannerUrl || publicationItem.fileUrl ||"";
    const attachmentUrls = publicationItem.attachmentUrls || [];

    return (
      <main>
        <div className="grid md:grid-cols-4 md:gap-10 gap-[50px] md:px-0 px-5">
          <div className="col-span-3">
            <BreadCrumb title="Publications" />
            {bannerUrl && (
              <div className="relative flex items-center bg-gray-200 h-[40vh]">
                <img
                  src={bannerUrl}
                  className="w-full  max-h-[40vh] border object-contain rounded-md"
                  // className="w-full absolute top-0 right-0 left-0 bottom-0 object-cover h-full max-h-[inheit] "
                  alt=""
                />
              </div>
            )}
            <div className="col-span-1 mt-6">
              <div className="mb-3">
                <h3 className="font-semibold my-2">{publicationItem?.name}</h3>
                {/* <p className="text-sm font-light">Date published: {publicationItem?.created_at}</p> */}
                <p className="text-sm font-light">
                  Date published: {formattedDate}
                </p>
              </div>
              <br />
              {publicationItem?.content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: `${publicationItem.content}`,
                  }}
                />
              ) : (
                ""
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className={`px-2 py-1 rounded-md ${
                  hasLiked ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
                onClick={handleLike}
              >
                <AiOutlineLike />
              </button>
              <button
                className={`px-2 py-1 rounded-md ${
                  hasDisliked ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
                onClick={handleDislike}
              >
                <AiOutlineDislike />
              </button>
            </div>
            {attachmentUrls.length > 0 && (
              <div className="mt-4">
                <DownloadFileButton
                  fileUrls={attachmentUrls}
                  fileNames={attachmentUrls.map((url) => {
                    const fileNameArr: string[] = url.split("/") || [];
                    return fileNameArr[fileNameArr.length - 1];
                  })}
                  buttonText="Attachments"
                />
              </div>
            )}
            <div>{/* <PublicationComment newsId={publicationId} /> */}</div>
          </div>
          <div className="md:col-span-1 col-span-3">
            <SeeAll title="Others" />
            <EventGrid numberOfItemsToShow={3} />
            <div className="">
              {otherPublicationItems?.map(
                (publicationItem: PublicationDataType, index: number) => (
                  <PublicationCard
                    hidePostDetails={true}
                    key={index}
                    publicationItem={publicationItem}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }
};

export default PublicationsDetailPage;
