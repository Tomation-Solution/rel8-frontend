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
      if (user && userProfileData){

        if (userProfileData[0]?.amount_owing>0) {
         
          notifyUser("You must pay your dues to proceed","error");
          navigate('/pay-dues');
        }
      }
    }, [userProfileData,navigate,notifyUser]);

  return (
    <div className="font-sans h-screen overflow-hidden relative flex justify-between">
        <Sidebar  isMobileSidebarOpen={isMobileSidebarOpen}  setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
        <section className="lg:w-[calc(100%)] overflow-y-scroll h-screen  pb-10 relative">
          <div className="fixed w-full">
            <Navbar setIsMobileSidebarOpen={setIsMobileSidebarOpen} isMobileSidebarOpen={isMobileSidebarOpen} />
          </div>
            <div className="scrollbar-thin mt-12 scrollbar-thumb-[#C1C1C1] scrollbar-track-gray-200 scrollbar-rounded overflow-y-auto text-black z-1 w-[95%] mx-auto py-4 pt-[70px]" >  
                {children}
            </div>

        </section>
    </div>
  )
}

export default DashboardLayout