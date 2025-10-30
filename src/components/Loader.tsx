import { Hourglass } from "react-loader-spinner";
import { useTheme } from "../context/themeContext";

const Loader = () => {

  const theme = useTheme();
  
  console.log(theme);
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Hourglass
        visible={true}
        height="100"
        width="100"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        // colors={["#015595", "#72a1ed"]}
        colors={[theme?.currentTheme?.primaryColor || "#015595",theme?.currentTheme?.secondaryColor || "#72a1ed"]}
      />
      
    </div>
  );
};

export default Loader;
