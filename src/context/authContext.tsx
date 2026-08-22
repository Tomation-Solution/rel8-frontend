import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useQuery, useQueryClient } from "react-query";
import { MemberInfoType, Organization } from "../types/myTypes";
import { fetchUserProfile } from "../api/profile/profile-api";
import { clearStoredSession, hasValidSession, readStoredSession, takeIntendedPath, writeStoredSession } from "../utils/session";

interface AppContextType {
  user: any | null;
  setRel8LoginUserData: (data: MemberInfoType) => void;
  userFullName: string;
  userProfileData: any[];
  organization: Organization;
  /** True when a non-expired token is in storage. The guards and the layout use this
   *  rather than `!!user`, which is also true mid-logout and false mid-hydration. */
  isAuthenticated: boolean;
  /** Drops the session, the cached queries behind it and any remembered destination. */
  logout: () => void;
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

function readStoredOrganization(): any {
  try {
    return JSON.parse(localStorage.getItem("tenant-info") || "null")?.organization ?? {};
  } catch {
    return {};
  }
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  /*
   * Read storage during the first render, not in an effect.
   *
   * This is the session-persistence bug: `user` started as null and was filled in by a
   * `useEffect`, but effects run child-first — so `DashboardLayout`'s "no user, go to
   * /login" check ran a full tick before this provider had looked at localStorage. Every
   * hard refresh of a dashboard page therefore bounced a logged-in member to the login
   * screen with a "You must be logged in" toast.
   */
  const [user, setUser] = useState<MemberInfoType | null>(() => readStoredSession() as MemberInfoType | null);
  const [organization, setOrganization] = useState<any>(readStoredOrganization);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasValidSession);
  const [userFullName, setUserFullName] = useState<string>("");
  const [userProfileData, setUserProfileData] = useState<any[]>([]);

  const queryClient = useQueryClient();

  // The tenant record is written by `TenantGate` after this provider has already mounted
  // on a cold start, so pick it up when it lands.
  useEffect(() => {
    const syncOrganization = () => setOrganization(readStoredOrganization());
    syncOrganization();
    window.addEventListener("storage", syncOrganization);
    return () => window.removeEventListener("storage", syncOrganization);
  }, []);

  const userProfile = useQuery("userProfile", fetchUserProfile, {
    // Firing this while signed out produced a guaranteed 401 on every public page — the
    // very thing the interceptor now redirects on.
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!userProfile.data) return;

    const profileData: any = userProfile.data;
    setUserProfileData(profileData);

    // Merge rather than replace: the profile response carries no `token`, and overwriting
    // the stored session with it left the context holding a user the API layer could not
    // authenticate.
    setUser(previous => ({ ...(previous ?? {}), ...profileData }));
    setUserFullName(profileData.name as string);
  }, [userProfile.data]);

  const setRel8LoginUserData = useCallback((data: MemberInfoType) => {
    writeStoredSession(data as any);
    setUser(data);
    setIsAuthenticated(hasValidSession());
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    takeIntendedPath();
    setUser(null);
    setUserFullName("");
    setUserProfileData([]);
    setIsAuthenticated(false);
    // Otherwise the next member to sign in on this device briefly sees the previous
    // account's dues, events and notifications served from cache.
    queryClient.clear();
  }, [queryClient]);

  /*
   * Keep tabs in step, and notice a token that lapses while the app is open. Without the
   * `storage` listener, logging out in one tab left every other tab rendering a dashboard
   * backed by a token that had already been thrown away.
   */
  useEffect(() => {
    const resync = () => {
      const valid = hasValidSession();
      setIsAuthenticated(valid);
      if (!valid) setUser(null);
    };

    window.addEventListener("storage", resync);
    window.addEventListener("focus", resync);
    const interval = window.setInterval(resync, 60_000);

    return () => {
      window.removeEventListener("storage", resync);
      window.removeEventListener("focus", resync);
      window.clearInterval(interval);
    };
  }, []);

  return <AppContext.Provider value={{ organization, user, setRel8LoginUserData, userFullName, userProfileData, isAuthenticated, logout }}>{children}</AppContext.Provider>;
};
