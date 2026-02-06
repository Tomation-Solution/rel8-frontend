import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import profileImage from "../../../assets/images/dummy.jpg";
import { fetchExcoById } from "../../../api/members/api-members";

type Exco = {
  _id: string;
  name: string;
  email: string;
  position: string;
  bio?: string;
  profileImage?: string | null;
  startDate?: string;
  endDate?: string;
};

const ExcoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifyUser } = Toast();

  const { data, isLoading, isError } = useQuery(
    ["exco", id],
    () => fetchExcoById(id as string),
    { enabled: !!id, refetchOnWindowFocus: false }
  );

  const exco: Exco | null = data?._id ? data : data?.exco?._id ? data.exco : null;

  if (isLoading) return <CircleLoader />;
  if (isError) {
    notifyUser("Failed to load exco details", "error");
  }

  return (
    <main className="max-w-4xl">
      <BreadCrumb title={"Exco Details"} />

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm text-org-primary hover:underline mb-4"
      >
        Back
      </button>

      {!exco ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600">Exco not found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={exco.profileImage || profileImage}
              alt={exco.name}
              className="w-full md:w-[260px] h-[260px] object-cover rounded-lg border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900">{exco.name}</h2>
              <p className="text-org-primary font-medium mt-1">{exco.position}</p>
              {exco.email && (
                <p className="text-sm text-gray-600 mt-2">{exco.email}</p>
              )}

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exco.startDate && (
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm text-gray-800">
                      {new Date(exco.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {exco.endDate && (
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="text-sm text-gray-800">
                      {new Date(exco.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                  {exco.bio || "No bio provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ExcoDetailPage;


