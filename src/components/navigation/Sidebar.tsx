import { sideBarData as initialSideBarData } from "../../data/sideBarData";
import NavItem from "./NavItem";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SubMenuItem, SideBarLinkType } from "../../types/sidebarDataType";
import { useAppContext } from "../../context/authContext";

interface Props {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
}

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }: Props) => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [sideBarData, setSideBarData] = useState<SideBarLinkType[]>(initialSideBarData);

  const isExco: boolean = user?.exco?.isExco === true;
  const userGroups: { _id: string; name: string }[] = Array.isArray(user?.groups) ? user.groups : [];

  useEffect(() => {
    const environmentsSubMenu: SubMenuItem[] = [{ name: "Members Environment", path: "/members" }];

    const committeeGroups: SubMenuItem[] = [];
    const otherGroups: SubMenuItem[] = [];

    userGroups.forEach(group => {
      const entry: SubMenuItem = { name: group.name, path: `/groups/${group._id}` };
      if (group.name.toLowerCase().includes("committee")) {
        committeeGroups.push(entry);
      } else {
        otherGroups.push(entry);
      }
    });

    // If more than one committee group, nest them under a "Committee" parent entry
    if (committeeGroups.length > 1) {
      environmentsSubMenu.push({ name: "Committee", path: "", children: committeeGroups });
    } else {
      committeeGroups.forEach(g => environmentsSubMenu.push(g));
    }

    otherGroups.forEach(g => environmentsSubMenu.push(g));

    const updated = initialSideBarData.map(item => (item.name === "Environments" ? { ...item, subMenu: environmentsSubMenu } : item));
    setSideBarData(updated);
  }, [isExco, userGroups.length]);

  const handleLogout = () => {
    localStorage.removeItem("rel8User");
    localStorage.removeItem("userRel8RegistrationData");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Navbar */}
      {/* <nav className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 overflow-y-auto hidden lg:inline-block lg:w-80 z-10 !bg-[#FAFAFB] fixed h-full shadow-md py-5"> */}
      <nav className="hidden lg:block lg:w-80 z-10 !bg-[#FAFAFB] h-screen shadow-md py-5 sticky top-0 overflow-y-auto">
        {sideBarData.map((item, index) => (
          <NavItem key={index} item={item} isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} onLogout={item.name === "Logout" ? handleLogout : undefined} />
        ))}
      </nav>

      {/* Mobile Navbar */}
      <div
        onClick={() => setIsMobileSidebarOpen(false)}
        className={`lg:hidden fixed left-0 right-0 bottom-0 top-[70px] bg-black/60 z-40 transition-opacity duration-200 ${isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <nav
          className={`fixed left-0 bottom-0 top-[70px] w-[80%] max-w-[320px] bg-white px-3 py-6 overflow-y-auto transform transition-transform duration-200 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={e => e.stopPropagation()}
          aria-label="Mobile navigation"
        >
          {sideBarData.map((item, index) => (
            <NavItem key={index} item={item} isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} onLogout={item.name === "Logout" ? handleLogout : undefined} />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
