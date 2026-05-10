import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SideBarLinkType } from "../../types/sidebarDataType";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface NavItemProps {
  item: SideBarLinkType;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
  onLogout?: () => void;
}

const NavItem = ({ item, isMobileSidebarOpen, setIsMobileSidebarOpen, onLogout }: NavItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSubMenuActive = item.subMenu?.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + "/")) ?? false;

  const [isDropdownOpen, setIsDropdownOpen] = useState(isSubMenuActive);

  const handleClick = (e?: React.MouseEvent) => {
    if (item.name === "Logout" && onLogout) {
      onLogout();
    } else if (item.subMenu) {
      e?.preventDefault();
      setIsDropdownOpen(prev => !prev);
    } else {
      navigate(item.path || "");
      if (isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    }
  };

  const handleSubMenuClick = (path: string, isMessage?: boolean) => {
    if (isMessage) return;
    navigate(path);
    setIsMobileSidebarOpen(false);
  };

  const isActive = item.path
    ? item.path === "/"
      ? location.pathname === "/"
      : location.pathname === item.path || location.pathname.startsWith(item.path + "/") || (item.activeFor?.some(p => location.pathname === p || location.pathname.startsWith(p + "/")) ?? false)
    : isSubMenuActive || (item.activeFor?.some(p => location.pathname === p || location.pathname.startsWith(p + "/")) ?? false);

  const itemContent = (
    <div className={`flex my-1 items-center justify-between gap-3 text-[15px] p-3 mx-4 rounded-lg text-gray-500 ${isActive ? "bg-org-primary text-white font-bold" : "hover:bg-org-secondary hover:text-org-primary"}`}>
      <div className="flex items-center gap-2">
        {item.mainIcon && React.createElement(item.mainIcon, { className: "w-5 h-5" })}
        <span className="text-sm md:text-[15px]">{item.name}</span>
      </div>
      <div className="flex items-center gap-1">
        {(item.activeLinkIcon || item.notActiveLinkIcon) && <img className="w-fit h-6 object-fit" src={isActive ? item.activeLinkIcon : item.notActiveLinkIcon} alt="" />}
        {item.subMenu && <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""} ${isActive ? "text-white" : "text-gray-400"}`} />}
      </div>
    </div>
  );

  return (
    <>
      {item.subMenu ? (
        <button type="button" onClick={e => handleClick(e)} className="w-full text-left">
          {itemContent}
        </button>
      ) : (
        <NavLink to={item.path ?? ""} style={{ textDecoration: "none" }} onClick={() => handleClick()}>
          {itemContent}
        </NavLink>
      )}

      {isDropdownOpen && item.subMenu && (
        <div className="ml-6 mt-1 mb-1 space-y-1">
          {item.subMenu.map((subItem, index) => {
            const subIsActive = !subItem.isMessage && (location.pathname === subItem.path || location.pathname.startsWith(subItem.path + "/"));
            return (
              <div
                key={index}
                onClick={() => handleSubMenuClick(subItem.path, subItem.isMessage)}
                className={`text-sm px-3 py-2 rounded-lg mx-4 ${
                  subItem.isMessage ? "text-gray-400 italic cursor-default" : `cursor-pointer ${subIsActive ? "bg-org-primary text-white font-semibold" : "text-gray-600 hover:bg-org-secondary hover:text-org-primary"}`
                }`}
              >
                {subItem.name}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default NavItem;
