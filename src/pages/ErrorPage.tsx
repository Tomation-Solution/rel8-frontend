import { useNavigate, useRouteError } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

import { Button, EmptyState } from "../components/ui";

/**
 * The router's error boundary. No mockup — built on the redesign's empty-state language.
 *
 * Shows the underlying message in development only: it is useful when you are the one
 * debugging and meaningless (or alarming) to a member.
 */
const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError() as { statusText?: string; message?: string } | undefined;

  return (
    <main className="min-h-screen grid place-items-center px-4 bg-white">
      <div className="w-full max-w-md">
        <EmptyState
          icon={FiAlertTriangle}
          title="Something went wrong"
          description="We hit a problem loading this page. It's been logged — try again in a moment."
          action={
            <div className="flex gap-3">
              <Button onClick={() => window.location.reload()}>Try again</Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Go to dashboard
              </Button>
            </div>
          }
        />
        {import.meta.env.DEV && (error?.statusText || error?.message) && <p className="mt-4 text-center text-xs text-muted font-mono break-words">{error.statusText || error.message}</p>}
      </div>
    </main>
  );
};

export default ErrorPage;
