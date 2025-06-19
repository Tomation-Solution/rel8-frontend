import { Link } from "react-router-dom";
import ZeroNotifications from "../../../assets/images/no-notification-available.png";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { fetchAllNotifications } from "../../../api/notifications/notifications-api";
import { useQuery } from "react-query";
import { NotificationDataType } from "../../../types/myTypes";
import Spinner from "../../../components/loaders/CircleLoader";

const formatDatesInMessage = (message: string): string => {
  // This regex matches ISO date strings (e.g., 2025-06-30T00:00:00.000Z)
  const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g;

  return message.replace(dateRegex, (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
};

// const getNotificationLink = (notification: NotificationDataType) => {
//   switch (notification.latest_update_table_name) {
//     case "news":
//       return `/news/${notification.latest_update_table_id}/`;
//     case "events":
//       return `/events/${notification.latest_update_table_id}/`;
//     default:
//       return "/notifications";
//   }
// };

const NotificationsPage = () => {
  const { data, isError, isLoading } = useQuery<NotificationDataType[]>(
    "notifications",
    fetchAllNotifications
  );

  const notifications = data || [];

  console.log(notifications, "Notifications Data");

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error loading notifications</div>;

  return (
    <main>
      <BreadCrumb title="Notifications" />
      {notifications.length > 0 ? (
        <div className="flex flex-col my-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              // key={notification.id}
              // to={getNotificationLink(notification)}
              className="block"
            >
              <div className="p-2 bg-neutral-3 rounded-md my-1 hover:bg-gray-100 transition">
                <div className="flex flex-col p-2">
                  <h3 className="text-sm font-semibold">
                    {notification.title}
                  </h3>
                  <small className="text-xs text-neutral-1">
                    {formatDatesInMessage(notification.message)}
                  </small>
                </div>
                <small className="text-xs">
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="my-2 flex justify-center">
          <img
            src={ZeroNotifications}
            className="object-contain max-w-[500px]"
            alt="No notifications"
          />
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
