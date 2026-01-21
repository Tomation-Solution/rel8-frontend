import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchActiveProjects, createContribution, Project, ProjectContribution } from "../../../api/projects/projects-api";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useForm } from "react-hook-form";
import ServicesFileUploadInput from "../../../components/form/ServicesFileUploadInput";
import { useRef } from "react";
import Button from "../../../components/button/Button";
import FormError from "../../../components/form/FormError";

interface ContributionFormData {
  contributionType: 'cash' | 'in_kind';
  inKindDescription?: string;
  amount?: string;
  proofOfPayment?: FileList;
}

const FundAProjectPage = () => {
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const proofOfPaymentRef = useRef<HTMLInputElement | null>(null);

  const { data: projects, isLoading, isError } = useQuery('active-projects', fetchActiveProjects);
  const { data: myContributions } = useQuery('my-contributions', () => 
    import("../../../api/projects/projects-api").then(m => m.fetchMyContributions())
  );

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ContributionFormData>({
    defaultValues: {
      contributionType: 'cash'
    }
  });

  const contributionType = watch('contributionType');

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
      queryClient.invalidateQueries('my-contributions');
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.message || "Failed to submit contribution", "error");
    }
  });

  const onSubmit = async (data: ContributionFormData) => {
    if (!selectedProject) return;

    const proofOfPaymentFile = data.proofOfPayment?.[0];

    if (data.contributionType === 'cash' && !proofOfPaymentFile) {
      notifyUser("Proof of payment is required for cash contributions", "error");
      return;
    }

    if (data.contributionType === 'in_kind' && !data.inKindDescription) {
      notifyUser("Please describe your in-kind contribution", "error");
      return;
    }

    createContributionMutation.mutate({
      projectId: selectedProject._id,
      contributionType: data.contributionType,
      inKindDescription: data.inKindDescription,
      amount: data.amount ? parseFloat(data.amount) : undefined,
    }, proofOfPaymentFile as any);
  };

  const openContributionModal = (project: Project) => {
    setSelectedProject(project);
    setShowContributionModal(true);
    reset({ contributionType: 'cash' });
  };

  const closeModal = () => {
    setShowContributionModal(false);
    setSelectedProject(null);
    reset();
  };

  const getProjectContributionStatus = (projectId: string) => {
    const contribution = myContributions?.find((c: ProjectContribution) => c.projectId._id === projectId);
    if (!contribution) return null;
    
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[contribution.status]}`}>
        {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
      </span>
    );
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
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <main className='grid grid-cols-1 md:grid-cols-4 gap-7'>
      <div className='col-span-1 md:col-span-3 md:px-0 px-5'>
        <BreadCrumb title='Fund a Project' />
        
        {isLoading && <CircleLoader />}
        
        {!isLoading && projects && projects.length === 0 && (
          <div className="py-10 text-center text-[25px]">
            No active projects available at the moment.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {!isLoading && projects?.map((project: Project) => {
            const projectBanners = project.banners || (project.banner ? [project.banner] : []);
            const mainBanner = projectBanners[0] || '/placeholder-image.jpg';
            
            return (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {mainBanner && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={mainBanner}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    {getProjectContributionStatus(project._id)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateDescription(project.description)}
                  </p>
                  
                  {project.paymentType === 'payment_link' && (
                    <div className="mb-4">
                      <a
                        href={project.paymentDetails}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Payment Link →
                      </a>
                    </div>
                  )}
                  
                  {project.paymentType === 'account' && (
                    <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
                      <p className="font-semibold text-gray-700 mb-1">Account Information:</p>
                      <p className="text-gray-600 whitespace-pre-wrap">{project.paymentDetails}</p>
                    </div>
                  )}
                  
                  <Button
                    text="Contribute"
                    onClick={() => openContributionModal(project)}
                    className="w-full"
                  />
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
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Contribution Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contribution Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="cash"
                        {...register('contributionType', { required: true })}
                        className="mr-2"
                      />
                      Cash
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="in_kind"
                        {...register('contributionType', { required: true })}
                        className="mr-2"
                      />
                      In Kind
                    </label>
                  </div>
                </div>

                {/* Cash Contribution Fields */}
                {contributionType === 'cash' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (Optional)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register('amount')}
                        className="form-control w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      {errors.proofOfPayment?.type === 'required' && (
                        <FormError message="Proof of payment is required" />
                      )}
                      <ServicesFileUploadInput
                        register={register}
                        text="Upload Proof of Payment"
                        name="proofOfPayment"
                        ref={proofOfPaymentRef}
                        onClick={handleProofOfPaymentClick}
                      />
                      <small className="text-gray-500 text-xs mt-1 block">
                        Upload receipt or proof of payment
                      </small>
                    </div>

                    {selectedProject.paymentType === 'payment_link' && (
                      <div className="p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800 mb-2">
                          Make your payment using the link below, then upload proof:
                        </p>
                        <a
                          href={selectedProject.paymentDetails}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {selectedProject.paymentDetails}
                        </a>
                      </div>
                    )}

                    {selectedProject.paymentType === 'account' && (
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Account Information:
                        </p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {selectedProject.paymentDetails}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* In-Kind Contribution Fields */}
                {contributionType === 'in_kind' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe Your In-Kind Contribution
                    </label>
                    {errors.inKindDescription?.type === 'required' && (
                      <FormError message="Description is required" />
                    )}
                    <textarea
                      {...register('inKindDescription', { 
                        required: contributionType === 'in_kind' 
                      })}
                      rows={5}
                      className="form-control w-full p-2 border border-gray-300 rounded"
                      placeholder="Describe what you're contributing (e.g., services, materials, time, etc.)"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    text="Cancel"
                    onClick={closeModal}
                    type="outlined"
                    className="flex-1"
                  />
                  <Button
                    text={createContributionMutation.isLoading ? "Submitting..." : "Submit Contribution"}
                    onClick={handleSubmit(onSubmit)}
                    isLoading={createContributionMutation.isLoading}
                    className="flex-1"
                  />
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

