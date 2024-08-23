import { useRef } from 'react';
import bluePurpleGradientCoverBackground from '../../assets/images/bluePurpleGradientCoverBackgrond.png';
import AuthPageLeftContainer from '../../components/auth/AuthPageLeftContainer';
import FormError from '../../components/form/FormError';
import { useForm } from "react-hook-form";
import TextInputWithImage from '../../components/form/TextInputWithImage';
import Button from '../../components/button/Button';
import AuthPageInformation from '../../components/auth/AuthPageInformation';
import AuthPageHeader from '../../components/auth/AuthPageHeader';
import userIcon from '../../assets/icons/user-circle.png';
import { useMutation } from "react-query";
import { verifyUserMembership } from '../../api/auth/auth-api';
import Toast from '../../components/toast/Toast';
import { useNavigate } from 'react-router-dom';
import { setRel8UserRegistrationData } from '../../utils/extra_functions';
import { TENANT } from '../../utils/constants';

export type VerifyMembershipForm = {
  MEMBERSHIP_NO: string;
  email?: string;
};

const VerifyMemberPage = () => {
  const { notifyUser } = Toast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<VerifyMembershipForm>();
  
  // Use a ref to store the input email
  const inputEmailRef = useRef<string | undefined>();

  const { mutate, isLoading } = useMutation(verifyUserMembership, {
    onSuccess: (data) => {
      if (data.status_code === 200 && data.success && data.data.length > 0) {
        const userRel8RegistrationData = data.data[0].user;
        const inputEmail = inputEmailRef.current?.trim();
        // console.log(inputEmail);

        // Check if the subdomain is 'aani' and validate the email
        if (TENANT === 'aani') {
          // Split the emails and trim each one to remove any trailing commas or whitespace
          const emailList = userRel8RegistrationData.email.split(',').map(email => email.trim()).filter(email => email !== '');

          // Check if the input email is in the list of emails
          if (emailList.includes(inputEmail || '')) {
            const hasStoredUserInLocalStorage = setRel8UserRegistrationData(userRel8RegistrationData);
            if (hasStoredUserInLocalStorage) {
              notifyUser(`Membership Verification for ${userRel8RegistrationData.name} successful`, "success");
              navigate("/register");
            }
          } else {
            notifyUser("Email does not match", "error");
          }
        } else {
          // No email validation needed for other tenants
          const hasStoredUserInLocalStorage = setRel8UserRegistrationData(userRel8RegistrationData);
          if (hasStoredUserInLocalStorage) {
            notifyUser(`Membership Verification for ${userRel8RegistrationData.name} successful`, "success");
            navigate("/register");
          }
        }
      } else {
        notifyUser("Invalid membership number or data not found", "error");
      }
    },
    onError: (error: any) => {
      const data: any = error.response.data;
      notifyUser(data.message, "error");
    }
  });

  const onSubmit = (data: VerifyMembershipForm) => {
    inputEmailRef.current = data.email; // Store the input email in the ref
    mutate(data);
  };

  return (
    <main className="grid items-center w-full h-screen place text-color">
      <div className="grid w-full h-full grid-cols-2 ">
        <AuthPageLeftContainer image={bluePurpleGradientCoverBackground} />
        <section className="relative grid h-full col-span-2 md:col-span-1 place-items-center">
          <div className="auth-form-container">
            <AuthPageHeader
              authPageHeader="Verify Membership"
              authPageText="Enter your membership number to verify your account"
            />
            <form className="flex flex-col w-full max-w-md gap-y-4 " onSubmit={handleSubmit(onSubmit)}>
              <div>
                {errors.MEMBERSHIP_NO?.type === 'required' && (<FormError message="Membership No. is required" />)}
                <TextInputWithImage disabled={isLoading} register={register} name="MEMBERSHIP_NO" placeHolder="Membership No" image={userIcon} />
              </div>
              
              {TENANT === 'aani' && (
                <div>
                  {errors.email?.type === 'required' && (<FormError message="Email is required" />)}
                  <TextInputWithImage disabled={isLoading} register={register} name="email" placeHolder="Email" image={userIcon} />
                </div>
              )}

              <div className="grid">
                <Button isLoading={isLoading} text='Continue' />
              </div>
            </form>
            <AuthPageInformation authPageInformationText="Already have an account?" authPageInformationAction="Login" authPageInformationLink="/login" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default VerifyMemberPage;
