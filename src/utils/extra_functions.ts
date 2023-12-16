import React from "react";
import jwt_decode from "jwt-decode";
import {
  useLocation
} from "react-router-dom";
import { MemberType } from "../api/members/api-members";

type UserRegistrationParticluarsDataType = {
    MEMBERSHIP_NO:string;
    TITLE:string;
    name:string;
    MEMBERSHIP_GRADE:string;
    POSITION_HELD:string|null
}


export const setRel8UserRegistrationData = (data:UserRegistrationParticluarsDataType )=>{
    localStorage.setItem('userRel8RegistrationData',JSON.stringify(data))
  return true
}

export const getRel8UserRegistrationData = () => {
  const data = localStorage.getItem('userRel8RegistrationData');
  if (data) {
    const userData = JSON.parse(data);
    return userData
  } else {
    return null
  }
};

export const getRel8LoginUserToken = () =>{
  try{
      const data = localStorage.getItem('rel8User')
      if (data){
        const token = JSON.parse(data)?.token
        return token
      }
  }catch(err:any){
      return null
  
}
}

export const getRel8LoginUserData = () =>{
  try{
      const data = localStorage.getItem('rel8User')
      if (data){
        const logged_in_user = jwt_decode(JSON.parse(data)?.access )
        return logged_in_user
      }
  }catch(err:any){
      return null
  
}

}
export const setRel8LoginUserData = (data:{item:string, value:any}) =>{
  try {
    localStorage.setItem('rel8User',JSON.stringify(data))
    return getRel8LoginUserData()
} catch (error) {
    console.log(error);
}
}




export const  getSubdomain =()=> {
  const hostname = window.location.hostname;

  // Split the hostname by dots
  const parts = hostname.split('.');

  // Check if there is a subdomain
  if (parts.length >= 3) {
    // The subdomain is the first part of the hostname
    const subdomain = parts[0];
    return subdomain;
  } else {
    // No subdomain found
    return null;
  }
}



export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}









export type UserType = {
  "token": string,
  "user_type": "members"|'admin'|'super_admin',
  "chapter": {
      "name": string,
      "id": number
  }[],
  "council": {
          "name": string,
          "id": number,
          "chapter": any
      }[],
  "commitee": 
      {
          "name": string,
          "id": number
      }[]
  ,
  "user_id": number,
  "member_id": string,
  "profile_image":string | null
}



type getUserOrNullResponse = null | UserType
export const getUserOrNull = ():getUserOrNullResponse=>{
  try{
    const user:any  = localStorage.getItem('rel8User')
    return JSON.parse(user)

  }catch(err:any){
    return null
  }
  

}




// export const toCurrency = (amount: number | string) => {
//   return '₦'+ numbro(amount).format('₦0,0');
// }


// export const getChatRoomName = ()=>{
//   const logged_in_user =  getUserOrNull()
//   if(logged_in_user){
//     const room_name = logged_in_user?.user_id>reciver_id?`${logged_in_user?.user_id}and${reciver_id}`:`${reciver_id}and${logged_in_user?.user_id}`
//   }
// }




export const FetchName = (member:MemberType):string=>{
  // @ts-ignore
  const name:any = member.member_info.find(d=>{
    return d.name.toLocaleLowerCase() == 'name' ||  d.name.toLocaleLowerCase() == 'first' ||d.name.toLocaleLowerCase() == 'first name' || d.name.toLocaleLowerCase() == 'surname'
})['value']
if(typeof name==='string'){
  return name
}
 return `Member (${member.id})`
}

export const FetchNameByMemberInfo = (member_info:MemberType['member_info']):string=>{
  // @ts-ignore
  const name:any = member_info.find(d=>{
    return d.name.toLocaleLowerCase() == 'name' ||  d.name.toLocaleLowerCase() == 'first' ||d.name.toLocaleLowerCase() == 'first name' || d.name.toLocaleLowerCase() == 'surname'
})['value']
if(typeof name==='string'){
  return name
}
 return `Member`
}

export const FetchMembershipNo = (member:MemberType):string=>{
  // @ts-ignore
  const name:any = member.member_info.find(d=>{
    return d.name == 'MEMBERSHIP_NO' 
})['value']

if(typeof name==='string'){
  return name
}

 return `Member (${member.id})`
}

