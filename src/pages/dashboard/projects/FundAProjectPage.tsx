import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchActiveProjects, Project, ProjectContribution } from "../../../api/projects/projects-api";
import { declareProjectContribution, isFree, startProjectContribution, supportsMethod, type PaymentCheckout, type PaymentMethod } from "../../../api/paystack-api";
import BankTransferPanel from "../../../components/payments/BankTransferPanel";
import PaymentMethodChoice from "../../../components/payments/PaymentMethodChoice";
import { defaultMethod } from "../../../components/payments/defaultMethod";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useForm } from "react-hook-form";
import { Button, Card, EmptyState, MediaCardGrid, PageHeader, StatusPill } from "../../../components/ui";
import MediaCard from "../../../components/ui/MediaCard";
import { FiHeart } from "react-icons/fi";
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

    const labels: Record<string, string> = {
      pending: "Awaiting payment",
      awaiting_verification: "Awaiting confirmation",
      paid: "Paid",
      verified: "Verified",
      rejected: "Not accepted",
      failed: "Payment failed",
      cancelled: "Cancelled",
    };

    return <StatusPill status={effective} label={labels[effective] ?? undefined} />;
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
    <>
      <PageHeader title="Fund a Project" subtitle="Contribute your own part to the ongoing project" />

      {isLoading ? (
        <div className="py-20 grid place-items-center">
          <CircleLoader />
        </div>
      ) : !projects || projects.length === 0 ? (
        <EmptyState icon={FiHeart} title="No active projects" description="Projects your association opens for contribution will appear here." />
      ) : (
        <MediaCardGrid>
          {projects.map((project: Project) => {
            const banners = project.banners || (project.banner ? [project.banner] : []);
            return (
              <MediaCard
                key={project._id}
                image={banners[0]}
                title={project.name}
                excerpt={truncateDescription(project.description)}
                badge="New"
                badgeTone="brand"
                /* The chip is `ProjectContribution.status` for in-kind and `paymentStatus`
                   for cash — two different enums that only share a colour set. */
                status={undefined}
                footer={getProjectContributionStatus(project._id)}
                actions={
                  <Button fullWidth icon={FiHeart} onClick={() => openContributionModal(project)}>
                    Contribute to the Project
                  </Button>
                }
              />
            );
          })}
        </MediaCardGrid>
      )}

      {/* Contribution Modal */}
      {showContributionModal && selectedProject && (
        <div className="fixed inset-0 bg-ink/50 grid place-items-center z-50 p-4" role="dialog" aria-modal="true">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[20px] font-semibold text-ink">Contribute to {selectedProject.name}</h2>
                <button type="button" aria-label="Close" onClick={closeModal} className="text-muted hover:text-ink text-2xl leading-none">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Contribution Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Contribution Type</label>
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
                      <label className="block text-sm font-medium text-ink mb-2">Contribution Amount</label>
                      <input type="number" step="0.01" min="0" {...register("amount", { required: true })} className="form-control w-full p-2 border border-hairline rounded" placeholder="Enter amount" />
                      {errors.amount && <p className="text-status-danger text-xs mt-1">Amount is required</p>}
                    </div>

                    {isFree(selectedProject.paymentConfig) ? (
                      <div className="p-3 bg-status-warning-bg rounded">
                        <p className="text-sm text-status-warning">This project has no payment method configured. Please contact the organisation.</p>
                      </div>
                    ) : (
                      <>
                        <PaymentMethodChoice config={selectedProject.paymentConfig} value={payMethod} onChange={setPayMethod} disabled={paystackLoading} />

                        {payMethod === "paystack" ? (
                          <div className="p-3 bg-org-tint rounded">
                            <p className="text-sm text-org-primary">You'll be taken to Paystack to pay by card or bank transfer. Your contribution confirms automatically.</p>
                          </div>
                        ) : (
                          <div className="p-3 bg-org-tint/40 rounded">
                            <p className="text-sm text-ink">You'll be shown the account details and a reference to quote on your transfer.</p>
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
                    <label className="block text-sm font-medium text-ink mb-2">Describe Your In-Kind Contribution</label>
                    {errors.inKindDescription?.type === "required" && <FormError message="Description is required" />}
                    <textarea
                      {...register("inKindDescription", {
                        required: contributionType === "in_kind",
                      })}
                      rows={5}
                      className="form-control w-full p-2 border border-hairline rounded"
                      placeholder="Describe what you're contributing (e.g., services, materials, time, etc.)"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={closeModal} className="flex-1">
                    {transferCheckout ? "Close" : "Cancel"}
                  </Button>
                  {!transferCheckout && (
                    <Button onClick={handleSubmit(onSubmit)} isLoading={paystackLoading} className="flex-1">
                      {supportsMethod(selectedProject.paymentConfig, "paystack") && contributionType === "cash" ? "Contribute via Paystack" : "Submit Contribution"}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default FundAProjectPage;
