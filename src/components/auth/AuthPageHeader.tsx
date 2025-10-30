import { getTenantInfo } from "../../utils/constants";

interface Props {
  authPageHeader: string;
  authPageText: string;
  className?: string;
}

const AuthPageHeader = ({ authPageHeader, authPageText, className }: Props) => {

  const { logo } = getTenantInfo();
  return (
    <div className={`grid w-full my-10 text-center ${className}`}>
      <img src={logo} className="block mx-auto !max-h-32" alt="" />
      <h1 className="font-bold text-org-primary-blue ">{authPageHeader}</h1>
      <p className="font-[400] text-[16px] text-textColor"> {authPageText}</p>
    </div>
  );
};

export default AuthPageHeader;
