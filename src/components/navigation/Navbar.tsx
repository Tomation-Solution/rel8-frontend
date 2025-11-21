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

interface Props {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
}

const Navbar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }: Props) => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  // Fetch notifications
  const { data: notifications } = useQuery(
    "notifications",
    fetchAllNotifications
  );

  // Calculate the number of notifications
  const notificationCount = notifications?.length || 0;

  console.log(user);

  console.log(user);
  return (
    <header className="h-[70px] z-[999] w-full sticky px-2 border-b bg-gray-50 ">
      <div className="w-[95%] mx-auto flex items-center h-full justify-between">
        <div className="flex items-center gap-5">
          <span
            className="lg:hidden cursor-pointer"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? (
              <AiOutlineClose className="w-7 h-7 cursor-pointer" />
            ) : (
              <FaBars className="w-7 h-7 cursor-pointer" />
            )}
          </span>
          <h3 className="font-bold text-neutral-1 capitalize md:text-xl text-[16px]">
            <span className="text-textColor !capitalize">Hello</span>{" "}
            <span className="!capitalize">{user?.name}</span>
          </h3>
        </div>
        <div className="hidden lg:inline-flex flex-[0.6] items-center justify-center h-[65%]">
          <form
            action=""
            className="h-full w-full flex items-center justify-between gap-1"
          >
            <div className="bg-[#eee] flex items-center h-full flex-1 rounded-md gap-2 px-3">
              <HiMiniMagnifyingGlass className="text-neutral-1 w-6 h-6" />
              <input
                type="text"
                className="bg-[#eee] h-full rounded-[12px] placeholder:text-neutral-1 placeholder:text-sm flex-1 px-3 outline-none"
                placeholder="Search"
              />
            </div>
            <button className="h-[inherit]">
              <img
                src={navbarSearch}
                className="mx-2 h-full max-h-[inherit] object-fit"
                alt=""
              />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="relative bg-org-primary grid place-items-center rounded-full p-2 cursor-pointer"
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
