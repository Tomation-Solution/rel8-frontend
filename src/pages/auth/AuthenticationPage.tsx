import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { apiPublic } from "../../api/baseApi";
import { useAppContext } from "../../context/authContext";

const AuthenticationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

    const { setRel8LoginUserData } = useAppContext();
  

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const electionId = searchParams.get("electionId");

    console.log("URL search params:", Object.fromEntries(searchParams.entries()));
    console.log("Extracted token:", token);

    const performMagicLogin = async () => {
      if (!token) {
        return navigate("/login");
      }

      try {
        console.log("Attempting magic login with token:", token);
        // Don't double-encode the token if it's already URL-encoded
        const encodedToken = token.includes('%') ? token : encodeURIComponent(token);
        const response = await apiPublic.get(`/members/magic-login/${encodedToken}`);
        console.log("Magic login response:", response);

        if (!response.data || !response.data.token || !response.data.member) {
          console.error("Invalid response format from magic login");
          navigate("/login");
          return;
        }

        const { token: authToken, member } = response.data;
  
        setRel8LoginUserData({ ...member, token: authToken })
        console.log(token,member);
        console.log("Successfully logged in via magic link, redirecting to election");

        // Redirect to elections page; this route already exists
        if(electionId){
          navigate(`/election/${electionId}`);
        }else{
          navigate("/election", { replace: true });
        }
      } catch (error) {
        console.error("Magic login failed", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Error status:", error.response.status);
        }
        navigate("/login");
      }
    };

    performMagicLogin();
  }, [location.search, navigate]);

  return <Loader />;
};

export default AuthenticationPage;


