import { useRef } from "react";
import { useQuery } from "react-query";
import { fetchUserDues } from "../../../api/account/account-api";
import { useAppContext } from "../../../context/authContext";
import { getTenantInfo } from "../../../utils/constants";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { getInitials } from "../../../utils/strings";

// ── helpers ────────────────────────────────────────────────────────────────

const isCurrentYear = (isoDate?: string): boolean => {
  if (!isoDate) return true;
  return new Date(isoDate).getFullYear() === new Date().getFullYear();
};

const currentYear = new Date().getFullYear();

const fmtDate = (d: Date): string => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Read actual hex values from org theme — avoids CSS-variable issues in html2canvas
const getCardColors = (organization: any): { primary: string; secondary: string } => ({
  primary: organization?.colorTheme?.primary ?? "#1a56db",
  secondary: organization?.colorTheme?.secondary ?? "#0e3d91",
});

// ── card dimensions (px) ───────────────────────────────────────────────────
const CARD_W = 340;
const CARD_H = 214;

// ── PDF download (front + back, CR80 sized pages) ─────────────────────────

const downloadAsPDF = async (frontEl: HTMLElement, backEl: HTMLElement, orgName: string) => {
  try {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    const capture = (el: HTMLElement) =>
      html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
      });

    const [frontCanvas, backCanvas] = await Promise.all([capture(frontEl), capture(backEl)]);

    // CR80 card: 85.6 × 54 mm
    const W = 85.6;
    const H = 54;

    const pdf = new jsPDF({ unit: "mm", format: [W, H] });
    pdf.addImage(frontCanvas.toDataURL("image/png"), "PNG", 0, 0, W, H);
    pdf.addPage([W, H]);
    pdf.addImage(backCanvas.toDataURL("image/png"), "PNG", 0, 0, W, H);
    pdf.save(`membership-card-${orgName.replace(/\s+/g, "-").toLowerCase()}-${currentYear}.pdf`);
  } catch {
    window.print();
  }
};

// ── card components (all inline styles — no Tailwind / CSS variables) ──────

interface CardColors {
  primary: string;
  secondary: string;
}

interface CardFrontProps {
  name: string;
  memberId: string;
  imageUrl?: string;
  orgName: string;
  orgLogo?: string;
  validFrom: string;
  validTo: string;
  groups: { _id: string; name: string }[];
  colors: CardColors;
}

const CardFront = ({ name, memberId, imageUrl, orgName, orgLogo, validFrom, validTo, groups, colors }: CardFrontProps) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      overflow: "hidden",
      position: "relative",
      color: "white",
      fontFamily: "system-ui, -apple-system, sans-serif",
      userSelect: "none",
      flexShrink: 0,
    }}
  >
    <div style={{ position: "absolute", top: -32, right: -32, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />
    <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />

    <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {orgLogo ? (
          <img src={orgLogo} alt={orgName} crossOrigin="anonymous" style={{ height: 28, width: 28, borderRadius: "50%", objectFit: "cover", background: "white", padding: 2 }} />
        ) : (
          <div style={{ height: 28, width: 28, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: colors.primary }}>
            {getInitials(orgName)}
          </div>
        )}
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", opacity: 0.92, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{orgName}</span>
      </div>
      <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 12 }}>Member</span>
    </div>

    <div style={{ position: "absolute", top: 56, bottom: 40, left: 20, right: 20, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ flexShrink: 0 }}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} crossOrigin="anonymous" style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover", border: "2px solid rgba(255,255,255,0.4)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              border: "2px solid rgba(255,255,255,0.4)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
        {groups.length > 0 && <p style={{ fontSize: 10, opacity: 0.75, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{groups.map(g => g.name).join(" \u00B7 ")}</p>}
        <p style={{ fontSize: 10, fontFamily: "monospace", opacity: 0.6, letterSpacing: "0.15em", textTransform: "uppercase", margin: "4px 0 0" }}>ID \u00B7 {memberId}</p>
      </div>
    </div>

    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 20px" }}>
      <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.7 }}>Valid</span>
      <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.05em" }}>
        {validFrom} \u2013 {validTo}
      </span>
    </div>
  </div>
);

interface CardBackProps {
  orgName: string;
  orgLogo?: string;
  email?: string;
  phone?: string;
  website?: string;
  yearEstablished?: number;
  colors: CardColors;
}

