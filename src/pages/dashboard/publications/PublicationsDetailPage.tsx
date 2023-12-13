import SeeAll from "../../../components/SeeAll";
// import NewsCard from "../../components/cards/NewsCard";
// import { newsData } from "../../data/newsData";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { PublicationDataType,  } from "../../../types/myTypes";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchUserPublications } from "../../../api/publications/publications-api";
import CircleLoader from "../../../components/loaders/CircleLoader";
import EventGrid from "../../../components/grid/EventGrid";
import Toast from "../../../components/toast/Toast";
const PublicationsDetailPage = () => {

  const { notifyUser } = Toast();
  const { publicationId } = useParams();

  const { data, isLoading, isError } = useQuery('publications', fetchUserPublications,{
    // enabled: false,
  });
  const publicationItem = data?.data?.find((item:PublicationDataType) => item.id.toString() === publicationId);

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
                <BreadCrumb title="Publications" />
                <div className="relative" >
                  <img
                    src={publicationItem?.image}
                    className="w-full object-cover max-h-[40vh] top-0 bottom-0 left-0 right-0  rounded-md border "
                    alt=""
                  />
                </div>
                <div className="col-span-1 mt-6">
                    <h3 className=" font-semibold my-2" >{publicationItem?.name}</h3>
                    {/* {publicationItem?.paragraphs.map((item:PublicationParagraphType)=>(
                    <p className="text-textColor font-light text-justify" >
                      {item.paragragh}
                    </p>
                    ))} */}
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
  
              {/* {[...newsData].splice(0,2).map((newsItem, index) => (
                <NewsCard hidePostDetails={true} key={index} newsItem={newsItem} />
              ))} */}
              </div>
            </div>
          </div>
  
      </main>
    )
  }
}

export default PublicationsDetailPage