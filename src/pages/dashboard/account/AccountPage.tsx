import { useState } from "react";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import ProfileTab from "./ProfileTab";
import PaymentsTab from "./PaymentsTab";
import MembershipCardTab from "./MembershipCardTab";

type Tab = "profile" | "payments" | "card";

const TABS: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "payments", label: "Payments" },
  { key: "card", label: "Membership Card" },
];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <main>
      <BreadCrumb title="My Account" />

      <div className="mt-4 border-b border-gray-200 flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? "border-org-primary text-org-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "card" && <MembershipCardTab />}
      </div>
    </main>
  );
};

export default AccountPage;
