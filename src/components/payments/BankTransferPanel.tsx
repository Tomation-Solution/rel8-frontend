import { useState } from "react";
import { FiCheckCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";
import type { PaymentCheckout } from "../../api/paystack-api";
import { Button } from "../ui";
import { formatMoney, useCurrencySymbol } from "../../utils/currency";

/**
 * The bank-transfer half of the unified payment flow (X-1 / X-7).
 *
 * Shown after a payment is started with `method: "bank_transfer"`. The member transfers
 * to the association's account quoting the generated reference, then tells us — at which
 * point an admin verifies it against their bank statement.
 *
 * **Proof is optional.** It is only demanded when the item's config sets
 * `bankTransfer.requireProof`, because most associations reconcile from their own
 * statement and forcing a receipt upload just loses payers.
 */

interface BankTransferPanelProps {
  checkout: PaymentCheckout;
  /** Called when the member says they have paid. Receives the optional proof file. */
  onDeclare: (opts: { proof?: File | null; note?: string }) => Promise<void> | void;
  declaring?: boolean;
  declared?: boolean;
  error?: string;
  /** Set from the item's paymentConfig.bankTransfer.requireProof. */
  requireProof?: boolean;
  title?: string;
}

const BankTransferPanel = ({ checkout, onDeclare, declaring = false, declared = false, error, requireProof = false, title = "Complete your payment" }: BankTransferPanelProps) => {
  // The amount used to be hardcoded to a naira sign, so every non-NGN tenant saw the wrong
  // currency on the one screen where the number has to be exactly right.
  const currencySymbol = useCurrencySymbol();
  const [proof, setProof] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");

  const bt = checkout.bankTransfer;
  // An account number alone is what a payer actually needs; name and bank are supporting
  // detail. Without it there is nothing actionable on this screen.
  const hasAccountDetails = Boolean(bt?.accountNumber);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard unavailable — the value is on screen anyway */
    }
  };

  const handleDeclare = async () => {
    setLocalError("");
    if (requireProof && !proof) {
      setLocalError("Please attach proof of payment for this item.");
      return;
    }
    await onDeclare({ proof, note: note.trim() || undefined });
  };

  if (declared) {
    return (
      <div className="rounded-xl border border-status-success/30 bg-status-success-bg p-4">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-status-success">
          <FiCheckCircle className="w-4 h-4" /> Payment submitted
        </p>
        <p className="mt-1 text-xs text-ink">
          We've told the organisation. They'll confirm it against their records — you'll be notified once it's approved.
          {checkout.reference && (
            <>
              {" "}
              Your reference is <span className="font-semibold">{checkout.reference}</span>.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-hairline bg-white p-5">
      {checkout.fallbackFrom === "paystack" && (
        <div className="mb-4 rounded-lg border border-status-warning/30 bg-status-warning-bg p-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-status-warning">
            <FiInfo className="w-4 h-4" /> Online payment isn&rsquo;t available right now
          </p>
          <p className="mt-1 text-xs text-ink">
            We couldn't start your online payment, so we've set up a bank transfer instead. You can pay to the account below — nothing has been charged.
          </p>
        </div>
      )}

      <p className="text-[15px] font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs text-muted">Transfer the amount below and quote your reference so the payment can be matched to you.</p>

      {/* Items migrated from the pre-X-7 schema can offer bank transfer with no structured
          account details — the old free-text blob was preserved but never parsed. Showing
          the usual "transfer to the account below" with no account is worse than saying so:
          the payer either gives up or sends money somewhere wrong. */}
      {!hasAccountDetails && (
        <div className="mt-4 rounded-lg border border-status-danger/30 bg-status-danger-bg p-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-status-danger">
            <FiAlertTriangle className="w-4 h-4" /> Account details are missing
          </p>
          <p className="mt-1 text-xs text-ink">
            The organisation hasn't finished setting up bank transfer for this item, so there's no account to pay into yet. Please contact them before
            sending anything{bt?.instructions ? " — the note below is all they have provided." : "."}
          </p>
        </div>
      )}

      <div className="mt-4 space-y-2.5 rounded-lg bg-org-tint p-4">
        {bt?.accountName && <Row label="Account name" value={bt.accountName} onCopy={copy} copied={copied} />}
        {bt?.accountNumber && <Row label="Account number" value={bt.accountNumber} onCopy={copy} copied={copied} />}
        {bt?.bankName && <Row label="Bank" value={bt.bankName} />}
        {checkout.amount != null && <Row label="Amount" value={formatMoney(checkout.amount, currencySymbol)} />}
        {checkout.reference && <Row label="Reference" value={checkout.reference} highlight onCopy={copy} copied={copied} />}
        {bt?.instructions && <p className="border-t border-org-tint-strong pt-2.5 text-xs text-muted">{bt.instructions}</p>}
      </div>

      <div className={`mt-4 space-y-3 ${hasAccountDetails ? "" : "opacity-50 pointer-events-none"}`} aria-disabled={!hasAccountDetails}>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink">
            Proof of payment {requireProof ? <span className="text-status-danger">*</span> : <span className="text-muted">(optional)</span>}
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={e => setProof(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-org-tint file:px-3 file:py-2 file:text-xs file:font-medium file:text-org-primary"
          />
          {!requireProof && <p className="mt-1.5 text-xs text-muted">You can submit without a receipt — the organisation can match your reference on their statement.</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Anything the organisation should know"
            className="w-full rounded-lg border border-hairline px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-org-primary focus:outline-none"
          />
        </div>

        {(localError || error) && <p className="text-xs text-status-danger">{localError || error}</p>}

        <Button fullWidth isLoading={declaring} onClick={handleDeclare}>
          I&rsquo;ve made the transfer
        </Button>
      </div>
    </div>
  );
};

const Row = ({ label, value, highlight, onCopy, copied }: { label: string; value: string; highlight?: boolean; onCopy?: (l: string, v: string) => void; copied?: string | null }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="shrink-0 text-xs text-muted">{label}</span>
    <span className="flex items-center gap-2 text-right">
      <span className={`break-all text-sm ${highlight ? "font-bold text-org-primary" : "font-medium text-ink"}`}>{value}</span>
      {onCopy && (
        <button type="button" onClick={() => onCopy(label, value)} className="shrink-0 text-xs text-org-primary underline">
          {copied === label ? "Copied" : "Copy"}
        </button>
      )}
    </span>
  </div>
);

export default BankTransferPanel;
