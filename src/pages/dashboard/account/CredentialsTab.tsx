import { useState } from "react";
import { FiCreditCard, FiAward, FiEye, FiArrowLeft } from "react-icons/fi";

import { Card, Button, EmptyState } from "../../../components/ui";
import MembershipCardTab from "./MembershipCardTab";

/**
 * "Credentials" — `Credentials.png`.
 *
 * Two action cards. Only one of them has a backend.
 *
 * - **Membership ID Card** works: it is rendered in the browser from the member's own
 *   profile, which is why `MembershipCardTab` exists and needs no new endpoint.
 * - **Certificate** does not. `credential.template.routes.js` is `requireOrgAdmin` on
 *   *every* route, and it serves *templates* — there is no issued-credential model and no
 *   member-scoped endpoint to fetch "my certificate". `Certificate.png` and
 *   `certificate.jpg` show a fully rendered certificate with a member name, QR code and
 *   issue date; none of that is reachable from this app today.
 *
 * So the certificate card states the position instead of opening a viewer that could only
 * 403. "Verify Certificate" (also in the mockup) has no endpoint either — REDESIGN.md §5.
 */
const CredentialsTab = () => {
  const [view, setView] = useState<"index" | "card">("index");

  if (view === "card") {
    return (
      <>
        <button type="button" onClick={() => setView("index")} className="inline-flex items-center gap-3 text-ink hover:text-org-primary mb-4">
          <FiArrowLeft className="w-5 h-5" />
          <span className="text-[15px]">Back to credentials</span>
        </button>
        <MembershipCardTab />
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
      <Card className="p-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold text-ink">Membership ID Card</h3>
          <p className="text-sm text-muted mt-1">View and Download your digital Membership ID Card</p>
          <Button className="mt-5" icon={FiEye} onClick={() => setView("card")}>
            View ID Card
          </Button>
        </div>
        <span className="w-14 h-14 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
          <FiCreditCard className="w-6 h-6 text-org-primary" />
        </span>
      </Card>

      <Card className="p-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold text-ink">Certificate</h3>
          <p className="text-sm text-muted mt-1">Browse and view all your issued certificates</p>
          <Button className="mt-5" variant="muted" disabled icon={FiEye}>
            View Certificate
          </Button>
          <p className="text-xs text-muted mt-3">Certificates aren&rsquo;t available in the portal yet. Your association can send you one directly.</p>
        </div>
        <span className="w-14 h-14 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
          <FiAward className="w-6 h-6 text-org-primary" />
        </span>
      </Card>

      <div className="lg:col-span-2">
        <EmptyState icon={FiAward} title="Nothing else here yet" description="Any other credentials your association issues will show up on this page." />
      </div>
    </div>
  );
};

export default CredentialsTab;
