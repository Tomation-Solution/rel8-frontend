import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { BackLink, PageHeader } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { fetchMemberById } from "../../../api/members/api-members";
import profileImage from "../../../assets/images/dummy.jpg";
import { FiLinkedin, FiTwitter, FiMail, FiPhone, FiBriefcase } from "react-icons/fi";

const Field = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="p-3 bg-org-tint/50 rounded-lg">
      <p className="text-xs text-muted mb-0.5">{label}</p>
      <p className="text-sm text-ink font-medium">{value}</p>
    </div>
  );
};

const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notifyUser } = Toast();

  const {
    data: member,
    isLoading,
    isError,
  } = useQuery(["memberProfile", id], () => fetchMemberById(id as string), {
    enabled: !!id,
    retry: 1,
    onError: () => notifyUser("Failed to load member profile", "error"),
  });

  if (isLoading) return <CircleLoader />;

  const name = member?.name || member?.full_name || "—";
  const photo = member?.profileImage || member?.imageUrl || member?.photo || profileImage;
  const memberType = typeof member?.memberType === "object" ? member.memberType : null;

  return (
    <main className="max-w-4xl">
      <BackLink to="/environment" label="Back to environment" />
      <PageHeader title={name} subtitle="Member profile" />

      <button type="button" onClick={() => navigate(-1)} className="text-sm text-org-primary hover:underline mb-4 inline-block">
        ← Back
      </button>

      {isError || !member ? (
        <div className="bg-white border border-hairline rounded-xl p-6">
          <p className="text-muted">Member not found or you don't have access to view this profile.</p>
        </div>
      ) : (
        <div className="bg-white border border-hairline rounded-xl overflow-hidden">
          {/* Top banner */}
          <div className="h-20 bg-org-primary/10" />

          <div className="px-6 pb-6">
            {/* Avatar + basic info */}
            <div className="flex flex-col sm:flex-row gap-5 -mt-10 mb-6">
              <img src={photo} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm shrink-0" />
              <div className="pt-2 sm:pt-12 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-ink">{name}</h2>
                  {memberType && <span className="text-xs font-medium bg-org-primary/10 text-org-primary px-2.5 py-0.5 rounded-full">{memberType.name}</span>}
                </div>
                {member.position && <p className="text-sm text-org-primary font-medium mt-0.5">{member.position}</p>}
                {member.jobTitle && (
                  <p className="text-sm text-muted flex items-center gap-1 mt-0.5">
                    <FiBriefcase size={13} /> {member.jobTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            {member.bio && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-ink mb-1">About</h3>
                <p className="text-sm text-muted leading-relaxed">{member.bio}</p>
              </div>
            )}

            {/* Contact + details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Field label="Email" value={member.email} />
              <Field label="Phone" value={member.phone || member.telephone_number} />
              <Field label="Address" value={member.address} />
              <Field label="Date of Birth" value={member.dob ? new Date(member.dob).toLocaleDateString() : null} />
              <Field label="Citizenship" value={member.citizenship} />
              {memberType?.description && <Field label="Member Type" value={`${memberType.name} — ${memberType.description}`} />}
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {member.exco?.isExco && <span className="text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full">Exco — {member.exco.position || "Member"}</span>}
              {member.committee?.isMember && <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">Committee — {member.committee.committeeName || "Member"}</span>}
              {member.is_financial === true && <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">Financial Member</span>}
            </div>

            {/* Social links */}
            {(member.linkedIn || member.twitter || member.email) && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-hairline">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-sm text-muted hover:text-org-primary transition-colors">
                    <FiMail size={15} /> {member.email}
                  </a>
                )}
                {member.linkedIn && (
                  <a href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted hover:text-org-primary transition-colors">
                    <FiLinkedin size={15} /> LinkedIn
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter.startsWith("http") ? member.twitter : `https://twitter.com/${member.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted hover:text-org-primary transition-colors"
                  >
                    <FiTwitter size={15} /> Twitter
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-1.5 text-sm text-muted hover:text-org-primary transition-colors">
                    <FiPhone size={15} /> {member.phone}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default MemberProfilePage;
