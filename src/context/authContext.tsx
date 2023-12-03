import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserDataType } from '../types/myTypes';
import { useQuery } from 'react-query';
import { fetchUserProfile } from '../api/profile/profile-api';


interface AppContextType {
  user: UserDataType | null;
  setRel8LoginUserData: (data: UserDataType) => void;
  userFullName:string;
  userProfileData:any;
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
  const [user, setUser] = useState<UserDataType | null>(null);

  const [userFullName,setUserFullName] = useState<string>("")
  const [userProfileData,setUserProfileData] = useState([])

  useEffect(() => {
    // Load user data from local storage when the app starts
    const storedUserData = localStorage.getItem('rel8User');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
    
  }, []);

  const  userProfile = useQuery('userProfile', fetchUserProfile,{
    // enabled:true
    retry:1,
    staleTime: 10 * 60 * 1000,
  });

  // console.log('data-->',userProfileData)
 
  useEffect(()=>{
    setUserProfileData(userProfile?.data?.data)
    if (userProfile && userProfile.data && userProfile.data.data && userProfile.data.data.length > 0){
      const name = userProfile?.data?.data[0]?.more_info.find(v => v.name === "name")?.value;
      if (name) {
        setUserFullName(name);
      }
    }
  },[userProfile])

  // console.log(userProfileData,'userProfile')



   const setRel8LoginUserData = (data:UserDataType) =>{
    try {
      setUser(data);
      localStorage.setItem('rel8User',JSON.stringify(data))
  } catch (error) {
      console.log(error);
  }
  }

  return (
    <AppContext.Provider value={{ user, setRel8LoginUserData,userFullName,userProfileData}}>
    {/* <AppContext.Provider value={{ user, setRel8LoginUserData}}> */}
      {children}
    </AppContext.Provider>
  );
};
