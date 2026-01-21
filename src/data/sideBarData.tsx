import {
  FiGrid,
  FiImage,
  FiCalendar,
  FiUser,
  FiBell,
  FiHelpCircle,
  FiLogOut,
  FiBriefcase,
} from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { PiChatTeardropText } from "react-icons/pi";
import { CgWebsite } from "react-icons/cg";
import { MdBallot, MdOutlineAdminPanelSettings } from "react-icons/md";
import { SideBarLinkType } from '../types/sidebarDataType'

export const sideBarData: SideBarLinkType[] = [
  {
    mainIcon: FiGrid,
    name: "Home",
    path: "/",
  },
  {
    mainIcon: PiChatTeardropText,
    name: "Chat",
    path: "/chat",
  },
  {
    mainIcon: FiBell,
    name: "Notifications",
    path: "/notifications",
  },
  // {
  //   mainIcon:membersEnviroment,
  //   name: "Directory",
  //   path: "/registry",
  //   activeLinkIcon: '',
  //   notActiveLinkIcon:'',
  // },
  {
    mainIcon: HiOutlineUserGroup,
    name: "Members Enviroment",
    path: "/members",
  },
  {
    mainIcon: MdOutlineAdminPanelSettings,
    name: "Excos Enviroment",
    path: "/excos",
  },
  // {
  //   mainIcon: comiteeEnviromentIcon,
  //   name: "Committee Environment",
  //   activeLinkIcon: togglerIcon,
  //   notActiveLinkIcon: togglerIcon,
  //   subMenu: [] // This will be filled with committee data fetched from the backend
  // },

  {
    mainIcon: FiCalendar,
    name: "Events",
    path: "/events",
  },
  {
    mainIcon: FiCalendar,
    name: "Meetings",
    path: "/meeting",
  },
  // {
  //   mainIcon: FiCalendar,
  //   name: "Special Events",
  //   path: "/special-events",
  // },
  {
    mainIcon: CgWebsite,
    name: "Publication",
    path: "/publications",
  },
  {
    mainIcon: CgWebsite,
    name: "News",
    path: "/news",
  },
  // {
  //   mainIcon:resourcesIcon,
  //   name: "Resources",
  //   path: "/resources",
  // },
  {
    mainIcon: FiImage,
    name: "Gallery",
    path: "/gallery",
  },
  {
    mainIcon: MdBallot,
    // mainIcon: electionIcon,
    name: "Election",
    path: "/election",
  },
  {
    mainIcon: FiUser,
    name: "Dues",
    path: "/dues",
  },
  {
    mainIcon: FiUser,
    name: "My Account",
    path: "/account",
  },
  {
    mainIcon: FiUser,
    name: "Fund a Project",
    path: "/fund-a-project",
  },
  {
    mainIcon: FiBriefcase,
    name: "Service Requests",
    path: "/service-requests",
  },
  // {
  //   mainIcon: subscribeIcon,
  //   name: "Subscribe",
  //   path: "/subscribe",
  // },
  {
    mainIcon: FiHelpCircle,
    name: "Support",
    path: "/support",
  },
  {
    mainIcon: FiLogOut,
    name: "Logout",
    path: "/logout",
  },
];
