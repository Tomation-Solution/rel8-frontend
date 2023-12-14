import membersEnviroment from '../assets/icons/members-enviroment.png'
import activeLinkIcon from '../assets/icons/active-link-icon.png'
import nonActiveLinkIcon from '../assets/icons/non-active-link-icon.png'
import excosEnviromentIcon from '../assets/icons/excos-enviroment.png'
import comiteeEnviromentIcon from '../assets/icons/comittee-enviroment.png'
import togglerIcon from '../assets/icons/toggler.png'
import eventsIcon from '../assets/icons/events.png'
import newsIcon from '../assets/icons/news.png'
import galleryIcon from '../assets/icons/gallery.png'
import accountIcon from '../assets/icons/my-account.png'
import serviceRequestsIcon from '../assets/icons/service-request.png'
import electionIcon from '../assets/icons/election.png'
import logoutIcon from '../assets/icons/logout.png'
import homeIcon from '../assets/icons/home.png'
import chatIcon from '../assets/icons/chat.png'
import notificationsIcon from '../assets/icons/bell.png'
import { SideBarLinkType } from '../types/sidebarDataType'

export const sideBarData: SideBarLinkType[] = [
  {
    mainIcon: homeIcon,
    name: "Home",
    path: "/",
  },
  {
    mainIcon: chatIcon,
    name: "Chat",
    path: "/chat",
  },
  {
    mainIcon: notificationsIcon,
    name: "Notifications",
    path: "/notifications",
  },
  {
    mainIcon:membersEnviroment,
    name: "Registry",
    path: "/registry",
    activeLinkIcon: '',
    notActiveLinkIcon:'',
  },
  {
    mainIcon:membersEnviroment,
    name: "Members Enviroment",
    path: "#",
    activeLinkIcon: activeLinkIcon,
    notActiveLinkIcon:nonActiveLinkIcon,
  },
  {
    mainIcon: excosEnviromentIcon,
    name: "Excos Enviroment",
    path: "/excos",
    activeLinkIcon: activeLinkIcon,
    notActiveLinkIcon:nonActiveLinkIcon,
  },
  {
    mainIcon: comiteeEnviromentIcon,
    name: "Committee Envirmoment",
    activeLinkIcon: togglerIcon,
    notActiveLinkIcon: togglerIcon,
  },
  {
    mainIcon: eventsIcon,
    name: "Events",
    path: "/events",
  },
  // {
  //   mainIcon: eventsIcon,
  //   name: "Special Events",
  //   path: "/special-events",
  // },
  {
    mainIcon:newsIcon,
    name: "Publication",
    path: "/publications",
  },
  {
    mainIcon:newsIcon,
    name: "News",
    path: "/news",
  },
  // {
  //   mainIcon:resourcesIcon,
  //   name: "Resources",
  //   path: "/resources",
  // },
  {
    mainIcon: galleryIcon,
    name: "Gallery",
    path: "/gallery",
  },
  {
    mainIcon: accountIcon,
    name: "My Account",
    path: "/account",
  },
  {
    mainIcon: serviceRequestsIcon,
    name: "Service Requests",
    path: "/service-requests",
  },
  {
    mainIcon: electionIcon,
    name: "Election",
    path: "/election",
  },
  // {
  //   mainIcon: subscribeIcon,
  //   name: "Subscribe",
  //   path: "/subscribe",
  // },
  // {
  //   mainIcon: supportIcon,
  //   name: "Support",
  //   path: "/support",
  // },
  {
    mainIcon: logoutIcon,
    name: "Logout",
    path: "/logout",
  },
];
