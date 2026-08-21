import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { FiAward, FiX } from "react-icons/fi";

import { fetchApplicationFeeStatus, startApplicationFeePayment, declareApplicationFeePayment } from "../../api/applicationFee/application-fee-api";
import { supportsMethod, isFree, type PaymentCheckout, type PaymentMethod } from "../../api/paystack-api";
import BankTransferPanel from "./BankTransferPanel";
import PaymentMethodChoice from "./PaymentMethodChoice";
import { defaultMethod } from "./defaultMethod";
import { Button, Card, StatusPill } from "../ui";
import Toast from "../toast/Toast";
import { formatMoney, useCurrencySymbol } from "../../utils/currency";

/**
 * The membership application fee, shown to the one member who owes it.
 *
 * Renders nothing at all unless the server says this member owes — which it only does for
 * someone who joined by applying, at an organization that charges. Everyone else never
 * sees it, so this can be mounted unconditionally.
 *
 * Deliberately **not** a hard blocker. The dues blocker exists for members who have been
 * around long enough to owe; locking a brand-new member out of the portal on their first
 * visit, before they have seen anything they joined for, is a bad trade for a fee an admin
 * can chase. It is prominent and dismissible-per-session instead.
 */
const ApplicationFeeGate = () => {
  const queryClient = useQueryClient();
  const { notifyUser } = Toast();
  const currencySymbol = useCurrencySymbol();

  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("rel8FeeNoticeDismissed") === "1";
    } catch {
      return false;
    }
  });
  const [payMethod, setPayMethod] = useState<PaymentMethod | null>(null);
  const [checkout, setCheckout] = useState<PaymentCheckout | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [declaring, setDeclaring] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [declareError, setDeclareError] = useState("");

  const { data } = useQuery("applicationFeeStatus", fetchApplicationFeeStatus, {
    retry: 1,
    staleTime: 60 * 1000,
  });

  if (!data?.owes || !data.fee) return null;

  const fee = data.fee;
  const config = fee.paymentConfig;
  const effectiveMethod: PaymentMethod = payMethod && supportsMethod(config, payMethod) ? payMethod : defaultMethod(config);
  const rejected = data.payment?.status === "rejected";

  const begin = async () => {
    setStarting(true);
    setDeclareError("");
    setDeclared(false);
    try {
      const result = await startApplicationFeePayment(fee._id, effectiveMethod);
      const co = result.checkout;

      if (co?.method === "paystack" && co.authorizationUrl) {
        window.location.href = co.authorizationUrl;
        return;
      }
      if (co?.method === "bank_transfer") {
        setCheckout(co);
        setPaymentId(result.payment?._id ?? null);
      }
    } catch (err: any) {
      notifyUser(err?.response?.data?.message || "Could not start your payment. Please try again.", "error");
    } finally {
      setStarting(false);
    }
  };

  const declare = async ({ proof, note }: { proof?: File | null; note?: string }) => {
    if (!paymentId) return;
    setDeclaring(true);
    setDeclareError("");
    try {
      await declareApplicationFeePayment(paymentId, { proof, note });
      setDeclared(true);
      queryClient.invalidateQueries("applicationFeeStatus");
    } catch (err: any) {
      setDeclareError(err?.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setDeclaring(false);
    }
  };

  if (dismissed && !checkout) return null;

  return (
    <Card accent className="p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <span className="w-11 h-11 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
            <FiAward className="w-5 h-5 text-org-primary" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[17px] font-semibold text-ink">{fee.paymentName}</h3>
              {rejected && <StatusPill status="rejected" label="Not accepted" />}
            </div>
            <p className="text-sm text-muted mt-1">
              {rejected
                ? `Your last payment wasn't accepted${data.payment?.rejectionReason ? ` — ${data.payment.rejectionReason}` : ""}. Please try again.`
                : "Welcome aboard. There's one thing left: your membership fee."}
            </p>
            <p className="text-[20px] font-semibold text-org-primary mt-2">{formatMoney(fee.amount, currencySymbol)}</p>
          </div>
        </div>

        {!checkout && (
          <button
            type="button"
            aria-label="Dismiss for now"
            onClick={() => {
              setDismissed(true);
              try {
                sessionStorage.setItem("rel8FeeNoticeDismissed", "1");
              } catch {
                /* storage disabled — it just reappears on the next page */
              }
            }}
            className="text-muted hover:text-ink flex-shrink-0"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {isFree(config) ? (
        <p className="mt-5 text-sm text-muted">No payment method is set up for this fee yet. Your association will be in touch.</p>
      ) : checkout ? (
        <div className="mt-5">
          <BankTransferPanel
            checkout={checkout}
            onDeclare={declare}
            declaring={declaring}
            declared={declared}
            error={declareError}
            requireProof={Boolean(config?.bankTransfer?.requireProof)}
            title="Transfer to the account below"
          />
          <Button variant="ghost" className="mt-3" onClick={() => setCheckout(null)}>
            Back
          </Button>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          <PaymentMethodChoice config={config} value={effectiveMethod} onChange={setPayMethod} disabled={starting} />
          <div>
            <Button isLoading={starting} onClick={begin}>
              Pay {formatMoney(fee.amount, currencySymbol)}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ApplicationFeeGate;
