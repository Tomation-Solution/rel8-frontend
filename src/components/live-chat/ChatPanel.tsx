import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { AI_AGENT_NAME, SupportChatMessage } from "../../api/support-chat/support-chat-api";
import { useLiveChat } from "./use-live-chat";
import Toast from "../toast/Toast";

const bubbleClass = (message: SupportChatMessage) => {
  if (message.senderType === "member") return "self-end bg-org-primary text-white rounded-2xl rounded-br-md";
  if (message.senderType === "ai") return "self-start bg-status-neutral-bg text-ink rounded-2xl rounded-bl-md";
  return "self-start bg-status-success-bg text-ink rounded-2xl rounded-bl-md";
};

const senderLabel = (message: SupportChatMessage) => {
  if (message.senderType === "ai") return AI_AGENT_NAME;
  if (message.senderType === "admin") return "Support";
  return null;
};

const ThinkingBubble = ({ label }: { label: string }) => (
  <div className="self-start">
    <p className="mb-1 ml-1 text-xs text-muted">{label}</p>
    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-status-neutral-bg px-4 py-3.5">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
    </div>
  </div>
);

const ChatPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { messages, agentTyping, awaitingAi, resolved, isLoading, sendMessage, notifyTyping } = useLiveChat(isOpen);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { notifyUser } = Toast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, agentTyping, awaitingAi]);

  if (!isOpen) return null;

  const handleChange = (value: string) => {
    setDraft(value);
    notifyTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => notifyTyping(false), 1500);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    if (typingTimer.current) clearTimeout(typingTimer.current);
    notifyTyping(false);
    sendMessage(text).catch(() => notifyUser("Message failed to send — try again.", "error"));
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-2xl sm:right-6">
      <div className="flex items-center justify-between bg-org-primary px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Support Chat</p>
          <p className="text-xs text-white/70">{AI_AGENT_NAME} answers instantly; an admin steps in when needed</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white" aria-label="Close chat">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-3">
        {isLoading && messages.length === 0 && <p className="py-8 text-center text-sm text-muted">Loading your conversation...</p>}

        {!isLoading && messages.length === 0 && <p className="py-8 text-center text-sm text-muted">Ask anything about dues, events, elections or your account — {AI_AGENT_NAME} is listening.</p>}

        {messages.map(message => {
          const label = senderLabel(message);
          return (
            <div key={message.id} className={`max-w-[85%] ${message.senderType === "member" ? "self-end" : "self-start"}`}>
              {label && <p className="mb-1 ml-1 text-xs text-muted">{label}</p>}
              <div className={`px-3.5 py-2.5 text-sm whitespace-pre-wrap ${bubbleClass(message)}`}>{message.content}</div>
            </div>
          );
        })}

        {(awaitingAi || agentTyping) && <ThinkingBubble label={agentTyping ? "Support" : AI_AGENT_NAME} />}

        {resolved && <p className="py-2 text-center text-xs text-muted">This conversation was resolved — send a message to start a new one.</p>}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-hairline px-4 pt-2">
        <Link to="/dashboard/support" className="text-xs text-org-primary hover:underline" onClick={onClose}>
          Prefer email? Raise a ticket instead
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
        <textarea
          value={draft}
          onChange={event => handleChange(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
          placeholder="Type your message..."
          maxLength={2000}
          rows={1}
          className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-hairline bg-app px-3.5 py-2.5 text-sm text-ink outline-none focus:border-org-primary"
        />
        <Button htmlType="submit" size="md" disabled={!draft.trim()} icon={PaperAirplaneIcon} aria-label="Send message" className="!px-3" />
      </form>
    </div>
  );
};

export default ChatPanel;
