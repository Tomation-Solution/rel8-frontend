import apiTenant from '../baseApi';
import { fetchAllMembers } from '../members/api-members';

export const getGroupMessages = async () => {
    const response = await apiTenant.get('/api/chat/group');
    // Transform data to match frontend expectations
    const transformedData = response.data.map((msg: any) => ({
        user__id: msg.senderId._id,
        message: msg.content,
        full_name: msg.senderId.name,
        time: new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    }));
    return transformedData;
}

export const getPrivateMessages = async () => {
    const response = await apiTenant.get('/api/chat/private');
    return response.data;
}

export const sendGroupMessage = async (content: string) => {
    const response = await apiTenant.post('/api/chat/group', { content });
    return response.data;
}

export const sendPrivateMessage = async (content: string, recipientId: string) => {
    const response = await apiTenant.post('/api/chat/private', { content, recipientId });
    return response.data;
}

export const getChatOverview = async () => {
    const response = await apiTenant.get('/api/chat/overview');
    return response.data;
}

// Legacy functions for backward compatibility
export const getChats = async (roomName: string) => {
    // For now, return group messages
    return getGroupMessages();
}

export const getAllChatsUsers = async () => {
    return fetchAllMembers();
}

export const fetchOldGeneralChats = async () => {
    return getGroupMessages();
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