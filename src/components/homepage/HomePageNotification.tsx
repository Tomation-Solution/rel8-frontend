import calendarIcon from '../../assets/icons/calendar.png'
import clockIcon from '../../assets/icons/clock.png'

interface NotificationDataType {
    notificationType: string;
    title: string;
    about:string;
    time?:string;
  }

interface Props{
    notificationItem:NotificationDataType
}

const HomePageNotification = ({notificationItem}:Props) => {
  return (
    <div  className='bg-[#f9f9f9] border border-[#ececec] flex items-center gap-2 px-3 py-2 my-1 rounded-md' >
    <img className="w-7 h-7" src={notificationItem.notificationType === 'meeting' ? clockIcon : calendarIcon } alt="notification-image" />
    <div className="grid " >
        <span className="font-bold col-span-2 text-primary-blue capitalize" >{notificationItem.title}</span>
        <div className="flex items-center gap-2" >
        <span className="text-xs col-span-2 text-[#3a3a3a] line-clamp-1" >{notificationItem.about}</span>
        {notificationItem.time && (
            
        <span  className="whitespace-nowrap text-xs">{notificationItem.time}</span>
        )}
        </div>
    </div>
</div>
  )
}

export default HomePageNotification