import blueEllipse from '../../../assets/images/notification-blue-ellipse.png';
import pinkEllipse from '../../../assets/images/notification-ink-ellipse.png';
import ZeroNotifications from '../../../assets/images/no-notification-available.png';
import BreadCrumb from '../../../components/breadcrumb/BreadCrumb';
import { fetchAllNotifications } from '../../../api/notifications/notifications-api';
import { useQuery } from 'react-query';
import { NotificationDataType } from '../../../types/myTypes';
import Spinner from '../../../components/loaders/CircleLoader'


const NotificationsPage = () => {
  const { data, isError, isLoading } = useQuery<NotificationDataType[]>('notifications', fetchAllNotifications);

  if (isLoading) return <div><Spinner /></div>;
  if (isError) return <div>Error loading notifications</div>;

  const notifications = data || [];

  const getRelativeDate = (date: string): string => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  const groupedNotifications = notifications.reduce<Record<string, NotificationDataType[]>>((acc, notification) => {
    const dateKey = getRelativeDate(notification.created_on);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(notification);
    return acc;
  }, {});

  const sortedKeys = Object.keys(groupedNotifications).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return 0;
  });

  return (
    <main>
      <BreadCrumb title='Notifications' />
      {sortedKeys.length > 0 ? (
        sortedKeys.map((dateKey) => (
          <div key={dateKey} className='flex flex-col my-2'>
            <small>{dateKey}</small>
            {groupedNotifications[dateKey].map((notification) => (
              <div key={notification.id} className='relative flex items-center p-2 bg-neutral-3 rounded-md my-1'>
                <img src={pinkEllipse} className='absolute bottom-0 left-[30%] h-[30%] opacity-80' alt="" />
                <img src={blueEllipse} className='absolute top-0 left-[50%] h-3/4 opacity-50' alt="" />
                <div className='flex flex-col p-2 flex-1'>
                  <h3 className='text-sm font-semibold'>{notification.title}</h3>
                  <small className='text-xs text-neutral-1'>{notification.body}</small>
                </div>
                <small className='text-xs'>{new Date(notification.created_on).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="my-2 flex justify-center">
          <img src={ZeroNotifications} className="object-contain max-w-[500px]" alt="" />
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
