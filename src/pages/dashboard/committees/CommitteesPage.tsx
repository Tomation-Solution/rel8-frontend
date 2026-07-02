import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useQuery } from "react-query";
import { fetchMyCommittees, CommitteeType } from "../../../api/committee/committee";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { Link } from "react-router-dom";
import Toast from "../../../components/toast/Toast";

const CommitteesPage = () => {
  const { notifyUser } = Toast();

  const {
    data: committees,
    isLoading,
    isError,
  } = useQuery("myCommittees", fetchMyCommittees, {
    onError: () => notifyUser("Failed to load committees", "error"),
  });

  if (isLoading) return <CircleLoader />;

  return (
    <main>
      <BreadCrumb title="Committee Environment" />
      <div className="mt-4 space-y-4 max-w-3xl">
        {isError || !committees || committees.length === 0 ? (
          <p className="text-gray-500 py-10 text-center">You are not part of any committee.</p>
        ) : (
          committees.map((committee: CommitteeType) => (
            <div key={committee._id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-bold text-gray-800">{committee.name}</h2>
              </div>

              {committee.description && <p className="text-gray-600 text-sm mb-4">{committee.description}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Chairperson</p>
                  <p className="text-gray-600">{committee.chairperson?.name}</p>
                  <p className="text-gray-400 text-xs">{committee.chairperson?.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Members ({committee.members?.length ?? 0})</p>
                  <ul className="text-gray-600 space-y-0.5">
                    {committee.members?.slice(0, 3).map(m => (
                      <li key={m._id}>{m.name}</li>
                    ))}
                    {(committee.members?.length ?? 0) > 3 && <li className="text-gray-400 text-xs">+{committee.members.length - 3} more</li>}
                  </ul>
                </div>
              </div>

              {committee.positions?.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium text-gray-700 text-sm mb-1">Positions</p>
                  <div className="flex flex-wrap gap-2">
                    {committee.positions.map((pos, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {pos}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link to={`/committees/${committee._id}`} className="inline-block px-4 py-2 bg-org-primary text-white text-sm rounded-md hover:bg-org-primary/90 transition-colors">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default CommitteesPage;
