import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { FiUser, FiCalendar, FiFileText } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi2";

import { trackApplication, type ReviewStatus } from "../../api/applications/applications-api";
import { Button, Card, EmptyState, PageHeader, StatusPill } from "../../components/ui";
import CircleLoader from "../../components/loaders/CircleLoader";
import { formatDate } from "../../utils/dates";
import { getTrackedApplication, saveTrackedApplication } from "./trackedApplication";

/**
 * The applicant dashboard — `onboarding-rel8/New Applicant dashboard.png`.
 *
 * Two statuses, and they are **different things** — the mockup shows both, so do we:
 *   `formStatus`   draft / submitted / published  — did the application arrive
 *   `reviewStatus` pending / approved / rejected / needs_revision — what the admin decided
 * An application is "SUBMITTED" and "Pending" at the same time; folding them into one
 * status would lose that.
 */
const REVIEW_LABEL: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Not accepted",
  needs_revision: "Needs revision",
};

const Row = ({ icon: Icon, label, children }: { icon: typeof FiUser; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-4 min-w-0">
    <span className="w-11 h-11 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
      <Icon className="w-5 h-5 text-org-primary" />
    </span>
    <div className="min-w-0">
      <p className="text-[15px] font-medium text-org-primary">{label}</p>
      <div className="text-sm text-ink mt-0.5">{children}</div>
    </div>
  </div>
);

const ApplicationStatusPage = () => {
  const navigate = useNavigate();
  const stored = getTrackedApplication();

  /*
   * Re-fetch rather than render the stored copy. The applicant may have left this tab open
   * for days while an admin worked through the queue, and a status page showing a stale
   * "Pending" after they have been approved is worse than useless.
   */
  const { data, isLoading, isError } = useQuery(["trackedApplication", stored?.code], () => trackApplication({ code: stored!.code, email: stored!.email }), {
    enabled: !!stored,
    initialData: stored?.application,
    onSuccess: fresh => {
      if (stored) saveTrackedApplication(stored.code, stored.email, fresh);
    },
  });

  useEffect(() => {
    if (!stored) navigate("/track", { replace: true });
  }, [stored, navigate]);

  if (!stored) return null;

  if (isLoading && !data) {
    return (
      <div className="py-20">
        <CircleLoader />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <>
        <PageHeader title="Application" />
        <EmptyState icon={FiFileText} title="We couldn't load your application" description="Try looking it up again with your application ID and email." action={<Button onClick={() => navigate("/track")}>Back to tracking</Button>} />
      </>
    );
  }

  const application = data!;
  const orgName = application.organization?.name ?? "your association";

  return (
    <>
      <PageHeader title="Application" subtitle={`See the details of your application with ${orgName}.`} />

      <Card className="p-6 sm:p-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
          <Row icon={FiUser} label="Applicant's Name">
            {application.applicantName}
          </Row>

          <Row icon={HiOutlineIdentification} label="Applicant's ID">
            <span className="font-medium tracking-wide">{application.code}</span>
          </Row>

          <Row icon={FiCalendar} label="Application Date">
            {formatDate(application.submittedAt)}
          </Row>

          <Row icon={FiFileText} label="Application Status">
            <span className="uppercase text-status-success font-medium">{application.formStatus}</span>
          </Row>

          <Row icon={HiOutlineIdentification} label="Review Status">
            <StatusPill status={application.reviewStatus} label={REVIEW_LABEL[application.reviewStatus]} />
          </Row>
        </div>

        {application.reviewStatus === "approved" && (
          <div className="mt-8 rounded-xl border border-status-success/30 bg-status-success-bg p-5">
            <p className="text-sm font-semibold text-status-success">You&rsquo;ve been approved</p>
            <p className="text-sm text-ink mt-1">
              {orgName} has accepted your application. Check <span className="font-medium">{application.applicantEmail}</span> for a link to set your password — that is how you get into the member portal.
            </p>
          </div>
        )}

        {application.reviewStatus === "needs_revision" && (
          <div className="mt-8 rounded-xl border border-status-warning/30 bg-status-warning-bg p-5">
            <p className="text-sm font-semibold text-status-warning">More information needed</p>
            <p className="text-sm text-ink mt-1">{orgName} has asked for changes to your application. They will be in touch at {application.applicantEmail}.</p>
          </div>
        )}

        {application.reviewStatus === "rejected" && (
          <div className="mt-8 rounded-xl border border-hairline bg-status-neutral-bg p-5">
            <p className="text-sm font-semibold text-ink">This application was not accepted</p>
            {/* Review notes are internal to the admin and never leave the server — pointing
                the applicant at the association is the only honest thing to say here. */}
            <p className="text-sm text-muted mt-1">If you think this is a mistake, contact {orgName} directly.</p>
          </div>
        )}
      </Card>
    </>
  );
};

export default ApplicationStatusPage;
