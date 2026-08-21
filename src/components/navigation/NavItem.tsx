import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SideBarLinkType } from "../../types/sidebarDataType";
import { FiChevronDown, FiFolder } from "react-icons/fi";

interface NavItemProps {
  item: SideBarLinkType;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
  onLogout?: () => void;
  /** Count badge after the label (Events). */
  badge?: number;
  /** Unread marker after the label (Notifications). */
  dot?: boolean;
}

const NavItem = ({ item, isMobileSidebarOpen, setIsMobileSidebarOpen, onLogout, badge, dot }: NavItemProps) => {
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

  const matches = (base: string) => location.pathname === base || location.pathname.startsWith(base + "/");

  const isActive = item.path
    ? item.path === "/"
      ? location.pathname === "/"
      : matches(item.path) || (item.activeFor?.some(matches) ?? false)
    : isSubMenuActive || (item.activeFor?.some(matches) ?? false);

  // Active state: lavender pill with a brand-coloured bar down its left edge, bleeding to
  // the rail's edge. Inactive rows are plain — no hover fill on the icon.
  const base = "relative flex items-center justify-between gap-3 pl-6 pr-4 py-3 rounded-r-lg transition-colors";
  const tone = item.danger ? "text-status-danger hover:bg-status-danger-bg/60" : isActive ? "bg-org-tint text-org-primary font-medium" : "text-ink hover:bg-org-tint/60";

  const itemContent = (
    <div className={`${base} ${tone}`}>
      {isActive && !item.danger && <span className="absolute left-0 top-0 bottom-0 w-1 rounded-r bg-org-primary" aria-hidden />}
      <span className="flex items-center gap-3 min-w-0">
        {item.mainIcon && React.createElement(item.mainIcon, { className: "w-5 h-5 flex-shrink-0" })}
        <span className="text-[15px] truncate">{item.name}</span>
        {dot && <span className="w-2 h-2 rounded-full bg-org-primary flex-shrink-0" aria-label="unread" />}
      </span>
      <span className="flex items-center gap-1 flex-shrink-0">
        {typeof badge === "number" && badge > 0 && <span className={`text-xs rounded-full px-2 py-0.5 ${isActive ? "bg-org-primary text-white" : "bg-neutral-2 text-white"}`}>{badge}</span>}
        {(item.activeLinkIcon || item.notActiveLinkIcon) && <img className="w-fit h-6 object-fit" src={isActive ? item.activeLinkIcon : item.notActiveLinkIcon} alt="" />}
        {item.subMenu && <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />}
      </span>
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
        <div className="ml-10 mt-1 mb-1 space-y-1">
          {item.subMenu.map((subItem, index) => {
            // ── Nested group (e.g. Committee folder) ──────────────────
            if (subItem.children && subItem.children.length > 0) {
              return <NestedSubGroup key={index} label={subItem.name} items={subItem.children} onNavigate={path => handleSubMenuClick(path)} />;
            }

            // ── Regular sub-item ──────────────────────────────────────
            const subIsActive = !subItem.isMessage && matches(subItem.path);
            return (
              <div
                key={index}
                onClick={() => handleSubMenuClick(subItem.path, subItem.isMessage)}
                className={`text-sm px-3 py-2 mr-4 rounded-lg ${subItem.isMessage ? "text-muted italic cursor-default" : `cursor-pointer ${subIsActive ? "bg-org-tint text-org-primary font-medium" : "text-muted hover:bg-org-tint/60"}`}`}
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

// ── Collapsible nested sub-group (e.g. "Committee" folder) ──────────────────

interface NestedSubGroupProps {
  label: string;
  items: { name: string; path: string }[];
  onNavigate: (path: string) => void;
}

const NestedSubGroup = ({ label, items, onNavigate }: NestedSubGroupProps) => {
  const location = useLocation();
  const anyChildActive = items.some(c => location.pathname === c.path || location.pathname.startsWith(c.path + "/"));
  const [open, setOpen] = useState(anyChildActive);

  return (
    <div>
      <button type="button" onClick={() => setOpen(prev => !prev)} className="w-full flex items-center justify-between px-3 py-2 mr-4 rounded-lg text-sm text-muted hover:bg-org-tint/60">
        <span className="flex items-center gap-2">
          <FiFolder className="w-4 h-4 flex-shrink-0" />
          {label}
        </span>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5">
          {items.map((child, i) => {
            const isActive = location.pathname === child.path || location.pathname.startsWith(child.path + "/");
            return (
              <div key={i} onClick={() => onNavigate(child.path)} className={`text-sm px-3 py-2 mr-4 rounded-lg cursor-pointer ${isActive ? "bg-org-tint text-org-primary font-medium" : "text-muted hover:bg-org-tint/60"}`}>
                {child.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
