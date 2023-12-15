import apiTenant from '../baseApi';



export const getChats = async (roomName:string)=>{
    
        const response = await apiTenant.get("/chat/?room_name=" + roomName);
        return response.data
    
}
export const getAllChatsUsers = async ()=>{
   
    
        const response = await apiTenant.get("user/memberlist-info/get_all_members/");
        return response.data
    }


export const fetchOldGeneralChats = async () =>{
    const response = await apiTenant.get(`/chat/?room_name=general`);
    return response.data
}




// export const FetchName = (member:MemberType):string=>{
//     const name:any = member.member_info.find(d=>{
//       return d.name.toLocaleLowerCase() == 'name' ||  d.name.toLocaleLowerCase() == 'first' ||d.name.toLocaleLowerCase() == 'first name' || d.name.toLocaleLowerCase() == 'surname'
//   })['value']
//   if(typeof name==='string'){
//     return name
//   }
//    return `Member (${member.id})`
//   }
  
//   export const FetchNameByMemberInfo = (member_info:MemberType['member_info']):string=>{
//     const name:any = member_info.find(d=>{
//       return d.name.toLocaleLowerCase() == 'name' ||  d.name.toLocaleLowerCase() == 'first' ||d.name.toLocaleLowerCase() == 'first name' || d.name.toLocaleLowerCase() == 'surname'
//   })['value']
//   if(typeof name==='string'){
//     return name
//   }
//    return `Member`
//   }
  
//   export const FetchMembershipNo = (member:MemberType):string=>{
//     const name:any = member.member_info.find(d=>{
//       return d.name == 'MEMBERSHIP_NO' 
//   })['value']
  
//   if(typeof name==='string'){
//     return name
//   }
  
//    return `Member (${member.id})`
//   }