import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { IoWalletOutline } from "react-icons/io5";
import { FiDownload, FiCreditCard, FiUploadCloud, FiX } from "react-icons/fi";

import { fetchUserDues } from "../../../api/account/account-api";
import { declareDuePayment, isFree, isOutstanding, isSettled, PAYMENT_STATUS_LABEL, startDuePayment, supportsMethod, type PaymentCheckout } from "../../../api/paystack-api";
import BankTransferPanel from "../../../components/payments/BankTransferPanel";

import { Button, Card, EmptyState, Pagination, SearchFilterBar, StatCard, StatCardRow, StatusPill, Table, TableColumn } from "../../../components/ui";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { downloadDueReceipt } from "./receipt";
import { formatMoney, useCurrencySymbol } from "../../../utils/currency";
import { formatDate } from "../../../utils/dates";

const PER_PAGE = 12;

const FILTERS = [
  { value: "all", label: "All Dues" },
  { value: "outstanding", label: "Outstanding" },
  { value: "paid", label: "Paid" },
];

/**
 * The member's dues: outstanding total, searchable table, and the two payment paths.
 *
 * This started as two near-identical copies — `DuesPage` and the Account page's Payments
 * tab — which had drifted: the Account copy hand-rolled a multipart POST to
 * `/api/dues/pay/:id/declare` instead of calling `declareDuePayment`, so the two screens
 * declared transfers differently and only one honoured `requireProof`. They were merged
 * here in M7, and M11 dropped the Account tab entirely (the mockup's account SubNav has
 * only Profile Settings and Credentials, and Dues is its own item in the rail).
 *
 * ⚠️ Payment *logic* is settled — see CLAUDE.md X-1/X-7. This module is a restyle.
 *
 * The two rules that are easy to break and easy to miss:
 *   1. proof is optional unless `paymentConfig.bankTransfer.requireProof` is set;
 *   2. bank details never appear before a payment exists, because the reference generated
 *      alongside them is the only thing that lets an admin match a transfer to this member.
 */
interface DuesPanelProps {
  /** Hide the outstanding-total tile when the host screen already shows one. */
  showStat?: boolean;
}

