import { useQuery } from "react-query";
import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import MeetingCard from "../../../components/cards/MeetingCard";
import GalleryGrid from "../../../components/grid/GalleryGrid";
import QuickNav from "../../../components/navigation/QuickNav";
import { fetchUserMeetings } from "../../../api/meetings/api-meetings";

const MeetingPage = () => {
  const { data, isLoading, isError } = useQuery("meetings", fetchUserMeetings);

  console.log("--->meetings data", data);

  if (isLoading) {
    return (
      <main>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-4">
          <section className="col-span-3">
            <BreadCrumb title="Meetings" />
            <div className="text-center py-8">
              <p>Loading meetings...</p>
            </div>
          </section>
          <section className="col-span-1">
            <SeeAll title="Gallery" />
            <GalleryGrid numberOfItemsToShow={2} />
            <QuickNav />
          </section>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-4">
          <section className="col-span-3">
            <BreadCrumb title="Meetings" />
            <div className="text-center py-8 text-red-500">
              <p>Failed to load meetings. Please try again later.</p>
            </div>
          </section>
          <section className="col-span-1">
            <SeeAll title="Gallery" />
            <GalleryGrid numberOfItemsToShow={2} />
            <QuickNav />
          </section>
        </div>
      </main>
    );
  }

  const meetings = Array.isArray(data) ? data : [];

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-4">
        <section className="col-span-3">
          <BreadCrumb title="Meetings" />
          {meetings.length > 0 ? (
            meetings.map((meeting: any, index: number) => (
              <MeetingCard key={meeting._id || meeting.id || index} meeting={meeting} linkTo="meeting" />
            ))
          ) : (
            <h3 className="text-org-primary-blue font-light text-center py-8">No Meetings Available</h3>
          )}
        </section>
        <section className="col-span-1">
          <SeeAll title="Gallery" />
          <GalleryGrid numberOfItemsToShow={2} />
          <QuickNav />
        </section>
      </div>
    </main>
  );
};

export default MeetingPage;
