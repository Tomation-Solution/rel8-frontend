import React from "react";

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
  mainIcon?: React.ElementType;
  activeLinkIcon?: string;
  notActiveLinkIcon?: string;
  subMenu?: SubMenuItem[];
  requiresExco?: boolean;
  requiresCommittee?: boolean;
  activeFor?: string[];
}
