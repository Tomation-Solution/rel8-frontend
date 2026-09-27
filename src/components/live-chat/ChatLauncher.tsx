import { useState } from "react";
import { ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ChatPanel from "./ChatPanel";

const ChatLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <button
        type="button"
        onClick={() => setIsOpen(current => !current)}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-org-primary text-white shadow-lg transition-transform hover:scale-105 hover:bg-org-primary-hover sm:right-6"
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <ChatBubbleLeftRightIcon className="h-6 w-6" />}
      </button>
    </>
  );
};

export default ChatLauncher;
