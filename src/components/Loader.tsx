import { Hourglass } from "react-loader-spinner";
import { useTheme } from "../context/themeContext";
import { DEFAULT_PRIMARY, DEFAULT_SECONDARY } from "../utils/themeUtils";

/** Route-level suspense fallback. */
const Loader = () => {
  const theme = useTheme();

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Hourglass
        visible
        height="100"
        width="100"
        ariaLabel="Loading"
        // Was #015595 / #72a1ed — blues left over from the pre-redesign palette.
        colors={[theme?.currentTheme?.primaryColor || DEFAULT_PRIMARY, theme?.currentTheme?.secondaryColor || DEFAULT_SECONDARY]}
      />
    </div>
  );
};

export default Loader;
