// import BreadCrumb from "../../../components/BreadCrumb";
import SeeAll from "../../../components/SeeAll";
import { useParams } from "react-router-dom";
import profileImage from "../../../assets/images/avatar-1.jpg";
import ProgressBar from "../../../components/progress-bar/ProgressBar";
import ElectionContestantCard from "../../../components/cards/ElectionContestantCard";
// import avatarImg1 from "../../../assets/images/avatar-1.jpg";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import apiTenant from "../../../api/baseApi";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader";
import { CiUser } from "react-icons/ci";
import { fetchElectionContestants } from "../../../api/elections/api-elections";
import { useQuery } from "react-query";
import CircleLoader from "../../../components/loaders/CircleLoader";

type Candidate = {
  _id: string;
  name: string;
  bio: string;
  imageUrl?: string;
  manifesto?: string;
  // Add other properties as needed
};

const ElectionContestantDetailPage = () => {
  const { id, election_id } = useParams();
  const token = localStorage.getItem("token");
  const { data, isLoading, refetch } = useQuery(
    ["electionContestants", election_id],
    () => fetchElectionContestants(election_id),
    {
      enabled: !!id,
    }
  );

  console.log(election_id, "ElectionId");

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchElectionCandidate = async () => {
    try {
      const response = await apiTenant.get(`api/elections/candidate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        setLoading(false);
        console.log(response?.data, "Election Response");
        setCandidate(response?.data);
      }
    } catch (error) {
      console.log(error, "Election Candidate Error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectionCandidate();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="grid grid-cols-5 space-x-[50px] text-textColor">
      <div className="col-span-3">
        <BreadCrumb title={candidate?.name} />
        <section>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-[#F4CE9B] grid place-items-center rounded-md">
              {!candidate?.imageUrl ? (
                <div className="w-[200px] h-[200px] rounded-full bg-gray-50 flex items-center justify-center">
                  <CiUser color="gray" size={49} />
                </div>
              ) : (
                <img
                  src={candidate?.imageUrl || profileImage}
                  className="w-[200px] h-[200px] rounded-full"
                  alt=""
                />
              )}
            </div>
            <div>
              <h3 className="font-medium">Bio</h3>
              <p className="text-justify font-light ">{candidate?.bio}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 my-3">
            <span className="space-y-3">
              <button className="px-3 py-2 bg-primaryBlue rounded-md text-white w-full">
                Vote
              </button>
              <ProgressBar percentCompleted="50%" />
              <small>50% of votes (520)</small>
            </span>
          </div>
        </section>
        {/* mainfesto */}
        <div>
          <h3 className="font-semibold">Manifesto</h3>
          {candidate?.manifesto}
          <br />
          {/* <Link to="" className="font-semibold text-primaryBlue my-2">
            Download Full manifesto
          </Link> */}
        </div>
      </div>
      <div className="col-span-2">
        <SeeAll title="Other Contestants" />
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <CircleLoader />
            </>
          ) : data?.length === 0 ? (
            <div className="col-span-4 text-center">
              <h3 className="text-lg font-semibold">No Contestants Found</h3>
              <p className="text-sm text-gray-500">
                There are currently no contestants for this election position.
              </p>
            </div>
          ) : (
            data?.map((contestant: any) => (
              <ElectionContestantCard
                key={contestant._id}
                image={contestant.imageUrl}
                name={contestant.name}
                about={contestant.bio}
                id={contestant._id}
                electionPositionId={election_id}
                refetch={refetch}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default ElectionContestantDetailPage;
