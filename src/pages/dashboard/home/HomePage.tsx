import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useQuery } from 'react-query';
import { fetchAllUserNews } from "../../../api/news/news-api";
import CircleLoader from "../../../components/loaders/CircleLoader";
import SeeAll from "../../../components/SeeAll";
import { fetchAllUserEvents } from "../../../api/events/events-api";
import EventsCard from "../../../components/cards/EventsCard";
import HomePageNotification from "../../../components/homepage/HomePageNotification";
import QuickNav from "../../../components/navigation/QuickNav";
import GalleryGrid from "../../../components/grid/GalleryGrid";
import Toast from "../../../components/toast/Toast";
import HomePageNewsCard from "../../../components/cards/HomePageNewsCard";
import { fetchUserPublications } from "../../../api/publications/publications-api";
import { PublicationDataType } from "../../../types/myTypes";
import PublicationCard from "../../../components/cards/PublicationCard";
import { fetchAllNotifications } from "../../../api/notifications/notifications-api";
import { NotificationDataType } from "../../../types/myTypes";
import { useEnvironmentContext } from "../../../context/environmentContext";
import { filterContentByEnvironment } from "../../../utils/contentFilter";
import { useMemo } from "react";

const HomePage = () => {
  const { data, isError, isLoading } = useQuery('notifications', fetchAllNotifications);
  const { notifyUser } = Toast();
  const { selectedEnvironments } = useEnvironmentContext();

  const eventsResponsiveCarousel = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const newResponsiveCarousel = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    }
  };

  const news = useQuery('news', fetchAllUserNews, {
    retry: 1,
    retryDelay: 3000,
  });

  const events = useQuery('events', fetchAllUserEvents, {
    retry: 1,
    retryDelay: 3000,
  });

  const publication = useQuery('publications', fetchUserPublications, {
    retry: 1,
    retryDelay: 3000,
  });

  // Filter content based on selected environments
  const filteredNews = useMemo(() => {
    return filterContentByEnvironment(news.data, selectedEnvironments);
  }, [news.data, selectedEnvironments]);

  const filteredPublications = useMemo(() => {
    return filterContentByEnvironment(publication.data, selectedEnvironments);
  }, [publication.data, selectedEnvironments]);

  const filteredEvents = useMemo(() => {
    return filterContentByEnvironment(events.data, selectedEnvironments);
  }, [events.data, selectedEnvironments]);

  if (news.isError) {
    notifyUser('Sorry, an error occured when fetching news', 'error');
  }
  if (events.isError) {
    notifyUser('Sorry, an error occured when fetching events', 'error');
  }


  return (
    <main className='grid grid-cols-1 xl:grid-cols-4 gap-x-[80px] md:gap-8 gap-10 md:px-0 px-5'>
      <div className="col-span-1 xl:col-span-3 relative flex flex-col gap-8 ">
        <div className="">
        <BreadCrumb title='Latest Updates' />
        {/* Latest Updates */}
        <div className={`relative py-6 ${news.isLoading ? "flex items-center justify-center" : ""}`}>
          {news.isLoading && <CircleLoader />}
          {filteredNews && filteredNews.length > 0 &&
            <Carousel
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="flex items-center !bg-white absolute top-0 h-fit w-fit bg-red-400 main-class"
              renderDotsOutside
              showDots
              arrows={false}
              className="" responsive={newResponsiveCarousel}>
              {filteredNews.map((newsItem, index) => (
                <HomePageNewsCard key={index} newsItem={newsItem} index={index} />
              ))}
            </Carousel>
          }
          {!news.isLoading && filteredNews && filteredNews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No news available for the selected environment(s).
            </div>
          )}
        </div>
        </div>

        {/* Events & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 my-7">
          <div className="flex flex-col">
            <SeeAll title="Events" path="/events" />
            <div className={`grid place items-center`}>
              {events.isLoading && <CircleLoader />}
              {!events.isLoading && filteredEvents && filteredEvents.length === 0 && (
                  <div className="bg-transparent w-full rounded-md py-2 px-2 border border-primary-dark1 text-center col-span-full">
                      No events available for the selected environment(s).
                  </div>
              )}
              {filteredEvents && filteredEvents.length > 0 && (
                <Carousel
                  responsive={eventsResponsiveCarousel}
                  autoPlay={true}
                  arrows={true}
                  rewind={true}
                  autoPlaySpeed={3000}
                  keyBoardControl={true}
                  className="container"
                >
                  {filteredEvents.map((eventItem:any, index:number) => (
                    <EventsCard key={index} eventItem={eventItem} />
                  ))}
                </Carousel>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <SeeAll title="Notifications" path="/notifications" />
            <div className="grid md:justify-betwee">
              {isLoading && <CircleLoader />}
              {!isLoading && data?.length === 0 && (
                  <div className="bg-transparent w-full rounded-md py-2 px-2 border border-primary-dark1 text-center col-span-full">
                      No notifications available, enjoy the silence.
                  </div>
              )}
              {data && data.slice(0, 4).map((notificationItem: NotificationDataType, index: number) => (
                <HomePageNotification key={index} notificationItem={notificationItem} />
              ))}
            </div>
          </div>
        </div>
        {/* Publications */}
        <div>
          <SeeAll title='Publications' path="/publications" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5">
            {filteredPublications && filteredPublications.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No publications available for the selected environment(s).
              </div>
            ) : (
              filteredPublications?.map((publicationItem: PublicationDataType, index: number) => (
                <PublicationCard key={index} publicationItem={publicationItem} /> 
              ))
            )}
          </div>
        </div>
      </div>
      {/* Gallery */}
      <div className='col-span-1'>
        <SeeAll title='Gallery' path="/gallery" />
        <GalleryGrid numberOfItemsToShow={3} />
        <QuickNav />
      </div>
    </main>
  )
}

export default HomePage;
