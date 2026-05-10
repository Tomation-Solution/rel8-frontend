import { useQuery } from "react-query";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { fetchAllExcos } from "../../../api/members/api-members";
import { useState } from "react";
import { ExcoMemberDataType } from "../../../types/myTypes";
import ExcosMemberCard from "../../../components/cards/ExcosMemberCard";
import NewsCard from "../../../components/cards/NewsCard";
import PublicationCard from "../../../components/cards/PublicationCard";
import GalleryCard from "../../../components/cards/GalleryCard";
import { fetchAllUserNews } from "../../../api/news/news-api";
import { fetchUserPublications } from "../../../api/publications/publications-api";
import { fetchAllGalleryData } from "../../../api/gallery/gallery-api";
import { fetchAllUserEvents } from "../../../api/events/events-api";
import { fetchUserMeetings } from "../../../api/meetings/api-meetings";
import EventsCard from "../../../components/cards/EventsCard";
import MeetingCard from "../../../components/cards/MeetingCard";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";

type Tab = "members" | "news" | "publications" | "gallery" | "events" | "meetings";

const TABS: { key: Tab; label: string }[] = [
  { key: "members", label: "Leadership" },
  { key: "news", label: "News" },
  { key: "publications", label: "Publications" },
  { key: "gallery", label: "Gallery" },
  { key: "events", label: "Events" },
  { key: "meetings", label: "Meetings" },
];

const EmptyState = ({ label }: { label: string }) => <p className="text-gray-400 text-sm py-10 text-center">No {label} for the Excos yet.</p>;

const ExcosPage = () => {
  const { data, isLoading, isError } = useQuery("excos", fetchAllExcos);
  const { data: newsData } = useQuery("news", fetchAllUserNews);
  const { data: publicationsData } = useQuery("publications", fetchUserPublications);
  const { data: galleryData } = useQuery(["galleryData", 1], () => fetchAllGalleryData(1));
  const { data: eventsData } = useQuery("events", fetchAllUserEvents);
  const { data: meetingsData } = useQuery("meetings", fetchUserMeetings);

  const [activeTab, setActiveTab] = useState<Tab>("members");
  const { notifyUser } = Toast();

  // New response: array of groups, each with positions[]
  // Legacy response: flat array of exco records
  const groups: any[] = Array.isArray(data) ? data : [];
  const isNewShape = groups.length > 0 && Array.isArray(groups[0]?.positions);

  const isExcoItem = (item: any) => item.audience === "exco";

  const excoNews: any[] = Array.isArray(newsData) ? newsData.filter(isExcoItem) : [];
  const excoPublications: any[] = Array.isArray(publicationsData) ? publicationsData.filter(isExcoItem) : [];
  const excoGallery: any[] = Array.isArray(galleryData) ? galleryData.filter(isExcoItem) : [];
  const excoEvents: any[] = Array.isArray(eventsData) ? eventsData.filter(isExcoItem) : [];
  const excoMeetings: any[] = Array.isArray(meetingsData) ? meetingsData.filter(isExcoItem) : [];

  if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    notifyUser("An error occurred while trying to fetch excos", "error");
  }

  return (
    <main>
      <BreadCrumb title={"Excos Environment"} />

      {/* Tab bar */}
      <div className="mt-4 border-b border-gray-200 flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? "border-org-primary text-org-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* MEMBERS (LEADERSHIP) TAB */}
        {activeTab === "members" && (
          <>
            {isNewShape ? (
              // New API: groups → positions
              groups.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-org-primary-blue text-xl">No Leadership Available</h3>
                </div>
              ) : (
                groups.map((group: any) => (
                  <div key={group._id} className="mb-8">
                    {groups.length > 1 && <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">{group.name}</h3>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                      {(group.positions || [])
                        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
                        .map((pos: any) => (
                          <ExcosMemberCard key={pos._id} item={{ ...pos, position: pos.title, profileImage: pos.imageUrl }} />
                        ))}
                    </div>
                    {(!group.positions || group.positions.length === 0) && <p className="text-gray-400 text-sm py-4 text-center">No positions listed for this group.</p>}
                  </div>
                ))
              )
            ) : (
              // Legacy flat array response
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 flex-1">
                  {groups.map((item: ExcoMemberDataType, index: number) => (
                    <ExcosMemberCard key={index} item={item} />
                  ))}
                </div>
                {groups.length === 0 && (
                  <div className="text-center py-8">
                    <h3 className="text-org-primary-blue text-xl">No Excos Available</h3>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* NEWS TAB */}
        {activeTab === "news" &&
          (excoNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              {excoNews.map(item => (
                <NewsCard key={item._id} newsItem={item} hidePostDetails linkTo="news" />
              ))}
            </div>
          ) : (
            <EmptyState label="news" />
          ))}

        {/* PUBLICATIONS TAB */}
        {activeTab === "publications" &&
          (excoPublications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              {excoPublications.map(item => (
                <PublicationCard key={item._id} publicationItem={item} linkTo="publication" />
              ))}
            </div>
          ) : (
            <EmptyState label="publications" />
          ))}

        {/* GALLERY TAB */}
        {activeTab === "gallery" &&
          (excoGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              {excoGallery.map(item => (
                <GalleryCard key={item._id} galleryItem={item} />
              ))}
            </div>
          ) : (
            <EmptyState label="gallery" />
          ))}

        {/* EVENTS TAB */}
        {activeTab === "events" &&
          (excoEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              {excoEvents.map(item => (
                <EventsCard key={item._id} eventItem={item} />
              ))}
            </div>
          ) : (
            <EmptyState label="events" />
          ))}

        {/* MEETINGS TAB */}
        {activeTab === "meetings" &&
          (excoMeetings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              {excoMeetings.map(item => (
                <MeetingCard key={item._id} meeting={item} />
              ))}
            </div>
          ) : (
            <EmptyState label="meetings" />
          ))}
      </div>
    </main>
  );
};

export default ExcosPage;
