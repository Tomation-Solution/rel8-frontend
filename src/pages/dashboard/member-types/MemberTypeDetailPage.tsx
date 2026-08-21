import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { BackLink, Button, EmptyState, PageHeader } from "../../../components/ui";
import { FiUsers } from "react-icons/fi";
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
        <BackLink to="/environment" label="Back to environment" />
        <PageHeader title="Membership Type" />
        <EmptyState icon={FiUsers} title="Couldn't load this membership type" description="Something went wrong reaching the server. Try again in a moment." />
      </main>
    );
  }

  if (!canView) {
    return (
      <main className="max-w-4xl">
        <BackLink to="/environment" label="Back to environment" />
        <PageHeader title={data.memberType?.name ?? "Membership Type"} />
        <EmptyState icon={FiUsers} title="Not visible to you" description="You are not a member of this membership type." action={<Button onClick={() => navigate("/environment")}>Back to environment</Button>} />
      </main>
    );
  }

  const typeName = data.memberType?.name ?? "Membership Type";
  const members: MemberTypeMember[] = data.members ?? [];

  return (
    <main>
      <BackLink to="/environment" label="Back to environment" />
      <PageHeader title={typeName} subtitle={`${members.length} member${members.length === 1 ? "" : "s"} in this membership type`} />

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
