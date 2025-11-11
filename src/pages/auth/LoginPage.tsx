// import loginPageCoverImage from "../../assets/cover-images/login-background-cover.png";
import loginPageCoverImage from "../../assets/cover-images/login-back2.jpg"
import formImage from "../../assets/images/form-image.png";
import AuthPageLeftContainer from "../../components/auth/AuthPageLeftContainer";
import AuthPageHeader from "../../components/auth/AuthPageHeader";
import AuthPageInformation from "../../components/auth/AuthPageInformation";
import RememberUser from "../../components/auth/RememberUser";
import TextInputWithImage from "../../components/form/TextInputWithImage";
import userIconImage from "../../assets/icons/user.png";
import { useForm} from "react-hook-form";
import FormError from "../../components/form/FormError";
import TextInputPassWord from "../../components/form/TextInputPassword";
import Button from "../../components/button/Button";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/toast/Toast";
import { memberLogin } from "../../api/auth/auth-api";
import { useAppContext } from "../../context/authContext";




export type LoginFormFields = {
  email: string;
  password: string;
};

const LoginPage = () => {

  const { notifyUser } = Toast();
  const navigate = useNavigate();
  const { setRel8LoginUserData } = useAppContext();
  
 
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormFields>();

  const { mutate, isLoading } = useMutation(memberLogin, {
    onSuccess: (data) => {
      setRel8LoginUserData({ ...data.member, token: data.token })
      notifyUser("Login Successful","success");
      navigate('/')

    },
    onError: (error:any) => {
      const data:any = error.response.data
      console.log(data)
      notifyUser(data.message ||"An error occured while logging you in","error");
    },


    
  });

  const onSubmit = (data: LoginFormFields) =>{
    mutate({ userType: 'member', ... data })
  } 


  return (
    <div className="grid items-center w-full h-screen place text-color">
      <div className="grid w-full h-full grid-cols-2 ">
        <AuthPageLeftContainer  image={loginPageCoverImage} />
        <section className="relative grid h-full col-span-2 md:col-span-1 place-items-center">
          <img
            src={formImage}
            className=" absolute top-0 left-0 w-[250px] z-[1] 2xl:w-[450px]"
            alt=""
          />
          <div className="relative auth-form-container ">
          
            <AuthPageHeader
            className="sm:mt-10 md:mt-0"
              authPageHeader="Login"
              authPageText="Input details to access alumnus account"
            />
            <form className="flex flex-col w-full max-w-md gap-y-4" onSubmit={handleSubmit(onSubmit)} >
              
              <div>   
                {errors.email?.type === 'required' && (<FormError message="Email is required" />)}
                <TextInputWithImage inputType="email"  register={register}  name="email" placeHolder="Email" image={userIconImage} />
              </div>
              
              <div>
              
              {errors.password?.type === 'required' && ( <FormError message="Password is required" /> )}
              <TextInputPassWord register={register} name="password" placeHolder="Password" image={true} />
              </div>
              

             <RememberUser showLink={true} />
             <div className="grid">
               <Button isLoading={isLoading} text='Login' />
            </div>
            </form>
            {/* <AuthPageInformation
              authPageInformationText="Don’t have an account?"
              authPageInformationAction="Register"
              authPageInformationLink="/register"
            /> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
