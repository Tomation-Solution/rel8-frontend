import { useState } from "react";

import { PageHeader, SubNav, Tabs, TabItem } from "../../../components/ui";
import ProfileTab from "./ProfileTab";
import PasswordTab from "./PasswordTab";
import NotificationPreferenceTab from "./NotificationPreferenceTab";
import CredentialsTab from "./CredentialsTab";

/**
 * My Account — `My Account*.png`, `Credentials.png`.
 *
 * A `SubNav` (Profile Settings / Credentials) with inner `Tabs` on the profile side.
 *
 * The old page had a third tab, "Payments", which was a second copy of the dues screen.
 * The mockup's SubNav has only these two, and Dues is its own item in the rail showing the
 * same panel, so nothing is lost by dropping it — see M7, where the two copies were merged
 * into one `DuesPanel`.
 */
type Section = "profile" | "credentials";

const SECTIONS: TabItem[] = [
  { key: "profile", label: "Profile Settings" },
  { key: "credentials", label: "Credentials" },
];

const PROFILE_TABS: TabItem[] = [
  { key: "general", label: "General Settings" },
  { key: "password", label: "Password Settings" },
  { key: "notifications", label: "Notification Preference" },
];

const AccountPage = () => {
  const [section, setSection] = useState<Section>("profile");
  const [profileTab, setProfileTab] = useState("general");

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
      <SubNav items={SECTIONS} active={section} onChange={key => setSection(key as Section)} />

      <div className="flex-1 min-w-0">
        {section === "profile" ? (
          <>
            <PageHeader title="Account Profile Settings" subtitle="Update your profile photo and personal details" />
            <Tabs tabs={PROFILE_TABS} active={profileTab} onChange={setProfileTab} />
            {profileTab === "general" && <ProfileTab />}
            {profileTab === "password" && <PasswordTab />}
            {profileTab === "notifications" && <NotificationPreferenceTab />}
          </>
        ) : (
          <>
            <PageHeader title="Credentials" subtitle="Manage your membership certificate and identity" />
            <CredentialsTab />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
