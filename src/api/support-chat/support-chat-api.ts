import apiTenant from "../baseApi";

export type SupportChatStatus = "waiting" | "active" | "resolved" | "closed";
export type SupportSenderType = "member" | "admin" | "ai";

// Mirrors AI_AGENT_NAME in the backend's supportKnowledge.js — keep in step.
export const AI_AGENT_NAME = "Rella";

export interface SupportChatMessage {
  id: string;
  senderType: SupportSenderType;
  senderId: string | null;
  content: string;
  sentAt: string;
}

export interface SupportChatConversation {
  id: string;
  status: SupportChatStatus;
  hasHumanAgent: boolean;
  unread: number;
  messages: SupportChatMessage[];
}

export const getSupportConversation = async (): Promise<SupportChatConversation> => {
  const response = await apiTenant.get("/api/support-chat/conversation");
  return response.data;
};

export const sendSupportMessage = async (message: string) => {
  const response = await apiTenant.post("/api/support-chat/message", { message });
  return response.data as { message: SupportChatMessage; aiReply: SupportChatMessage | null; escalated: boolean };
};

export const markSupportChatRead = async (conversationId: string) => {
  const response = await apiTenant.post(`/api/support-chat/${conversationId}/read`);
  return response.data;
};
