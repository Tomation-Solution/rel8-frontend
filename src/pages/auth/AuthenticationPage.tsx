import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

import { apiPublic } from "../../api/baseApi";
import { useAppContext } from "../../context/authContext";
import AuthSplitLayout from "../../components/auth/AuthSplitLayout";
import { Button } from "../../components/ui";
import CircleLoader from "../../components/loaders/CircleLoader";

/**
 * Magic-link sign-in. The member clicks a link in their email and lands here.
 *
 * No mockup — built on the login page's split layout, since this is the same moment in the
 * journey.
 *
 * A failure used to bounce straight to `/login` with nothing said, which reads as "the link
 * did nothing" — the commonest cause is an expired token (they last an hour), and the
 * member needs to know that so they ask for another rather than clicking the dead one
 * again.
 */
const AuthenticationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRel8LoginUserData } = useAppContext();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const electionId = searchParams.get("electionId");

    const performMagicLogin = async () => {
      if (!token) {
        setFailed(true);
        return;
      }

      try {
        // The token arrives URL-encoded from the email; encoding it twice breaks it.
        const encodedToken = token.includes("%") ? token : encodeURIComponent(token);
        const response = await apiPublic.get(`/members/magic-login/${encodedToken}`);

        if (!response.data?.token || !response.data?.member) {
          setFailed(true);
          return;
        }

        setRel8LoginUserData({ ...response.data.member, token: response.data.token });

        // The link can carry an election to drop them straight into; otherwise the portal.
        if (electionId) navigate(`/election/${electionId}`, { replace: true });
        else navigate("/", { replace: true });
      } catch {
        setFailed(true);
      }
    };

    performMagicLogin();
  }, [location.search, navigate, setRel8LoginUserData]);

  if (failed) {
    return (
      <AuthSplitLayout title="This link has expired" subtitle="Sign-in links are only valid for an hour.">
        <div className="flex flex-col gap-4">
          <p className="inline-flex items-start gap-2 text-sm text-muted">
            <FiAlertTriangle className="w-4 h-4 mt-0.5 text-status-warning flex-shrink-0" />
            Ask for a new link, or sign in with your password if you have set one.
          </p>
          <Button fullWidth size="lg" onClick={() => navigate("/login")}>
            Go to login
          </Button>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout title="Signing you in" subtitle="One moment — we're checking your link." showRule={false}>
      <CircleLoader />
    </AuthSplitLayout>
  );
};

export default AuthenticationPage;
