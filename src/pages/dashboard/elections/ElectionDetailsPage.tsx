import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllUserDues } from "../../../api/dues/api-dues";
import {
  castVote,
  fetchElectionDetails,
} from "../../../api/elections/api-elections";
import StatCard from "../../../components/cards/StatCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";

interface Position {
  id: string;
  name: string;
  totalVotes: number;
  candidates: Candidate[];
}

interface Candidate {
  id: string;
  name: string;
  votes: number;
  percentage: string;
  manifesto?: string;
  manifestoType?: string;
  fileUrl?: string;
  hasUserVoted?: boolean;
  voters?: any[];
}

interface PositionItemProps {
  position: Position;
  isSelected: boolean;
  onClick: () => void;
}

interface CandidateChoiceCardProps {
  candidate: Candidate;
  onViewManifesto: (candidate: Candidate) => void;
  onVote: (candidateId: string) => void;
  votingState: "idle" | "voting" | "voted" | "error";
  hasVotedInPosition: boolean;
  hasUserVotedForCandidate: boolean;
}

const PositionItem: React.FC<PositionItemProps> = ({
  position,
  isSelected,
  onClick,
}) => (
  <div
    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
      isSelected ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50"
    } border`}
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-gray-800">{position.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Candidates: {position.candidates.length}
        </p>
      </div>
      <div className="text-blue-700">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    </div>
  </div>
);

const CandidateChoiceCard: React.FC<CandidateChoiceCardProps> = ({
  candidate,
  onViewManifesto,
  onVote,
  votingState,
  hasVotedInPosition,
  hasUserVotedForCandidate,
}) => {
  const hasVoted = hasUserVotedForCandidate || votingState === "voted";

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">{candidate.name}</h4>
        <button
          className="text-sm font-semibold text-org-primary hover:text-blue-800 underline"
          onClick={() => onViewManifesto(candidate)}
        >
          Read Manifesto
        </button>
      </div>

      <div className="flex items-center">
        {hasVoted ? (
          <button className="px-4 py-2 flex items-center gap-2 text-sm rounded bg-green-700 text-white cursor-not-allowed">
            <FiCheck size={18} /> <span>Voted</span>
          </button>
        ) : (
          <button
            onClick={() => onVote(candidate.id)}
            disabled={hasVotedInPosition || votingState === "voting"}
            className={`px-4 py-2 text-sm rounded text-white ${
              hasVotedInPosition || votingState === "voting"
                ? "bg-gray-400 cursor-not-allowed"
                : votingState === "error"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-org-primary hover:bg-org-primary/80"
            }`}
          >
            {votingState === "voting"
              ? "Voting..."
              : votingState === "error"
                ? "Try Again"
                : `Vote ${candidate.name}`}
          </button>
        )}
      </div>
    </div>
  );
};

const ManifestoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
}> = ({ isOpen, onClose, candidate }) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {candidate.name}'s Manifesto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {candidate.manifestoType === "text" ? (
            <div className="bg-gray-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
              {candidate.manifesto || "No manifesto content available."}
            </div>
          ) : candidate.fileUrl ? (
            <div className="h-96">
              <iframe
                src={candidate.fileUrl}
                width="100%"
                height="100%"
                className="border-none rounded-md"
                title={`${candidate.name}'s Manifesto`}
              />
            </div>
          ) : (
            <p className="text-gray-500">No manifesto file available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const DuesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onGoToDues: () => void;
}> = ({ isOpen, onClose, onGoToDues }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-xl border-l-[4px] border-org-secondary w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Not Eligible to Vote</h2>
          <p className="text-gray-600 mb-6">
            You have dues from your organization that haven't been confirmed
            yet. You cannot vote during this election period until all your dues
            are confirmed. Head over to the dues section to check the status of
            your payments.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onGoToDues}
              className="px-4 py-2 bg-org-primary text-white rounded hover:bg-org-primary/80"
            >
              Go to Dues
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ElectionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [electionData, setElectionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [duesModalOpen, setDuesModalOpen] = useState(false);
  const [votingStates, setVotingStates] = useState<{
    [candidateId: string]: "idle" | "voting" | "voted" | "error";
  }>({});
  const [votedCandidates, setVotedCandidates] = useState<Set<string>>(
    new Set(),
  );
  const [hasOutstandingDues, setHasOutstandingDues] = useState(false);
  const [activeTab, setActiveTab] = useState("positions");
  const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(
    new Set(),
  );

  const { notifyUser } = Toast();

  const tabsData = [
    { value: "positions", label: "Positions" },
    { value: "results", label: "Results" },
  ];

  const isElectionOngoing = () => {
    if (!electionData) return true;
    const now = new Date();
    const endDateTime = new Date(electionData.endDate);
    if (electionData.endTime) {
      const [hours, minutes] = electionData.endTime.split(":");
      endDateTime.setHours(parseInt(hours), parseInt(minutes));
    }
    return now < endDateTime;
  };

  const handleViewManifesto = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const handleGoToDues = () => {
    setDuesModalOpen(false);
    navigate("/dues"); // Navigate to dues page
  };

  const checkOutstandingDues = async () => {
    try {
      const duesData = await fetchAllUserDues();
      // Check if there are any unconfirmed dues (confirmationStatus !== 'approved')
      const hasUnconfirmedDues =
        duesData?.some((due: any) => due.confirmed === false) || false;
      console.log(duesData, hasUnconfirmedDues);
      setHasOutstandingDues(hasUnconfirmedDues);
      return hasUnconfirmedDues;
    } catch (error) {
      console.error("Failed to check dues:", error);
      return false;
    }
  };

  const handleVote = async (candidateId: string) => {
    if (votedCandidates.has(candidateId)) return;

    // Check for outstanding dues first
    const hasDues = await checkOutstandingDues();
    if (hasDues) {
      setDuesModalOpen(true);
      return;
    }

    setVotingStates((prev) => ({ ...prev, [candidateId]: "voting" }));

    try {
      await castVote(candidateId);
      setVotedCandidates((prev) => new Set([...prev, candidateId]));
      setVotingStates((prev) => ({ ...prev, [candidateId]: "voted" }));
      notifyUser("Vote cast successfully!", "success");

      // Refresh election data to show updated vote counts
      const data = await fetchElectionDetails(id!);
      setElectionData(data);
    } catch (error: any) {
      setVotingStates((prev) => ({ ...prev, [candidateId]: "error" }));
      notifyUser(
        error.response?.data?.message || "Failed to cast vote",
        "error",
      );
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await fetchElectionDetails(id);
        setElectionData(data);

        // Initialize voted candidates based on API response
        const userVotedCandidates = new Set<string>();
        data.positions.forEach((position: any) => {
          position.candidates.forEach((candidate: any) => {
            if (candidate.hasUserVoted) {
              userVotedCandidates.add(candidate.id);
            }
          });
        });
        setVotedCandidates(userVotedCandidates);

        if (
          data.positions.length > 0 &&
          selectedPosition >= data.positions.length
        ) {
          setSelectedPosition(0);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch election details");
        notifyUser("Failed to fetch election details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, selectedPosition]);

  if (loading) {
    return <CircleLoader />;
  }

  if (error || !electionData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Election not found"}</p>
      </div>
    );
  }

  const currentPosition = electionData.positions[selectedPosition];
  const positionTotalVotes = currentPosition?.totalVotes;
  const positionEligibleVoters = Math.floor(
    electionData.stats.eligibleVoters / electionData.positions.length,
  );
  const positionTurnout =
    positionEligibleVoters > 0
      ? ((positionTotalVotes / positionEligibleVoters) * 100).toFixed(0)
      : "0";

  // Check if user has voted in current position
  const hasVotedInCurrentPosition =
    currentPosition?.candidates?.some((candidate) =>
      votedCandidates.has(candidate.id),
    ) || false;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Title and Actions */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {electionData.theme}
            </h1>
            <p className="text-sm text-gray-500">
              {new Date(electionData.startDate).toLocaleDateString()} -{" "}
              {new Date(electionData.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white inline-flex border-b border-gray-200 gap-1 w-full mb-6">
          {tabsData.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-12 py-4 rounded-t-md font-medium text-sm bg-transparent border-gray-200 transition-colors ${
                activeTab === tab.value
                  ? "bg-org-secondary/40 text-gray-700 border-b-2 border-org-secondary font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Votes Cast"
            value={electionData.stats.totalVotes}
          />
          <StatCard
            title="Voter Turnout"
            value={`${electionData.stats.voterTurnout}%`}
          />
          <StatCard
            title="Positions"
            value={electionData.stats.totalPositions}
          />
        </div>

        {/* Tab Content */}
        {activeTab === "positions" && (
          <>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Positions List */}
              <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-org-primary">
                <div className="p-5 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-700">Positions</h4>
                </div>
                <div className="p-4 space-y-3">
                  {electionData.positions.length > 0 ? (
                    electionData.positions.map(
                      (position: any, index: number) => (
                        <PositionItem
                          key={position.id}
                          position={position}
                          isSelected={selectedPosition === index}
                          onClick={() => setSelectedPosition(index)}
                        />
                      ),
                    )
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>No positions available for this election.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Position Results */}
              <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-org-primary">
                <div className="p-5 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-700">
                    {currentPosition?.name} Results
                  </h4>
                </div>

                {/* Position Stats */}
                <div className="grid grid-cols-2 gap-4 p-4">
                  <StatCard
                    title="Total Votes Cast"
                    value={positionTotalVotes}
                  />
                  <StatCard
                    title="Voter Turnout"
                    value={`${positionTurnout}%`}
                  />
                </div>

                {/* Candidates Results */}
                <div className="p-4">
                  {currentPosition?.candidates &&
                  currentPosition.candidates.length > 0 ? (
                    currentPosition.candidates.map((candidate: any) => (
                      <CandidateChoiceCard
                        key={candidate.id}
                        candidate={candidate}
                        onViewManifesto={handleViewManifesto}
                        onVote={handleVote}
                        votingState={votingStates[candidate.id] || "idle"}
                        hasVotedInPosition={hasVotedInCurrentPosition}
                        hasUserVotedForCandidate={
                          candidate.hasUserVoted || false
                        }
                      />
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>
                        No candidates or votes recorded for this position yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "results" && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {isElectionOngoing() ? (
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Elections are Ongoing
                </h3>
                <p className="text-gray-600">
                  The election results will be available once the voting period
                  ends on {new Date(electionData.endDate).toLocaleDateString()}{" "}
                  {electionData.endTime && `at ${electionData.endTime}`}.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Election Results
                </h3>

                {/* Position Results */}
                <div className="space-y-6">
                  {electionData.positions.map(
                    (position: any, index: number) => (
                      <div
                        key={position.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          {position.name}
                        </h4>

                        <div className="space-y-3">
                          {position.candidates
                            .sort((a: any, b: any) => b.votes - a.votes)
                            .map((candidate: any, candidateIndex: number) => (
                              <>
                                <div
                                  key={candidate.id}
                                  onClick={() => {
                                    setExpandedCandidates((prev) => {
                                      const newSet = new Set(prev);
                                      if (newSet.has(candidate.id)) {
                                        newSet.delete(candidate.id);
                                      } else {
                                        newSet.add(candidate.id);
                                      }
                                      return newSet;
                                    });
                                  }}
                                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg ${
                                    candidateIndex === 0
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        candidateIndex === 0
                                          ? "bg-green-500 text-white"
                                          : "bg-gray-400 text-white"
                                      }`}
                                    >
                                      {candidateIndex + 1}
                                    </div>
                                    <span className="font-medium text-gray-800">
                                      {candidate.name}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-gray-800">
                                      {candidate.votes} votes
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {candidate.percentage}%
                                    </div>
                                  </div>
                                </div>
                                {expandedCandidates.has(candidate.id) && (
                                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                    {candidate.voters &&
                                    candidate.voters.length > 0 ? (
                                      <div className="space-y-2">
                                        {(candidate.voters || [])
                                          .sort(
                                            (a: any, b: any) =>
                                              new Date(b.votedAt).getTime() -
                                              new Date(a.votedAt).getTime(),
                                          )
                                          .map(
                                            (
                                              voter: any,
                                              voterIndex: number,
                                            ) => (
                                              <div
                                                key={voterIndex}
                                                className="flex items-center justify-between text-sm bg-white px-3 py-2 rounded border"
                                              >
                                                <div>
                                                  <span className="font-medium text-gray-800">
                                                    {voter.name}
                                                  </span>
                                                  {/* <span className="text-gray-500 ml-2">
                                                    → {candidate.name}
                                                  </span> */}
                                                </div>
                                                {/* <span className="text-gray-500 text-xs">
                                                  {new Date(
                                                    voter.votedAt,
                                                  ).toLocaleDateString()}{" "}
                                                  {new Date(
                                                    voter.votedAt,
                                                  ).toLocaleTimeString()}
                                                </span> */}
                                              </div>
                                            ),
                                          )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 italic text-center">
                                        No voters recorded for this candidate
                                      </p>
                                    )}
                                  </div>
                                )}
                              </>
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <ManifestoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          candidate={selectedCandidate}
        />

        <DuesModal
          isOpen={duesModalOpen}
          onClose={() => setDuesModalOpen(false)}
          onGoToDues={handleGoToDues}
        />
      </div>
    </div>
  );
};

export default ElectionDetailsPage;
