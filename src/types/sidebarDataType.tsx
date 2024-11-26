export interface SubMenuItem {
  name: string;
  path: string;
  isMessage?: boolean;
}

export interface DropdownLinkType {
  mainIcon: string;
  name: string;
  path: string;
}

export interface SideBarLinkType {
  name: string;
  path?: string;
  mainIcon?: string;
  activeLinkIcon?: string;
  notActiveLinkIcon?: string;
  subMenu?: SubMenuItem[]; // Updated to use SubMenuItem interface
}