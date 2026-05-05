import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import QuickNav from "../../../components/navigation/QuickNav";
import { useQuery } from "react-query";
import { PublicationDataType, NewsCommentDetails } from "../../../types/myTypes";
import PublicationCard from "../../../components/cards/PublicationCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { fetchAllUserNews } from "../../../api/news/news-api";
import { useEffect } from "react";
import NewsCard from "../../../components/cards/NewsCard";

const NewsPage = () => {
  const { notifyUser } = Toast();
  const { data, isLoading, isError } = useQuery("news", fetchAllUserNews);

  useEffect(() => {
    if (isError) {
      notifyUser("An error occurred while fetching news details", "error");
    }
  }, [isError, notifyUser]);

  if (isLoading) {
    return <CircleLoader />;
  }

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_280px] gap-7">
        <div className="min-w-0 overflow-hidden md:px-0 px-10">
          <BreadCrumb title={"News"} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isLoading && data && Array.isArray(data) && data.length === 0 && <div className="col-span-full text-center py-8 text-gray-500">No news available.</div>}
            {data && Array.isArray(data) && data.map((newsItem: NewsCommentDetails, index: number) => <NewsCard key={index} newsItem={newsItem} linkTo="news" />)}
          </div>
        </div>
        <div className="min-w-0">
          <BreadCrumb title={"Events"} />
          <div className="grid space-y-3 md:px-0 px-10">
            <EventGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} />
            <QuickNav />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewsPage;
