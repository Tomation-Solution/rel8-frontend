import React from "react";

export interface SubMenuItem {
  name: string;
  path: string;
  isMessage?: boolean;
  /** Nested children — used to group items (e.g. all Committee groups) */
  children?: SubMenuItem[];
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
  /** Stable id the Sidebar uses to attach a live count badge or unread dot. */
  key?: string;
  /** Opens a new visual group — renders extra space above the item. */
  startsGroup?: boolean;
  /** Destructive styling (Logout). */
  danger?: boolean;
}
