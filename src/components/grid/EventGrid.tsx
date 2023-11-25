import { useQuery } from "react-query"; 
import { fetchAllUserEvents } from "../../api/events/events-api";
import EventsCard from "../cards/EventsCard";
import Toast from "../toast/Toast";
import CircleLoader from "../loaders/CircleLoader";

interface Props {
  numberOfItemsToShow?: number;
  heightOfCard?:string;
}

const EventGrid = ({numberOfItemsToShow=2,heightOfCard}:Props) => {
  const { notifyUser } = Toast();

  const { data, isError, isLoading } = useQuery("events",fetchAllUserEvents,);

  if (isError){
    notifyUser('Sorry, an error occured while fetching events','error')
  }

  if (isLoading){
    return <CircleLoader />
  }

  return (
    <>
   
    {data?.data?.slice(0, numberOfItemsToShow)
      .map((eventItem: any, index: number) => (
        <EventsCard height={heightOfCard} hideButton={true} key={index} eventItem={eventItem} />
      ))}
  </>
  )
}

export default EventGrid