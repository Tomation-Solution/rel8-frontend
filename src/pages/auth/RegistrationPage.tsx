import registrationPagebackgroundImage from "../../assets/cover-images/registration-background-cover.png";
import loginBackgroundContainer from '../../assets/images/form-image.png'
import AuthPageLeftContainer from "../../components/auth/AuthPageLeftContainer";
import AuthPageHeader from "../../components/auth/AuthPageHeader";
import AuthPageInformation from "../../components/auth/AuthPageInformation";
import userCircleIcon from '../../assets/icons/user-circle.png'
import phoneIcon from '../../assets/icons/phone.png'
import messageIcon from '../../assets/icons/message.png'
import TextInputWithImage from "../../components/form/TextInputWithImage";
import userIconImage from "../../assets/icons/user.png";
import { useForm } from "react-hook-form";
import FormError from "../../components/form/FormError";
import TextInputPassWord from "../../components/form/TextInputPassword";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Toast from "../../components/toast/Toast";
import { getRel8UserRegistrationData} from "../../utils/extra_functions";
import { useMutation } from "react-query";
import { createMember, getAllChapters } from "../../api/auth/auth-api";
import Button from "../../components/button/Button";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import SelectInputWithImage from "../../components/form/SelectInputWithImage";

export type RegistrationFormFields = {
  fullname: string;
  username: string;
  rel8Email: string;
  password: string;
  phone_number: string;
  department: string;
  graduation_year: string;
  chapter: string;
  MEMBERSHIP_NO: string;
};

const RegistrationPage = () => {
  const data: any = getRel8UserRegistrationData();
  const { notifyUser } = Toast();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(createMember, {
    onSuccess: (data) => {
      notifyUser(data.message, "success");
      toast.success("Registration Successful, please check your email to activate your account");
      navigate('/login');
    },
    onError: (error: any) => {
      const data: any = error.response.data;
      notifyUser(data.message.error, "error");
    }
  });

  const { data: chapters } = useQuery("chapters", getAllChapters, {
    enabled: true,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormFields>();

  const onSubmit = (formData: RegistrationFormFields) => {
    formData.MEMBERSHIP_NO = data.MEMBERSHIP_NO;
  
    // Construct the data to match the backend expected fields
    const submissionData: any = {
      MEMBERSHIP_NO: formData.MEMBERSHIP_NO,
      fullname: formData.fullname || '', 
      programme: formData.department || '',
      yog: formData.graduation_year || '',
      password: formData.password || '',
      rel8Email: formData.rel8Email || '',
    };
  
    // Check if any required fields are missing and notify the user
    for (const key in submissionData) {
      if (!submissionData[key]) {
        notifyUser(`${key} is required`, "error");
        return;
      }
    }
  
    // Send the form data
    mutate(submissionData);
  };
  
  useEffect(() => {
    if (!data) {
      navigate('/verify-membership');
    }
  }, [navigate, data]);

  if (data) {
    return (
      <div className="grid items-center w-full h-screen place text-color">
        <div className="grid w-full h-full grid-cols-2 ">
          <AuthPageLeftContainer maxHeight="max-h-120vh" image={registrationPagebackgroundImage} />
          <section className="relative grid h-full col-span-2 mb-8 md:col-span-1  lg:mb-0 place-items-center">
            <img
              src={loginBackgroundContainer}
              className="hidden lg:inline absolute top-0 left-0 w-[250px] z-[1] 2xl:w-[450px]"
              alt=""
            />
            <div className="relative auth-form-container  ">
              <AuthPageHeader
                authPageHeader="Registration"
                authPageText="Input details to register as alumnus"
              />
              <form className="flex flex-col justify-center w-full max-w-md gap-y-4 mx-auto " onSubmit={handleSubmit(onSubmit)} >
                <div>
                  {errors.fullname?.type === 'required' && (<FormError message="Fullname is required" />)}
                  <TextInputWithImage defaultValue={data['fullname']} disabled={isLoading} register={register} name="fullname" placeHolder="Fullname" image={userCircleIcon} />
                </div>
                <div>
                  {errors.rel8Email?.type === 'required' && (<FormError message="rel8Email is required" />)}
                  <TextInputWithImage disabled={isLoading} inputType="email" register={register} name="rel8Email" placeHolder="Email Address" image={messageIcon} />
                </div>
                <div>
                  {errors.username?.type === 'required' && (<FormError message="Username is required" />)}
                  <TextInputWithImage disabled={isLoading} register={register} name="username" placeHolder="Username" image={userIconImage} />
                </div>
                <div>
                  {errors.password?.type === 'required' && (<FormError message="Password is required" />)}
                  <TextInputPassWord disabled={isLoading} register={register} name="password" placeHolder="Password" image={true} />
                </div>
                <div>
                  {errors.phone_number?.type === 'required' && (<FormError message="Phone number is required" />)}
                  <TextInputWithImage register={register} name="phone_number" placeHolder="Phone Number" image={phoneIcon} />
                </div>
                <div>
                  {errors.department?.type === 'required' && (<FormError message="Department is required" />)}
                  <TextInputWithImage disabled={isLoading} register={register} name="department" defaultValue={data['programme']} placeHolder="Department" />
                </div>
                <div>
                  {/* {errors.department?.type === 'required' && (<FormError message="Department is required" />)} */}
                  <TextInputWithImage disabled={isLoading} register={register} name="state" placeHolder="State of Origin" />
                </div>
                <div>
                  {/* {errors.department?.type === 'required' && (<FormError message="Department is required" />)} */}
                  <TextInputWithImage disabled={isLoading} register={register} name="address" placeHolder="Physical Address" />
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    {/* {errors.graduation_year?.type === 'required' && (<FormError message="Graduation Year is required" />)} */}
                    <TextInputWithImage disabled={isLoading} register={register} name="countryOfResidence" placeHolder="Country of Residence" />
                  </div>
                  <div>
                    {/* {errors.graduation_year?.type === 'required' && (<FormError message="Graduation Year is required" />)} */}
                    <TextInputWithImage disabled={isLoading} register={register} name="stateOfResidence"  placeHolder="State of Residence" />
                  </div>
                  </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    {errors.graduation_year?.type === 'required' && (<FormError message="Graduation Year is required" />)}
                    <TextInputWithImage disabled={isLoading} register={register} name="graduation_year" defaultValue={data['yog']} placeHolder="Graduation Year" />
                  </div>
                    {/* <div>
                      {errors.chapter?.type === 'required' && (<FormError message="Chapter is required" />)}
                      <TextInputWithImage disabled={isLoading} register={register} name="chapter" placeHolder="Chapter" />
                    </div> */}
                  <div>
                    {errors.chapter?.type === 'required' && (<FormError message="Chapter is required" />)}
                      <SelectInputWithImage
                        disabled={isLoading}
                        register={register}
                        name="chapter"
                        placeHolder="Select Chapter"
                        options={chapters?.data || []}
                        />
                  </div>
                </div>
                <div className="grid">
                  <Button isLoading={isLoading} text='Register' />
                </div>
              </form>
              <AuthPageInformation authPageInformationText="Already have an account?" authPageInformationAction="Login" authPageInformationLink="/login" />
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default RegistrationPage;

