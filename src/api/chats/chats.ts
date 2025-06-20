import apiTenant from "../baseApi";

export const getChats = async (roomName: string) => {
  const response = await apiTenant.get("/chat/?room_name=" + roomName);
  return response.data;
};
export const getAllChatsUsers = async () => {
  const response = await apiTenant.get("api/members/");
  return response.data;
};

export const fetchOldGeneralChats = async () => {
  const response = await apiTenant.get(`api/chat/group`);
  return response.data;
};

export const fetchPrivateChats = async () => {
  const response = await apiTenant.get(`api/chat/private/`);
  return response.data;
};

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

// Mock endpoints - replace with your actual endpoints

// Group Chat Functions

export const sendGroupMessage = async (data: { content: string }) => {
  try {
    const response = await apiTenant.post(`/api/chat/group`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending group message:", error);
    throw error;
  }
};

export const sendPrivateMessage = async (data: {
  content: string;
  recipientId: string | number;
}) => {
  console.log(data, "Data in private");

  try {
    const response = await apiTenant.post(`api/chat/private`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending private message:", error);
    throw error;
  }
};
