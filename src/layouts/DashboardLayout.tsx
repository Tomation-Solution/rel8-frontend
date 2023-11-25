import React, { ReactNode, useEffect } from "react"
import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";
import { useNavigate } from "react-router-dom";
import Toast from "../components/toast/Toast";
import { useAppContext } from "../context/authContext";


interface DashboardLayoutInterfaceProps {
    children: ReactNode;
  }

const DashboardLayout = ({children}:DashboardLayoutInterfaceProps) => {

  // const { user } = useContext();
  const { user,userProfileData } = useAppContext();
  const navigate = useNavigate();
  const { notifyUser } = Toast();

    const [isMobileSidebarOpen,setIsMobileSidebarOpen] = React.useState<boolean>(false)

    // console.log('user-profile___>',userProfileData?.[0].amount_owing)


 
    useEffect(() => {
      if (!user) {
       
        notifyUser("You must be logged in to view this page","error");
        navigate('/login');
      }
    }, [user,navigate,notifyUser]);

    useEffect(() => {
      if (user){

        if (userProfileData[0]?.amount_owing>0) {
         
          notifyUser("You must pay your dues to proceed","error");
          navigate('/pay-dues');
        }
      }
    }, [userProfileData,navigate,notifyUser]);

  return (
    <div className="font-sans h-screen relative ">
        <Sidebar  isMobileSidebarOpen={isMobileSidebarOpen}  setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
        <section className="lg:max-w-[calc(100%_-_330px)] ml-auto py-10">
            <Navbar setIsMobileSidebarOpen={setIsMobileSidebarOpen} isMobileSidebarOpen={isMobileSidebarOpen} />
            <div className="scrollbar-thin scrollbar-thumb-[#C1C1C1] scrollbar-track-gray-200 scrollbar-rounded overflow-y-auto text-black z-1 w-[95%] mx-auto py-4 pt-[70px]" >  
                {children}
            </div>

        </section>
    </div>
  )
}

export default DashboardLayout