const DuesPanel = ({ showStat = true }: DuesPanelProps) => {
  const queryClient = useQueryClient();
  const { notifyUser } = Toast();
  const currencySymbol = useCurrencySymbol();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [startingId, setStartingId] = useState<string | null>(null);

  // X-7: the transfer flow is two steps — start a payment to get a reference and the
  // account details, then declare the transfer against that reference.
  const [checkout, setCheckout] = useState<PaymentCheckout | null>(null);
  const [transferDueId, setTransferDueId] = useState<string | null>(null);
  const [requireProof, setRequireProof] = useState(false);
  const [declaring, setDeclaring] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [declareError, setDeclareError] = useState("");

  const { data, isError, isLoading } = useQuery("userDues", fetchUserDues);

  const dues = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const outstandingTotal = useMemo(() => dues.filter((due: any) => isOutstanding(due.status)).reduce((total: number, due: any) => total + (parseFloat(due.amount) || 0), 0), [dues]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return dues.filter((due: any) => {
      if (filter === "outstanding" && !isOutstanding(due.status)) return false;
      if (filter === "paid" && !isSettled(due.status)) return false;
      if (!needle) return true;
      return `${due.purpose ?? ""} ${due.amount ?? ""}`.toLowerCase().includes(needle);
    });
  }, [dues, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  /** Paystack redirects; bank transfer opens the panel with its generated reference. */
  const beginPayment = async (due: any, method?: "paystack" | "bank_transfer") => {
    setStartingId(due._id);
    setDeclareError("");
    setDeclared(false);
    try {
      const result = await startDuePayment(due._id, method);
      const co = result.checkout;

      if (co?.method === "paystack" && co.authorizationUrl) {
        window.location.href = co.authorizationUrl;
        return;
      }

      if (co?.method === "bank_transfer") {
        setCheckout(co);
        setTransferDueId(due._id);
        setRequireProof(Boolean(due?.paymentConfig?.bankTransfer?.requireProof));
      }
    } catch (err: any) {
      notifyUser(err?.response?.data?.message || "Failed to start payment", "error");
    } finally {
      setStartingId(null);
    }
  };

  const handleDeclareTransfer = async ({ proof, note }: { proof?: File | null; note?: string }) => {
    if (!transferDueId) return;
    setDeclaring(true);
    setDeclareError("");
    try {
      await declareDuePayment(transferDueId, { proof, note });
      setDeclared(true);
      queryClient.invalidateQueries("userDues");
    } catch (err: any) {
      setDeclareError(err?.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setDeclaring(false);
    }
  };

  const closeTransfer = () => {
    setCheckout(null);
    setTransferDueId(null);
    setDeclared(false);
    setDeclareError("");
  };

  if (isError) notifyUser("An error occured while fetching your dues", "error");

  const columns: TableColumn<any>[] = [
    { key: "purpose", label: "Due Name", render: due => <span className="font-medium">{due.purpose || "Due"}</span> },
    {
      key: "amount",
      label: `Amount (${currencySymbol})`,
      render: due => <span className="text-org-primary font-semibold">{formatMoney(due.amount, "")}</span>,
    },
    { key: "startDate", label: "Date", render: due => formatDate(due.startDate) },
    {
      key: "status",
      label: "Status",
      render: due => <StatusPill status={due.status} label={PAYMENT_STATUS_LABEL[due.status] ?? undefined} />,
    },
    {
      key: "actions",
      // Buttons get the full card width on a phone rather than a squeezed right column.
      mobileFullWidth: true,
      label: "Actions",
      align: "right",
      render: due => {
        const status = due.status || "unpaid";
        const settled = isSettled(status);
        const awaiting = status === "awaiting_verification" || status === "awaiting-confirmation";
        const owes = !settled && !awaiting;

        const hasPaystack = supportsMethod(due.paymentConfig, "paystack");
        const hasTransfer = supportsMethod(due.paymentConfig, "bank_transfer");
        const noMethod = isFree(due.paymentConfig);
        const busy = startingId === due._id;

        return (
          <div className="flex justify-end gap-2 flex-wrap">
            {settled && (
              <>
                <Button size="sm" variant="muted" disabled>
                  Due Paid
                </Button>
                <Button size="sm" variant="outline" icon={FiDownload} onClick={() => downloadDueReceipt(due, currencySymbol)}>
                  Receipt
                </Button>
              </>
            )}

            {awaiting && (
              <Button size="sm" variant="muted" disabled>
                Awaiting confirmation
              </Button>
            )}

            {owes && noMethod && <span className="text-sm text-muted">No payment method set</span>}

            {owes && hasPaystack && (
              <Button size="sm" icon={FiCreditCard} isLoading={busy} disabled={!!startingId && !busy} onClick={() => beginPayment(due, "paystack")}>
                Click to Pay
              </Button>
            )}

            {owes && hasTransfer && (
              <Button size="sm" variant="outline" icon={FiUploadCloud} isLoading={busy} disabled={!!startingId && !busy} onClick={() => beginPayment(due, "bank_transfer")}>
                Upload Receipt
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {showStat && (
        <StatCardRow className="lg:grid-cols-3">
          <StatCard title="Total Outstanding Dues" value={isLoading ? "..." : formatMoney(outstandingTotal, currencySymbol)} icon={IoWalletOutline} />
        </StatCardRow>
      )}

      <SearchFilterBar search={search} onSearchChange={resetPage(setSearch)} searchPlaceholder="Search by due name, amount" filter={filter} onFilterChange={resetPage(setFilter)} filterOptions={FILTERS} className="mb-6" />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : (
        <>
          <Table columns={columns} rows={visible} rowKey={due => due._id} empty={<EmptyState icon={IoWalletOutline} title={dues.length === 0 ? "No dues" : "Nothing matches that"} description={dues.length === 0 ? "You have no dues right now." : "Try a different search or filter."} />} />
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {/* X-7: bank details + reference, only after a payment exists to attach them to. */}
      {checkout && (
        <div className="fixed inset-0 bg-ink/50 grid place-items-center z-50 p-4" role="dialog" aria-modal="true">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-[18px] font-semibold text-ink">Pay by bank transfer</h3>
              <button type="button" onClick={closeTransfer} aria-label="Close" className="text-muted hover:text-ink">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <BankTransferPanel checkout={checkout} onDeclare={handleDeclareTransfer} declaring={declaring} declared={declared} error={declareError} requireProof={requireProof} title="Transfer to the account below" />

            <div className="mt-5 flex justify-end">
              <Button variant={declared ? "primary" : "outline"} onClick={closeTransfer}>
                {declared ? "Done" : "Close"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default DuesPanel;
