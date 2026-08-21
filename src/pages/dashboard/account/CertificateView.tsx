import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { FiAward, FiDownload, FiArrowLeft } from "react-icons/fi";

import { fetchMyCredential } from "../../../api/credentials/credentials-api";
import CredentialCanvas from "../../../components/credentials/CredentialCanvas";
import { Button, Card, EmptyState, KeyValueList } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { formatDate } from "../../../utils/dates";

/**
 * "Certificates of Membership" — `Certificate.png`.
 *
 * The certificate on the left, an information panel on the right, and a download.
 *
 * `Verify Certificate` is **not** rendered: there is no verification endpoint, and a button
 * that claims to verify a document while doing nothing is worse than no button. See
 * REDESIGN.md §5 — it comes back when the backend has something to verify against.
 */
const CertificateView = ({ onBack }: { onBack: () => void }) => {
  const { notifyUser } = Toast();
  const exportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading, isError, error } = useQuery(["myCredential", "certificate"], () => fetchMyCredential("certificate"), { retry: false });

  /**
   * Export at the design's own pixel dimensions rather than what is on screen, so a
   * certificate viewed on a phone still downloads at full resolution.
   *
   * `html2canvas` and `jspdf` are already dependencies — the dues receipt and the ID card
   * both use them.
   */
  const download = async () => {
    if (!exportRef.current || !data) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");

      const node = exportRef.current;
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true, // the background and any images are on Cloudinary
        backgroundColor: "#ffffff",
        width: data.template.canvasWidth,
        height: data.template.canvasHeight,
        windowWidth: data.template.canvasWidth,
        windowHeight: data.template.canvasHeight,
      });

      const landscape = data.template.canvasWidth >= data.template.canvasHeight;
      const pdf = new jsPDF({ orientation: landscape ? "landscape" : "portrait", unit: "px", format: [data.template.canvasWidth, data.template.canvasHeight] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, data.template.canvasWidth, data.template.canvasHeight);
      pdf.save(`${data.variables.memberId || "certificate"}-certificate.pdf`);
    } catch (err: any) {
      // Most likely an image that did not send CORS headers, which taints the canvas.
      notifyUser(err?.message?.includes("tainted") ? "The certificate image could not be exported. Please contact your association." : "Could not download the certificate. Please try again.", "error");
    } finally {
      setDownloading(false);
    }
  };

  const back = (
    <button type="button" onClick={onBack} className="inline-flex items-center gap-3 text-ink hover:text-org-primary mb-4">
      <FiArrowLeft className="w-5 h-5" />
      <span className="text-[15px]">Back to credentials</span>
    </button>
  );

  if (isLoading) {
    return (
      <>
        {back}
        <CircleLoader />
      </>
    );
  }

  // A 404 means the association has not published a certificate design — a normal state.
  if (isError || !data) {
    const notPublished = (error as any)?.response?.status === 404;
    return (
      <>
        {back}
        <EmptyState
          icon={FiAward}
          title={notPublished ? "No certificate yet" : "Couldn't load your certificate"}
          description={notPublished ? "Your association hasn't published a membership certificate design. They'll appear here once it does." : "Something went wrong reaching the server. Try again in a moment."}
        />
      </>
    );
  }

  const { template, variables, organization } = data;

  return (
    <>
      {back}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 min-w-0">
          <Card className="p-4 overflow-hidden">
            <CredentialCanvas template={template} variables={variables} exportRef={exportRef} />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-6">
            <h3 className="text-[17px] font-semibold text-ink mb-4">Certificate Information</h3>
            <KeyValueList
              entries={[
                { label: "Certificate Name", value: template.name || "Membership Certificate" },
                { label: "Member ID", value: variables.memberId },
                { label: "Issue Date", value: variables.dateIssued || "—" },
                { label: "Issued By", value: organization?.name ?? "—" },
                { label: "Status", value: "VALID" },
              ]}
            />
          </Card>

          <Button fullWidth size="lg" icon={FiDownload} isLoading={downloading} onClick={download}>
            Download Certificate
          </Button>

          {/*
            The mockup also shows "Verify Certificate". There is no verification endpoint,
            so the button is omitted rather than shipped inert — see REDESIGN.md §5.
          */}
          <p className="text-xs text-muted">
            Issued {formatDate(template.publishedAt) !== "—" ? `from a design published ${formatDate(template.publishedAt)}` : "by your association"}. Contact your association if any detail is wrong.
          </p>
        </div>
      </div>
    </>
  );
};

export default CertificateView;
