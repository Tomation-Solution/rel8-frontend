interface Props {
  /** True when the signed-in member sent it — own messages sit right, in brand colour. */
  sender?: boolean;
  message: string;
  time?: string;
  by: string;
}

/**
 * One chat message. Own messages are brand-filled and right-aligned; everyone else's are
 * white on the lavender canvas, as `Chat.png` draws them.
 *
 * Was `components/chat/ChatItem.tsx`. It moved here when the standalone Chat page was
 * removed (M13) — chat is a property of an Environment, so its pieces live with it.
 */
const MessageBubble = ({ by, sender, message, time }: Props) => (
  <div className={`flex flex-col w-fit max-w-[85%] sm:max-w-[55%] m-2 animate-fade-in ${sender ? "ml-auto items-end" : "mr-auto items-start"}`}>
    {!sender && <small className="text-xs text-org-primary font-medium mb-1">{by || "Anonymous"}</small>}
    <p className={`text-sm rounded-lg px-3 py-2 whitespace-pre-line break-anywhere animate-slide-up ${sender ? "bg-org-primary text-white" : "bg-white text-ink border border-hairline"}`}>{message}</p>
    <small className="text-[11px] text-muted mt-1">{time}</small>
  </div>
);

export default MessageBubble;
