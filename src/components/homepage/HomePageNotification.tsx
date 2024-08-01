import calendarIcon from '../../assets/icons/calendar.png'
import clockIcon from '../../assets/icons/clock.png'
import { Props } from '../../types/myTypes';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

const HomePageNotification = ({notificationItem}:Props) => {
  return (
    <div  className='bg-[#f9f9f9] border border-[#ececec] flex items-center gap-2 px-3 py-2 my-1 rounded-md' >
    <img className="w-7 h-7" src={notificationItem.latest_update_table_name === 'news' ? clockIcon : calendarIcon } alt="notification-image" />
    <div className="grid " >
        <span className="font-bold col-span-2 text-primary-blue capitalize" >{notificationItem.title}</span>
        <div className="flex items-center gap-2 md:gap-5" >
        <span className="text-xs col-span-2 text-[#3a3a3a] line-clamp-1" >{notificationItem.body}</span>
        {notificationItem.created_on && (
            <span className="whitespace-nowrap text-xs">{formatDate(notificationItem.created_on)}</span>
          )}
        </div>
    </div>
</div>
  )
}

export default HomePageNotification