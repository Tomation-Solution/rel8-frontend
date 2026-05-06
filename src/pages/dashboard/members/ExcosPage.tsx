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
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { useNavigate } from "react-router-dom";

type Tab = "members" | "news" | "publications" | "gallery";

const TABS: { key: Tab; label: string }[] = [
  { key: "members", label: "Meet the Excos" },
  { key: "news", label: "News" },
  { key: "publications", label: "Publications" },
  { key: "gallery", label: "Gallery" },
];

const EmptyState = ({ label }: { label: string }) => <p className="text-gray-400 text-sm py-10 text-center">No {label} for the Excos yet.</p>;

const ExcosPage = () => {
  const { data, isLoading, isError } = useQuery("excos", fetchAllExcos);
  const { data: newsData } = useQuery("news", fetchAllUserNews);
  const { data: publicationsData } = useQuery("publications", fetchUserPublications);
  const { data: galleryData } = useQuery(["galleryData", 1], () => fetchAllGalleryData(1));

  const [activeTab, setActiveTab] = useState<Tab>("members");
  const [currentPage, setCurrentPage] = useState(1);
  const { notifyUser } = Toast();
  const navigate = useNavigate();

  const isExcoItem = (item: any) => item.audience === "exco";

  const excoNews: any[] = Array.isArray(newsData) ? newsData.filter(isExcoItem) : [];
  const excoPublications: any[] = Array.isArray(publicationsData) ? publicationsData.filter(isExcoItem) : [];
  const excoGallery: any[] = Array.isArray(galleryData) ? galleryData.filter(isExcoItem) : [];

  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data && Array.isArray(data) ? data.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil((data && Array.isArray(data) ? data.length : 0) / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
        {/* MEMBERS TAB */}
        {activeTab === "members" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 flex-1">
              {currentItems?.map((item: ExcoMemberDataType, index: number) => (
                <ExcosMemberCard
                  key={index}
                  item={item}
                  onClick={() => {
                    const excoId = (item as any)?._id || (item as any)?.id;
                    if (excoId) navigate(`/excos/${excoId}`);
                  }}
                />
              ))}
            </div>

            {!isLoading && (!data || (Array.isArray(data) && data.length === 0)) && (
              <div className="text-center py-8">
                <h3 className="text-org-primary-blue text-xl">No Excos Available</h3>
                <p className="text-gray-500 mt-2">Excos will be listed here when available.</p>
              </div>
            )}

            {pageNumbers.length > 0 && (
              <ul className="flex space-x-2 items-center justify-center my-2">
                {pageNumbers?.map((number, index) => (
                  <li key={index}>
                    <button className={`${currentPage === number ? "bg-org-primary text-white" : "bg-neutral-3"} px-3 py-2 rounded-sm focus:outline-none`} onClick={() => setCurrentPage(number)}>
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
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
      </div>
    </main>
  );
};

export default ExcosPage;
