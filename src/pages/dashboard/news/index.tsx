import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import QuickNav from "../../../components/navigation/QuickNav";
import { useQuery } from "react-query";
import { PublicationDataType } from "../../../types/myTypes";
import PublicationCard from "../../../components/cards/PublicationCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { fetchAllUserNews } from "../../../api/news/news-api";

const NewsPage = () => {
  const { notifyUser } = Toast();

  const {  data, isLoading, isError} = useQuery('news', fetchAllUserNews,{
    // enabled: false,
  });

  if (isLoading){
    return <CircleLoader/>
  }

  if (isError){
    return notifyUser("An error occured while fetching publication details","error")
  }
  
  return (
    <main>
      <div className="grid grid-cols-4  space-x-7">
        <div className="col-span-3">
          <BreadCrumb title={"News"} />
          <div className="grid grid-cols-2 gap-6">
            {data?.data?.map((publicationItem:PublicationDataType, index:number) => (
              <PublicationCard key={index} publicationItem={publicationItem}  linkTo="news"/>
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <BreadCrumb title={"Events"} />
          <div className="grid space-y-3" >

          <EventGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} /> 
          <QuickNav />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewsPage;
