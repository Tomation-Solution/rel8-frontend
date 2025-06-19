import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiTenant from "../../api/baseApi";

interface Props {
  image: string;
  name: string;
  about: string;
  id?: string;
  electionPositionId?: string;
  refetch?: () => void;
}

const ElectionContestantCard = ({
  image,
  name,
  about,
  id,
  electionPositionId,
  refetch,
}: Props) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleNavigate = () => {
    navigate(`/elections-contestant/${electionPositionId}/${id}`);
    refetch && refetch();
  };

  const handleVote = async () => {
    try {
      const response = await apiTenant.post(
        `api/elections/vote`,
        { candidateId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data, "Vote Response");
      toast.success("Vote casted successfully");
    } catch (error: any) {
      console.log("Error casting vote:");
      toast.error(
        error.response?.data?.message ||
          "An error occurred while casting your vote"
      );
    }
  };

  return (
    <>
      <div className="max-w-sm  border border-gray-200 rounded-lg shadow p-3 bg-primary-dark2 ">
        {image === null ? (
          <div className="w-full h-[15rem] bg-gray-300 rounded-t-lg flex items-center justify-center">
            <CiUser color="gray" size={49} />
          </div>
        ) : (
          <img className="rounded-t-lg w-full h-[15rem]" src={image} alt="" />
        )}

        <div className="my-2">
          <a href="#">
            <h5 className="mb-1 text-base font-semibold tracking-tight line-clamp-1 text-white">
              {name}
            </h5>
          </a>
          <p className="mb-1 font-light  line-clamp-2 text-sm text-white">
            {about}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleVote}
              className="bg-primaryBlue rounded-md text-white py-2 px-3"
            >
              Vote
            </button>
            <button
              onClick={handleNavigate}
              className="border border-[#67CCFF] rounded-md text-[#67CCFF] py-2 px-3"
            >
              View Bio
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectionContestantCard;
