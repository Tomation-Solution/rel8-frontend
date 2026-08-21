import { useState } from "react";
import { useMutation } from "react-query";

import { declareDuePayment, startDuePayment, type PaymentCheckout } from "../../api/paystack-api";
import BankTransferPanel from "../payments/BankTransferPanel";
import { Button, Card } from "../ui";
import Toast from "../toast/Toast";
import { formatMoney, useCurrencySymbol } from "../../utils/currency";

interface Props {
  due__Name: string;
  amount: string;
  dueId: number;
}

/**
 * One outstanding due, payable in place. Used by the post-login `PayupPage`.
 *
 * MP-3: this screen used to handle only the Paystack path and told the member to go to the
 * Dues page for a transfer. It completes either flow here — the header comment claiming
 * otherwise outlived the fix and has been removed.
 */
const PayUpForASingleDue = ({ due__Name, amount, dueId }: Props) => {
  const { notifyUser } = Toast();
  const currencySymbol = useCurrencySymbol();

  const [checkout, setCheckout] = useState<PaymentCheckout | null>(null);
  const [declaring, setDeclaring] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [declareError, setDeclareError] = useState("");

  // X-7: dues start at POST /api/dues/pay/:dueId and return a unified `checkout`.
  const { mutate, isLoading } = useMutation(() => startDuePayment(String(dueId)), {
    onSuccess: data => {
      const co = data?.checkout;

      if (co?.method === "paystack" && co.authorizationUrl) {
        window.location.href = co.authorizationUrl;
        return;
      }

      if (co?.method === "bank_transfer") {
        setCheckout(co);
        return;
      }

      notifyUser("No payment method is configured for this due. Please contact your organisation.", "error");
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.message || "An error occurred while starting your payment", "error");
    },
  });

  const handleDeclare = async ({ proof, note }: { proof?: File | null; note?: string }) => {
    setDeclaring(true);
    setDeclareError("");
    try {
      await declareDuePayment(String(dueId), { proof, note });
      setDeclared(true);
    } catch (err: any) {
      setDeclareError(err?.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setDeclaring(false);
    }
  };

  if (checkout) {
    return (
      <div className="w-full my-3">
        <p className="mb-3 text-[15px] text-ink">
          {due__Name} — <span className="font-semibold text-org-primary">{formatMoney(amount, currencySymbol)}</span>
        </p>
        <BankTransferPanel checkout={checkout} onDeclare={handleDeclare} declaring={declaring} declared={declared} error={declareError} title="Transfer to the account below" />
      </div>
    );
  }

  return (
    <Card className="w-full my-2 p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[15px] text-ink truncate">{due__Name}</p>
        <p className="text-[18px] font-semibold text-org-primary">{formatMoney(amount, currencySymbol)}</p>
      </div>
      <Button isLoading={isLoading} onClick={() => mutate()}>
        Pay
      </Button>
    </Card>
  );
};

export default PayUpForASingleDue;
