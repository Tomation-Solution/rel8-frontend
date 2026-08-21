import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";

import { requestPassword } from "../../../api/auth/auth-api";
import AuthSplitLayout from "../../../components/auth/AuthSplitLayout";
import { Button, IconInput } from "../../../components/ui";
import Toast from "../../../components/toast/Toast";

export type ForgotPasswordFormField = {
  email: string;
};

/**
 * No mockup exists for this screen — extrapolated from the login page, which does have one.
 * Same split layout, same field treatment.
 */
const ForgotPasswordPage = () => {
  const { notifyUser } = Toast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormField>();

  const { mutate, isLoading, isSuccess } = useMutation(requestPassword, {
    onSuccess: () => {
      notifyUser("Check your inbox — we've sent you a link to set a new password.", "success");
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.message || "An error occured while resetting your password", "error");
    },
  });

  if (isSuccess) {
    return (
      <AuthSplitLayout title="Check your inbox" subtitle={`We've sent a password reset link to ${getValues("email")}.`}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted text-center">The link expires in an hour. If it doesn&rsquo;t arrive, check your spam folder before trying again.</p>
          <Link to="/login" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-org-primary">
            <FiArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout title="Forgot Password" subtitle="Enter your email and we'll send you a link to set a new one">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(data => mutate(data))}>
        <IconInput
          iconStyle="attached"
          icon={FiMail}
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email address" },
          })}
        />

        <Button htmlType="submit" fullWidth size="lg" isLoading={isLoading} className="mt-2">
          Send reset link
        </Button>

        <Link to="/login" className="inline-flex items-center justify-center gap-2 text-sm text-ink hover:text-org-primary mt-2">
          <FiArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </form>
    </AuthSplitLayout>
  );
};

export default ForgotPasswordPage;
