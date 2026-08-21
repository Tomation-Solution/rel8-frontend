import { isFree, supportsMethod, type PaymentConfig, type PaymentMethod } from "../../api/paystack-api";

/**
 * Lets the payer choose how to pay, when the admin has configured more than one way.
 *
 * The admin side supports selecting several methods per item, but the member side was
 * choosing on the payer's behalf: projects and services picked Paystack whenever it was
 * available, the account-page dues action was hardcoded to bank transfer, and event
 * registration sent no method at all so the server always resolved to Paystack. In every
 * one of those cases the second configured option was unreachable — the admin's choice
 * was recorded and then ignored.
 *
 * Renders nothing when there is only one method (nothing to choose) or none (the item is
 * free), so callers can drop it in unconditionally.
 */

interface PaymentMethodChoiceProps {
  config?: PaymentConfig | null;
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
  label?: string;
}

const COPY: Record<PaymentMethod, { label: string; hint: string }> = {
  paystack: {
    label: "Pay online",
    hint: "Card, transfer, USSD. Confirms immediately.",
  },
  bank_transfer: {
    label: "Bank transfer",
    hint: "Transfer to the association's account and quote the reference. An admin confirms it.",
  },
};

const PaymentMethodChoice = ({ config, value, onChange, disabled, label = "How would you like to pay?" }: PaymentMethodChoiceProps) => {
  if (isFree(config)) return null;

  const available = (["paystack", "bank_transfer"] as PaymentMethod[]).filter(m => supportsMethod(config, m));

  // One option is not a choice — showing a single radio just adds a click.
  if (available.length < 2) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      <div className="space-y-2">
        {available.map(method => {
          const selected = value === method;
          return (
            <button
              key={method}
              type="button"
              disabled={disabled}
              onClick={() => onChange(method)}
              className={`w-full text-left rounded-lg border p-3.5 transition-colors disabled:opacity-50 ${
                selected ? "border-org-primary bg-org-tint" : "border-hairline bg-white hover:border-org-primary/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${
                    selected ? "border-org-primary" : "border-muted"
                  }`}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-org-primary" />}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{COPY[method].label}</span>
                  <span className="block text-xs text-muted">{COPY[method].hint}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// `defaultMethod` lives in ./defaultMethod — a component file that also exports a helper
// trips react-refresh/only-export-components, and this repo lints at --max-warnings 0.

export default PaymentMethodChoice;
