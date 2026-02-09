// import { HiOutlineBookmark } from "react-icons/hi2"
import { FaRegCommentDots } from "react-icons/fa"
import { PublicationDataType, NewsCommentDetails } from "../../types/myTypes"
import { Link } from "react-router-dom";

interface Props{
    newsItem: NewsCommentDetails;
    hidePostDetails?:boolean;
    linkTo?:string
}

const NewsCard = ({newsItem,hidePostDetails,linkTo='news'}:Props) => {

    const formattedDate = newsItem ? new Date((newsItem as any).updated_at || (newsItem as any).updatedAt || (newsItem as any).createdAt || '').toLocaleDateString() : '';

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <img className="rounded-t-lg w-full md:h-[180px] h-[170px] object-contain" src={(newsItem as any).image || (newsItem as any).bannerUrl} alt="" />
    <div className="p-5">
        <Link to={`/${linkTo}/${(newsItem as any).id || (newsItem as any)._id}/`} >
            <h5 className="mb-1 text-[15px] font-bold tracking-tight text-textColor truncate line-clamp-1 dark:text-white">{(newsItem as any).name || (newsItem as any).topic}</h5>
        </Link>
        <p className="text-[10px] line-clamp-1 mb-2">{formattedDate}</p>
        {/* <p className="mb-3 font-normal text-textColor line-clamp-2 text-sm">{(newsItem as any).body || (newsItem as any).content}</p> */}
       {!hidePostDetails && (
       <div className="flex items-center justify-between" >
            <div className="grid grid-cols-2  divide-x-2 " >
                <aside className="flex items-center gap-2" >
                    <img src="/src/assets/images/avatar-1.jpg" className="w-10 h-10 object-contain rounded-full border" alt="" />
                    <aside className="grid p-1" >
                    {/* <p className="text-sm font-medium my-1 line-clamp-1" >{newsItem.paragraphs[0].heading.slice(3, -10)}</p> */}
                    <small className="text-xs text-white bg-[#D97706] w-fit p-1 rounded-md" >Author</small>
                    </aside>
                </aside>
                <div className="border-l flex items-center gap-2 text-sm" >
                    <FaRegCommentDots className='w-5 h-5 text-textColor ml-2' /> <span>{newsItem.comments?.length} comments</span>
                </div>
            </div>
        </div>
       )}
    </div>
</div>
  )
}

export default NewsCard