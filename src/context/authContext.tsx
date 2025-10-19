import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MemberInfoType } from '../types/myTypes';
import { useQuery } from 'react-query';
import { fetchUserProfile } from '../api/profile/profile-api';

interface AppContextType {
  user: MemberInfoType | null;
  setRel8LoginUserData: (data: MemberInfoType) => void;
  userFullName: string;
  userProfileData: any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MemberInfoType | null>(null);
  const [userFullName, setUserFullName] = useState<string>('');
  const [userProfileData, setUserProfileData] = useState<any[]>([]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('rel8User');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  const userProfile = useQuery('userProfile', fetchUserProfile, {
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (userProfile.data) {
      const profileData = userProfile.data.data || [];
      setUserProfileData(profileData);

      if (profileData.length > 0) {
        const moreInfo = profileData[0]?.more_info || [];
        const fullNameValue = moreInfo[5]?.value || '';
        const parts = fullNameValue.split(' ');

        if (parts.length > 0) {
          setUserFullName(parts[0]);
        }
      }
    }
  }, [userProfile.data]);

  const setRel8LoginUserData = (data: MemberInfoType) => {
    try {
      setUser(data);
      localStorage.setItem('rel8User', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppContext.Provider value={{ user, setRel8LoginUserData, userFullName, userProfileData }}>
      {children}
    </AppContext.Provider>
  );
};
