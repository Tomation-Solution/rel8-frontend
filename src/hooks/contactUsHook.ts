import { useMutation } from 'react-query';
import { technicalSupport, adminSupport } from '../api/contactUs/contactUs';

export const useTechnicalSupport = () => {
  return useMutation((formData) => technicalSupport(formData));
};

export const useAdminSupport = () => {
    return useMutation((formData) => adminSupport(formData));
  };