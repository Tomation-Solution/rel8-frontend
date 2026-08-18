import { useState } from "react";
import type { PaymentCheckout } from "../../api/paystack-api";

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

const formatAmount = (amount?: number) => (amount == null ? "" : `₦${Number(amount).toLocaleString()}`);

const BankTransferPanel = ({ checkout, onDeclare, declaring = false, declared = false, error, requireProof = false, title = "Complete your payment" }: BankTransferPanelProps) => {
  const [proof, setProof] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");

  const bt = checkout.bankTransfer;

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
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-semibold text-green-900">Payment submitted</p>
        <p className="mt-1 text-xs text-green-800">
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
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-xs text-gray-500">Transfer the amount below and quote your reference so the payment can be matched to you.</p>

      <div className="mt-3 space-y-2 rounded-md bg-gray-50 p-3">
        {bt?.accountName && <Row label="Account name" value={bt.accountName} onCopy={copy} copied={copied} />}
        {bt?.accountNumber && <Row label="Account number" value={bt.accountNumber} onCopy={copy} copied={copied} />}
        {bt?.bankName && <Row label="Bank" value={bt.bankName} />}
        {checkout.amount != null && <Row label="Amount" value={formatAmount(checkout.amount)} />}
        {checkout.reference && <Row label="Reference" value={checkout.reference} highlight onCopy={copy} copied={copied} />}
        {bt?.instructions && <p className="border-t border-gray-200 pt-2 text-xs text-gray-600">{bt.instructions}</p>}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Proof of payment {requireProof ? <span className="text-red-500">*</span> : <span className="text-gray-400">(optional)</span>}
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={e => setProof(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-org-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-org-primary"
          />
          {!requireProof && <p className="mt-1 text-xs text-gray-400">You can submit without a receipt — the organisation can match your reference on their statement.</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Anything the organisation should know"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-org-primary focus:outline-none"
          />
        </div>

        {(localError || error) && <p className="text-xs text-red-600">{localError || error}</p>}

        <button
          type="button"
          onClick={handleDeclare}
          disabled={declaring}
          className="w-full rounded-md bg-org-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {declaring ? "Submitting…" : "I've made the transfer"}
        </button>
      </div>
    </div>
  );
};

const Row = ({ label, value, highlight, onCopy, copied }: { label: string; value: string; highlight?: boolean; onCopy?: (l: string, v: string) => void; copied?: string | null }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="shrink-0 text-xs text-gray-500">{label}</span>
    <span className="flex items-center gap-2 text-right">
      <span className={`break-all text-sm ${highlight ? "font-bold text-org-primary" : "font-medium text-gray-900"}`}>{value}</span>
      {onCopy && (
        <button type="button" onClick={() => onCopy(label, value)} className="shrink-0 text-xs text-org-primary underline">
          {copied === label ? "Copied" : "Copy"}
        </button>
      )}
    </span>
  </div>
);

export default BankTransferPanel;
