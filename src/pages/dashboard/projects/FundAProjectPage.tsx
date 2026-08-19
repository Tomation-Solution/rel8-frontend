import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchActiveProjects, createContribution, Project, ProjectContribution } from "../../../api/projects/projects-api";
import { declareProjectContribution, isFree, startProjectContribution, supportsMethod, type PaymentCheckout, type PaymentMethod } from "../../../api/paystack-api";
import BankTransferPanel from "../../../components/payments/BankTransferPanel";
import PaymentMethodChoice, { defaultMethod } from "../../../components/payments/PaymentMethodChoice";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useForm } from "react-hook-form";
import ServicesFileUploadInput from "../../../components/form/ServicesFileUploadInput";
import { useRef } from "react";
import Button from "../../../components/button/Button";
import FormError from "../../../components/form/FormError";

interface ContributionFormData {
  contributionType: "cash" | "in_kind";
  inKindDescription?: string;
  amount?: string;
  proofOfPayment?: FileList;
}

const FundAProjectPage = () => {
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [paystackLoading, setPaystackLoading] = useState(false);
  // X-7: bank transfer is a two-step flow — start the contribution to get a
  // reference and the account details, then declare the transfer.
  // The payer's chosen method. Seeded from the project when the modal opens; only
  // actually offered as a choice when the project configures more than one.
  const [payMethod, setPayMethod] = useState<PaymentMethod>("bank_transfer");
  const [transferCheckout, setTransferCheckout] = useState<PaymentCheckout | null>(null);
  const [transferContributionId, setTransferContributionId] = useState<string | null>(null);
  const [declaring, setDeclaring] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [declareError, setDeclareError] = useState("");
  const proofOfPaymentRef = useRef<HTMLInputElement | null>(null);

  const { data: projects, isLoading, isError } = useQuery("active-projects", fetchActiveProjects);
  const { data: myContributions } = useQuery("my-contributions", () => import("../../../api/projects/projects-api").then(m => m.fetchMyContributions()));

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ContributionFormData>({
    defaultValues: {
      contributionType: "cash",
    },
  });

  const contributionType = watch("contributionType");

  const handleProofOfPaymentClick = () => {
    if (proofOfPaymentRef.current) {
      proofOfPaymentRef.current.click();
    }
  };

  const createContributionMutation = useMutation(createContribution, {
    onSuccess: () => {
      notifyUser("Contribution submitted successfully!", "success");
      setShowContributionModal(false);
      reset();
      queryClient.invalidateQueries("my-contributions");
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.message || "Failed to submit contribution", "error");
    },
  });

  /**
   * Submit a contribution (X-7).
   *
   * in_kind  -> no payment; straight into the admin verification queue.
   * cash     -> creates a Payment and returns either a Paystack checkout URL or the
   *             association's bank details plus a reference to quote.
   */
  const onSubmit = async (data: ContributionFormData) => {
    if (!selectedProject) return;

    if (data.contributionType === "in_kind") {
      if (!data.inKindDescription) {
        notifyUser("Please describe your in-kind contribution", "error");
        return;
      }
      try {
        setPaystackLoading(true);
        await startProjectContribution({
          projectId: selectedProject._id,
          contributionType: "in_kind",
          inKindDescription: data.inKindDescription,
        });
        notifyUser("Contribution submitted successfully!", "success");
        setShowContributionModal(false);
        reset();
        queryClient.invalidateQueries("my-contributions");
      } catch (err: any) {
        notifyUser(err?.response?.data?.message || "Failed to submit contribution", "error");
      } finally {
        setPaystackLoading(false);
      }
      return;
    }

    // ---- cash ---------------------------------------------------------------
    const amount = data.amount ? parseFloat(data.amount) : 0;
    if (!amount || amount <= 0) {
      notifyUser("Please enter a valid contribution amount", "error");
      return;
    }

    const config = selectedProject.paymentConfig;
    if (isFree(config)) {
      notifyUser("This project has no payment method configured", "error");
      return;
    }

    // The payer chose this when the project offers both; otherwise it is the only
    // configured method. It used to be decided here, ignoring the admin's second option.
    const method = supportsMethod(config, payMethod) ? payMethod : defaultMethod(config);

    try {
      setPaystackLoading(true);
      setDeclared(false);
      setDeclareError("");

      const result = await startProjectContribution({
        projectId: selectedProject._id,
        contributionType: "cash",
        amount,
        method,
      });

      const checkout = result.checkout;

      if (checkout?.method === "paystack" && checkout.authorizationUrl) {
        window.location.href = checkout.authorizationUrl;
        return;
      }

      if (checkout?.method === "bank_transfer") {
        setTransferCheckout(checkout);
        setTransferContributionId(result.contribution?._id ?? null);
        queryClient.invalidateQueries("my-contributions");
      }
    } catch (err: any) {
      notifyUser(err?.response?.data?.message || "Failed to submit contribution", "error");
    } finally {
      setPaystackLoading(false);
    }
  };

  /** Member states they have made the transfer. Proof optional. */
  const handleDeclareTransfer = async ({ proof, note }: { proof?: File | null; note?: string }) => {
    if (!transferContributionId) return;
    setDeclaring(true);
    setDeclareError("");
    try {
      await declareProjectContribution(transferContributionId, { proof, note });
      setDeclared(true);
      queryClient.invalidateQueries("my-contributions");
    } catch (err: any) {
      setDeclareError(err?.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setDeclaring(false);
    }
  };

  const openContributionModal = (project: Project) => {
    setSelectedProject(project);
    setShowContributionModal(true);
    // Seed the choice from this project, so a project offering only one method still
    // starts on that method rather than on a stale selection from the previous one.
    setPayMethod(defaultMethod(project.paymentConfig));
    reset({ contributionType: "cash" });
  };

  const closeModal = () => {
    setShowContributionModal(false);
    setSelectedProject(null);
    setTransferCheckout(null);
    setTransferContributionId(null);
    setDeclared(false);
    setDeclareError("");
    reset();
  };

  const getProjectContributionStatus = (projectId: string) => {
    const contribution = myContributions?.find((c: ProjectContribution) => c.projectId._id === projectId);
    if (!contribution) return null;

    // X-7: cash contributions are governed by the unified paymentStatus; in-kind
    // contributions are not payments and keep their own `status`.
    const effective = contribution.contributionType === "cash" ? contribution.paymentStatus || "pending" : contribution.status;

    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      awaiting_verification: "bg-orange-100 text-orange-800",
      paid: "bg-green-100 text-green-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-600",
    };

    const labels: Record<string, string> = {
      pending: "Awaiting payment",
      awaiting_verification: "Awaiting confirmation",
      paid: "Paid",
      verified: "Verified",
      rejected: "Not accepted",
      failed: "Payment failed",
      cancelled: "Cancelled",
    };

    return <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[effective] ?? "bg-gray-100 text-gray-700"}`}>{labels[effective] ?? effective}</span>;
  };

  if (isError) {
    notifyUser("An error occurred while fetching projects", "error");
  }

  // Parse HTML description
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateDescription = (html: string, maxLength: number = 150) => {
    const text = stripHtml(html);
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_280px] gap-7">
      <div className="min-w-0 overflow-hidden md:px-0 px-5">
        <BreadCrumb title="Fund a Project" />

        {isLoading && <CircleLoader />}

        {!isLoading && projects && projects.length === 0 && <div className="py-10 text-center text-[25px]">No active projects available at the moment.</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {!isLoading &&
            projects?.map((project: Project) => {
              const projectBanners = project.banners || (project.banner ? [project.banner] : []);
              const mainBanner = projectBanners[0] || "/placeholder-image.jpg";

              return (
                <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {mainBanner && (
                    <div className="h-48 overflow-hidden">
                      <img src={mainBanner} alt={project.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                      {getProjectContributionStatus(project._id)}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{truncateDescription(project.description)}</p>

                    {/* X-7: account details are no longer shown up front — they come
                        with a payment reference once a contribution is started, so the
                        transfer can actually be matched to the member. */}
                    {!isFree(project.paymentConfig) && (
                      <p className="mb-4 text-xs text-gray-500">
                        {supportsMethod(project.paymentConfig, "paystack") && supportsMethod(project.paymentConfig, "bank_transfer")
                          ? "Pay by card or bank transfer"
                          : supportsMethod(project.paymentConfig, "paystack")
                            ? "Pay by card or transfer via Paystack"
                            : "Pay by bank transfer"}
                      </p>
                    )}

                    <Button text="Contribute" onClick={() => openContributionModal(project)} className="w-full" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Contribution Modal */}
      {showContributionModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Contribute to {selectedProject.name}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Contribution Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" value="cash" {...register("contributionType", { required: true })} className="mr-2" />
                      Cash
                    </label>
                    <label className="flex items-center">
                      <input type="radio" value="in_kind" {...register("contributionType", { required: true })} className="mr-2" />
                      In Kind
                    </label>
                  </div>
                </div>

                {/* Cash Contribution Fields */}
                {contributionType === "cash" && !transferCheckout && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Amount</label>
                      <input type="number" step="0.01" min="0" {...register("amount", { required: true })} className="form-control w-full p-2 border border-gray-300 rounded" placeholder="Enter amount" />
                      {errors.amount && <p className="text-red-500 text-xs mt-1">Amount is required</p>}
                    </div>

                    {isFree(selectedProject.paymentConfig) ? (
                      <div className="p-3 bg-yellow-50 rounded">
                        <p className="text-sm text-yellow-800">This project has no payment method configured. Please contact the organisation.</p>
                      </div>
                    ) : (
                      <>
                        <PaymentMethodChoice config={selectedProject.paymentConfig} value={payMethod} onChange={setPayMethod} disabled={paystackLoading} />

                        {payMethod === "paystack" ? (
                          <div className="p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-800">You'll be taken to Paystack to pay by card or bank transfer. Your contribution confirms automatically.</p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-700">You'll be shown the account details and a reference to quote on your transfer.</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* X-7: bank details + reference, after the contribution is started */}
                {contributionType === "cash" && transferCheckout && (
                  <BankTransferPanel
                    checkout={transferCheckout}
                    onDeclare={handleDeclareTransfer}
                    declaring={declaring}
                    declared={declared}
                    error={declareError}
                    requireProof={Boolean(selectedProject.paymentConfig?.bankTransfer?.requireProof)}
                    title="Transfer to the account below"
                  />
                )}

                {/* In-Kind Contribution Fields */}
                {contributionType === "in_kind" && !transferCheckout && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Describe Your In-Kind Contribution</label>
                    {errors.inKindDescription?.type === "required" && <FormError message="Description is required" />}
                    <textarea
                      {...register("inKindDescription", {
                        required: contributionType === "in_kind",
                      })}
                      rows={5}
                      className="form-control w-full p-2 border border-gray-300 rounded"
                      placeholder="Describe what you're contributing (e.g., services, materials, time, etc.)"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button text={transferCheckout ? "Close" : "Cancel"} onClick={closeModal} type="outlined" className="flex-1" />
                  {!transferCheckout && (
                    <Button
                      text={paystackLoading ? "Please wait…" : supportsMethod(selectedProject.paymentConfig, "paystack") && contributionType === "cash" ? "Contribute via Paystack" : "Submit Contribution"}
                      onClick={handleSubmit(onSubmit)}
                      isLoading={paystackLoading}
                      className="flex-1"
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default FundAProjectPage;
