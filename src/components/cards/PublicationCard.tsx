// import { HiOutlineBookmark } from "react-icons/hi2"
import { FaRegCommentDots } from "react-icons/fa";
import { PublicationDataType } from "../../types/myTypes";
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
interface Props {
  publicationItem: PublicationDataType;
  hidePostDetails?: boolean;
  linkTo?: string;
}
const PublicationCard = ({
  publicationItem,
  hidePostDetails,
  linkTo = "publication",
}: Props) => {
  const formattedDate = new Date(
    publicationItem.updated_at
  ).toLocaleDateString();

  return (
    <div className="max-w- bg-white border border-gray-200 rounded-lg shadow">
      <img
        className="rounded-t-lg w-full md:h-[180px] h-[170px] object-contain"
        src={publicationItem.fileUrl || publicationItem?.bannerUrl}
        alt=""
      />
      <div className="md:p-5 p-2">
        <Link to={`/${linkTo}/${publicationItem._id}/`}>
          <h5 className="mb-2 md:text-[15px] text-sm font-bold tracking-tight text-textColor line-clamp-1 dark:text-white">
            {publicationItem?.title || publicationItem?.topic}
          </h5>
        </Link>
        {/* <p className="mb-2 text-[10px] line-clamp-1">{formattedDate}</p> */}
        {/* <p className="mb-3 font-normal text-textColor line-clamp-2 text-sm">{publicationItem.paragraphs[2].paragragh}</p> */}
        {!hidePostDetails && (
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-2  divide-x-2 ">
              {publicationItem.likes && (
                <aside className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <AiFillLike className="w-4 h-4 text-blue-primary" />
                  </div>
                  <aside className="p-1 flex items-center">
                    <p className="text-sm font-medium my-1 line-clamp-1">
                      {publicationItem?.likes && publicationItem?.likes?.length}
                    </p>
                    <small className="text-xs text-black w-fit p-1 rounded-md">
                      {publicationItem?.likes?.length > 1 ? "Likes" : "Like"}
                    </small>
                  </aside>
                </aside>
              )}
              <div className="border-l flex items-center gap-2 text-sm">
                <FaRegCommentDots className="w-5 h-5 text-textColor ml-2" />{" "}
                {publicationItem.comments && (
                  <span>{publicationItem.comments.length} comments</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationCard;
