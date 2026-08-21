/**
 * Chat API.
 *
 * ⚠️ **Naming**: what these paths call a "group" is an **Environment** (REDESIGN.md §0c).
 * The backend renamed the model (`Environment`), the message model (`EnvironmentMessage`)
 * and the whole Socket.IO protocol, but left the REST paths under `/api/chat/group*`.
 * So the URLs below are correct as written and must not be "fixed"; the function names
 * follow the concept, not the path.
 *
 * The live socket protocol is `joinEnvironment` / `leaveEnvironment` /
 * `environmentMessage` / `typing` / `stopTyping`, all keyed on `{ environmentId }` — see
 * `EnvironmentConversationPanel.tsx`.
 */
import apiTenant from "../baseApi";
import { fetchAllMembers } from "../members/api-members";

export const getEnvironmentMessages = async () => {
  const response = await apiTenant.get("/api/chat/group");
  // Transform data to match frontend expectations
  const transformedData = response.data.map((msg: any) => ({
    user__id: msg.senderId?._id || msg.senderId || null,
    message: msg.content,
    full_name: msg.senderId?.name || "System",
    time: new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  }));

  console.log(transformedData, "transformed data");
  return transformedData;
};

export const getPrivateMessages = async () => {
  const response = await apiTenant.get("/api/chat/private");
  // Transform data to match frontend expectations
  const transformedData = response.data.map((msg: any) => ({
    user__id: msg.senderId._id,
    message: msg.content,
    full_name: msg.senderId.name,
    time: new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  }));
  return transformedData;
};

export const sendEnvironmentMessage = async (content: string, environmentId?: string) => {
  // The REST body key is still `groupId` — that is what `sendGroupMessage` reads.
  const payload = environmentId ? { content, groupId: environmentId } : { content };
  const response = await apiTenant.post("/api/chat/group", payload);
  return response.data;
};

export const sendPrivateMessage = async (content: string, recipientId: string) => {
  const response = await apiTenant.post("/api/chat/private", { content, recipientId });
  return response.data;
};

export const getChatOverview = async () => {
  const response = await apiTenant.get("/api/chat/overview");
  return response.data;
};

export const getEnvironmentChats = async () => {
  const response = await apiTenant.get("/api/chat/groups");
  return response.data;
};

/**
 * Message history for one environment.
 *
 * The **URL still says `group`** — the backend renamed the model and the socket protocol
 * but not these REST paths (`chat.routes.js` still mounts `/group/:groupId`, with
 * `chat.controller.js` aliasing `const Group = require("../models/Environment")`). The id
 * in the path is an Environment id. Do not "fix" the path.
 *
 * ⚠️ This endpoint is currently expected to return `[]` regardless of content — see
 * REDESIGN.md §0d, backend bug BE-A. The socket path works; only this history fetch is
 * affected.
 */
export const getEnvironmentMessagesById = async (environmentId: string) => {
  const response = await apiTenant.get(`/api/chat/group/${environmentId}`);
  // Transform data to match frontend expectations
  const transformedData = response.data.map((msg: any) => ({
    user__id: msg.senderId?._id || msg.senderId || null,
    message: msg.content,
    full_name: msg.senderId?.name || "System",
    // `timestamps: true` on EnvironmentMessage gives createdAt/updatedAt, not `timestamp`.
    time: new Date(msg.createdAt ?? msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  }));

  return transformedData;
};

export const getPrivateMessagesWith = async (memberId: string) => {
  const response = await apiTenant.get("/api/chat/private");
  return (response.data as any[])
    .filter(msg => {
      const senderId = msg.senderId?._id ?? msg.senderId;
      const recipientId = msg.recipientId?._id ?? msg.recipientId;
      return String(senderId) === String(memberId) || String(recipientId) === String(memberId);
    })
    .map(msg => ({
      user__id: msg.senderId?._id ?? msg.senderId ?? null,
      message: msg.content,
      full_name: msg.senderId?.name ?? "Unknown",
      time: new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    }));
};

export const toggleEnvironmentChat = async (environmentId: string, isActive: boolean) => {
  const response = await apiTenant.patch(`/api/chat/groups/${environmentId}/toggle`, { isActive });
  return response.data;
};

export const clearEnvironmentChat = async (environmentId: string) => {
  const response = await apiTenant.delete(`/api/chat/groups/${environmentId}`);
  return response.data;
};

// Legacy functions for backward compatibility
export const getChats = async (roomName: string) => {
  // For private chats, return private messages
  return getPrivateMessages();
};

export const getAllChatsUsers = async () => {
  return fetchAllMembers();
};

export const fetchOldGeneralChats = async () => {
  return getEnvironmentMessages();
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
