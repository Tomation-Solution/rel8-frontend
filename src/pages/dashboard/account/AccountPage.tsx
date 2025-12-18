import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import ProfileTab from "./ProfileTab";

const AccountPage = () => {
  return (
    <main>
      <BreadCrumb title="My Account" />
      <ProfileTab />
    </main>
  );
};

export default AccountPage;