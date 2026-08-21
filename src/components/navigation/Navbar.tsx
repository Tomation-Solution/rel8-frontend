import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { FiBell } from "react-icons/fi";
import { HiMiniMagnifyingGlass, HiOutlineCalendarDays } from "react-icons/hi2";
import { useAppContext } from "../../context/authContext";
import { fetchAllNotifications } from "../../api/notifications/notifications-api";
import { formatTopbarDate } from "../../utils/dates";

interface Props {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
}

const Divider = () => <span className="hidden xl:block w-px h-8 bg-hairline flex-shrink-0" aria-hidden />;

const Navbar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }: Props) => {
  const { user, organization } = useAppContext();
  const navigate = useNavigate();

  const { data: notifications } = useQuery("notifications", fetchAllNotifications, { enabled: !!user, staleTime: 5 * 60 * 1000 });
  const hasUnread = (notifications?.length || 0) > 0;

  return (
    <header className="relative z-30 h-[70px] w-full flex-shrink-0 border-b border-hairline bg-app">
      <div className="h-full flex items-center gap-3 xl:gap-5 px-4 lg:px-6">
        <button type="button" aria-label={isMobileSidebarOpen ? "Close menu" : "Open menu"} className="lg:hidden flex-shrink-0 text-ink" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
          {isMobileSidebarOpen ? <AiOutlineClose className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>

        {/*
          Decorative for now — there is no search endpoint on this backend, so wiring the
          field would only produce a box that never returns anything. See REDESIGN.md §5.
        */}
        <div className="hidden md:flex flex-1 max-w-md items-center gap-2 h-11 px-4 rounded-lg border border-org-tint-strong bg-white cursor-not-allowed">
          <HiMiniMagnifyingGlass className="w-5 h-5 text-org-primary/50 flex-shrink-0" />
          <input type="text" disabled placeholder="Search Anything" className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-muted cursor-not-allowed" aria-label="Search (coming soon)" />
          <kbd className="hidden lg:inline text-[11px] text-muted bg-hairline/70 rounded px-2 py-1 flex-shrink-0">Ctrl + K</kbd>
        </div>

        <div className="flex-1 md:flex-none" />

        <Divider />

        <div className="hidden xl:flex items-center gap-2 flex-shrink-0">
          <HiOutlineCalendarDays className="w-5 h-5 text-org-primary" />
          <span className="text-sm text-ink whitespace-nowrap">{formatTopbarDate()}</span>
        </div>

        <Divider />

        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="inline-flex items-center gap-2 h-10 px-3 sm:px-4 rounded-full border border-org-primary text-org-primary hover:bg-org-tint flex-shrink-0"
        >
          <span className="relative">
            <FiBell className="w-5 h-5" />
            {hasUnread && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-status-danger" />}
          </span>
          <span className="hidden sm:inline text-sm">Notifications</span>
        </button>

        <Divider />

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:block text-right leading-tight min-w-0">
            <p className="text-sm font-semibold text-ink truncate max-w-[140px]">{organization?.shortName || organization?.name || "Rel8"}</p>
            <p className="text-xs text-muted truncate">{user?.exco?.isExco ? "Exco" : "Member"}</p>
          </div>
          {organization?.logo ? (
            <img src={organization.logo} alt="" className="w-10 h-10 rounded-lg object-contain bg-white border border-hairline flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-org-tint text-org-primary grid place-items-center font-semibold flex-shrink-0">{String(organization?.shortName || organization?.name || "R").charAt(0).toUpperCase()}</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
