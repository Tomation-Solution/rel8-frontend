import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserDataType } from "../types/myTypes";
import { useQuery } from "react-query";
import { fetchUserProfile } from "../api/profile/profile-api";

interface AppContextType {
  user: UserDataType | null;
  setRel8LoginUserData: (data: UserDataType) => void;
  userFullName: string;
  userProfileData: any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDataType | null>(null);
  const [userFullName, setUserFullName] = useState<string>("");
  const [userProfileData, setUserProfileData] = useState<any[]>([]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("rel8User");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  const userProfile = useQuery("userProfile", fetchUserProfile, {
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });

  console.log(userProfile.data, "User Profile Data");

  useEffect(() => {
    if (userProfile.data) {
      const profileData = userProfile.data || {};
      setUserProfileData(profileData);
      setUser(profileData);

      if (profileData) {
        setUserFullName(userProfile.data.name);
      }
    }
  }, [userProfile.data]);

  const setRel8LoginUserData = (data: UserDataType) => {
    try {
      setUser(userProfile.data);
      localStorage.setItem("rel8User", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppContext.Provider
      value={{ user, setRel8LoginUserData, userFullName, userProfileData }}
    >
      {children}
    </AppContext.Provider>
  );
};
