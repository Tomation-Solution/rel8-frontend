// import calendarIcon from '../../assets/icons/calendar.png'
// import clockIcon from '../../assets/icons/clock.png'
// import { Props } from '../../types/myTypes';
// import { Link } from "react-router-dom";
// import { PublicationDataType } from "../../types/myTypes"

// interface Props{
//     newsItem:PublicationDataType;
//     hidePostDetails?:boolean;
//     linkTo?:string
// }

// const formatDate = (dateString: string) => {
//   const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
//   const date = new Date(dateString);
//   return date.toLocaleDateString(undefined, options);
// }

// const HomePageNotification = ({notificationItem}:Props) => {
//   return (
//     <div  className='bg-[#f9f9f9] border border-[#ececec] flex items-center gap-2 px-3 py-2 my-1 rounded-md' >
//     <img className="w-7 h-7" src={notificationItem.latest_update_table_name === 'news' ? clockIcon : calendarIcon } alt="notification-image" />
//     {/* <div className="grid " > */}
//     {/* <Link to={`/news/${galleryItem.id}/`}> */}
//     <Link to={`/${linkTo}/${newsItem.id}/`} >
//       <div className="flex flex-col flex-grow">
//           <span className="font-bold col-span-2 text-primary-blue capitalize" >{notificationItem.title}</span>
//           <div className="flex justify-between gap-2" >
//           <span className="text-xs col-span-2 text-[#3a3a3a] line-clamp-1" >{notificationItem.body}</span>
//           {notificationItem.created_on && (
//               <span className="whitespace-nowrap text-xs">{formatDate(notificationItem.created_on)}</span>
//             )}
//           </div>
//       </div>
//     </Link>
// </div>
//   )
// }

// export default HomePageNotification

import { useEffect } from "react";
import calendarIcon from "../../assets/icons/calendar.png";
import clockIcon from "../../assets/icons/clock.png";
import { Link } from "react-router-dom";
import {
  NotificationDataType,
  PublicationDataType,
  EventDataType,
} from "../../types/myTypes";

interface Props {
  notificationItem: NotificationDataType;
  newsItem?: PublicationDataType;
  eventItem?: EventDataType;
}

// Function to format the date
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Determine the correct notification link dynamically
// const getNotificationLink = (
//   notification: NotificationDataType,
//   newsItem?: PublicationDataType,
//   eventItem?: EventDataType
// ) => {
//   console.log("Notification Data:", notification);
//   console.log("News Item Data:", newsItem);
//   console.log("Event Item Data:", eventItem);

//   switch (notification.latest_update_table_name) {
//     case "news":
//       return `/news/${notification.latest_update_table_id}/`;
//     case "events":
//       return `/events/${notification.latest_update_table_id}/`;
//     default:
//       return "/notifications";
//   }
// };

const HomePageNotification = ({
  notificationItem,
  newsItem,
  eventItem,
}: Props) => {
  useEffect(() => {
    console.log("Notification Item:", notificationItem);
    console.log("News Item:", newsItem);
    console.log("Event Item:", eventItem);
  }, [notificationItem, newsItem, eventItem]);

  return (
    <Link
      // to={getNotificationLink(notificationItem, newsItem, eventItem)}
      className="block"
    >
      <div className="bg-[#f9f9f9] border border-[#ececec] flex items-center gap-2 px-3 py-2 my-1 rounded-md cursor-pointer hover:bg-gray-200 transition">
        <img
          className="w-7 h-7"
          src={
            notificationItem?.latest_update_table_name === "news"
              ? clockIcon
              : calendarIcon
          }
          alt="notification-icon"
        />
        <div className="flex flex-col flex-grow">
          <span className="font-bold text-primary-blue capitalize">
            {notificationItem.title}
          </span>
          <div className="flex justify-between gap-2">
            <span className="text-xs text-[#3a3a3a] line-clamp-1">
              {notificationItem.message}
            </span>
            {notificationItem.createdAt && (
              <span className="whitespace-nowrap text-xs">
                {formatDate(notificationItem.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomePageNotification;
