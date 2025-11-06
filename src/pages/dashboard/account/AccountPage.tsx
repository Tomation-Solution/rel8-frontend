import accountWallet from "../../../assets/icons/account-wallet.png";
import CompletedPaymentTable from "../../../components/tables/CompletedPaymentTable";
import { useState } from "react";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchUserDues } from "../../../api/account/account-api";
import { TableDataType } from "../../../types/myTypes";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
// @ts-ignore
import Table from "../../../components/Table/Table";
import useDynamicPaymentApi from "../../../api/payment";
import apiTenant from "../../../api/baseApi";
import { FaExternalLinkAlt, FaLink } from "react-icons/fa";

const AccountPage = () => {
  const [showCompleted, setShowCompleted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDueId, setSelectedDueId] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const { pay, loadingPay } = useDynamicPaymentApi();
  const queryClient = useQueryClient();
  const { notifyUser } = Toast();

  const showPendingTable = () => {
    setShowCompleted(false);
  };
  const showCompletedTable = () => {
    setShowCompleted(true);
  };

  const { data, isError, isLoading } = useQuery("userDues", fetchUserDues);

  // Mutation for requesting confirmation
  const requestConfirmationMutation = useMutation(
    async ({ dueId, proofFile }: { dueId: string; proofFile: File | null }) => {
      const formData = new FormData();
      if (proofFile) {
        formData.append('proof', proofFile);
      }
      const response = await apiTenant.post(`/api/dues/pay/${dueId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
    }
  );

  if (isLoading) {
    return <CircleLoader />;
  }

  const paidDues = data?.filter(
    (dues: TableDataType) => dues.is_paid === true && dues.is_overdue === false
  );
  const pendingDues = data?.filter((dues: TableDataType) => true);

  const openCheckoutLink = (link: string) => {
    window.open(link, "_blank");
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
    ?.filter((dues: TableDataType) => true)
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
          ${parseFloat(value).toFixed(2)}
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
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        const status = row.original.status// || (row.original.confirmed ? "confirmed" : "pending");
        
        const statusConfig = {
          approved: {
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            label: "Confirmed"
          },
          pending: {
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            label: "Pending"
          },

          "awaiting-confirmation": {
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            label: "Awaiting confirmation"
          },
          rejected: {
            bgColor: "bg-red-100",
            textColor: "text-red-800",
            label: "Rejected"
          }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
          <span className={`px-2 py-1 ${config.bgColor} ${config.textColor} rounded-full text-sm inline-block`}>
            {config.label}
          </span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "paymentLink",
      Cell: ({ row }) => {
        const status = row.original.status || 'pending';
        const isApproved = status === "approved";
        const isPending = status === "pending";
        const isRejected = status === "rejected";
        const isPaid = row.original.is_paid;

        return (
          <div className="flex justify-end gap-x-2">
            {isPending && !isPaid && 
              <button
                className="text-white flex items-center gap-3 bg-org-primary px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
                onClick={(e) => {
                  openCheckoutLink(row.original.paymentLink);
                  e.stopPropagation();
                }}
              >
                <span>
                  Pay
                  </span>
                   <FaExternalLinkAlt/>
              </button>
            }
            {!isPaid && isPending && (
              <button
                className="text-org-primary bg-org-secondary px-4 py-2 rounded-md hover:bg-opacity-90 transition-all min-w-[140px]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRequestConfirmation(row.original._id);
                }}
              >
                Request Confirmation
              </button>
            )}
            {!isPaid && isRejected && (
              <button
                className="text-org-primary bg-org-secondary px-4 py-2 rounded-md hover:bg-opacity-90 transition-all min-w-[140px]"
                onClick={(e) => {
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

  return (
    <main>
      <BreadCrumb title="My Account" />
      {(loadingPay || requestConfirmationMutation.isLoading) && <CircleLoader />}
      <div className="flex items-center gap-x-9">
        <div className="flex items-center">
          <img
            className="w-[100px] h-[100px] object-contain"
            src={accountWallet}
            alt=""
          />
          <div>
            <h3 className="text-3xl font-bold text-org-primary-blue">
              {totalPendingAmount}
            </h3>
            <small>Total Outstanding fee</small>
          </div>
        </div>
        <div className="flex hidden items-center gap-2">
          <button
            onClick={showCompletedTable}
            className={`${
              showCompleted
                ? "bg-org-primary text-white p-2  border border-white  "
                : "bg-[#ccddea] text-black border p-2 border-primaryBlue h-[40px] rounded-md"
            } h-[40px] rounded-md`}
          >
            Completed Payment
          </button>
          <button
            onClick={showPendingTable}
            className={`${
              !showCompleted
                ? "bg-org-primary text-white p-2  border border-white  "
                : "bg-[#ccddea] text-black border p-2 border-primaryBlue h-[40px] rounded-md"
            } h-[40px] rounded-md`}
          >
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
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 w-full"
            />
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
              <button
                onClick={handleSubmitConfirmation}
                disabled={!proofFile || requestConfirmationMutation.isLoading}
                className="px-4 py-2 bg-org-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50"
              >
                {requestConfirmationMutation.isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AccountPage;