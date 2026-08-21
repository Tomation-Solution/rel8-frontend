import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { FiBarChart2, FiCalendar, FiPieChart } from "react-icons/fi";

import { fetchElections, fetchPositions, fetchElectionStatsForMembers } from "../../../api/elections/api-elections";
import { Button, EmptyState, PageHeader, Pagination, SearchFilterBar, StatCard, StatCardRow, StatusPill, Table, TableColumn, Tabs, TabItem } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { formatDate } from "../../../utils/dates";

const PER_PAGE = 12;

const TABS: TabItem[] = [
  { key: "elections", label: "Elections" },
  { key: "positions", label: "Positions" },
];

const ELECTION_FILTERS = [
  { value: "all", label: "All Elections" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Ended", label: "Ended" },
];

/**
 * `getElectionStatus()` on the backend returns exactly these three, and it accounts for
 * `closedAt` — an admin closing an election early. Do **not** recompute the window in the
 * browser: this page used to build `new Date(\`${startDate}T${startTime}:00\`)`, which
 * resolves the election's wall-clock time against the *viewer's* timezone. That is the
 * same bug BE-6 fixed server-side and MP-5 removed from the detail page.
 */
const STATUS_TONE: Record<string, "brand" | "success" | "past"> = {
  Upcoming: "brand",
  Ongoing: "success",
  Ended: "past",
};

const ElectionsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("elections");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const elections = useQuery("elections", fetchElections, { staleTime: 2 * 60 * 1000 });
  const positions = useQuery("positions", fetchPositions, { staleTime: 5 * 60 * 1000 });
  const stats = useQuery("electionStats", fetchElectionStatsForMembers, { staleTime: 5 * 60 * 1000 });

  const electionRows = useMemo(() => {
    const rows = Array.isArray(elections.data) ? [...elections.data].reverse() : [];
    const needle = search.trim().toLowerCase();
    return rows.filter((item: any) => {
      if (filter !== "all" && item.status !== filter) return false;
      if (!needle) return true;
      return `${item.theme ?? ""} ${item.description ?? ""}`.toLowerCase().includes(needle);
    });
  }, [elections.data, search, filter]);

  const positionRows = useMemo(() => {
    const rows = Array.isArray(positions.data) ? positions.data : [];
    const needle = search.trim().toLowerCase();
    return rows.filter((item: any) => !needle || `${item.name ?? ""} ${item.currentHolder?.name ?? ""}`.toLowerCase().includes(needle));
  }, [positions.data, search]);

  const rows = tab === "elections" ? electionRows : positionRows;
  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = rows.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const statValues = stats.data?.stats ?? {};

  const electionColumns: TableColumn<any>[] = [
    { key: "theme", label: "Theme", render: item => <span className="font-medium">{item.theme || "Untitled election"}</span> },
    { key: "status", label: "Status", render: item => <StatusPill label={item.status} tone={STATUS_TONE[item.status] ?? "neutral"} /> },
    {
      key: "duration",
      label: "Duration",
      render: item => (item.startDate && item.endDate ? `${formatDate(item.startDate)} – ${formatDate(item.endDate)}` : "—"),
    },
    { key: "positions", label: "Positions", align: "center", render: item => item.positionIds?.length ?? 0 },
    { key: "turnout", label: "Turnout", align: "center", render: item => `${item.stats?.turnout ?? 0}%` },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: item => {
        const id = item._id ?? item.id;
        // Ongoing -> vote. Ended -> results. Upcoming -> nothing to do yet. Whether this
        // member has already voted is per-position and only known on the detail page, so
        // "Voted Already" is decided there rather than guessed from the list.
        if (item.status === "Ongoing") {
          return (
            <Button size="sm" onClick={() => navigate(`/election/${id}`)}>
              Click To Vote
            </Button>
          );
        }
        if (item.status === "Ended") {
          return (
            <Button size="sm" variant="outline" onClick={() => navigate(`/election/${id}`)}>
              View Result
            </Button>
          );
        }
        return (
          <Button size="sm" variant="muted" disabled>
            Not Yet Open
          </Button>
        );
      },
    },
  ];

  /**
   * `Position.png` also draws "Date Started", "Time Spent" and "Past Holder". The Position
   * model is `{ name, orgId, currentHolder }` plus timestamps — none of those three exist,
   * and there is no position-history collection to derive them from. Omitted per §5.
   */
  const positionColumns: TableColumn<any>[] = [
    { key: "name", label: "Position", render: item => <span className="font-medium">{item.name}</span> },
    { key: "currentHolder", label: "Current Holder", render: item => item.currentHolder?.name || "Vacant" },
    { key: "createdAt", label: "Date Created", render: item => formatDate(item.createdAt) },
  ];

  const isLoading = tab === "elections" ? elections.isLoading : positions.isLoading;

  return (
    <>
      <PageHeader title="Elections" subtitle="Here's how things are going for you." />

      <StatCardRow>
        <StatCard title="Total Elections Held" value={stats.isLoading ? "..." : (statValues.totalElectionsHeld ?? 0)} icon={FiBarChart2} />
        <StatCard title="Upcoming Elections" value={stats.isLoading ? "..." : (statValues.upcomingElections ?? 0)} icon={FiCalendar} />
        <StatCard title="Average Turn-out" value={stats.isLoading ? "..." : `${statValues.averageTurnout ?? 0}%`} icon={FiPieChart} />
      </StatCardRow>

      <Tabs
        tabs={TABS}
        active={tab}
        onChange={key => {
          setTab(key);
          setSearch("");
          setPage(1);
        }}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={value => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder={tab === "elections" ? "Search election by theme" : "Search position by name"}
        filter={tab === "elections" ? filter : undefined}
        onFilterChange={
          tab === "elections"
            ? value => {
                setFilter(value);
                setPage(1);
              }
            : undefined
        }
        filterOptions={tab === "elections" ? ELECTION_FILTERS : undefined}
        className="mb-6"
      />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : (
        <>
          <Table
            columns={tab === "elections" ? electionColumns : positionColumns}
            rows={visible}
            rowKey={item => item._id ?? item.id}
            empty={<EmptyState icon={FiBarChart2} title={tab === "elections" ? "No elections" : "No positions"} description={tab === "elections" ? "Elections your association runs will appear here." : "No positions have been defined yet."} />}
          />
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default ElectionsPage;
