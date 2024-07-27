import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useQuery } from 'react-query';
import { fetchAllUserNews } from "../../../api/news/news-api";
import CircleLoader from "../../../components/loaders/CircleLoader";
import SeeAll from "../../../components/SeeAll";
import { fetchAllUserEvents } from "../../../api/events/events-api";
import EventsCard from "../../../components/cards/EventsCard";
import { notificationData } from "../../../data/notificationData";
import HomePageNotification from "../../../components/homepage/HomePageNotification";
import QuickNav from "../../../components/navigation/QuickNav";
import GalleryGrid from "../../../components/grid/GalleryGrid";
import Toast from "../../../components/toast/Toast";
import HomePageNewsCard from "../../../components/cards/HomePageNewsCard";
import { fetchUserPublications } from "../../../api/publications/publications-api";
import { PublicationDataType } from "../../../types/myTypes";
import PublicationCard from "../../../components/cards/PublicationCard";

const HomePage = () => {

  const { notifyUser } = Toast();

  const eventsResponsiveCarousel = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
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
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
    
  };

  

  const  news = useQuery('news', fetchAllUserNews,{
    retry: 1,
    retryDelay: 3000, 
  });
  const  events = useQuery('events', fetchAllUserEvents,{
    retry: 1,
    retryDelay: 3000, 
  });

  const publication = useQuery('publications', fetchUserPublications,{
    retry: 1,
    retryDelay: 3000, 
  });
 
  if (news.isError){
    notifyUser('Sorry, an error occured when fetching news','error')
  }
  if (events.isError){
    notifyUser('Sorry, an error occured when fetching events','error')
  }

   
   
  return (
    <main  className='grid grid-cols-4 gap-x-[80px]'>
        <div className="col-span-4 xl:col-span-3 relative" >
          <BreadCrumb title='Latest Updates' />
          
          {/* Latest Updates  */}
          <div className={`relative py-6 ${news.isLoading ? "flex items-center justify-center":""}`} >
          {news.isLoading && <CircleLoader /> }
          {news?.data?.data && news?.data?.data.length > 0 &&
            <Carousel 
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="flex items-center !bg-white  absolute top-0 h-fit  w-fit bg-red-400 main-class"
            renderDotsOutside
            showDots
            arrows={false}
    
            className="" responsive={newResponsiveCarousel}>
              {news?.data?.data.map((newsItem,index)=>(
              <HomePageNewsCard key={index} newsItem={newsItem} index={index} />
              ))}            
            </Carousel>
          }
          </div>
          {/* Events & Notifications */}
          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-7">
            <div className="flex flex-col " >
              <SeeAll title="Events" path="/events" />

              
              
                <div className={`grid place items-center`} >
                {events.isLoading && <CircleLoader />}
                { events.data && (
              <Carousel
                responsive={eventsResponsiveCarousel}
                autoPlay={true}
                arrows={true}
                rewind={true}
                autoPlaySpeed={3000}
                keyBoardControl={true}
                className="container"
              >
                {events?.data?.data.map((eventItem:any, index:any) => (
                  <EventsCard key={index} eventItem={eventItem} />
                ))}
              </Carousel>
              )}
              </div>
            </div>
            <div className="hidden  md:flex flex-col" >
              <SeeAll title="Notifications" path="/notifications" />
              <div className="grid justify-between " >

                {notificationData.map((notificationItem,index)=>(
                  <HomePageNotification key={index} notificationItem={notificationItem} />
                ))}
              </div>
            </div>
          </div>
          <div>

          <SeeAll title='Publications' path="/publications" />
          <div className="grid grid-cols-2 gap-6">
            {publication?.data?.data?.map((publicationItem:PublicationDataType, index:number) => (
              <PublicationCard key={index} publicationItem={publicationItem} />
            ))}
          </div>
          </div>

        </div>
        <div className='hidden xl:inline col-span-1'  >
        <SeeAll title='Gallery' path="/gallery" />
        <GalleryGrid numberOfItemsToShow={3} />
     

        <QuickNav />
        

          
        </div>
    </main>
     
  )
}

export default HomePage