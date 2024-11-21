import SeeAll from "../../../components/SeeAll";
import eventsIcon from "../../../assets/icons/calendar.png";
import clockIcon from "../../../assets/icons/clock.png";
import dummyOrganizerImage from "../../../assets/images/dummy.jpg";
import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { Link, useParams } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { fetchAllUserEvents, registerForFreeEvent, registerForPaidEvent } from "../../../api/events/events-api";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";

const EventDetailPage = () => {

    const { eventId } = useParams();
    const { notifyUser } = Toast();
    const navigate = useNavigate(); // To handle navigation after success

    const singleEvent  = useQuery("events",fetchAllUserEvents,{
        refetchOnMount: false,
        enabled:!!eventId,
        retry:2,
    });

    const handleFreeEventMutation = useMutation(registerForFreeEvent, {
      onSuccess: (data) => {
        notifyUser(data.message,"success");
        // console.log('hahaha-->event',data)
      },
      onError: (error:any) => {
        const data:any = error.response.data
        notifyUser(JSON.stringify(`${data?.message.error}`),"error");
      }
    });

    const registerForPaidEventMutation = useMutation(() => registerForPaidEvent(eventId, event.amount), {
      onSuccess: (data) => {
        const hasPaid = event?.event_access?.has_paid ?? false; // Fallback for undefined
        console.log('Mutation onSuccess data:', data);
        console.log('Event Access:', event?.event_access);
      
        if (!hasPaid) {
          const authorizationURL = data?.data?.data?.authorization_url;
          if (authorizationURL) {
            window.location.href = authorizationURL;
          } else {
            notifyUser("Authorization URL not found. Try again.", "error");
          }
        } else {
          notifyUser("Congratulations, you have paid for the event", "success");
          navigate(`/event/success/${eventId}`);
        }
      },
      
      onError: (error) => {
        console.log(error);
        notifyUser('An error occurred while registering for the event', 'error');
      },
    });
       
    const handleRegisterUserForFreeEvents = ()=>{
      if (eventId){
        
        const formData = new FormData()
        formData.append("event_id",eventId)
        handleFreeEventMutation.mutate(formData)
      }
    }
       
    const handleRegisterUserForPaidEvents = () => {
      const hasPaid = event?.event_access?.has_paid ?? false;
    
      if (eventId && event?.is_paid_event && !hasPaid) {
        registerForPaidEventMutation.mutate();
      } else if (hasPaid) {
        notifyUser('You have already paid for this event', "success");
      } else {
        notifyUser('Unable to determine payment status. Please try again.', "error");
      }
    };
    
    const event = singleEvent.data?.data.find((item:any) => item.id.toString() === eventId);
    if (singleEvent.isError){
        notifyUser("An error occured while fetching event detail","error")
      }

    if (singleEvent.isLoading){
        return <CircleLoader />
    }

    if (event){

        return (
          <main className="grid md:grid-cols-4 md:gap-10 gap-[50px] md:px-0 px-5 text-textColor ">
            {
              handleFreeEventMutation.isLoading?
              <CircleLoader />:''
            }
          <div className="col-span-3">
            <BreadCrumb title="Event's Details" />
            <div className="relative " >
                <div className="relative flex items-center  h-[40vh]">

              <img
                src={event?.image}
                className="w-full  max-h-[40vh] border object-contain rounded-md"
                // className="w-full absolute top-0 right-0 left-0 bottom-0 object-cover h-full max-h-[inheit] "
                alt=""
              />
                </div>
              <div className="grid md:grid-cols-5 grid-cols-3 my-5 gap-1">
                <div className=" col-span-3 flex items-center font-semibold">
               
                  <span className="block" >Name of event: 
                  <span className="font-light text-justify" >

                   {" "}{event.name} 
                  
                  </span>
                   </span>
                </div>
                <div className=" col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 h-fit">
                  <span className="flex items-center whitespace-nowrap py-3 px-2 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
                    <img src={eventsIcon} className="w-6 h-6" alt="" />{" "}
                    <span className="overflow-y-auto">{event.startDate}</span>
                  </span>
                  <span className="flex items-center whitespace-nowrap py-3 px-2 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
                    <img src={clockIcon} className="w-6 h-6" alt="" />{" "}
                    <span>{event.startTime}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-3 my-5 border-t border-b py-4">
              <div className="flex items-center gap-2">
                <img
                  src={event?.organiserImage ? event.organiserImage : dummyOrganizerImage}
                  className="w-10 h-10 rounded-full border"
                  alt=""
                />
                <div>
                  <h3 className="text-base ">
                   { event?.organiser_name? event?.organiser_name:"Not Available"} <span className="text-xs">~ Organizer</span>{" "}
                  </h3>
                  <p className="text-sm text-neutral1">
                    {event?.organiser_extra_info ? event.organiser_extra_info : "Organiser Info not available"}
                  </p>
                </div>
              </div>

              <Link to={`${event?.event_docs}`} className="bg-primary-blue text-center grid place-items-center text-white  border border-white h-[40px] rounded-md  hover:border-primary-blue">
                Download Event Atachment
              </Link>
            </div>
            
            <div className="" >
              <h3 className="text-sm">Event Fee: <span className="font-bold text-sm">
                  {event?.amount && parseFloat(event.amount) > 0 ? `₦${parseFloat(event.amount).toFixed(2)}` : "Free"}
                  </span>
              </h3>
              <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                <button className="bg-primary-blue text-white  border border-white h-[40px] rounded-md  ">
                  Add Participants
                </button>              
                <button onClick={event?.is_paid_event ? handleRegisterUserForPaidEvents : handleRegisterUserForFreeEvents} className="bg-white text-primaryBlue border border-primary-blue h-[40px] rounded-md">
                  {event?.is_paid_event ? "Pay for event" : "Register for free"}
                </button>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 col-span-3">
            <SeeAll title="Others" path="/events" />
            <EventGrid heightOfCard="h-[160px]" numberOfItemsToShow={3} />
            {/* <GalleryColumn numberOfItemsToShow={4} /> */}
          </div>
        </main>
        )
    }
}

export default EventDetailPage