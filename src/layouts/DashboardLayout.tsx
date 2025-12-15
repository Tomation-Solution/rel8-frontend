import React, { ReactNode, useEffect, useState } from "react"
import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../components/toast/Toast";
import { useAppContext } from "../context/authContext";
import OutstandingDuesModal from "../components/modals/OutstandingDuesModal";
import { useQuery } from "react-query";
import { fetchUserDues } from "../api/account/account-api";
import { fetchOrganizationSettings } from "../api/organization/organization-api";
import { TableDataType } from "../types/myTypes";


interface DashboardLayoutInterfaceProps {
    children: ReactNode;
  }

const DashboardLayout = ({children}:DashboardLayoutInterfaceProps) => {

  const { user,userProfileData } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifyUser } = Toast();

    const [isMobileSidebarOpen,setIsMobileSidebarOpen] = React.useState<boolean>(false)
    const [showDuesModal, setShowDuesModal] = useState(true);

    // Get organization settings for currency
    const { data: orgSettings } = useQuery("organizationSettings", fetchOrganizationSettings);
    const currentCurrency = orgSettings?.settings?.currency || 'USD';
    const currencySymbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      NGN: '₦',
      CAD: 'C$',
      AUD: 'A$',
    };
    const currencySymbol = currencySymbols[currentCurrency] || '$';

    // Get user dues data
    const { data: userDues } = useQuery("userDues", fetchUserDues, {
      enabled: !!user, // Only fetch if user is logged in
    });

    // Check if current page is account page
    const isAccountPage = location.pathname === '/account' || location.pathname.startsWith('/dashboard/account');

    // Calculate total outstanding amount from dues data
    const totalOutstandingAmount = userDues
      ?.filter((dues: TableDataType) => dues.status !== 'approved')
      ?.reduce((total: number, dues: TableDataType) => {
        return total + parseFloat(dues.amount || '0');
      }, 0) || 0;

    useEffect(() => {
      if (!user) {

        notifyUser("You must be logged in to view this page","error");
        navigate('/login');
      }
    }, [user,navigate,notifyUser]);

    useEffect(() => {
      if (user && userDues && totalOutstandingAmount > 0 && !isAccountPage){
          setShowDuesModal(true);
      } else {
        setShowDuesModal(false);
      }
    }, [user, userDues, totalOutstandingAmount, isAccountPage]);

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

        {/* Outstanding Dues Modal */}
        <OutstandingDuesModal
          isOpen={showDuesModal}
          onClose={() => setShowDuesModal(false)}
          totalAmount={totalOutstandingAmount}
          currencySymbol={currencySymbol}
        />
    </div>
  )
}

export default DashboardLayout