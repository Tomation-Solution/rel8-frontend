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
  subMenu?: Array<{
      name: string;
      path: string;
  }>; // Ensure that subMenu is an array of objects with the properties 'name' and 'path'
}
