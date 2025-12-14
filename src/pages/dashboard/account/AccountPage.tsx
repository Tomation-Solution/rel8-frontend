import { useState } from "react";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import PaymentsTab from "./PaymentsTab";
import ProfileTab from "./ProfileTab";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'profile'>('payments');

  return (
    <main>
      <BreadCrumb title="My Account" />

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'border-org-primary text-org-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-org-primary text-org-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Profile
        </button>
      </div>

      {activeTab === 'payments' && <PaymentsTab />}
      {activeTab === 'profile' && <ProfileTab />}
    </main>
  );
};

export default AccountPage;