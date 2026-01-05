import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import QuickNav from "../../../components/navigation/QuickNav";
import { useQuery } from "react-query";
import { PublicationDataType, NewsCommentDetails } from "../../../types/myTypes";
import PublicationCard from "../../../components/cards/PublicationCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { fetchAllUserNews } from "../../../api/news/news-api";
import { useEffect, useMemo } from "react";
import NewsCard from "../../../components/cards/NewsCard";
import { useEnvironmentContext } from "../../../context/environmentContext";
import { filterContentByEnvironment } from "../../../utils/contentFilter";

const NewsPage = () => {
  const { notifyUser } = Toast();
  const { selectedEnvironments } = useEnvironmentContext();
  const {  data, isLoading, isError} = useQuery('news', fetchAllUserNews);

  // Filter news based on selected environments
  const filteredNews = useMemo(() => {
    return filterContentByEnvironment(data, selectedEnvironments);
  }, [data, selectedEnvironments]);

  useEffect(() => {
    if (isError) {
      notifyUser("An error occurred while fetching news details", "error");
    }
  }, [isError, notifyUser]);

  if (isLoading){
    return <CircleLoader/>
  }
  
  console.log(data)
  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
      <div className="col-span-1 md:col-span-3 md:px-0 px-10">
          <BreadCrumb title={"News"} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNews?.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No news available for the selected environment(s).
              </div>
            ) : (
              filteredNews?.map((newsItem:NewsCommentDetails, index:number) => (
                <NewsCard key={index} newsItem={newsItem}  linkTo="news"/>
              ))
            )}
          </div>
        </div>
        <div className="col-span-1 md:col-span-1">
          <BreadCrumb title={"Events"} />
          <div className="grid space-y-3 md:px-0 px-10" >
          <EventGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} />
          <QuickNav />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewsPage;
