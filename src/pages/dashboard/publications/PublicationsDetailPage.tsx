import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { PublicationDataType,  } from "../../../types/myTypes";
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
import DownloadPublicationButton from "../../../components/button/DownloadPublicationButton";

const PublicationsDetailPage = () => {

  const { notifyUser } = Toast();
  const { publicationId } = useParams();
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const { data, isLoading, isError } = useQuery('publications', fetchUserPublications,{
    // enabled: false,
  });

  const publicationItem = data?.data?.find((item:PublicationDataType) => item.id.toString() === publicationId);
  console.log('--->',data?.data)
  const otherPublicationItems = data?.data?.filter((item:PublicationDataType) => item.id.toString() !== publicationId);

  const formattedDate = publicationItem ? new Date(publicationItem.updated_at).toLocaleDateString() : '';

  useEffect(() => {
    if (publicationItem) {
      setHasLiked(publicationItem.likes > 0);
      setHasDisliked(publicationItem.dislikes !== null && publicationItem.dislikes > 0);
    }
  }, [publicationItem]);

  const handleLike = () => {
    toast.info("Like functionality coming soon", { autoClose: 2000 });
  };

  const handleDislike = () => {
    toast.info("Dislike functionality coming soon", { autoClose: 2000 });
  };

  if (isLoading){
    return <CircleLoader/>
  }

  if (isError){
    return notifyUser("An error occured while fetching publication details","error")
  }

  if (data){
    const fileUrl = publicationItem.danload || "";
    const fileNameArr: string[] = fileUrl.split('/') || [];
    const fileName = fileNameArr[fileNameArr.length - 1];

    return (
      <main>
          <div className="grid md:grid-cols-4 md:gap-10 gap-[50px] md:px-0 px-5">
            <div className="col-span-3">
                <BreadCrumb title="Publications" />
                <div className="relative" >
                  <img
                    src={publicationItem?.image}
                    className="w-full object-cover max-h-[40vh] top-0 bottom-0 left-0 right-0  rounded-md border "
                    alt=""
                  />
                </div>
                <div className="col-span-1 mt-6">
                <div className="mb-3">
                <h3 className="font-semibold my-2">{publicationItem?.name}</h3>
                {/* <p className="text-sm font-light">Date published: {publicationItem?.created_at}</p> */}
                <p className="text-sm font-light">Date published: {formattedDate}</p>

              </div>
                    <br />
                    {
                publicationItem?.body?
                <div
               dangerouslySetInnerHTML={{
                 __html: `${publicationItem.body}`,
               }}
             />:''
                }
                </div>
                <div className="flex gap-2 mt-4">
                  <button className={`px-2 py-1 rounded-md ${hasLiked ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
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
                < DownloadPublicationButton fileUrl={fileUrl} fileName={fileName} />
                <div>
              <PublicationComment newsId={parseInt(publicationId || '0', 10)} />
            </div>
            </div>
            <div className="md:col-span-1 col-span-3">
              <SeeAll title="Others" />
              <EventGrid numberOfItemsToShow={3} />
              <div  className="" >
  
              {otherPublicationItems?.map((publicationItem: PublicationDataType, index: number) => (
                <PublicationCard hidePostDetails={true} key={index} publicationItem={publicationItem} />
              ))}
              </div>
            </div>
          </div>
      </main>
    )
  }
}

export default PublicationsDetailPage