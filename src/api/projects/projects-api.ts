import apiTenant from "../baseApi";

export interface Project {
  _id: string;
  name: string;
  description: string;
  paymentType: 'account' | 'payment_link';
  paymentDetails: string;
  banner?: string;
  banners?: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectContribution {
  _id: string;
  projectId: {
    _id: string;
    name: string;
    banners?: string[];
    banner?: string;
  };
  memberId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  contributionType: 'cash' | 'in_kind';
  proofOfPayment?: string;
  inKindDescription?: string;
  amount?: number;
  status: 'pending' | 'verified' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all active projects
export const fetchActiveProjects = async (): Promise<Project[]> => {
  const response = await apiTenant.get('/api/projects/active');
  return response.data;
};

// Get member's contributions
export const fetchMyContributions = async (): Promise<ProjectContribution[]> => {
  const response = await apiTenant.get('/api/projects/contributions/my-contributions');
  return response.data;
};

// Create contribution
export const createContribution = async (data: {
  projectId: string;
  contributionType: 'cash' | 'in_kind';
  inKindDescription?: string;
  amount?: number;
}, proofOfPaymentFile?: File): Promise<ProjectContribution> => {
  const formData = new FormData();
  formData.append('projectId', data.projectId);
  formData.append('contributionType', data.contributionType);
  
  if (data.contributionType === 'in_kind' && data.inKindDescription) {
    formData.append('inKindDescription', data.inKindDescription);
  }
  
  if (data.contributionType === 'cash' && data.amount) {
    formData.append('amount', data.amount.toString());
  }
  
  if (proofOfPaymentFile) {
    formData.append('proofOfPayment', proofOfPaymentFile);
  }

  const response = await apiTenant.post('/api/projects/contributions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

