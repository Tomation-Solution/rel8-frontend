import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { PublicationDataType } from "../../../types/myTypes";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchUserSinglePublication } from "../../../api/publications/publications-api";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { toast } from "react-toastify";
// import { useState, useEffect } from "react";
import apiTenant from "../../../api/baseApi";

const PublicationsDetailPage = () => {
  const { notifyUser } = Toast();
  const { publicationId } = useParams();
  // const [hasLiked, setHasLiked] = useState(false);
  // const [hasDisliked, setHasDisliked] = useState(false);

  // Fetch single publication
  const {
    data: publicationItem,
    isLoading,
    isError,
  } = useQuery<PublicationDataType>(
    ["publication", publicationId],
    () => fetchUserSinglePublication(publicationId || ""),
    {
      enabled: !!publicationId,
    }
  );

  console.log(publicationItem, "Publication Item Data");

  // Fetch other publications (optional)

  const formattedDate = publicationItem
    ? new Date(publicationItem.updated_at).toLocaleDateString()
    : "";

  // useEffect(() => {
  //   if (publicationItem) {
  //     setHasLiked(publicationItem.likes.length > 0);
  //     setHasDisliked(
  //       publicationItem.dislikes !== null && publicationItem.dislikes > 0
  //     );
  //   }
  // }, [publicationItem]);

  const downloadPublication = async () => {
    try {
      // Get the file name from the URL or use a default name
      const fileName =
        publicationItem?.fileUrl?.split("/").pop() || "publication.pdf";

      // Fetch the file with responseType as 'blob'

      if (publicationItem?.fileUrl) {
        const response = await apiTenant.get(publicationItem?.fileUrl, {
          responseType: "blob",
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        // Append to DOM, trigger click, then remove
        document.body.appendChild(link);
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        link.remove();

        toast.success("Download started successfully", { autoClose: 2000 });
      }

      // Create a blob from the response

      // Create a temporary anchor element
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(
        error.response?.data?.message || "Failed to download publication",
        {
          autoClose: 2000,
        }
      );
    }
  };

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    return notifyUser(
      "An error occurred while fetching publication details",
      "error"
    );
  }

  if (!publicationItem) {
    return notifyUser("Publication not found", "error");
  }

  return (
    <main>
      <div className="grid md:grid-cols-4 md:gap-10 gap-[50px] md:px-0 px-5">
        <div className="col-span-3">
          <BreadCrumb title="Publications" />
          <div className="relative">
            <img
              src={publicationItem.fileUrl}
              className="w-full object-cover max-h-[40vh] rounded-md border"
              alt="Publication"
            />
          </div>
          <div className="col-span-1 mt-6">
            <div className="mb-3">
              <h3 className="font-semibold my-2">{publicationItem.title}</h3>
              <p className="text-sm font-light">
                Date published: {formattedDate}
              </p>
            </div>
            <br />
            {publicationItem.body && (
              <div dangerouslySetInnerHTML={{ __html: publicationItem.body }} />
            )}
          </div>
          {/* <div className="flex gap-2 mt-4">
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
          </div> */}
          <div>
            <button
              className="px-3 w-[240px] my-4 py-2 bg-primary-blue text-white border border-white h-[40px] rounded-md hover:bg-white hover:text-primary-blue hover:border-primary-blue"
              onClick={downloadPublication}
            >
              Download Publication
            </button>
          </div>
          {/* <div>
            <PublicationComment newsId={parseInt(publicationId || "0", 10)} />
          </div> */}
        </div>
        {/* <div className="md:col-span-1 col-span-3">
          <SeeAll title="Others" />
          <EventGrid numberOfItemsToShow={3} />
          <div className="">
            {otherPublicationItems?.map(
              (item: PublicationDataType, index: number) => (
                <PublicationCard
                  hidePostDetails={true}
                  key={index}
                  publicationItem={item}
                />
              )
            )}
          </div>
        </div> */}
      </div>
    </main>
  );
};

export default PublicationsDetailPage;
