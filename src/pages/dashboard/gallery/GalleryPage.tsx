import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { FiImage } from "react-icons/fi";

import { fetchGalleryPage } from "../../../api/gallery/gallery-api";
import { EmptyState, PageHeader, Pagination, SearchFilterBar, StatCard, StatCardRow } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { galleryImages } from "../content/contentFields";

const FILTERS = [
  { value: "all", label: "All Gallery" },
  { value: "new", label: "Newest first" },
  { value: "old", label: "Oldest first" },
];

/** "19th, June 2026" — the band headers in `Gallery.png`. */
const bandLabel = (value?: string) => {
  if (!value) return "Undated";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Undated";
  const day = d.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix}, ${d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
};

interface Tile {
  key: string;
  /** The gallery item this image belongs to — what the tile links to. */
  itemId: string;
  url: string;
  caption: string;
}

const GalleryPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  // This endpoint pages server-side (`gallery_version2`), unlike the rest of the content API.
  const { data, isLoading, isError } = useQuery(["galleryPage", page], () => fetchGalleryPage(page), { keepPreviousData: true });

  const items = useMemo(() => (Array.isArray(data?.gallery) ? data!.gallery : []), [data]);

  /** One band per calendar day, each holding every image of every item posted that day. */
  const bands = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const byDay = new Map<string, { label: string; when: number; tiles: Tile[] }>();

    const ordered = [...items].sort((a: any, b: any) => {
      const diff = +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0);
      return filter === "old" ? -diff : diff;
    });

    ordered.forEach((item: any) => {
      const id = item._id ?? item.id;
      const day = new Date(item.createdAt ?? 0).toDateString();

      const tiles = galleryImages(item)
        .map((image, index) => ({ key: `${id}-${index}`, itemId: String(id), url: image.url, caption: image.caption || item.caption || `Photo ${index + 1}` }))
        .filter(tile => !needle || `${tile.caption} ${bandLabel(item.createdAt)}`.toLowerCase().includes(needle));

      if (tiles.length === 0) return;

      const existing = byDay.get(day);
      if (existing) existing.tiles.push(...tiles);
      else byDay.set(day, { label: bandLabel(item.createdAt), when: +new Date(item.createdAt ?? 0), tiles });
    });

    const list = [...byDay.values()];
    list.sort((a, b) => (filter === "old" ? a.when - b.when : b.when - a.when));
    return list;
  }, [items, search, filter]);

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.limit || 10)));

  return (
    <>
      <PageHeader title="Welcome To Gallery" subtitle="See the memories here..." />

      <StatCardRow className="lg:grid-cols-3">
        <StatCard title="All Gallery" value={isLoading ? "..." : (data?.total ?? items.length)} icon={FiImage} />
      </StatCardRow>

      <SearchFilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search Gallery by name, date" filter={filter} onFilterChange={setFilter} filterOptions={FILTERS} className="mb-6" />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : isError ? (
        <EmptyState icon={FiImage} title="Couldn't load the gallery" description="Something went wrong reaching the server. Try again in a moment." />
      ) : bands.length === 0 ? (
        <EmptyState icon={FiImage} title={items.length === 0 ? "Nothing here yet" : "Nothing matches that"} description={items.length === 0 ? "Photos your association shares will show up here." : "Try a different search."} />
      ) : (
        <>
          <div className="flex flex-col gap-8">
            {bands.map(band => (
              <section key={band.label}>
                <h3 className="bg-org-tint rounded-lg px-5 py-3 text-[15px] font-medium text-ink mb-5">{band.label}</h3>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {band.tiles.map(tile => (
                    <button key={tile.key} type="button" onClick={() => navigate(`/gallery/${tile.itemId}`)} className="text-left rounded-xl overflow-hidden border border-hairline hover:border-org-primary/40 transition-colors">
                      <img src={tile.url} alt={tile.caption} className="w-full h-28 object-cover" />
                      <span className="block bg-org-tint px-3 py-2 text-sm text-org-primary text-center truncate">{tile.caption}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default GalleryPage;
