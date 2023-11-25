export interface DropdownLinkType {
    mainIcon: string;
    name: string;
    path: string;
  }
  
export interface SideBarLinkType {
    mainIcon: string;
    name: string;
    path?: string;
    activeLinkIcon?: string;
    notActiveLinkIcon?: string;
    dropDown?: DropdownLinkType[];
  }