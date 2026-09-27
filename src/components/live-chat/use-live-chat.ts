import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { getSupportConversation, markSupportChatRead, sendSupportMessage, SupportChatMessage } from "../../api/support-chat/support-chat-api";
import { getSupportSocket } from "../../utils/supportSocket";

interface SocketMessage {
  messageId: string;
  conversationId: string;
  senderType: SupportChatMessage["senderType"];
  senderId: string | null;
  content: string;
  sentAt: string;
}

export const useLiveChat = (isOpen: boolean) => {
  const [liveMessages, setLiveMessages] = useState<SupportChatMessage[]>([]);
  const [unread, setUnread] = useState(0);
  const [agentTyping, setAgentTyping] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  const { data: conversation, isLoading, refetch } = useQuery("supportConversation", getSupportConversation, { enabled: isOpen, staleTime: 0 });

  // The AI reply rides the send request itself, so "the assistant is
  // thinking" is precisely: a send in flight on a conversation the AI handles.
  const awaitingAi = isSending && !conversation?.hasHumanAgent && conversation?.status !== "active";

  useEffect(() => {
    if (!conversation) return;
    conversationIdRef.current = conversation.id;
    seenIdsRef.current = new Set(conversation.messages.map(message => message.id));
    setLiveMessages(conversation.messages);
    setUnread(conversation.unread);
    setResolved(conversation.status === "resolved" || conversation.status === "closed");
  }, [conversation]);

  useEffect(() => {
    const socket = getSupportSocket();
    if (!socket) return;

    const onMessage = (payload: SocketMessage) => {
      if (payload.conversationId !== conversationIdRef.current) return;
      if (seenIdsRef.current.has(payload.messageId)) return;
      seenIdsRef.current.add(payload.messageId);

      const incoming: SupportChatMessage = {
        id: payload.messageId,
        senderType: payload.senderType,
        senderId: payload.senderId,
        content: payload.content,
        sentAt: payload.sentAt,
      };

      // Only this member writes member messages in their own conversation, so
      // such an echo IS the optimistic row — swap, don't append, or the
      // message shows twice until the send request resolves.
      setLiveMessages(current => {
        if (payload.senderType === "member") {
          const optimisticIndex = current.findIndex(message => message.id.startsWith("optimistic-") && message.content === payload.content);
          if (optimisticIndex !== -1) {
            const next = [...current];
            next[optimisticIndex] = incoming;
            return next;
          }
        }
        return [...current, incoming];
      });
      if (!isOpen && payload.senderType !== "member") setUnread(current => current + 1);
    };

    const onTyping = (payload: { userId: string; isTyping: boolean }) => setAgentTyping(payload.isTyping);
    const onResolved = () => setResolved(true);

    socket.on("support-message", onMessage);
    socket.on("support-typing", onTyping);
    socket.on("support-resolved", onResolved);

    return () => {
      socket.off("support-message", onMessage);
      socket.off("support-typing", onTyping);
      socket.off("support-resolved", onResolved);
    };
  }, [isOpen]);

  // Opening the panel clears the badge and tells the server.
  useEffect(() => {
    if (!isOpen || unread === 0 || !conversationIdRef.current) return;
    setUnread(0);
    markSupportChatRead(conversationIdRef.current).catch(() => undefined);
  }, [isOpen, unread]);

  const sendMessage = useCallback(
    async (text: string) => {
      const optimistic: SupportChatMessage = {
        id: `optimistic-${Date.now()}`,
        senderType: "member",
        senderId: "me",
        content: text,
        sentAt: new Date().toISOString(),
      };
      setLiveMessages(current => [...current, optimistic]);
      setIsSending(true);
      setResolved(false);

      try {
        await sendSupportMessage(text);
        // The socket echo swaps the optimistic row in place; the refetch
        // resets the list from the server and covers a lost echo.
        refetch();
      } catch (error) {
        setLiveMessages(current => current.filter(message => message.id !== optimistic.id));
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [refetch],
  );

  const notifyTyping = useCallback((isTyping: boolean) => {
    const conversationId = conversationIdRef.current;
    if (!conversationId) return;
    getSupportSocket()?.emit(isTyping ? "support-typing-start" : "support-typing-stop", { conversationId });
  }, []);

  return {
    conversation: conversation ?? null,
    messages: liveMessages,
    unread,
    agentTyping,
    awaitingAi,
    resolved,
    isLoading,
    isSending,
    sendMessage,
    notifyTyping,
  };
};
