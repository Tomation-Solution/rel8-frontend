import ProgressBar from "../../../components/progress-bar/ProgressBar";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchElections } from "../../../api/elections/api-elections";
import apiTenant from "../../../api/baseApi";
import { useEffect, useState } from "react";
import CircleLoader from "../../../components/loaders/CircleLoader";

const ElectionAllVotes = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [positionResults, setPositionResults] = useState({});

  // Fetch all elections data
  const { data: elections, isLoading } = useQuery("elections", fetchElections);

  // Function to fetch results for a specific position
  const fetchPositionResults = async (positionId: any) => {
    try {
      const response = await apiTenant.get(
        `api/elections/results/${positionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching position results:", error);
      return null;
    }
  };

  // Fetch results for all positions when data loads
  useEffect(() => {
    if (elections) {
      const fetchAllPositionResults = async () => {
        const results = {};
        for (const election of elections) {
          for (const position of election.positions) {
            const positionResult = await fetchPositionResults(position._id);
            if (positionResult) {
              results[position._id] = positionResult;
            }
          }
        }
        setPositionResults(results);
      };
      fetchAllPositionResults();
    }
  }, [elections]);

  if (isLoading || Object.keys(positionResults).length === 0) {
    return <CircleLoader />;
  }

  return (
    <main className="grid grid-cols-5 space-x-[50px]">
      <div className="col-span-3">
        <BreadCrumb title="Election Results" />
        <section className="grid">
          {elections?.map((election: any) =>
            election.positions.map((position: any) => {
              const results = positionResults[position._id];
              if (!results) return null;

              return (
                <div
                  key={position._id}
                  className="border p-3 rounded-md border-neutral3 grid grid-cols-3 w-3/4 items-center my-1"
                >
                  <div className="col-span-2">
                    <h4 className="font-semibold mb-2">
                      Position: {position.name}
                    </h4>
                    {results.candidates?.length === 0 ? (
                      <>
                        <span className="block">No Result yet</span>
                      </>
                    ) : (
                      results.candidates?.map((candidate: any) => (
                        <div key={candidate._id} className="mb-2">
                          <p className="text-sm">{candidate.name}</p>
                          <div className="mt-1">
                            <small>
                              {candidate.votePercentage}% of total votes (
                              {candidate.voteCount})
                            </small>
                            <ProgressBar
                              percentCompleted={`${candidate.votePercentage}%`}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="col-span-1">
                    {/* Additional position-wide stats can go here */}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
      <section className="col-span-2 grid">
        <div className="grid grid-cols-2 gap-4">
          {/* Other contestants section can go here */}
        </div>
      </section>
    </main>
  );
};

export default ElectionAllVotes;
