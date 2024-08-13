import { useMutation } from 'react-query';
import { technicalSupport, adminSupport } from '../api/contactUs/contactUs';
import { SupportData } from '../types/myTypes'; // Ensure you import the correct type

export const useTechnicalSupport = () => {
  return useMutation((formData: SupportData) => technicalSupport(formData));
};

export const useAdminSupport = () => {
  return useMutation((formData: SupportData) => adminSupport(formData));
};
