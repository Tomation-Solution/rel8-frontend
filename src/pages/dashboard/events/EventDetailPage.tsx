import SeeAll from "../../../components/SeeAll";
import eventsIcon from "../../../assets/icons/calendar.png";
import clockIcon from "../../../assets/icons/clock.png";
import dummyOrganizerImage from "../../../assets/images/dummy.jpg";
import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { fetchAllUserEvents, registerForFreeEvent, registerForPaidEvent } from "../../../api/events/events-api";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { useAppContext } from "../../../context/authContext";

const EventDetailPage = () => {

  const { userProfileData } = useAppContext();

    const { eventId } = useParams();
    const { notifyUser } = Toast();

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

    
    // const { data: event, isLoading: eventLoading } = useQuery('yourEventQueryKey', fetchEventData);
  
    const registerForPaidEventMutation = useMutation(()=>registerForPaidEvent(eventId), {
      onSuccess: (data) => {
        // Redirect the user to the authentication URL
        // const authenticationUrl = data?.authentication_url;
        // if (authenticationUrl) {
        //   window.location.href = authenticationUrl;
        // }
        // console.log('paid for event on paystack o data',data?.data?.data?.authorization_url)
        if (!event?.event_access.has_paid) {
          const authorizationURL = data?.data?.data?.authorization_url
          ;
          if (authorizationURL) {
            window.location.href = authorizationURL;
          }
        } else {
          // Notify the user that they have paid for the event
          notifyUser("Congratulations, you have paid for the event", "success");
          // Optionally, you can refetch the event data after a successful registration
          // queryClient.invalidateQueries('yourEventQueryKey');
        }

      },
      onError: (error) => {
        // Handle error, notify user, etc.
        console.log(error)
        notifyUser('An error occured while registering for the event','error');
      },
    });
  

   
    const handleRegisterUserForFreeEvents = ()=>{
      if (eventId){
        
        const formData = new FormData()
        formData.append("event_id",eventId)
        // formData.append("proxy_participants",JSON.stringify([]))
        handleFreeEventMutation.mutate(formData)
      }
    }
    const handleRegisterUserForPaidEvents = ()=>{
      if (eventId && event?.is_paid_event && event?.event_access.has_paid) {
        {
          // you can use this format to send the details to a new created paid event url
          // const formData = new FormData();
          // formData.append('event_id', eventId);
          // formData.append(
          //   'proxy_participants',
          //   JSON.stringify([{ email: userProfileData[0]?.more_info[0]?.value, full_name: userProfileData[0]?.more_info[5]?.value }])
          // );
        }
        notifyUser('You have paid already',"success")
  
        // Use the mutate function from React Query to handle the post request
        // mutation.mutate(formData);
      }else if(eventId && event?.is_paid_event && !event?.event_access.has_paid){
        registerForPaidEventMutation.mutate()
      }
       
      
    }




    const event = singleEvent.data?.data.find((item:any) => item.id.toString() === eventId);

    if (singleEvent.isError){
        notifyUser("An error occured while fetching event detail","error")
      }

    if (singleEvent.isLoading){
        return <CircleLoader />
    }

    // console.log(event,'data for single event')

   

    if (event){

        return (
          <main className="grid grid-cols-4 gap-x-[60px] text-textColor ">
            {
              handleFreeEventMutation.isLoading?
              <CircleLoader />:''
            }
          <div className="col-span-3">
            <BreadCrumb title="Events" />
            <div className="relative " >
                <div className="relative flex items-center  h-[40vh]">

              <img
                src={event?.image}
                className="w-full  max-h-[40vh] border object-contain rounded-md"
                // className="w-full absolute top-0 right-0 left-0 bottom-0 object-cover h-full max-h-[inheit] "
                alt=""
              />
                </div>
              <div className="grid grid-cols-5 my-5 gap-1">
                <div className=" col-span-3 flex items-center font-semibold">
               
                  <span className="block" >Name of event: 
                  <span className="font-light text-justify" >

                   {event.name} 
                  
                  </span>
                   </span>
                </div>
                <div className=" col-span-2 grid grid-cols-2 gap-3 h-fit">
                  <span className="flex items-center whitespace-nowrap py-3 px-2 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
                    <img src={eventsIcon} className="w-6 h-6" alt="" />{" "}
                    <span>{event.startDate}</span>
                  </span>
                  <span className="flex items-center whitespace-nowrap py-3 px-2 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
                    <img src={clockIcon} className="w-6 h-6" alt="" />{" "}
                    <span>{event.startTime}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 my-5 border-t border-b py-4">
              <div className="flex items-center gap-2">
                <img
                  src={event?.organiserImage ? event.organiserImage : dummyOrganizerImage}
                  className="w-10 h-10 rounded-full border"
                  alt=""
                />
                <div>
                  <h3 className="text-base ">
                   { event?.organzier_name? event?.organzier_name:"Not Available"} <span className="text-xs">~ Organizer</span>{" "}
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
                <h3 className="text-sm" >Event Fee: <span className="font-bold text-sm" >₦{event?.amount ?  parseFloat(event.amount).toFixed(2) :  "Not Available"}</span></h3>
                <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                <button className="bg-primary-blue text-white  border border-white h-[40px] rounded-md  ">
               Add Participants
              </button>
              {/* <Button type="outlined"  text="xjnasj" className="!h-[40px] grid  place-items-center" />  */}
              
                <button onClick={event?.is_paid_event ? handleRegisterUserForPaidEvents :handleRegisterUserForFreeEvents}  className="bg-white text-primaryBlue border border-primary-blue h-[40px] rounded-md">
               Register
               {
                event?.is_paid_event?"Pay for event":"Register for free"
               }
              </button>
                </div>
            </div>
          </div>
          <div className="hidden xl:inline col-span-1">
            <SeeAll title="Others" path="/gallery" />
            <EventGrid heightOfCard="h-[160px]" numberOfItemsToShow={3} />
            {/* <GalleryColumn numberOfItemsToShow={4} /> */}
          </div>
        </main>
        )
    }
}

export default EventDetailPage