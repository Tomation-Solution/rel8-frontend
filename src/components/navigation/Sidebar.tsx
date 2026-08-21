import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { sideBarData } from "../../data/sideBarData";
import NavItem from "./NavItem";
import { useAppContext } from "../../context/authContext";
import { fetchAllUserEvents } from "../../api/events/events-api";
import { fetchAllNotifications } from "../../api/notifications/notifications-api";
import { greeting } from "../../utils/dates";

interface Props {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
}

/** The member's headline role — the pill under the greeting. */
const roleLabel = (user: any): string => {
  if (user?.exco?.isExco) return user?.exco?.position || "Exco";
  if (user?.memberType && typeof user.memberType === "object" && user.memberType.name) return user.memberType.name;
  return "Member";
};

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }: Props) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  // Same query keys the Events page and Navbar use, so react-query serves these from cache
  // rather than firing a second request just to draw a badge.
  const { data: events } = useQuery("events", fetchAllUserEvents, { enabled: !!user, staleTime: 5 * 60 * 1000 });
  const { data: notifications } = useQuery("notifications", fetchAllNotifications, { enabled: !!user, staleTime: 5 * 60 * 1000 });

  const badges = useMemo(
    () => ({
      events: Array.isArray(events) ? events.length : Array.isArray((events as any)?.data) ? (events as any).data.length : 0,
      notifications: Array.isArray(notifications) ? notifications.length : 0,
    }),
    [events, notifications]
  );

  const handleLogout = () => {
    localStorage.removeItem("rel8User");
    localStorage.removeItem("userRel8RegistrationData");
    navigate("/login");
  };

  const firstName = String(user?.name ?? "").split(" ")[0];

  const header = (
    <div className="px-6 pt-6 pb-5">
      <p className="text-[17px] leading-tight">
        <span className="text-org-primary font-semibold">{greeting()},</span> <span className="text-ink font-semibold">{firstName}</span>
      </p>
      <p className="text-xs text-muted mt-1 leading-snug">Welcome back to your member portal..</p>
      <span className="inline-block mt-3 text-xs font-medium text-org-primary bg-org-tint border border-org-primary/40 rounded-full px-4 py-1.5">{roleLabel(user)}</span>
    </div>
  );

  const items = sideBarData.map((item, index) => (
    <div key={item.key ?? index} className={item.startsGroup ? "mt-4" : ""}>
      <NavItem
        item={item}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onLogout={item.name === "Logout" ? handleLogout : undefined}
        badge={item.key === "events" ? badges.events : undefined}
        dot={item.key === "notifications" && badges.notifications > 0}
      />
    </div>
  ));

  return (
    <>
      {/* Desktop rail */}
      <nav className="hidden lg:flex lg:w-[272px] flex-col flex-shrink-0 bg-app border-r border-hairline h-screen sticky top-0 overflow-y-auto scrollbar-thin scrollbar-thumb-hairline">
        {header}
        <div className="pb-8">{items}</div>
      </nav>

      {/* Mobile drawer */}
      <div
        onClick={() => setIsMobileSidebarOpen(false)}
        className={`lg:hidden fixed inset-0 top-[70px] bg-black/50 z-40 transition-opacity duration-200 ${isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <nav
          className={`fixed left-0 bottom-0 top-[70px] w-[82%] max-w-[300px] bg-app overflow-y-auto transform transition-transform duration-200 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={e => e.stopPropagation()}
          aria-label="Mobile navigation"
        >
          {header}
          <div className="pb-8">{items}</div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
