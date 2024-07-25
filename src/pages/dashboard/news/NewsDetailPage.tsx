import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { PublicationDataType,  } from "../../../types/myTypes";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import CircleLoader from "../../../components/loaders/CircleLoader";
import EventGrid from "../../../components/grid/EventGrid";
import Toast from "../../../components/toast/Toast";
import { fetchAllUserNews } from "../../../api/news/news-api";
import NewsCard from "../../../components/cards/NewsCard";

const NewsDetailPage = () => {

  const { notifyUser } = Toast();
  const { newId } = useParams();
  const { data, isLoading, isError } = useQuery('news', fetchAllUserNews,{
    // enabled: false,
  });
  const newsItem = data?.data?.find((item:PublicationDataType) => item.id.toString() === newId);

  console.log('--->',data?.data)

  if (isLoading){
    return <CircleLoader/>
  }

  if (isError){
    return notifyUser("An error occured while fetching publication details","error")
  }

  if (data){

    return (
      <main>
          <div className="grid grid-cols-4  space-x-7">
            <div className="col-span-3">
                <BreadCrumb title="News" />
                <div className="relative" >
                  <img
                    src={newsItem?.image}
                    className="w-full object-cover max-h-[40vh] top-0 bottom-0 left-0 right-0  rounded-md border "
                    alt=""
                  />
                </div>
                <div className="col-span-1 mt-6">
                    <h3 className=" font-semibold my-2" >{newsItem?.name}</h3>
                    {/* {publicationItem?.paragraphs.map((item:PublicationParagraphType)=>(
                    <p className="text-textColor font-light text-justify" >
                      {item.paragragh}
                    </p>
                    ))} */}
                    <br />
                    {
                newsItem?.body?
                <div
               dangerouslySetInnerHTML={{
                 __html: `${newsItem.body}`,
               }}
             />:''
                }
                </div>
                <div>
                <button className="px-3 w-[240px] my-4 py-2 bg-primary-blue text-white  border border-white h-[40px] rounded-md hover:bg-white hover:text-primary-blue  hover:border-primary-blue">
                Download Publication
              </button>
                </div>
            </div>
            <div className="col-span-1">
              <SeeAll title="Others" />
              <EventGrid numberOfItemsToShow={3} />
              <div  className="space-y-3" >
              {[...data?.data].splice(0,2).map((newsItem, index) => (
                <NewsCard hidePostDetails={true} key={index} newsItem={newsItem} />
              ))}
              </div>
            </div>
          </div>
  
      </main>
    )
  }
}

export default NewsDetailPage