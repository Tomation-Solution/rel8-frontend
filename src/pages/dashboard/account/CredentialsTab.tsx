import { useState } from "react";
import { FiCreditCard, FiAward, FiEye, FiArrowLeft } from "react-icons/fi";

import { Card, Button } from "../../../components/ui";
import MembershipCardTab from "./MembershipCardTab";
import CertificateView from "./CertificateView";

/**
 * "Credentials" — `Credentials.png`.
 *
 * Two action cards. Only one of them has a backend.
 *
 * - **Membership ID Card** works: it is rendered in the browser from the member's own
 *   profile, which is why `MembershipCardTab` exists and needs no new endpoint.
 * - **Certificate** now works too. `GET /api/credentials/my?category=certificate` returns
 *   the organization's published design plus this member's values, and `CredentialCanvas`
 *   renders it. There is deliberately no issued-credential record: the template's
 *   `variable` elements are resolved on request, so a re-brand reaches every member with
 *   no reissue step.
 *
 * "Verify Certificate" from the mockup is still absent — there is no verification endpoint,
 * and an inert Verify button is worse than none. REDESIGN.md §5.
 */
const CredentialsTab = () => {
  const [view, setView] = useState<"index" | "card" | "certificate">("index");

  if (view === "certificate") return <CertificateView onBack={() => setView("index")} />;

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
          <Button className="mt-5" icon={FiEye} onClick={() => setView("certificate")}>
            View Certificate
          </Button>
        </div>
        <span className="w-14 h-14 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
          <FiAward className="w-6 h-6 text-org-primary" />
        </span>
      </Card>
    </div>
  );
};

export default CredentialsTab;
