import { useQuery } from "react-query";
import { fetchAllUserEvents } from "../../../api/events/events-api";
import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import EventsCard from "../../../components/cards/EventsCard";
import GalleryGrid from "../../../components/grid/GalleryGrid";
import CircleLoader from "../../../components/loaders/CircleLoader";
import QuickNav from "../../../components/navigation/QuickNav";
import Toast from "../../../components/toast/Toast";

const EventsPage = () => {
    const { notifyUser } = Toast();
    const { data, isError, isLoading } = useQuery("events", fetchAllUserEvents);

    if (isError) {
        notifyUser("An error occurred while fetching events", "error");
    }

    return (
        <main className='grid grid-cols-1 md:grid-cols-4 gap-7'>
            <div className='col-span-1 md:col-span-3 md:px-0 px-5'>
                <BreadCrumb title='Events' />

                <div className="grid grid-col-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {isLoading && <CircleLoader />}
                    {!isLoading && data && Array.isArray(data) && data.length === 0 && (
                        <div className="py-10 text-center col-span-full md:text-[25px]">
                            No events available.
                        </div>
                    )}
                    {!isLoading && !data && (
                        <div className="py-10 text-center col-span-full md:text-[25px]">
                            No events available.
                        </div>
                    )}
                    {!isLoading && data && Array.isArray(data) && data.map((eventItem: any, index: number) => (
                        <EventsCard key={index} eventItem={eventItem} />
                    ))}
                </div>
            </div>
            <div className="col-span-1 md:col-span-1">
                <SeeAll title='Gallery' path='/gallery' />
                <div className='relative'>
                    <GalleryGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} />
                </div>
                <QuickNav />
            </div>
        </main>
    );
}

export default EventsPage;
