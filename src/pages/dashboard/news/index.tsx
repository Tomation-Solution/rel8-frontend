import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { FiUser, FiMessageSquare, FiThumbsUp } from "react-icons/fi";

import { fetchAllUserNews } from "../../../api/news/news-api";
import { EmptyState, MediaCardGrid, PageHeader, Pagination, SearchFilterBar, StatCard, StatCardRow } from "../../../components/ui";
import MediaCard from "../../../components/ui/MediaCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { commentCount, contentAuthor, contentBanner, likeCount, newsBody, newsTitle } from "../content/contentFields";
import { formatCardDateTime, isPast } from "../../../utils/dates";
import { htmlToText } from "../../../utils/html";

const PER_PAGE = 9;

const FILTERS = [
  { value: "all", label: "All News" },
  { value: "new", label: "Newest first" },
  { value: "old", label: "Oldest first" },
];

/** Anything published in the last 30 days wears the "New" corner badge. */
const isRecent = (item: any) => !isPast(new Date(new Date(item?.createdAt ?? 0).getTime() + 30 * 24 * 60 * 60 * 1000));

const NewsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isError, isLoading } = useQuery("news", fetchAllUserNews, { staleTime: 5 * 60 * 1000 });

  const news = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const rows = news.filter((item: any) => !needle || `${newsTitle(item)} ${htmlToText(newsBody(item))}`.toLowerCase().includes(needle));
    if (filter === "old") return [...rows].sort((a, b) => +new Date(a.createdAt ?? 0) - +new Date(b.createdAt ?? 0));
    if (filter === "new") return [...rows].sort((a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0));
    return rows;
  }, [news, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <PageHeader title="Welcome To News" subtitle="See the details of Latest News here..." />

      <StatCardRow className="lg:grid-cols-3">
        <StatCard title="All News" value={isLoading ? "..." : news.length} icon={HiOutlineNewspaper} />
      </StatCardRow>

      <SearchFilterBar search={search} onSearchChange={resetPage(setSearch)} searchPlaceholder="Search News by name" filter={filter} onFilterChange={resetPage(setFilter)} filterOptions={FILTERS} className="mb-6" />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : isError ? (
        <EmptyState icon={HiOutlineNewspaper} title="Couldn't load news" description="Something went wrong reaching the server. Try again in a moment." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={HiOutlineNewspaper} title={news.length === 0 ? "No news yet" : "Nothing matches that"} description={news.length === 0 ? "News your association publishes will show up here." : "Try a different search."} />
      ) : (
        <>
          <MediaCardGrid>
            {visible.map((item: any) => {
              const id = item._id ?? item.id;
              return (
                <MediaCard
                  key={id}
                  image={contentBanner(item)}
                  title={newsTitle(item)}
                  meta={formatCardDateTime(item.createdAt)}
                  excerpt={htmlToText(newsBody(item))}
                  badge={isRecent(item) ? "New" : undefined}
                  badgeTone="brand"
                  onClick={() => navigate(`/news/${id}/`)}
                  actions={
                    <span className="text-sm font-medium text-org-primary underline self-start">Read more...</span>
                  }
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

export default NewsPage;
