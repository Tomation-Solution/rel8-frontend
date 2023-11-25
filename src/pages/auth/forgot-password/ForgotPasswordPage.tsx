import AuthPageLeftContainer from "../../../components/auth/AuthPageLeftContainer"
import AuthPageHeader from "../../../components/auth/AuthPageHeader"
import purpleBackgroundImage from  '../../../assets/images/purpleCoverBackground.png'
import AuthPageInformation from "../../../components/auth/AuthPageInformation"
import messageIcon from '../../../assets/icons/message.png'
import TextInputWithImage from "../../../components/form/TextInputWithImage";
import { useForm } from "react-hook-form";
import FormError from "../../../components/form/FormError";
import Button from "../../../components/button/Button"
import Toast from "../../../components/toast/Toast"
// import { useNavigate } from "react-router-dom"
import { useMutation } from "react-query"
import { requestPassword } from "../../../api/auth/auth-api"



export type ForgotPasswordFormField = {
  email: string;
};


const ForgotPasswordPage = () => {

  const { notifyUser } = Toast();
  // const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormField>();

  const { mutate, isLoading } = useMutation(requestPassword, {
    onSuccess: (data) => {
      console.log(data) 
      notifyUser("Forgot password link sent to your mail, check to proceed","success");
    },
    onError: (error:any) => {
      const data:any = error.response.data
      console.log(data)
     
      notifyUser("An error occured while resetting your password","error");
    }
    
  });

  const onSubmit = (data: ForgotPasswordFormField) =>{
    mutate(data)
  } 



  return (
    <div className="grid items-center w-full h-screen place text-color">
    <div className="grid w-full h-full grid-cols-2 ">
      <AuthPageLeftContainer image={purpleBackgroundImage} />
      <section className="relative grid h-full col-span-2 md:col-span-1 place-items-center">
        
        <div className="auth-form-container">
          <AuthPageHeader
            authPageHeader="Forgot password"
            authPageText="Enter email address to recover account"
          />
          <form className="flex flex-col w-full max-w-md gap-y-4 "  onSubmit={handleSubmit(onSubmit)}>

            <div>   
              {errors.email?.type === 'required' && (<FormError message="Email is required" />)}
              <TextInputWithImage inputType="email"  register={register} name="email" placeHolder="Email Address" image={messageIcon} />
            </div>  

           
            <div className="grid">
               <Button isLoading={isLoading} text='Continue' />
            </div>
          </form>

          <AuthPageInformation authPageInformationText="Already have an account?" authPageInformationAction="Login" authPageInformationLink="/login" />
          
        </div>
      </section>
    </div>
  </div>
  )
}

export default ForgotPasswordPage