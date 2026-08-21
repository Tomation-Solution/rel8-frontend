import { useMutation } from "react-query";
import { FiMail, FiShield } from "react-icons/fi";

import { requestPassword } from "../../../api/auth/auth-api";
import { Button, Card } from "../../../components/ui";
import Toast from "../../../components/toast/Toast";
import { useAppContext } from "../../../context/authContext";

/**
 * "Password Settings".
 *
 * `My Account-1.png` draws a current/new/confirm password form. **This backend has no
 * authenticated change-password endpoint** — `member.routes.js` offers only
 * `POST /members/set-password` (invite token), `POST /members/forgot-password` (email) and
 * `POST /members/reset-password/:token`. A three-field form here would have nowhere to
 * submit to.
 *
 * So the tab does the thing that actually works: sends the member a reset link. If an
 * authenticated `PUT /members/password` is added later, this becomes the real form.
 */
const PasswordTab = () => {
  const { notifyUser } = Toast();
  const { user, organization } = useAppContext();
  const email = (user as any)?.email ?? "";

  /*
   * Some organizations sign members in with an emailed link instead of a password
   * (`settings.magic_link`). For those, `forgot-password` sends a sign-in link — there is
   * no password to change — so saying "we'll email you a link to set a new one" would be
   * a straightforward lie. The copy follows the organization.
   */
  const passwordless = Boolean(organization?.settings?.magic_link);

  const mutation = useMutation(() => requestPassword({ email }), {
    onSuccess: () => {
      notifyUser(passwordless ? "Check your inbox — we've sent you a sign-in link." : "Check your inbox — we've sent you a link to set a new password.", "success");
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.message || "Could not send the reset link. Please try again.", "error");
    },
  });

  return (
    <div className="max-w-2xl">
      <Card accent className="p-6">
        <div className="flex items-start gap-4">
          <span className="w-11 h-11 rounded-full bg-org-tint grid place-items-center flex-shrink-0">
            <FiShield className="w-5 h-5 text-org-primary" />
          </span>
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold text-ink">{passwordless ? "You sign in with a link" : "Change your password"}</h3>
            <p className="text-sm text-muted mt-1">
              {passwordless ? (
                <>This association signs members in with a one-time link rather than a password, so there is nothing to change here. We can email {email ? <span className="text-ink font-medium">{email}</span> : "your registered address"} a fresh sign-in link.</>
              ) : (
                <>For your security, passwords are changed through a one-time link rather than in the browser. We&rsquo;ll email {email ? <span className="text-ink font-medium">{email}</span> : "your registered address"} a link to set a new one.</>
              )}
            </p>

            <Button className="mt-5" icon={FiMail} isLoading={mutation.isLoading} disabled={!email} onClick={() => mutation.mutate()}>
              {passwordless ? "Send me a sign-in link" : "Send me a reset link"}
            </Button>

            {!email && <p className="mt-3 text-xs text-status-danger">We don&rsquo;t have an email address on your profile. Contact your administrator.</p>}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PasswordTab;
