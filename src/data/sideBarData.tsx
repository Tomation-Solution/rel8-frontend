import { FiGrid, FiImage, FiCalendar, FiUser, FiBell, FiHelpCircle, FiLogOut, FiBriefcase, FiLayers } from "react-icons/fi";
import { PiChatTeardropText } from "react-icons/pi";
import { CgWebsite } from "react-icons/cg";
import { MdBallot } from "react-icons/md";
import { SideBarLinkType } from "../types/sidebarDataType";

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
    mainIcon: FiLayers,
    name: "Environments",
    subMenu: [], // populated dynamically in Sidebar.tsx based on user role
    activeFor: ["/members", "/excos", "/committees", "/groups"],
  },

  {
    mainIcon: FiCalendar,
    name: "Events",
    path: "/events",
    activeFor: ["/event"],
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
    activeFor: ["/publication"],
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
    activeFor: ["/elections-contestant", "/election-steps", "/all-votes", "/create-aspirant"],
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
    activeFor: ["/support-in-kind", "/support-in-cash"],
  },
  {
    mainIcon: FiBriefcase,
    name: "Service Requests",
    path: "/service-requests",
    activeFor: ["/service-requests-submission"],
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
    activeFor: ["/faq", "/technical-support", "/admin-support"],
  },
  {
    mainIcon: FiLogOut,
    name: "Logout",
    path: "/logout",
  },
];
