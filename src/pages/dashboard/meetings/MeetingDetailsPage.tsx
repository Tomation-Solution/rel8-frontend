// import BreadCrumb from "../../components/BreadCrumb";
import eventDetailImage from "../../assets/images/event-detail-image.png";
// import SeeAll from "../../components/SeeAll";
import eventsIcon from "../../assets/icons/calendar.png";
import clockIcon from "../../assets/icons/clock.png";
import avatarImage from "../../assets/images/avatar-1.jpg";
// import EventsColumn from "../../components/EventsColumn";
import LocationIcon from '../../assets/icons/location.png'
import AttachmentIcon from '../../assets/icons/attachment.png'
import SeeAll from "../../../components/SeeAll";
import EventGrid from "../../../components/grid/EventGrid";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";

const MeetingDetailsPage = () => {
  return (
    <main className="grid grid-cols-4 space-x-5 text-textColor">
    <div className="col-span-3">
      <BreadCrumb title="Meeting" />
      <div>
        <img
          src={eventDetailImage}
          className="w-full object-contain"
          alt=""
        />
        <div className="grid grid-cols-2 my-5">
          <div className="flex items-center font-semibold">
            <span>Name of Meeting</span>
            <span>....</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <span className="flex items-center whitespace-nowrap p-3 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
              <img src={eventsIcon} className="w-6 h-6" alt="" />{" "}
              <span>25/09/23</span>
            </span>
            <span className="flex items-center whitespace-nowrap p-3 text-sm bg-neutral-3 text-textColor rounded-md gap-2">
              <img src={clockIcon} className="w-6 h-6" alt="" />{" "}
              <span>8:00 PM</span>
            </span>
          </div>
        </div>
      </div>
      <div className="grid  my-5 border-t border-b py-3">
        <div className="flex items-center gap-2">
          <img
            src={avatarImage}
            className="w-10 h-10 rounded-full border"
            alt=""
          />
          <div>
            <h3 className="text-base font-medium">
              Organizer's Name <span className="text-xs">~ Organizer</span>{" "}
            </h3>
            <p className="text-sm text-neutral1">
              Organizer’s title/general sub-title
            </p>
          </div>
        </div>
      
      </div>
      <div>
        <div className="p-2 bg-neutral-3 text-sm rounded-md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio a maxime veniam nulla obcaecati. Quis optio, tempore dolor libero porro nihil maxime minus laborum illo doloribus vero consectetur, laboriosam earum! Rerum reprehenderit dolore repellat consequuntur illo architecto laborum rem ullam eos aliquam non, porro quibusdam nobis molestiae temporibus? Quos quam deserunt illum!
        </div>
        <div className="flex items-center gap-2 my-2" >
          <div className="flex items-center p-2 bg-neutral-3 rounded-md gap-2 text-sm" >
              <img src={AttachmentIcon} alt="" />
            <span>
              attachment.doc
              </span>
          </div>
          <div className="flex items-center p-2 bg-neutral-3 gap-2 text-sm rounded-md">
              <img src={LocationIcon} alt="" />
            <span>
              No 5, KPMG tower, Abode Avenue, Lagos, Nigeria P.O Box 236478
              </span>
          </div>
        </div>
      </div>

      <div className="my-8" >
       
          <div className="grid grid-cols-2 gap-2 my-3 text-sm">
          <button className="bg-primary-blue text-white  border border-white h-[40px] rounded-md hover:bg-white hover:text-primaryBlue  hover:border-primaryBlue">
         Add Participants
        </button>
          <button className="bg-white text-primaryBlue border border-primaryBlue h-[40px] rounded-md hover:bg-primary-blue hover:text-white hover:border-white">
         Register
        </button>
          </div>
      </div>
    </div>
    <div className="col-span-1">
      <SeeAll title="Others" path="/gallery" />
      <EventGrid numberOfItemsToShow={4} heightOfCard="h-[170px]" />
      {/* <GalleryColumn numberOfItemsToShow={4} /> */}
    </div>
  </main>
  )
}

export default MeetingDetailsPage