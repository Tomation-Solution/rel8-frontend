import { useQuery } from "react-query"
import { fetchAllUserEvents } from "../../../api/events/events-api"
import SeeAll from "../../../components/SeeAll"
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb"
import EventsCard from "../../../components/cards/EventsCard"
import GalleryGrid from "../../../components/grid/GalleryGrid"
import CircleLoader from "../../../components/loaders/CircleLoader"
import QuickNav from "../../../components/navigation/QuickNav"
import Toast from "../../../components/toast/Toast"

const EventsPage = () => {
    const { notifyUser } = Toast();
    const {   data, isError, isLoading } = useQuery("events",fetchAllUserEvents);

      if (isError){
        notifyUser("An error occured while fetching events","error")
      }

  return (
    <main  className='grid grid-cols-4 space-x-[60px]'>
        <div className='col-span-4 xl:col-span-3 flex flex-col'  >
        <BreadCrumb title='Events' />
     

        <div className=" grid grid-col-1 md:grid-cols-2 gap-y-3 gap-x-6">
            {isLoading && <CircleLoader />}
        {data?.data?.map((eventItem:any,index:number)=>(
         <EventsCard key={index}   eventItem={eventItem} />
       ))}
        </div>
        </div>
        <div className="col-span-1 hidden xl:inline">
            <SeeAll title='Gallery' path='/gallery' />
            <div className='relative ' >
             <GalleryGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} />
            </div>
            <QuickNav />
        </div>
    </main>
  )
}

export default EventsPage