import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/authContext";
import { LOGIN_ROUTE } from "../../components/auth/guards";

/**
 * `/logout` used to render the login page without clearing anything — the sidebar's own
 * handler removed the storage key and navigated, so hitting the URL directly (or the back
 * button afterwards) left the session intact. This is the real thing: drop the session and
 * the cached queries behind it, then land on login.
 */
const LogoutPage = () => {
  const { logout, isAuthenticated } = useAppContext();

  useEffect(() => {
    logout();
  }, [logout]);

  if (isAuthenticated) return null;

  return <Navigate to={LOGIN_ROUTE} replace />;
};

export default LogoutPage;