const CardBack = ({ orgName, orgLogo, email, phone, website, yearEstablished, colors }: CardBackProps) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      background: `linear-gradient(315deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      overflow: "hidden",
      position: "relative",
      color: "white",
      fontFamily: "system-ui, -apple-system, sans-serif",
      userSelect: "none",
      flexShrink: 0,
    }}
  >
    <div style={{ position: "absolute", top: -32, left: -32, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />
    <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.10)" }} />

    {/* magnetic stripe */}
    <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 10, background: "rgba(0,0,0,0.40)" }} />

    <div style={{ position: "absolute", top: 52, left: 20, right: 20, bottom: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
      {orgLogo ? (
        <img src={orgLogo} alt={orgName} crossOrigin="anonymous" style={{ height: 38, maxWidth: 130, objectFit: "contain", background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "4px 10px" }} />
      ) : (
        <div style={{ height: 40, width: 40, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: colors.primary }}>
          {getInitials(orgName)}
        </div>
      )}
      <p style={{ fontSize: 12, fontWeight: 700, margin: 0, textAlign: "center", letterSpacing: "0.04em", opacity: 0.95 }}>{orgName}</p>
      {yearEstablished ? <p style={{ fontSize: 9, opacity: 0.55, margin: 0 }}>Est. {yearEstablished}</p> : null}
      <div style={{ width: "55%", height: 1, background: "rgba(255,255,255,0.25)", margin: "3px 0" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        {email ? <p style={{ fontSize: 9, opacity: 0.78, margin: 0 }}>{email}</p> : null}
        {phone ? <p style={{ fontSize: 9, opacity: 0.78, margin: 0 }}>{phone}</p> : null}
        {website ? <p style={{ fontSize: 9, opacity: 0.78, margin: 0 }}>{website}</p> : null}
      </div>
    </div>

    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.22)", padding: "5px 20px", textAlign: "center" }}>
      <span style={{ fontSize: 8, opacity: 0.6, letterSpacing: "0.04em" }}>This card is the property of {orgName}. If found, please return.</span>
    </div>
  </div>
);

// ── main component ──────────────────────────────────────────────────────────

const MembershipCardTab = () => {
  const { user } = useAppContext();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const { organization, logo } = getTenantInfo();

  const { data: dues, isLoading } = useQuery("userDues", fetchUserDues);

  if (isLoading) return <CircleLoader />;

  const currentYearDues: any[] = Array.isArray(dues) ? dues.filter((d: any) => isCurrentYear(d.startDate ?? d.createdAt)) : [];

  const allApproved = currentYearDues.length > 0 && currentYearDues.every((d: any) => d.status === "approved" || d.confirmed === true);

  const memberId: string = user?._id?.toString().slice(-8).toUpperCase() ?? user?.id?.toString().slice(-8).toUpperCase() ?? "--------";

  const userGroups: { _id: string; name: string }[] = Array.isArray(user?.groups) ? user.groups : [];

  const earliestDue = currentYearDues.filter((d: any) => d.startDate).sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const validFromDate: Date = earliestDue?.startDate ? new Date(earliestDue.startDate) : new Date(currentYear, 0, 1);

  const validToDate: Date = new Date(validFromDate);
  validToDate.setFullYear(validToDate.getFullYear() + 1);
  validToDate.setDate(validToDate.getDate() - 1);

  const validFrom = fmtDate(validFromDate);
  const validTo = fmtDate(validToDate);
  const colors = getCardColors(organization);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Membership Card</h2>
        <p className="text-sm text-gray-500 mb-6">Your digital membership card for {currentYear}. Download as a PDF to print both sides at any computer centre.</p>

        {!allApproved ? (
          <div className="flex flex-col items-center gap-3 py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-sm text-center">Card not available yet</p>
            <p className="text-gray-400 text-xs text-center max-w-xs">
              Your membership card will appear here once all your {currentYear} dues are approved. Head to <strong>Payments</strong> to check your dues status.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-8 items-start justify-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Front</span>
                <div ref={frontRef}>
                  <CardFront
                    name={user?.name ?? ""}
                    memberId={memberId}
                    imageUrl={user?.imageUrl}
                    orgName={organization?.name ?? "Organisation"}
                    orgLogo={logo ?? undefined}
                    validFrom={validFrom}
                    validTo={validTo}
                    groups={userGroups}
                    colors={colors}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Back</span>
                <div ref={backRef}>
                  <CardBack
                    orgName={organization?.name ?? "Organisation"}
                    orgLogo={logo ?? undefined}
                    email={organization?.email}
                    phone={organization?.phone}
                    website={organization?.customUrl}
                    yearEstablished={organization?.yearEstablished}
                    colors={colors}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => frontRef.current && backRef.current && downloadAsPDF(frontRef.current, backRef.current, organization?.name ?? "membership")}
                className="flex items-center gap-2 px-5 py-2.5 bg-org-primary text-white text-sm rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
              <button type="button" onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Valid {validFrom} – {validTo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipCardTab;
