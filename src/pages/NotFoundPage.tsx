import { useNavigate } from "react-router-dom";
import { FiCompass } from "react-icons/fi";

import { Button, EmptyState } from "../components/ui";

/** No mockup — built on the redesign's empty-state language. */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen grid place-items-center px-4 bg-white">
      <div className="w-full max-w-md">
        <EmptyState
          icon={FiCompass}
          title="Page not found"
          description="That link doesn't lead anywhere. It may have been moved, or the address may have a typo."
          action={<Button onClick={() => navigate("/")}>Back to dashboard</Button>}
        />
      </div>
    </main>
  );
};

export default NotFoundPage;
