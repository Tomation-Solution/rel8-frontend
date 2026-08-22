import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { io, Socket } from "socket.io-client";
import { AiOutlineSend } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { getEnvironmentMessagesById, getPrivateMessagesWith } from "../../../api/chats/chats";
import { useAppContext } from "../../../context/authContext";
import { ENDPOINT_URL } from "../../../utils/constants";
import MessageBubble from "./MessageBubble";
import { ChatMessagesSkeleton } from "../../../components/loaders/ChatSkeletons";
import { EnvironmentMember } from "../../../api/environments/environments-api";
import { getSessionToken } from "../../../utils/session";
import { FiChevronLeft } from "react-icons/fi";

interface Message {
  user__id: string | null;
  message: string;
  full_name: string;
  time: string;
}

interface TypingUser {
  userId: string;
  name: string;
}

// ── Shared query options — load once; live updates come via Socket.IO ────────
// refetchOnWindowFocus:false + staleTime:Infinity prevents React Query from
// re-fetching history when the user Alt+Tabs back, which would duplicate
// messages that are already sitting in liveMessages (server-echoed via socket).
const HISTORY_QUERY_OPTS = { staleTime: Infinity, refetchOnWindowFocus: false } as const;

// ── Shared input bar ─────────────────────────────────────────────────────────

/** Phones show one pane at a time, so the conversation needs a way back to the room list. */
const BackToRooms = ({ onBack }: { onBack: () => void }) => (
  <button type="button" onClick={onBack} aria-label="Back to rooms" className="md:hidden -ml-1 p-1 rounded-full hover:bg-white/20 flex-shrink-0">
    <FiChevronLeft className="w-5 h-5" />
  </button>
);

interface InputBarProps {
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onBlur?: () => void;
}

const InputBar = ({ text, onChange, onKeyUp, onSend, onBlur }: InputBarProps) => (
  <div className="border-t border-gray-200 bg-white px-4 py-3 flex-shrink-0 [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
    <div className="flex items-center gap-2">
      <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
        <input type="text" className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400" placeholder="Type a message…" value={text} onChange={onChange} onKeyUp={onKeyUp} onBlur={onBlur} />
      </div>
      <button onClick={onSend} disabled={!text.trim()} className="p-3 min-w-[44px] min-h-[44px] grid place-items-center rounded-full bg-org-primary text-white hover:bg-org-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-shrink-0">
        <AiOutlineSend className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ── Shared messages area ─────────────────────────────────────────────────────

interface MessagesAreaProps {
  isLoading: boolean;
  messages: Message[];
  userId: string | undefined;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesArea = ({ isLoading, messages, userId, emptyIcon, emptyText, messagesEndRef }: MessagesAreaProps) => (
  <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3">
    {isLoading ? (
      <ChatMessagesSkeleton />
    ) : messages.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-3">{emptyIcon ?? <AiOutlineSend className="w-7 h-7" />}</div>
        <p className="text-sm">{emptyText ?? "No messages yet"}</p>
      </div>
    ) : (
      <>
        {messages.map((msg, i) => (
          <MessageBubble key={`${msg.user__id}-${i}`} by={msg.full_name} time={msg.time} sender={userId === msg.user__id || userId === String(msg.user__id)} message={msg.message} />
        ))}
        <div ref={messagesEndRef} />
      </>
    )}
  </div>
);

/*
 * Environment chat panel.
 *
 * The socket protocol was renamed server-side along with the model
 * (`rel8-backend-nordjs-2025/src/sockets/chat.socket.js`) and this client never followed,
 * so it was emitting events nothing listened for. The live names are:
 *
 *   emit  joinEnvironment      <environmentId>            server replies `joinedEnvironment`
 *   emit  leaveEnvironment     <environmentId>
 *   emit  environmentMessage   { environmentId, content }
 *   emit  typing / stopTyping  { environmentId }
 *   on    environmentMessage, typing, stopTyping, chatError
 *
 * The server also refuses the join unless the environment has `hasChat: true` AND the
 * caller is one of its `members` — it answers `chatError` rather than failing silently,
 * which is what the error strip below renders.
 */

/** Shown only on phones, where the room list and the conversation share one screen. */
interface BackProps {
  onBack?: () => void;
}

interface EnvironmentPanelProps extends BackProps {
  environmentId: string;
  environmentName: string;
}

export const EnvironmentPanel = ({ environmentId, environmentName, onBack }: EnvironmentPanelProps) => {
  const { user } = useAppContext();
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // staleTime:Infinity prevents a window-focus refetch from duplicating messages
  // that are already in liveMessages (server echo)
  const { data: history, isLoading } = useQuery(["environmentChatHistory", environmentId], () => getEnvironmentMessagesById(environmentId), HISTORY_QUERY_OPTS);

  // Socket setup
  useEffect(() => {
    const token: string | undefined = (() => {
      try {
        return getSessionToken();
      } catch {
        return undefined;
      }
    })();

    const socket = io(ENDPOINT_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinEnvironment", environmentId);
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("environmentMessage", (msg: any) => {
      setLiveMessages(prev => [
        ...prev,
        {
          user__id: msg.senderId?._id ?? msg.senderId ?? null,
          message: msg.content,
          full_name: msg.senderId?.name ?? "Unknown",
          time: new Date(msg.createdAt ?? msg.timestamp ?? Date.now()).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        },
      ]);
    });

    socket.on("typing", ({ userId, name }: TypingUser) => {
      setTypingUsers(prev => (prev.some(u => u.userId === userId) ? prev : [...prev, { userId, name }]));
    });
    socket.on("stopTyping", ({ userId }: { userId: string }) => {
      setTypingUsers(prev => prev.filter(u => u.userId !== userId));
    });
    socket.on("chatError", ({ message }: { message: string }) => setChatError(message));

    return () => {
      socket.emit("leaveEnvironment", environmentId);
      socket.disconnect();
    };
  }, [environmentId]);

  // Reset live state when switching environments
  useEffect(() => {
    setLiveMessages([]);
    setChatError(null);
    isTypingRef.current = false;
  }, [environmentId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, liveMessages]);

  const emitStopTyping = () => {
    if (isTypingRef.current && socketRef.current) {
      socketRef.current.emit("stopTyping", { environmentId });
      isTypingRef.current = false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (socketRef.current) {
      if (!isTypingRef.current) {
        socketRef.current.emit("typing", { environmentId });
        isTypingRef.current = true;
      }
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(emitStopTyping, 2000);
    }
  };

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current) return;
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    emitStopTyping();
    socketRef.current.emit("environmentMessage", { environmentId, content: trimmed });
    setText("");
  };

  // onKeyUp avoids spurious Enter fires caused by OS focus-restore events
  // (e.g. the browser queuing a keydown before alt+tab completes)
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) sendMessage();
  };

  const allMessages: Message[] = [...(history ?? []), ...liveMessages];
  const typingLabel = typingUsers.length === 0 ? null : typingUsers.length === 1 ? `${typingUsers[0].name} is typing…` : `${typingUsers.map(u => u.name).join(", ")} are typing…`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-org-primary to-org-primary/90 text-white flex-shrink-0">
        {onBack && <BackToRooms onBack={onBack} />}
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <BsPeople className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-sm">{environmentName} Chat</p>
          <p className="text-xs text-white/75">{connected ? "Connected" : "Connecting…"}</p>
        </div>
      </div>

      {chatError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-600 text-xs flex items-center justify-between flex-shrink-0">
          <span>{chatError}</span>
          <button onClick={() => setChatError(null)} className="ml-2 font-bold hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      <MessagesArea isLoading={isLoading} messages={allMessages} userId={user?._id ?? String(user?.id)} emptyIcon={<BsPeople className="w-7 h-7" />} emptyText="No messages yet — start the conversation!" messagesEndRef={messagesEndRef} />

      {typingLabel && <div className="px-4 py-1 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 italic flex-shrink-0">{typingLabel}</div>}

      <InputBar text={text} onChange={handleInputChange} onKeyUp={handleKeyUp} onSend={sendMessage} onBlur={emitStopTyping} />
    </div>
  );
};

