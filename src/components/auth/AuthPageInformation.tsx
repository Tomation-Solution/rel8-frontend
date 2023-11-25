import { Link } from "react-router-dom";
interface Props{
  authPageInformationText:string;
  authPageInformationAction:string;
  authPageInformationLink:string;

}
const AuthPageInformation = ({authPageInformationAction,authPageInformationLink,authPageInformationText}:Props) => {
  return (
    <div className="flex items-center w-full max-w-md gap-2 my-4 text-left" >
   {authPageInformationText} <Link to={authPageInformationLink} className="font-medium" >{authPageInformationAction}</Link>
</div>
  );
};

export default AuthPageInformation;
