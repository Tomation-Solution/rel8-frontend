import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchGroupById, fetchGroupMembers } from "../../../api/groups/groups-api";
import { fetchAllUserNews } from "../../../api/news/news-api";
import { fetchUserPublications } from "../../../api/publications/publications-api";
import { fetchAllGalleryData } from "../../../api/gallery/gallery-api";
import { fetchAllUserEvents } from "../../../api/events/events-api";
import { fetchUserMeetings } from "../../../api/meetings/api-meetings";
import CircleLoader from "../../../components/loaders/CircleLoader";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import GroupChatTab from "./GroupChatTab";
import NewsCard from "../../../components/cards/NewsCard";
import PublicationCard from "../../../components/cards/PublicationCard";
import GalleryCard from "../../../components/cards/GalleryCard";
import EventsCard from "../../../components/cards/EventsCard";
import MeetingCard from "../../../components/cards/MeetingCard";
import profileImage from "../../../assets/images/dummy.jpg";

type Tab = "info" | "members" | "news" | "publications" | "gallery" | "events" | "meetings" | "chat";

const TABS: { key: Tab; label: string }[] = [
  { key: "info", label: "Group Info" },
  { key: "members", label: "Members" },
  { key: "news", label: "News" },
  { key: "publications", label: "Publications" },
  { key: "gallery", label: "Gallery" },
  { key: "events", label: "Events" },
  { key: "meetings", label: "Meetings" },
];

const EmptyState = ({ label }: { label: string }) => <p className="text-gray-400 text-sm py-10 text-center">No {label} for this group yet.</p>;

const GroupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const { data: group, isLoading, isError } = useQuery(["groupDetails", id], () => fetchGroupById(id as string), { enabled: !!id });

  const { data: membersData, isLoading: membersLoading } = useQuery(["groupMembers", id], () => fetchGroupMembers(id as string), { enabled: !!id && activeTab === "members" });

  const { data: newsData } = useQuery("news", fetchAllUserNews);
  const { data: publicationsData } = useQuery("publications", fetchUserPublications);
  const { data: galleryData } = useQuery(["galleryData", 1], () => fetchAllGalleryData(1));
  const { data: eventsData } = useQuery("events", fetchAllUserEvents);
  const { data: meetingsData } = useQuery("meetings", fetchUserMeetings);

  const isGroupItem = (item: any) => item.groupId === id || item.group_id === id;

  const groupNews: any[] = Array.isArray(newsData) ? newsData.filter(isGroupItem) : [];
  const groupPublications: any[] = Array.isArray(publicationsData) ? publicationsData.filter(isGroupItem) : [];
  const groupGallery: any[] = Array.isArray(galleryData) ? galleryData.filter(isGroupItem) : [];
  const groupEvents: any[] = Array.isArray(eventsData) ? eventsData.filter(isGroupItem) : [];
  const groupMeetings: any[] = Array.isArray(meetingsData) ? meetingsData.filter(isGroupItem) : [];

  if (isLoading) return <CircleLoader />;
  if (isError || !group) return <div className="p-6 text-red-500">Failed to load group details.</div>;

  return (
    <main>
      <BreadCrumb title={group.name ?? "Group"} />

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
        {group.hasChat && (
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === "chat" ? "border-org-primary text-org-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Chat
          </button>
        )}
      </div>

      <div className="mt-6 max-w-3xl">
        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="bg-white shadow-sm border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
              {group.description && <p className="text-gray-600 mt-1">{group.description}</p>}
            </div>

            {group.positions && group.positions.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Positions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.positions
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map(pos => (
                      <div key={pos._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img src={pos.imageUrl || profileImage} alt={pos.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{pos.name}</p>
                          <p className="text-org-primary text-xs">{pos.title}</p>
                          {pos.email && <p className="text-gray-400 text-xs truncate">{pos.email}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === "members" &&
          (membersLoading ? (
            <CircleLoader />
          ) : (
            <>
              {Array.isArray(membersData) && membersData.length > 0 ? (
                <ul className="space-y-2">
                  {membersData.map(member => (
                    <li key={member._id} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                      <img src={member.imageUrl || profileImage} alt={member.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{member.name}</p>
                        {member.email && <p className="text-gray-400 text-xs truncate">{member.email}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState label="members" />
              )}
            </>
          ))}

        {/* NEWS TAB */}
        {activeTab === "news" &&
          (groupNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupNews.map(item => (
                <NewsCard key={item._id} newsItem={item} hidePostDetails linkTo="news" />
              ))}
            </div>
          ) : (
            <EmptyState label="news" />
          ))}

        {/* PUBLICATIONS TAB */}
        {activeTab === "publications" &&
          (groupPublications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupPublications.map(item => (
                <PublicationCard key={item._id} publicationItem={item} linkTo="publication" />
              ))}
            </div>
          ) : (
            <EmptyState label="publications" />
          ))}

        {/* GALLERY TAB */}
        {activeTab === "gallery" &&
          (groupGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupGallery.map(item => (
                <GalleryCard key={item._id} galleryItem={item} />
              ))}
            </div>
          ) : (
            <EmptyState label="gallery" />
          ))}

        {/* EVENTS TAB */}
        {activeTab === "events" &&
          (groupEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupEvents.map(item => (
                <EventsCard key={item._id} eventItem={item} />
              ))}
            </div>
          ) : (
            <EmptyState label="events" />
          ))}

        {/* MEETINGS TAB */}
        {activeTab === "meetings" &&
          (groupMeetings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupMeetings.map(item => (
                <MeetingCard key={item._id} meeting={item} />
              ))}
            </div>
          ) : (
            <EmptyState label="meetings" />
          ))}

        {/* CHAT TAB */}
        {activeTab === "chat" && group.hasChat && <GroupChatTab groupId={id as string} groupName={group.name} />}
      </div>
    </main>
  );
};

export default GroupDetailPage;