// ── Private (1-on-1) panel (Socket.IO /private namespace) ───────────────────

interface PrivatePanelProps extends BackProps {
  member: EnvironmentMember;
}

export const PrivatePanel = ({ member, onBack }: PrivatePanelProps) => {
  const { user } = useAppContext();
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history once; filter to this thread client-side per API spec
  const { data: history, isLoading } = useQuery(["privateChat", member._id], () => getPrivateMessagesWith(member._id), HISTORY_QUERY_OPTS);

  // Socket.IO /private namespace
  const myId = String(user?._id ?? user?.id ?? "");

  useEffect(() => {
    setLiveMessages([]);
    setChatError(null);

    const token: string | undefined = (() => {
      try {
        return getSessionToken();
      } catch {
        return undefined;
      }
    })();

    // Connect to the /private namespace
    const socket = io(`${ENDPOINT_URL}/private`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("privateMessage", (msg: any) => {
      const senderId = String(msg.senderId?._id ?? msg.senderId ?? "");
      const recipientId = String(msg.recipientId?._id ?? msg.recipientId ?? "");
      const theirId = String(member._id);

      // Only append messages that belong to this specific thread
      const isThisThread = (senderId === theirId && recipientId === myId) || (senderId === myId && recipientId === theirId);

      if (!isThisThread) return;

      setLiveMessages(prev => [
        ...prev,
        {
          user__id: senderId,
          message: msg.content,
          full_name: msg.senderId?.name ?? "Unknown",
          time: new Date(msg.createdAt ?? msg.timestamp ?? Date.now()).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        },
      ]);
    });

    socket.on("chatError", ({ message }: { message: string }) => {
      setChatError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [member._id, myId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, liveMessages]);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current) return;
    socketRef.current.emit("privateMessage", { content: trimmed, recipientId: member._id });
    setText("");
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) sendMessage();
  };

  const allMessages: Message[] = [...(history ?? []), ...liveMessages];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-org-primary to-org-primary/90 text-white flex-shrink-0">
        {onBack && <BackToRooms onBack={onBack} />}
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">{member.name.charAt(0).toUpperCase()}</div>
        <p className="font-semibold text-sm">{member.name}</p>
      </div>

      {chatError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-600 text-xs flex items-center justify-between flex-shrink-0">
          <span>{chatError}</span>
          <button onClick={() => setChatError(null)} className="ml-2 font-bold hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      <MessagesArea isLoading={isLoading} messages={allMessages} userId={myId} emptyText="No messages yet — say hello!" messagesEndRef={messagesEndRef} />

      <InputBar text={text} onChange={e => setText(e.target.value)} onKeyUp={handleKeyUp} onSend={sendMessage} />
    </div>
  );
};
