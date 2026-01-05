import { useQuery } from "react-query"; 
import { fetchAllUserEvents } from "../../api/events/events-api";
import EventsCard from "../cards/EventsCard";
import Toast from "../toast/Toast";
import CircleLoader from "../loaders/CircleLoader";
import { useEnvironmentContext } from "../../context/environmentContext";
import { filterContentByEnvironment } from "../../utils/contentFilter";
import { useMemo } from "react";

interface Props {
  numberOfItemsToShow?: number;
  heightOfCard?:string;
}

const EventGrid = ({numberOfItemsToShow=2,heightOfCard}:Props) => {
  const { notifyUser } = Toast();
  const { selectedEnvironments } = useEnvironmentContext();

  const { data, isError, isLoading } = useQuery("events",fetchAllUserEvents,);

  // Filter events based on selected environments
  const filteredEvents = useMemo(() => {
    const eventsData = data?.data || data || [];
    const filtered = filterContentByEnvironment(eventsData, selectedEnvironments);
    return filtered?.slice(0, numberOfItemsToShow);
  }, [data, selectedEnvironments, numberOfItemsToShow]);

  if (isError){
    notifyUser('Sorry, an error occured while fetching events','error')
  }

  if (isLoading){
    return <CircleLoader />
  }

  return (
    <div className=" xl/lg:px-0 md:px-10 px-5">
      {filteredEvents && filteredEvents.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">
          No events available for the selected environment(s).
        </div>
      ) : (
        filteredEvents?.map((eventItem: any, index: number) => (
          <EventsCard height={heightOfCard} hideButton={true} key={index} eventItem={eventItem} />
        ))
      )}
  </div>
  )
}

export default EventGrid