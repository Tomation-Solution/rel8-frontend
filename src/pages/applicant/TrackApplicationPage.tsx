import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { FiMail } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi2";

import { trackApplication } from "../../api/applications/applications-api";
import { Button, Card, IconInput } from "../../components/ui";
import { useAppContext } from "../../context/authContext";
import { saveTrackedApplication } from "./trackedApplication";

/**
 * "Welcome to Applicant's Portal" — `onboarding-rel8/New applicant portal.png`.
 *
 * Public: an applicant has no account. The mockup shows a single "Input Application ID"
 * field; there is a second field here for the email the application was submitted with,
 * because the ID alone would be enough for anyone holding it to read someone's name, email
 * and application status. Codes get forwarded; the pair does not.
 */
const TrackApplicationPage = () => {
  const navigate = useNavigate();
  const { organization } = useAppContext();

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation(() => trackApplication({ code, email }), {
    onSuccess: application => {
      saveTrackedApplication(code.trim(), email.trim(), application);
      navigate("/application");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "We could not find that application. Check the ID and email and try again.");
    },
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!code.trim() || !email.trim()) {
      setError("Enter both your application ID and the email you applied with.");
      return;
    }
    mutation.mutate();
  };

  return (
    <main className="min-h-screen bg-org-tint/40 grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[26px] font-semibold text-org-primary">Welcome to Applicant&rsquo;s Portal</h1>
          <p className="text-[15px] text-org-primary/80 mt-1">Track your application here with ease...</p>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            {organization?.logo ? (
              <img src={organization.logo} alt="" className="w-16 h-16 rounded-full object-contain bg-white border border-hairline" />
            ) : (
              <span className="w-16 h-16 rounded-full bg-org-tint grid place-items-center">
                <HiOutlineIdentification className="w-8 h-8 text-org-primary" />
              </span>
            )}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <IconInput
              iconStyle="attached"
              icon={HiOutlineIdentification}
              placeholder="Input Application ID"
              value={code}
              onChange={event => setCode(event.target.value)}
              aria-label="Application ID"
              autoComplete="off"
            />

            <IconInput iconStyle="attached" icon={FiMail} type="email" placeholder="Email you applied with" value={email} onChange={event => setEmail(event.target.value)} aria-label="Email address" autoComplete="email" />

            {error && <p className="text-sm text-status-danger">{error}</p>}

            <Button htmlType="submit" fullWidth size="lg" isLoading={mutation.isLoading}>
              TRACK YOUR APPLICATION
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted mt-6">Your application ID was emailed to you when you applied. It looks like {organization?.shortName ? `${String(organization.shortName).toUpperCase()}1234567` : "ABC1234567"}.</p>
      </div>
    </main>
  );
};

export default TrackApplicationPage;
