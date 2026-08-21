import { ColorRing } from "react-loader-spinner";
import { useTheme } from "../../context/themeContext";
import { DEFAULT_PRIMARY } from "../../utils/themeUtils";

interface Props {
  /**
   * Cover the viewport instead of sitting in the flow. This used to be the only
   * behaviour — the loader was `fixed inset` + `z-50`, so a spinner meant for a card or a
   * table threw a full-screen overlay over the whole app. Inline is the sane default.
   */
  fullscreen?: boolean;
}

const CircleLoader = ({ fullscreen = false }: Props) => {
  const theme = useTheme();
  // Was hardcoded #015595 — a blue — so every loading state in the app flashed the wrong
  // brand before (or instead of) the tenant's own colour.
  const colour = theme?.currentTheme?.primaryColor || DEFAULT_PRIMARY;

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 grid place-items-center bg-white/70" : "w-full grid place-items-center py-6"}>
      <ColorRing visible height="80" width="80" ariaLabel="Loading" wrapperClass="blocks-wrapper" colors={[colour, colour, colour, colour, colour]} />
    </div>
  );
};

export default CircleLoader;
