import { useQuery } from "react-query";
import SeeAll from "../../../components/SeeAll";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import MeetingCard from "../../../components/cards/MeetingCard";
import GalleryGrid from "../../../components/grid/GalleryGrid";
import QuickNav from "../../../components/navigation/QuickNav";
import { fetchUserMeetings } from "../../../api/meetings/api-meetings";

const MeetingPage = () => {
  const { data } = useQuery("meetings", fetchUserMeetings);

  console.log("--->meeting", data?.data);

  return (
    <main>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="col-span-3">
          <BreadCrumb title="Meeting" />
          {data?.data?.length > 0 &&
            data.data.map((meeting: any, index: number) => (
              <MeetingCard key={index} meeting={meeting} linkTo="meeting" />
            ))}
          {data?.data?.length <= 0 && (
            <h3 className="text-primary-blue font-light">No Meetings Available</h3>
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
