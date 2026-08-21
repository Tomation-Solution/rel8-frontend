import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { FiBell } from "react-icons/fi";

import { fetchAllNotifications } from "../../../api/notifications/notifications-api";
import { NotificationDataType } from "../../../types/myTypes";
import NotificationRow from "../../../components/notifications/NotificationRow";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { EmptyState, PageHeader, Pagination } from "../../../components/ui";

const PER_PAGE = 10;

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isError, isLoading } = useQuery<NotificationDataType[]>("notifications", fetchAllNotifications, { staleTime: 5 * 60 * 1000 });

  // The endpoint returns the whole list in one response — there is no page parameter on
  // `/notifications/latestupdate/member_lastest_updates/` — so paging is done here.
  const notifications = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const totalPages = Math.max(1, Math.ceil(notifications.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = notifications.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      <PageHeader title="Welcome To Your Notification" subtitle="Here's how things are going for you." />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : isError ? (
        <EmptyState icon={FiBell} title="Couldn't load your notifications" description="Something went wrong reaching the server. Try again in a moment." />
      ) : notifications.length === 0 ? (
        <EmptyState icon={FiBell} title="Nothing new" description="No notifications yet. Enjoy the silence." />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {visible.map((item, index) => (
              <NotificationRow key={item._id ?? index} item={item} stamp="posted" />
            ))}
          </div>
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default NotificationsPage;
