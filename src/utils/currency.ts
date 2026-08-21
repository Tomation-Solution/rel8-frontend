import { useQuery } from "react-query";
import { fetchOrganizationSettings } from "../api/organization/organization-api";

/**
 * The organization's currency, resolved to a symbol.
 *
 * This map used to be copy-pasted into DuesPage, PaymentsTab, PayUpForASingleDue and
 * DashboardLayout, each with its own default. One copy now.
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  CAD: "C$",
  AUD: "A$",
};

export const currencySymbolFor = (code?: string | null): string => CURRENCY_SYMBOLS[String(code || "USD").toUpperCase()] || "$";

/**
 * Reads the org settings through the shared `"organizationSettings"` query key, so every
 * caller is served from one cached response rather than firing its own request.
 */
export const useCurrencySymbol = (): string => {
  const { data } = useQuery("organizationSettings", fetchOrganizationSettings, { staleTime: 10 * 60 * 1000 });
  return currencySymbolFor(data?.settings?.currency);
};

/** "₦5,000.00" — the stat-card and table money format. */
export const formatMoney = (amount: number | string | null | undefined, symbol: string): string => {
  const value = typeof amount === "number" ? amount : parseFloat(String(amount ?? "0"));
  const safe = Number.isFinite(value) ? value : 0;
  return `${symbol}${safe.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
