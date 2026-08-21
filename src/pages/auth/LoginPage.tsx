import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { memberLogin } from "../../api/auth/auth-api";
import { useAppContext } from "../../context/authContext";
import AuthSplitLayout from "../../components/auth/AuthSplitLayout";
import { Button, IconInput } from "../../components/ui";
import Toast from "../../components/toast/Toast";

export type LoginFormFields = {
  email: string;
  password: string;
};

/** `login screen members/member's login page.png`. */
const LoginPage = () => {
  const { notifyUser } = Toast();
  const navigate = useNavigate();
  const { setRel8LoginUserData } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>();

  const { mutate, isLoading } = useMutation(memberLogin, {
    onSuccess: data => {
      setRel8LoginUserData({ ...data.member, token: data.token });
      notifyUser("Login Successful", "success");
      // Honour where they were headed before the session expired, if anywhere.
      const intended = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(intended || "/");
    },
    onError: (error: any) => {
      notifyUser(error?.response?.data?.message || "An error occured while logging you in", "error");
    },
  });

  const onSubmit = (data: LoginFormFields) => mutate({ userType: "member", email: data.email, password: data.password });

  return (
    <AuthSplitLayout title="Login" subtitle="Input details to access alumnus account">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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

        <IconInput
          iconStyle="attached"
          icon={FiLock}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
          // The eye toggle rides inside the field, as the mockup draws it.
          trailing={
            <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="text-muted hover:text-org-primary px-3">
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          }
        />

        <div className="flex items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-hairline accent-[rgb(var(--color-org-primary))]" />
            Remember me
          </label>

          <Link to="/forgot-password" className="text-sm text-ink hover:text-org-primary">
            Forget Password?
          </Link>
        </div>

        <Button htmlType="submit" fullWidth size="lg" isLoading={isLoading} className="mt-2">
          Login
        </Button>
      </form>
    </AuthSplitLayout>
  );
};

export default LoginPage;
