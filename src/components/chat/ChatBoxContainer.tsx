import { AiOutlineInfoCircle, AiOutlineSend } from "react-icons/ai";
import { BsEmojiSmile, BsTelephone } from "react-icons/bs";
import ChatItem from "./ChatItem";
import { ChatMessageDataType } from "../../types/myTypes";
import { useAppContext } from "../../context/authContext";
import CircleLoader from "../loaders/CircleLoader";
import { useState, useEffect, useRef } from "react";
import { TENANT, sitename } from "../../utils/constants";
import moment from "moment";
import { sendGroupMessage, sendPrivateMessage } from "../../api/chats/chats"; // You'll need to create these API functions

interface Props {
  currentChatType: chatRoomType;
  data: ChatMessageDataType[];
  isLoading: boolean;
  currentTab?: "group-chat" | "single-chat";
}

export type ChatBoxFormFields = {
  message: string;
};

export type chatRoomType = {
  type: "general" | "commitee" | "exco" | "single-chat";
  display: string;
  value: number;
};

const ChatBoxContainer = ({ currentChatType, data, isLoading }: Props) => {
  const { user } = useAppContext();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessageDataType[]>(data || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log(currentChatType, "Cuurent chat type");

  // Update messages when data prop changes
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;

    setSending(true);

    try {
      const messageData = {
        message: text,
        senderId: user._id,
        name: user.name,
        timestamp: Date.now(),
      };

      if (currentChatType.type === "general") {
        // Send group message
        const response = await sendGroupMessage({
          content: text,
        });

        console.log(response, "Group chat message");

        // Add the new message to local state
        setMessages((prev) => [
          ...prev,
          {
            _id: response._id || Date.now().toString(),
            content: text,
            name: user.name,
            timestamp: Date.now(),
            senderId: user._id,
          },
        ]);
      } else if (currentChatType.type === "single-chat") {
        // Send private message
        const receiverId = currentChatType.value;
        const response = await sendPrivateMessage({
          content: text,
          recipientId: receiverId,
        });

        console.log(currentChatType, "Current Chat Type");

        // Add the new message to local state
        setMessages((prev) => [
          ...prev,
          {
            _id: response._id || Date.now().toString(),
            content: text,
            name: user.name,
            timestamp: Date.now(),
            senderId: user._id,
          },
        ]);
      }

      setText("");
    } catch (error) {
      console.log("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <section className="border-2 border-neutral3">
      <div className="border-b-2 border-[#ececec] flex items-center w-full justify-between p-3">
        <h3 className="font-semibold text-[17px]">
          {currentChatType.display} Chat
        </h3>
        <div className="flex items-center justify-between gap-3 text-white">
          <span className="bg-primary-blue p-2 rounded-md">
            <BsTelephone className="w-5 h-5" />
          </span>
          <span className="bg-primary-blue p-2 rounded-md">
            <AiOutlineInfoCircle className="w-5 h-5" />
          </span>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[80vh]">
        {(isLoading || sending) && <CircleLoader />}
        {messages.map((chat: ChatMessageDataType, index: number) => (
          <ChatItem
            by={chat.name}
            key={index}
            time={moment(chat.timestamp).format("h:mm A")}
            sender={user?._id === chat.senderId}
            message={chat.content}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-2 gap-2">
        <BsEmojiSmile className="w-5 h-5" />
        <div className="flex-1 flex items-center">
          <div className="flex-1">
            <input
              type="text"
              className="form-control w-full"
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            className="py-2 px-3 grid place-items-center bg-neutral3 rounded-md"
            onClick={sendMessage}
            disabled={!text.trim() || sending}
          >
            <AiOutlineSend className="w-5 h-5 text-textColor" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatBoxContainer;
