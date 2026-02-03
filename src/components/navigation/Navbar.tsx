import avatarImage from "../../assets/images/avatar-1.jpg";
import Avatar from "../avatar/Avatar";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import navbarSearch from "../../assets/images/navbar-search.png";
import { useAppContext } from "../../context/authContext";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useQuery } from "react-query";
import { fetchAllNotifications } from "../../api/notifications/notifications-api";
import { useNavigate } from "react-router-dom";
import { useEnvironmentContext, EnvironmentType } from "../../context/environmentContext";
import { useState, useEffect, useRef } from "react";

interface Props {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
}

const Navbar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }: Props) => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { toggleEnvironment, isEnvironmentActive } = useEnvironmentContext();
  const [showEnvironmentDropdown, setShowEnvironmentDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const { data: notifications } = useQuery(
    "notifications",
    fetchAllNotifications
  );

  // Calculate the number of notifications
  const notificationCount = notifications?.length || 0;

  const environments: { type: EnvironmentType; label: string }[] = [
    { type: 'members', label: 'Members' },
    { type: 'excos', label: 'Excos' },
    { type: 'committee', label: 'Committee' },
  ];

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEnvironmentDropdown(false);
      }
    };

    if (showEnvironmentDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEnvironmentDropdown]);

  return (
    <header className="relative z-50 h-[70px] w-full border-b bg-gray-50">
      <div className="w-full h-full mx-auto flex items-center justify-between gap-2 md:gap-3 lg:gap-4 px-2 md:px-4 lg:px-6 overflow-x-auto">
        <div className="flex items-center gap-3 md:gap-5 flex-shrink-0 min-w-0">
          <button
            type="button"
            aria-label={isMobileSidebarOpen ? "Close menu" : "Open menu"}
            className="lg:hidden cursor-pointer flex-shrink-0"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? (
              <AiOutlineClose className="w-7 h-7 cursor-pointer" />
            ) : (
              <FaBars className="w-7 h-7 cursor-pointer" />
            )}
          </button>
          <h3 className="font-bold text-neutral-1 capitalize text-sm md:text-xl flex-shrink-0 whitespace-nowrap truncate">
            <span className="text-textColor !capitalize">Hello</span>{" "}
            <span className="!capitalize">{user?.name}</span>
          </h3>
        </div>
        <div className="hidden lg:inline-flex flex-1 max-w-md items-center justify-center h-[65%] mx-2 min-w-0">
          <form
            action=""
            className="h-full w-full flex items-center justify-between gap-1 min-w-0"
          >
            <div className="bg-[#eee] flex items-center h-full flex-1 rounded-md gap-2 px-3 min-w-0">
              <HiMiniMagnifyingGlass className="text-neutral-1 w-6 h-6 flex-shrink-0" />
              <input
                type="text"
                className="bg-[#eee] h-full rounded-[12px] placeholder:text-neutral-1 placeholder:text-sm flex-1 px-3 outline-none min-w-0"
                placeholder="Search"
              />
            </div>
            <button className="h-[inherit] flex-shrink-0">
              <img
                src={navbarSearch}
                className="mx-2 h-full max-h-[inherit] object-fit"
                alt=""
              />
            </button>
          </form>
        </div>
        {/* Environment Toggles */}
        <div className="hidden md:flex items-center gap-2 relative flex-shrink-0" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEnvironmentDropdown(!showEnvironmentDropdown);
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-org-primary whitespace-nowrap"
            >
              Environments
            </button>
            {showEnvironmentDropdown && (
              <div 
                className="fixed mt-2 w-48 bg-white rounded-md shadow-lg z-[1000] border border-gray-200"
                style={{
                  top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 0,
                  right: dropdownRef.current ? window.innerWidth - dropdownRef.current.getBoundingClientRect().right : 0,
                }}
              >
                <div className="py-1">
                  {environments.map((env) => (
                    <label
                      key={env.type}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isEnvironmentActive(env.type)}
                        onChange={() => {
                          toggleEnvironment(env.type);
                        }}
                        className="mr-3 h-4 w-4 text-org-primary focus:ring-org-primary border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{env.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="relative bg-org-primary grid place-items-center rounded-full p-2 cursor-pointer flex-shrink-0"
            onClick={() => navigate("/notifications")}
          >
            <IoNotificationsOutline className="text-white bg-org-primary w-6 h-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {notificationCount}
              </span>
            )}
          </div>
          <Avatar name={user?.name} imageUrl={user?.imageUrl} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;