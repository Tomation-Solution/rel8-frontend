import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { setPassword } from "../../../api/auth/auth-api";
import AuthSplitLayout from "../../../components/auth/AuthSplitLayout";
import { Button, IconInput } from "../../../components/ui";
import Toast from "../../../components/toast/Toast";

export type SetupNewPasswordInput = {
  password1: string;
  password2: string;
};

/** No mockup — same split layout as login, which does have one. */
const SetupNewPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { notifyUser } = Toast();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetupNewPasswordInput>();

  const { mutate, isLoading } = useMutation(setPassword, {
    onSuccess: () => {
      notifyUser("Password set. You can log in now.", "success");
      navigate("/login");
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.errors?.[0]?.msg || error?.response?.data?.message || "An error occured", "error");
    },
  });

  const onSubmit: SubmitHandler<SetupNewPasswordInput> = data => {
    mutate({ password: data.password1, token: token || "" });
  };

  const eye = (
    <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? "Hide password" : "Show password"} className="text-muted hover:text-org-primary px-3">
      {show ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
    </button>
  );

  // A link with no token cannot work — say so rather than letting them fill in a form that
  // will fail on submit.
  if (!token) {
    return (
      <AuthSplitLayout title="This link isn't valid" subtitle="It may have expired, or been opened without the full address.">
        <Button fullWidth size="lg" onClick={() => navigate("/forgot-password")}>
          Request a new link
        </Button>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout title="Setup new password" subtitle="Input new password to recover account">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <IconInput
          iconStyle="attached"
          icon={FiLock}
          type={show ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          trailing={eye}
          error={errors.password1?.message}
          {...register("password1", {
            required: "Password is required",
            // Matches the server's rule, so a mismatch is caught here rather than as a 400.
            minLength: { value: 8, message: "Use at least 8 characters" },
          })}
        />

        <IconInput
          iconStyle="attached"
          icon={FiLock}
          type={show ? "text" : "password"}
          placeholder="Confirm Password"
          autoComplete="new-password"
          error={errors.password2?.message}
          {...register("password2", {
            required: "Confirm your password",
            validate: value => value === watch("password1") || "Passwords do not match",
          })}
        />

        <Button htmlType="submit" fullWidth size="lg" isLoading={isLoading} className="mt-2">
          Submit
        </Button>
      </form>
    </AuthSplitLayout>
  );
};

export default SetupNewPasswordPage;
