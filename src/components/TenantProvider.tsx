import { ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getTenantInfo, TENANT } from "../utils/constants";
import Loader from "./Loader";
import { apiPublic } from "../api/baseApi";

interface TenantResponse {
  message: string;
  orgId: string;
  organization: {
    colorTheme: {
      primary: string;
      secondary: string;
    };
    settings: {
      customDomain: string | null;
      isCustomDomainVerified: boolean;
      preferCustomDomain: boolean;
    };
    _id: string;
    name: string;
    shortName: string;
    logo: string;
    numberOfMembers: number;
    yearEstablished: number;
    about: string;
    vision: string;
    mission: string;
    email: string;
    phone: string;
    isVerified: boolean;
    isActive: boolean;
    customUrl: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export default function TenantGate({ children }: { children: ReactNode }) {
  const [hasInfoChanged, setHasInfoChanged] = useState(false);
  
  const { isLoading, data, error } = useQuery<TenantResponse>({
    queryFn: async () => {
        const response = await apiPublic.get(`/org/${TENANT}`);
        return response.data;
    },
    refetchOnWindowFocus: true, 
  });

  useEffect(() => {
    if (data) {
      const storedTenantInfo = localStorage.getItem('tenant-info');
      
      if (!storedTenantInfo) {
        // First time - store the data
        localStorage.setItem('tenant-info', JSON.stringify(data));
        setHasInfoChanged(false);
      } else {
        // Compare stored data with new data
        const parsedStoredInfo: TenantResponse = JSON.parse(storedTenantInfo);
        
        // Check if critical tenant info has changed
        const hasChanged = 
          parsedStoredInfo.orgId !== data.orgId ;

        if (hasChanged) {
          // Update localStorage with new data
          localStorage.setItem('tenant-info', JSON.stringify(data));
          setHasInfoChanged(true);
          
          // Optional: Reload page to apply changes
          console.log('Tenant information has changed. Reloading...');
          window.location.reload();
        }
      }
    }
  }, [data]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Invalid organization url</p>
          <p className="text-sm text-gray-600 mt-2">Please check the url and try again</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}