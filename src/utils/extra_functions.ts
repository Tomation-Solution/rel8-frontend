/*
 * `setRel8UserRegistrationData` / `getRel8UserRegistrationData` were removed with the
 * self-registration flow — there is no registration in this portal. Members are created by
 * an admin (or by an approved application), emailed a link, set a password and log in.
 */
import React from "react";
import { useLocation } from "react-router-dom";
import { MemberType } from "../api/members/api-members";
import { readStoredSession } from "./session";

/*
 * `getRel8LoginUserToken`, `getRel8LoginUserData`, `setRel8LoginUserData` and
 * `getRel8LoginUserMemberId` lived here and had no callers left. Two of them could not
 * have worked: they read `access` and `member_id`, fields of the old Django session shape
 * that this backend has never returned. Session reads now go through `utils/session`.
 */

export const getSubdomain = () => {
  const hostname = window.location.hostname;

  // Split the hostname by dots
  const parts = hostname.split(".");

  // Check if there is a subdomain
  if (parts.length >= 3) {
    // The subdomain is the first part of the hostname
    const subdomain = parts[0];
    return subdomain;
  } else {
    // No subdomain found
    return null;
  }
};

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export type UserType = {
  token: string;
  user_type: "members" | "admin" | "super_admin";
  chapter: {
    name: string;
    id: number;
  }[];
  council: {
    name: string;
    id: number;
    chapter: any;
  }[];
  commitee: {
    name: string;
    id: number;
  }[];
  id: number;
  member_id: string;
  profile_image: string | null;
};

type getUserOrNullResponse = null | UserType;
/** Thin alias over the session store, kept for the chat tab that identifies "me". */
export const getUserOrNull = (): getUserOrNullResponse => readStoredSession() as getUserOrNullResponse;

// export const toCurrency = (amount: number | string) => {
//   return '₦'+ numbro(amount).format('₦0,0');
// }

// export const getChatRoomName = ()=>{
//   const logged_in_user =  getUserOrNull()
//   if(logged_in_user){
//     const room_name = logged_in_user?.user_id>reciver_id?`${logged_in_user?.user_id}and${reciver_id}`:`${reciver_id}and${logged_in_user?.user_id}`
//   }
// }

// export const FetchName = (member:MemberType):string=>{
//   // @ts-ignore
//   const name:any = member.member_info.find(d=>{
//     return d.name.toLocaleLowerCase() == 'name' ||  d.name.toLocaleLowerCase() == 'first' ||d.name.toLocaleLowerCase() == 'first name' || d.name.toLocaleLowerCase() == 'surname'
// })['value']
// if(typeof name==='string'){
//   return name
// }
//  return `Member (${member.id})`
// }

export const FetchName = (user: any) => {
  if (!user) {
    return "Unknown User"; // Return a default value if user is undefined
  }
  // Check if member_info contains a fullname value
  const memberInfoFullName = user.member_info?.find((info: any) => info.name === "fullname")?.value;
  if (memberInfoFullName) {
    return memberInfoFullName;
  }
  return user.name || "Unknown User"; // Return user's full_name or default value
};

export const FetchNameByMemberInfo = (member_info: MemberType["member_info"]): string => {
  const name: any = member_info.find(d => {
    return d.name.toLocaleLowerCase() == "name" || d.name.toLocaleLowerCase() == "first" || d.name.toLocaleLowerCase() == "first name" || d.name.toLocaleLowerCase() == "surname";
  })["value"];
  if (typeof name === "string") {
    return name;
  }
  return `Member`;
};

export const FetchMembershipNo = (member: MemberType): string => {
  const name: any = member.member_info.find(d => {
    return d.name == "MEMBERSHIP_NO";
  })["value"];

  if (typeof name === "string") {
    return name;
  }

  return `Member (${member.id})`;
};
