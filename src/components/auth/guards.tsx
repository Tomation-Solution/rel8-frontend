import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/authContext";
import { rememberIntendedPath, takeIntendedPath } from "../../utils/session";

/** Where a signed-in member lands. */
export const HOME_ROUTE = "/";
export const LOGIN_ROUTE = "/login";

/**
 * Gate for every signed-in screen.
 *
 * Replaces the `useEffect` in `DashboardLayout` that fired a "You must be logged in"
 * toast and called `navigate("/login")`. That check ran on the *first* render, before the
 * auth context had read localStorage, so it triggered on every hard refresh of a page a
 * perfectly valid session was entitled to see — and, because it was an effect, it
 * rendered the whole dashboard once before redirecting.
 */
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppContext();
  const location = useLocation();

  if (!isAuthenticated) {
    rememberIntendedPath(location.pathname + location.search);
    return <Navigate to={LOGIN_ROUTE} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

/**
 * The inverse: a member who already has a session has no business on the login or
 * forgot-password screens, so send them on to where they were going.
 *
 * `/setup-new-password` is deliberately *not* wrapped — it carries a one-time token from
 * an email and has to work whatever the current session is.
 */
export const GuestOnly = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return <Navigate to={takeIntendedPath() ?? HOME_ROUTE} replace />;
  }

  return <>{children}</>;
};
