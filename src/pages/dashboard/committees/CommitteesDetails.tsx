import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCommitteeDetails, CommitteeType } from "../../../api/committee/committee";
import { fetchAllUserNews } from "../../../api/news/news-api";
import { fetchUserPublications } from "../../../api/publications/publications-api";
import { fetchAllGalleryData } from "../../../api/gallery/gallery-api";
import { fetchAllUserEvents } from "../../../api/events/events-api";
import { fetchUserMeetings } from "../../../api/meetings/api-meetings";
import CircleLoader from "../../../components/loaders/CircleLoader";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import NewsCard from "../../../components/cards/NewsCard";
import PublicationCard from "../../../components/cards/PublicationCard";
import GalleryCard from "../../../components/cards/GalleryCard";
import EventsCard from "../../../components/cards/EventsCard";
import MeetingCard from "../../../components/cards/MeetingCard";

type Tab = "info" | "news" | "publications" | "gallery" | "events" | "meetings";

const TABS: { key: Tab; label: string }[] = [
  { key: "info", label: "Committee Info" },
  { key: "news", label: "News" },
  { key: "publications", label: "Publications" },
  { key: "gallery", label: "Gallery" },
  { key: "events", label: "Events" },
  { key: "meetings", label: "Meetings" },
];

const EmptyState = ({ label }: { label: string }) => <p className="text-gray-400 text-sm py-10 text-center">No {label} for this committee yet.</p>;

const CommitteeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const { data, isLoading, isError } = useQuery(["committeeDetails", id], () => fetchCommitteeDetails(id as string), { enabled: !!id });

  const { data: newsData } = useQuery("news", fetchAllUserNews);
  const { data: publicationsData } = useQuery("publications", fetchUserPublications);
  const { data: galleryData } = useQuery(["galleryData", 1], () => fetchAllGalleryData(1));
  const { data: eventsData } = useQuery("events", fetchAllUserEvents);
  const { data: meetingsData } = useQuery("meetings", fetchUserMeetings);

  const isCommitteeItem = (item: any) => item.audience === "committee" && (item.committeeId === id || item.committee_id === id);

  const committeeNews: any[] = Array.isArray(newsData) ? newsData.filter(isCommitteeItem) : [];
  const committeePublications: any[] = Array.isArray(publicationsData) ? publicationsData.filter(isCommitteeItem) : [];
  const committeeGallery: any[] = Array.isArray(galleryData) ? galleryData.filter(isCommitteeItem) : [];
  const committeeEvents: any[] = Array.isArray(eventsData) ? eventsData.filter(isCommitteeItem) : [];
  const committeeMeetings: any[] = Array.isArray(meetingsData) ? meetingsData.filter(isCommitteeItem) : [];

  if (isLoading) return <CircleLoader />;
  if (isError) return <div className="flex items-center justify-center h-screen text-red-500">Error loading committee details</div>;

  const committee: CommitteeType = data;

  return (
    <main>
      <BreadCrumb title={committee?.name ?? "Committee Details"} />

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

      <div className="mt-6 max-w-3xl">
        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="bg-white shadow-sm border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{committee?.name}</h2>
              {committee?.description && <p className="text-gray-600 mt-1">{committee.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Chairperson</h3>
                <p className="text-gray-800">{committee?.chairperson?.name}</p>
                <p className="text-gray-400 text-sm">{committee?.chairperson?.email}</p>
              </div>

              {committee?.positions?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Positions</h3>
                  <div className="flex flex-wrap gap-2">
                    {committee.positions.map((pos, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {pos}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Members ({committee?.members?.length ?? 0})</h3>
              {committee?.members?.length > 0 ? (
                <ul className="space-y-2">
                  {committee.members.map(member => (
                    <li key={member._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{member.name}</p>
                        <p className="text-gray-400 text-xs">{member.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No members in this committee.</p>
              )}
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === "news" &&
          (committeeNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {committeeNews.map(item => (
                <NewsCard key={item._id} newsItem={item} hidePostDetails linkTo="news" />
              ))}
            </div>
          ) : (
            <EmptyState label="news" />
          ))}

        {/* PUBLICATIONS TAB */}
        {activeTab === "publications" &&
          (committeePublications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {committeePublications.map(item => (
                <PublicationCard key={item._id} publicationItem={item} linkTo="publication" />
              ))}
            </div>
          ) : (
            <EmptyState label="publications" />
          ))}

        {/* GALLERY TAB */}
        {activeTab === "gallery" &&
          (committeeGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {committeeGallery.map(item => (
                <GalleryCard key={item._id} galleryItem={item} />
              ))}
            </div>
          ) : (
            <EmptyState label="gallery" />
          ))}

        {/* EVENTS TAB */}
        {activeTab === "events" &&
          (committeeEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {committeeEvents.map(item => (
                <EventsCard key={item._id} eventItem={item} />
              ))}
            </div>
          ) : (
            <EmptyState label="events" />
          ))}

        {/* MEETINGS TAB */}
        {activeTab === "meetings" &&
          (committeeMeetings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {committeeMeetings.map(item => (
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

export default CommitteeDetails;
