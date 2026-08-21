import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { FiBookOpen, FiUser, FiMessageSquare, FiThumbsUp } from "react-icons/fi";

import { fetchUserPublications } from "../../../api/publications/publications-api";
import { EmptyState, MediaCardGrid, PageHeader, Pagination, SearchFilterBar, StatCard, StatCardRow } from "../../../components/ui";
import MediaCard from "../../../components/ui/MediaCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { commentCount, contentAuthor, contentBanner, likeCount, publicationBody, publicationTitle } from "../content/contentFields";
import { formatCardDateTime, isPast } from "../../../utils/dates";
import { unformatText } from "../../../utils/strings";

const PER_PAGE = 9;

const FILTERS = [
  { value: "all", label: "All Publications" },
  { value: "new", label: "Newest first" },
  { value: "old", label: "Oldest first" },
];

const isRecent = (item: any) => !isPast(new Date(new Date(item?.createdAt ?? 0).getTime() + 30 * 24 * 60 * 60 * 1000));

const PublicationsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isError, isLoading } = useQuery("publications", fetchUserPublications, { staleTime: 5 * 60 * 1000 });

  const publications = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const rows = publications.filter((item: any) => !needle || `${publicationTitle(item)} ${unformatText(publicationBody(item))}`.toLowerCase().includes(needle));
    if (filter === "old") return [...rows].sort((a, b) => +new Date(a.createdAt ?? 0) - +new Date(b.createdAt ?? 0));
    if (filter === "new") return [...rows].sort((a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0));
    return rows;
  }, [publications, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <PageHeader title="Welcome To Publications" subtitle="See the details of the latest publications here..." />

      <StatCardRow className="lg:grid-cols-3">
        <StatCard title="All Publications" value={isLoading ? "..." : publications.length} icon={FiBookOpen} />
      </StatCardRow>

      <SearchFilterBar
        search={search}
        onSearchChange={resetPage(setSearch)}
        searchPlaceholder="Search Publication by name"
        filter={filter}
        onFilterChange={resetPage(setFilter)}
        filterOptions={FILTERS}
        className="mb-6"
      />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : isError ? (
        <EmptyState icon={FiBookOpen} title="Couldn't load publications" description="Something went wrong reaching the server. Try again in a moment." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiBookOpen}
          title={publications.length === 0 ? "No publications yet" : "Nothing matches that"}
          description={publications.length === 0 ? "Publications your association shares will show up here." : "Try a different search."}
        />
      ) : (
        <>
          <MediaCardGrid>
            {visible.map((item: any) => {
              const id = item._id ?? item.id;
              return (
                <MediaCard
                  key={id}
                  image={contentBanner(item)}
                  title={publicationTitle(item)}
                  meta={formatCardDateTime(item.createdAt)}
                  excerpt={unformatText(publicationBody(item))}
                  badge={isRecent(item) ? "New" : undefined}
                  badgeTone="brand"
                  onClick={() => navigate(`/publication/${id}/`)}
                  actions={<span className="text-sm font-medium text-org-primary underline self-start">Read more...</span>}
                  footer={
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-hairline text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <FiUser className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Autor: {contentAuthor(item)}</span>
                      </span>
                      <span className="inline-flex items-center gap-3 flex-shrink-0">
                        <span className="inline-flex items-center gap-1">
                          <FiMessageSquare className="w-4 h-4" />
                          {commentCount(item)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiThumbsUp className="w-4 h-4" />
                          {likeCount(item)}
                        </span>
                      </span>
                    </div>
                  }
                />
              );
            })}
          </MediaCardGrid>

          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default PublicationsPage;
