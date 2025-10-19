import bluePurpleGradientCoverBackground from "../../../assets/images/bluePurpleGradientCoverBackgrond.png";
import AuthPageLeftContainer from "../../../components/auth/AuthPageLeftContainer";
import AuthPageHeader from "../../../components/auth/AuthPageHeader";
import RememberUser from "../../../components/auth/RememberUser";
import FormError from "../../../components/form/FormError";
import TextInputPassWord from "../../../components/form/TextInputPassword";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../../../components/button/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";
import { resetPassword } from "../../../api/auth/auth-api";
import Toast from "../../../components/toast/Toast";

export type SetupNewPasswordInput = {
  password1: string;
  password2: string;
};

const SetupNewPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupNewPasswordInput>();

    const [params] = useSearchParams();

  const token = params.get('token');

  const navigate = useNavigate();
  const { notifyUser } = Toast();

  const { mutate, isLoading } = useMutation(resetPassword, {
    onSuccess: (data) => {
      // setRel8LoginUserData(data)
      notifyUser("Reset Successful","success");
      console.log(data)
      navigate('/login')
     
    },
    onError: (error:any) => {
      const data:any = error.response.data
      console.log(data)
      notifyUser(data.errors?.[0]?.msg || "An error occured","error");
    },
    
  });

  const onSubmit: SubmitHandler<SetupNewPasswordInput> = (data) => {

    if(data.password1 !== data.password2){
      notifyUser("Passwords do not match","error");
      return;
    }

    mutate({ password: data.password1, userType: 'member', token: token})
  }
    

  return (
    <div className="grid items-center w-full h-screen place text-color">
      <div className="grid w-full h-full grid-cols-2 ">
        <AuthPageLeftContainer image={bluePurpleGradientCoverBackground} />
        <section className="relative grid h-full col-span-2 md:col-span-1 place-items-center">
          <div className="relative auth-form-container ">
            <AuthPageHeader
              authPageHeader="Setup new password"
              authPageText="Input new password to recover account"
            />
            <form
              className="flex flex-col w-full max-w-md gap-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                {errors.password1?.type === "required" && (
                  <FormError message="Password 1 is required" />
                )}
                <TextInputPassWord
                  register={register}
                  name="password1"
                  placeHolder="Password"
                  image={true}
                />
              </div>
              <div>
                {errors.password2?.type === "required" && (
                  <FormError message="Password 2 is required" />
                )}
                <TextInputPassWord
                  register={register}
                  name="password2"
                  placeHolder="Confirm Password"
                  image={true}
                />
              </div>

              <RememberUser />

              <div className="grid">
                <Button isLoading={isLoading} text="Submit" />
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SetupNewPasswordPage;
