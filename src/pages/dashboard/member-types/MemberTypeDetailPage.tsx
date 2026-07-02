import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useAppContext } from "../../../context/authContext";
import { fetchMemberTypeMembers, MemberTypeMember } from "../../../api/member-types/member-types-api";
import profileImage from "../../../assets/images/dummy.jpg";

type Tab = "members";

const MemberTypeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { notifyUser } = Toast();
  const [activeTab] = useState<Tab>("members");

  const userMemberTypeId: string | null = typeof user?.memberType === "object" ? user.memberType?._id : (user?.memberType ?? null);

  const isAdmin: boolean = user?.role === "admin" || user?.isAdmin === true;

  const { data, isLoading, isError } = useQuery(["memberTypeMembers", id], () => fetchMemberTypeMembers(id as string), {
    enabled: !!id,
    onError: () => notifyUser("Failed to load members", "error"),
  });

  // Access guard — non-admins can only view their own type
  const canView = isAdmin || userMemberTypeId === id;

  if (isLoading) return <CircleLoader />;

  if (isError || !data) {
    return (
      <main className="max-w-4xl">
        <BreadCrumb title="Membership Type" />
        <p className="text-red-500 py-8 text-center">Failed to load membership type.</p>
      </main>
    );
  }

  if (!canView) {
    return (
      <main className="max-w-4xl">
        <BreadCrumb title={data.memberType?.name ?? "Membership Type"} />
        <div className="py-16 text-center">
          <p className="text-gray-500 text-base">You are not a member of this membership type.</p>
          <button onClick={() => navigate("/member-types")} className="mt-4 text-org-primary text-sm underline">
            Back to Membership Types
          </button>
        </div>
      </main>
    );
  }

  const typeName = data.memberType?.name ?? "Membership Type";
  const members: MemberTypeMember[] = data.members ?? [];

  return (
    <main>
      <BreadCrumb title={typeName} />

      {/* Tab bar */}
      <div className="mt-4 border-b border-gray-200 flex gap-1 overflow-x-auto">
        <button className="px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 border-org-primary text-org-primary">Members ({members.length})</button>
      </div>

      {/* Members grid */}
      <div className="mt-6">
        {members.length === 0 ? (
          <p className="text-gray-400 text-sm py-10 text-center">No members in this type yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.map(member => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

const MemberCard = ({ member }: { member: MemberTypeMember }) => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(`/members/${member._id}`)} className="bg-white border border-[#ececec] p-3 flex flex-col items-center rounded-xl text-center hover:shadow-md transition-shadow">
      <img src={member.profileImage || member.imageUrl || profileImage} alt={member.name} className="w-16 h-16 object-cover rounded-full mb-3" />
      <h6 className="font-semibold text-gray-800 text-sm leading-tight">{member.name || "—"}</h6>
      {member.position && <p className="text-xs text-gray-500 mt-0.5">{member.position}</p>}
      {member.email && <p className="text-xs text-org-primary mt-1 truncate w-full">{member.email}</p>}
    </button>
  );
};

export default MemberTypeDetailPage;
