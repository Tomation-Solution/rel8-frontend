import accountWallet from "../../../assets/icons/account-wallet.png";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchUserDues } from "../../../api/account/account-api";
import { fetchOrganizationSettings } from "../../../api/organization/organization-api";
import { TableDataType } from "../../../types/myTypes";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
// @ts-ignore
import Table from "../../../components/Table/Table";
import useDynamicPaymentApi from "../../../api/payment";
import apiTenant from "../../../api/baseApi";
import { FaExternalLinkAlt, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import { initializeDuePayment } from "../../../api/paystack-api";

const DuesPage = () => {
  const [showCompleted, setShowCompleted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDueId, setSelectedDueId] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [paystackLoadingId, setPaystackLoadingId] = useState<string | null>(null);
  const { pay, loadingPay } = useDynamicPaymentApi();
  const queryClient = useQueryClient();
  const { notifyUser } = Toast();

  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
    CAD: "C$",
    AUD: "A$",
  };

  const showPendingTable = () => {
    setShowCompleted(false);
  };
  const showCompletedTable = () => {
    setShowCompleted(true);
  };

  const { data, isError, isLoading } = useQuery("userDues", fetchUserDues);
  const { data: orgSettings } = useQuery("organizationSettings", fetchOrganizationSettings);

  const currentCurrency = orgSettings?.settings?.currency || "USD";
  const currencySymbol = currencySymbols[currentCurrency] || "$";

  // Mutation for requesting confirmation
  const requestConfirmationMutation = useMutation(
    async ({ dueId, proofFile }: { dueId: string; proofFile: File | null }) => {
      const formData = new FormData();
      if (proofFile) {
        formData.append("proof", proofFile);
      }
      const response = await apiTenant.post(`/api/dues/pay/${dueId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    {
      onSuccess: (_, { dueId }) => {
        // Update the cache to reflect the new status
        queryClient.setQueryData("userDues", (oldData: any) => {
          return oldData?.map((due: TableDataType) => {
            if (due._id === dueId) {
              return { ...due, status: "awaiting-confirmation" };
            }
            return due;
          });
        });
        setIsModalOpen(false);
        setProofFile(null);
        setSelectedDueId(null);
        notifyUser("Confirmation request submitted successfully", "success");
      },
      onError: (error: any) => {
        notifyUser(error?.response?.data?.message || "Failed to submit confirmation request", "error");
      },
    },
  );

  const paidDues = data?.filter((dues: TableDataType) => dues.is_paid === true && dues.is_overdue === false);
  const pendingDues = data?.filter((dues: TableDataType) => true);

  const openCheckoutLink = (link: string) => {
    window.open(link, "_blank");
  };

  const handlePaystackDue = async (memberDueId: string) => {
    try {
      setPaystackLoadingId(memberDueId);
      const { authorizationUrl } = await initializeDuePayment(memberDueId);
      window.location.href = authorizationUrl;
    } catch (err: any) {
      notifyUser(err?.response?.data?.message || "Failed to initialize payment", "error");
      setPaystackLoadingId(null);
    }
  };

  // ── Receipt download ──────────────────────────────────────────────────────
  const downloadReceipt = async (due: any) => {
    const SCALE = 2;
    const A4_W = 210;
    const A4_H = 297;
    const PX_W = Math.round(A4_W * SCALE * (96 / 25.4));
    const PX_H = Math.round(A4_H * SCALE * (96 / 25.4));
    const mm = (mm: number) => mm * SCALE * (96 / 25.4);

    const canvas = document.createElement("canvas");
    canvas.width = PX_W;
    canvas.height = PX_H;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, PX_W, PX_H);

    // Get org info from localStorage tenant
    let orgName = "Organisation";
    let orgLogoUrl: string | null = null;
    try {
      const tenant = JSON.parse(localStorage.getItem("tenant-info") ?? "");
      orgName = tenant?.organization?.name ?? orgName;
      orgLogoUrl = tenant?.organization?.logo ?? tenant?.organization?.logoUrl ?? null;
    } catch {
      /* ignore */
    }

    // Try to load logo
    let logoImg: HTMLImageElement | null = null;
    if (orgLogoUrl) {
      try {
        logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = orgLogoUrl!;
        });
      } catch {
        logoImg = null;
      }
    }

    const pad = mm(15);
    let y = pad;

    // Header bar
    const headerH = mm(28);
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(0, 0, PX_W, headerH);

    // Logo
    const logoSize = mm(18);
    if (logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pad + logoSize / 2, headerH / 2, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, pad, (headerH - logoSize) / 2, logoSize, logoSize);
      ctx.restore();
    }

    // Org name in header
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${mm(7)}px sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(orgName, pad + (logoImg ? logoSize + mm(5) : 0), headerH / 2);

    y = headerH + mm(12);

    // Title
    ctx.fillStyle = "#1e3a5f";
    ctx.font = `bold ${mm(10)}px sans-serif`;
    ctx.textBaseline = "alphabetic";
    ctx.fillText("PAYMENT RECEIPT", pad, y);
    y += mm(4);

    // Divider
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = mm(0.8);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(PX_W - pad, y);
    ctx.stroke();
    y += mm(8);

    // Receipt meta (right-aligned)
    const receiptDate = due.paidAt ? new Date(due.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date(due.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const metaLines = [
      ["Receipt No.", `#${String(due._id).slice(-8).toUpperCase()}`],
      ["Date", receiptDate],
    ];
    ctx.font = `${mm(4.5)}px sans-serif`;
    for (const [label, value] of metaLines) {
      ctx.fillStyle = "#666666";
      ctx.fillText(label, pad, y);
      ctx.fillStyle = "#111111";
      const valW = ctx.measureText(value).width;
      ctx.fillText(value, PX_W - pad - valW, y);
      y += mm(7);
    }
    y += mm(4);

    // Bill-to section
    ctx.fillStyle = "#f5f7fa";
    ctx.beginPath();
    ctx.roundRect(pad, y, PX_W - pad * 2, mm(22), mm(3));
    ctx.fill();
    ctx.fillStyle = "#1e3a5f";
    ctx.font = `bold ${mm(4.5)}px sans-serif`;
    ctx.fillText("BILLED TO", pad + mm(5), y + mm(6));
    ctx.fillStyle = "#333333";
    ctx.font = `${mm(4.5)}px sans-serif`;
    ctx.fillText(due.user__email ?? "", pad + mm(5), y + mm(13));
    y += mm(28);

    // Table header
    const colDesc = pad;
    const colQty = PX_W - pad - mm(60);
    const colAmt = PX_W - pad - mm(22);
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(pad, y, PX_W - pad * 2, mm(9));
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${mm(4)}px sans-serif`;
    ctx.fillText("Description", colDesc + mm(3), y + mm(5.8));
    ctx.fillText("Status", colQty, y + mm(5.8));
    ctx.fillText("Amount", colAmt, y + mm(5.8));
    y += mm(9);

    // Table row
    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(pad, y, PX_W - pad * 2, mm(11));
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = mm(0.3);
    ctx.strokeRect(pad, y, PX_W - pad * 2, mm(11));
    ctx.fillStyle = "#111111";
    ctx.font = `${mm(4.5)}px sans-serif`;
    ctx.fillText(due.purpose ?? "Due Payment", colDesc + mm(3), y + mm(7));
    const statusLabel = due.status === "approved" ? "Confirmed" : (due.status ?? "");
    ctx.fillStyle = "#16a34a";
    ctx.fillText(statusLabel, colQty, y + mm(7));
    const amtText = `${currencySymbol}${parseFloat(due.amount).toFixed(2)}`;
    ctx.fillStyle = "#111111";
    const amtW = ctx.measureText(amtText).width;
    ctx.fillText(amtText, colAmt + mm(12) - amtW, y + mm(7));
    y += mm(11);

    // Divider above total
    y += mm(4);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = mm(0.3);
    ctx.beginPath();
    ctx.moveTo(colQty - mm(5), y);
    ctx.lineTo(PX_W - pad, y);
    ctx.stroke();
    y += mm(7);

    // Total row
    ctx.fillStyle = "#111111";
    ctx.font = `bold ${mm(5)}px sans-serif`;
    ctx.fillText("Total Paid", colQty - mm(5), y);
    ctx.fillStyle = "#1e3a5f";
    ctx.font = `bold ${mm(5.5)}px sans-serif`;
    const totalW = ctx.measureText(amtText).width;
    ctx.fillText(amtText, colAmt + mm(12) - totalW, y);
    y += mm(16);

    // Footer note
    ctx.fillStyle = "#9ca3af";
    ctx.font = `italic ${mm(3.8)}px sans-serif`;
    ctx.fillText("This is a system-generated receipt and requires no signature.", pad, y);

    // Bottom accent bar
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(0, PX_H - mm(8), PX_W, mm(8));
    ctx.fillStyle = "#ffffff";
    ctx.font = `${mm(3.5)}px sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(orgName, pad, PX_H - mm(4));

    // Export
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.addImage(imgData, "PNG", 0, 0, A4_W, A4_H);
    pdf.save(`receipt-${String(due._id).slice(-8).toUpperCase()}.pdf`);
  };

  const handleRequestConfirmation = (dueId: string) => {
    setSelectedDueId(dueId);
    setIsModalOpen(true);
  };

  const handleSubmitConfirmation = () => {
    if (selectedDueId && proofFile) {
      requestConfirmationMutation.mutate({ dueId: selectedDueId, proofFile });
    } else {
      notifyUser("Please select a proof of payment file", "error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const totalPendingAmount = data
    ?.filter((dues: TableDataType) => dues.status != "approved")
    ?.reduce((total: number, dues: TableDataType) => {
      return total + parseFloat(dues.amount);
    }, 0);

  if (isError) {
    notifyUser("An error occured while fetching account details", "error");
  }

  const prop_columns = [
    {
      Header: "Due Name",
      accessor: "purpose",
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ value }) => (
        <span className="text-org-primary font-semibold">
          {currencySymbol}
          {parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      Header: "Date",
      accessor: "startDate",
      Cell: ({ value }) => {
        const date = new Date(value);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      Header: "Reason",
      accessor: "reason",
      Cell: ({ value }) => {
        return <span>{value}</span>;
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        const status = row.original.status; // || (row.original.confirmed ? "confirmed" : "pending");

        const statusConfig = {
          approved: {
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            label: "Confirmed",
          },
          pending: {
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            label: "Pending",
          },

          "awaiting-confirmation": {
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            label: "Awaiting confirmation",
          },
          rejected: {
            bgColor: "bg-red-100",
            textColor: "text-red-800",
            label: "Rejected",
          },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return <span className={`px-2 py-1 ${config.bgColor} ${config.textColor} rounded-full text-sm inline-block`}>{config.label}</span>;
      },
    },
    {
      Header: "Action",
      accessor: "paymentLink",
      Cell: ({ row }) => {
        const status = row.original.status || "pending";
        const isApproved = status === "approved";
        const isPending = status === "pending";
        const isRejected = status === "rejected";
        const isPaid = row.original.is_paid;
        const isPaystack = row.original.paymentType === "paystack";
        const isLoading = paystackLoadingId === row.original._id;

        return (
          <div className="flex justify-end gap-x-2">
            {/* Receipt for approved dues */}
            {isApproved && (
              <button
                className="text-white flex items-center gap-2 bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition-all"
                onClick={e => {
                  e.stopPropagation();
                  downloadReceipt(row.original);
                }}
              >
                <FaDownload />
                <span>Receipt</span>
              </button>
            )}

            {/* Paystack path: Pay Now button */}
            {isPaystack && !isPaid && (isPending || isRejected) && (
              <button
                disabled={!!paystackLoadingId}
                className="text-white flex items-center gap-2 bg-org-primary px-4 py-2 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                onClick={e => {
                  e.stopPropagation();
                  handlePaystackDue(row.original._id);
                }}
              >
                {isLoading ? "Redirecting…" : "Pay Now"}
              </button>
            )}

            {/* Manual path: external link + proof upload */}
            {!isPaystack && !isPaid && isPending && (
              <>
                {row.original.paymentLink && (
                  <button
                    className="text-white flex items-center gap-3 bg-org-primary px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
                    onClick={e => {
                      openCheckoutLink(row.original.paymentLink);
                      e.stopPropagation();
                    }}
                  >
                    <span>Pay</span>
                    <FaExternalLinkAlt />
                  </button>
                )}
                <button
                  className="text-org-primary bg-org-secondary px-4 py-2 rounded-md hover:bg-opacity-90 transition-all min-w-[140px]"
                  onClick={e => {
                    e.stopPropagation();
                    handleRequestConfirmation(row.original._id);
                  }}
                >
                  Request Confirmation
                </button>
              </>
            )}

            {/* Manual path: rejected → request again */}
            {!isPaystack && !isPaid && isRejected && (
              <button
                className="text-org-primary bg-org-secondary px-4 py-2 rounded-md hover:bg-opacity-90 transition-all min-w-[140px]"
                onClick={e => {
                  e.stopPropagation();
                  handleRequestConfirmation(row.original._id);
                }}
              >
                Request Again
              </button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <CircleLoader />;
  }

  return (
    <>
      {(loadingPay || requestConfirmationMutation.isLoading) && <CircleLoader />}
      <div className="flex items-center gap-x-9">
        <div className="flex items-center">
          <img className="w-[100px] h-[100px] object-contain" src={accountWallet} alt="" />
          <div>
            <h3 className="text-3xl font-bold text-org-primary-blue">
              {currencySymbol}
              {totalPendingAmount?.toFixed(2)}
            </h3>
            <small>Total Outstanding fee</small>
          </div>
        </div>
        <div className="flex hidden items-center gap-2">
          <button onClick={showCompletedTable} className={`${showCompleted ? "bg-org-primary text-white p-2  border border-white  " : "bg-[#ccddea] text-black border p-2 border-primaryBlue h-[40px] rounded-md"} h-[40px] rounded-md`}>
            Completed Payment
          </button>
          <button onClick={showPendingTable} className={`${!showCompleted ? "bg-org-primary text-white p-2  border border-white  " : "bg-[#ccddea] text-black border p-2 border-primaryBlue h-[40px] rounded-md"} h-[40px] rounded-md`}>
            Pending Payment
          </button>
        </div>
      </div>
      <div>
        <Table prop_columns={prop_columns} custom_data={pendingDues} />
      </div>

      {/* Modal for proof upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Proof of Payment</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 w-full" />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setProofFile(null);
                  setSelectedDueId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button onClick={handleSubmitConfirmation} disabled={!proofFile || requestConfirmationMutation.isLoading} className="px-4 py-2 bg-org-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50">
                {requestConfirmationMutation.isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DuesPage;
