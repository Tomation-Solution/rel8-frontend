import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiChevronRight } from "react-icons/fi";
import { fetchElections, fetchPositions, fetchElectionStatsForMembers } from "../../../api/elections/api-elections";
import StatCard from "../../../components/cards/StatCard";
import { DataTable } from "../../../components/Table/DataTable";
import PageHeading from "../../../components/PageHeading";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";

// Define types based on rel8-frontend
interface Election {
  id: number;
  name: string;
  role_name: string;
  role_detail: string;
  is_close: boolean;
  election_startDate: string | null;
  election_endDate: string | null;
  election_endTime: string | null;
  election_startTime: string | null;
  positionIds?: string[];
}

interface Position {
  id: string;
  name: string;
  currentHolder?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const filterOptions = [
  { value: "all", label: "All elections" },
  { value: "upcoming", label: "Upcoming elections" },
  { value: "completed", label: "Completed elections" },
];

const ElectionsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("elections");
  const navigate = useNavigate();

  const { notifyUser } = Toast();

  const { data: electionsData, isLoading: electionsLoading, isError: electionsError } = useQuery('elections', fetchElections);
  const { data: positionsData, isLoading: positionsLoading, isError: positionsError } = useQuery('positions', fetchPositions);
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery('electionStats', fetchElectionStatsForMembers);

  const isLoading = electionsLoading || positionsLoading || statsLoading;
  const isError = electionsError || positionsError || statsError;

  // Map backend data to display format
  const elections: Election[] = electionsData?.map((item: any) => ({
    id: item._id,
    name: item.theme,
    role_name: item.theme,
    role_detail: item.description || '',
    is_close: item.status === 'Ended',
    election_startDate: item.startDate,
    election_endDate: item.endDate,
    election_endTime: item.endTime,
    election_startTime: item.startTime,
    positionIds: item.positionIds,
  })) || [];

  // Map positions data
  const positions: Position[] = positionsData?.map((item: any) => ({
    id: item._id,
    name: item.name,
    currentHolder: item.currentHolder,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  })) || [];

  // Filter elections based on selected filter
  const filteredElections = React.useMemo(() => {
    if (selectedFilter === "upcoming") {
      return elections.filter((election) => !election.is_close);
    } else if (selectedFilter === "completed") {
      return elections.filter((election) => election.is_close);
    }
    return elections;
  }, [elections, selectedFilter]);

  const tabsData = [
    { value: "elections", label: "Elections" },
    { value: "positions", label: "Positions" },
  ];

  // Define columns for DataTable
  const electionsColumns = [
    { key: "name", label: "Theme" },
    {
      key: "status",
      label: "Status",
      render: (item: Election) => {
        const status = item.is_close ? "Completed" : "Upcoming";
        const bgColor = item.is_close ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
            {status}
          </span>
        );
      }
    },
    {
      key: "duration",
      label: "Duration",
      render: (item: Election) => {
        if (item.election_startDate && item.election_endDate) {
          return `${new Date(item.election_startDate).toLocaleDateString()} - ${new Date(item.election_endDate).toLocaleDateString()}`;
        }
        return "N/A";
      }
    },
    {
      key: "positions",
      label: "Positions",
      render: (item: Election) => item.positionIds?.length || 0
    },
    {
      key: "turnout",
      label: "Turnout",
      render: (item: Election) => "0%" // Placeholder - would need to calculate actual turnout
    },
  ];

  const positionsColumns = [
    { key: "name", label: "Position" },
    {
      key: "currentHolder",
      label: "Current Holder",
      render: (item: Position) => item.currentHolder?.name || "Vacant"
    },
    {
      key: "createdAt",
      label: "Date Started",
      render: (item: Position) => new Date(item.createdAt).toLocaleDateString()
    },
    {
      key: "timeSpent",
      label: "Time Spent",
      render: (item: Position) => {
        const created = new Date(item.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
      }
    },
    {
      key: "pastHolders",
      label: "Past Holders",
      render: (item: Position) => "0" // Placeholder - would need historical data
    },
  ];

    if (isLoading) {
    return <CircleLoader />;
  }

  if (isError) {
    notifyUser('Sorry, an error occurred when fetching data', 'error');
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <PageHeading>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Elections</h1>
          <p className="text-sm text-gray-500 mt-1">Here's how things are going for you.</p>
        </div>
      </PageHeading>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Elections Held" value={statsData?.stats?.totalElectionsHeld || 0} />
        <StatCard title="Upcoming Elections" value={statsData?.stats?.upcomingElections || 0} />
        <StatCard title="Average Turnout" value={`${statsData?.stats?.averageTurnout || 0}%`} />
        <StatCard title="Total Positions" value={statsData?.stats?.totalPositions || 0} />
        <StatCard title="Vacant Positions" value={statsData?.stats?.vacantPositions || 0} />
      </div>

      <div>
        {/* Tabs */}
        <div className="bg-white inline-flex border-b border-gray-200 gap-1 w-full">
          {tabsData.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-12 py-4 rounded-t-md font-medium text-sm bg-transparent border-gray-200  transition-colors ${
                activeTab === tab.value
                  ? "bg-org-secondary/40 text-gray-700 border-b-2 border-org-secondary font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-2">
          {activeTab === "elections" && (
            <DataTable
              title={`Elections (${filteredElections.length})`}
              columns={electionsColumns}
              data={filteredElections}
              filterOptions={filterOptions}
              onFilterSelect={setSelectedFilter}
              onRowClick={(item) => navigate(`/election/${item.id}`)}
              onEdit={(item) => navigate(`/election/${item.id}`)}
              showActions={true}
              emptyMessage="No elections available"
              getItemName={(item) => item.name}
            />
          )}

          {activeTab === "positions" && (
            <DataTable
              title={`Positions (${positions.length})`}
              columns={positionsColumns}
              data={positions}
              showActions={true}
              emptyMessage="No positions available"
              getItemName={(item) => item.name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionsPage;
