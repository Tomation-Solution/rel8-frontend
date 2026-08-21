import React, { ReactNode, useEffect, useState } from "react";
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
import { isOutstanding } from "../api/paystack-api";

interface DashboardLayoutInterfaceProps {
  children: ReactNode;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  CAD: "C$",
  AUD: "A$",
};

const DashboardLayout = ({ children }: DashboardLayoutInterfaceProps) => {
  const { user, organization } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifyUser } = Toast();

  const canShowBlocker = !!organization?.settings?.show_dues_blocker;

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState<boolean>(false);
  const [showDuesModal, setShowDuesModal] = useState(true);

  // Get organization settings for currency
  const { data: orgSettings } = useQuery("organizationSettings", fetchOrganizationSettings);
  const currencySymbol = currencySymbols[orgSettings?.settings?.currency || "USD"] || "$";

  // Get user dues data
  const { data: userDues } = useQuery("userDues", fetchUserDues, {
    enabled: !!user, // Only fetch if user is logged in
  });

  // Check if current page is account page
  const isAccountPage = location.pathname === "/account" || location.pathname.startsWith("/dashboard/account") || location.pathname.includes("election") || location.pathname.includes("dues");

  // Calculate total outstanding amount from dues data.
  // This used to filter on `status !== "approved"`, a value the backend has not returned
  // since X-7 — so every due counted as outstanding and the modal showed permanently.
  const totalOutstandingAmount =
    userDues
      ?.filter((dues: TableDataType) => isOutstanding(dues.status))
      ?.reduce((total: number, dues: TableDataType) => {
        return total + parseFloat(dues.amount || "0");
      }, 0) || 0;

  useEffect(() => {
    if (!user) {
      notifyUser("You must be logged in to view this page", "error");
      navigate("/login");
    }
  }, [user, navigate, notifyUser]);

  useEffect(() => {
    if (user && userDues && canShowBlocker && totalOutstandingAmount > 0 && !isAccountPage) {
      setShowDuesModal(true);
    } else {
      setShowDuesModal(false);
    }
  }, [user, userDues, totalOutstandingAmount, isAccountPage]);

  // Every route change starts at the top of the page — the scroll container is ours, not
  // the window's, so react-router's own scroll restoration never sees it.
  const scrollRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="font-sans h-screen overflow-hidden relative flex bg-white">
      <Sidebar isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />

      <section className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar setIsMobileSidebarOpen={setIsMobileSidebarOpen} isMobileSidebarOpen={isMobileSidebarOpen} />

        {/*
          The navbar sits in the flow now (it used to be `fixed`, which is what the old
          `pt-[70px]` on this container was compensating for), so this scrolls under
          nothing and needs no top offset.
        */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-hairline scrollbar-track-transparent">
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
        </main>
      </section>

      {/* Outstanding Dues Modal */}
      <OutstandingDuesModal isOpen={showDuesModal} onClose={() => setShowDuesModal(false)} totalAmount={totalOutstandingAmount} currencySymbol={currencySymbol} />
    </div>
  );
};

export default DashboardLayout;
