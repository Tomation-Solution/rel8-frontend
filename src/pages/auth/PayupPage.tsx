import AuthPageHeader from "../../components/auth/AuthPageHeader"
import AuthPageInformation from "../../components/auth/AuthPageInformation"
import registrationPagebackgroundImage from "../../assets/cover-images/registration-background-cover.png";
import loginBackgroundContainer from '../../assets/images/form-image.png'
import AuthPageLeftContainer from "../../components/auth/AuthPageLeftContainer";

import { useQuery } from "react-query";
import { fetchAllUserDues } from "../../api/dues/api-dues";
import PayUpForASingleDue from "../../components/pay-up/PayUpForASingleDue";
import Button from "../../components/button/Button";
import {  useNavigate } from "react-router-dom";
// import { useAppContext } from "../../context/authContext";

const PayupPage = () => {

  const navigate = useNavigate()
  
  const  dues = useQuery('dues', fetchAllUserDues,{
    retry:2
  });

 

  const overDueData = dues?.data?.data.filter((item:any) => item.is_overdue);

  const handleLogin = ()=>{
    navigate('/login')
  }
  

    // const { userProfileData } = useAppContext();
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
              authPageHeader="Account Locked"
              authPageText="Pay outstanding fee to gain access to account"
            />
            {overDueData?.map((due:any,index:number)=>(

               <PayUpForASingleDue key={index} due__Name={due?.due__Name} dueId={due?.id} amount={due?.amount} /> 
              ))}

            <Button onClick={handleLogin} text="Login" />
           
            <AuthPageInformation authPageInformationText="Already have an account?" authPageInformationAction="Login" authPageInformationLink="/login" />
          </div>
        </section>
      </div>
    </div>
  )
}

export default PayupPage