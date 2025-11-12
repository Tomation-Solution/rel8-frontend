import { useState, useEffect, useRef } from 'react';
import { AiOutlineInfoCircle, AiOutlineSend } from 'react-icons/ai';
import { BsEmojiSmile, BsPeople } from 'react-icons/bs';
import { useMutation, useQueryClient } from 'react-query';
import EmojiPicker from 'emoji-picker-react';
import ChatItem from './ChatItem';
import { ChatMessageDataType } from '../../types/myTypes';
import { useAppContext } from '../../context/authContext';
import CircleLoader from '../loaders/CircleLoader';
import { ChatMessagesSkeleton, ChatHeaderSkeleton } from '../loaders/ChatSkeletons';
import { TENANT, sitename } from '../../utils/constants';
import { getUserOrNull } from '../../utils/extra_functions';
import { sendGroupMessage, sendPrivateMessage } from '../../api/chats/chats';

interface Props {
  currentChatType: chatRoomType | null;
  data: ChatMessageDataType[];
  isLoading: boolean;
  currentTab?: 'group-chat' | 'single-chat';
}

export type ChatBoxFormFields = {
  message: string;
};

export type chatRoomType = {
  type: 'general' | 'commitee' | 'exco' | 'single-chat' | 'group';
  display: string;
  value: any;
};

const ChatBoxContainer = ({ currentChatType, data, isLoading }: Props) => {
  const { user } = useAppContext();
  const queryClient = useQueryClient();
  
  const [text, setText] = useState('');
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [newChats, setNewChats] = useState<ChatMessageDataType[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);

  const webSocketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useMutation(
    (data: { content: string; groupId?: string }) => sendGroupMessage(data.content, data.groupId),
    {
      onSuccess: () => {
        setText('');
        if (currentChatType.type === 'general') {
          queryClient.invalidateQueries('fetchOldGeneralChats');
        } else if (currentChatType.type === 'group') {
          queryClient.invalidateQueries(`fetchGroupChats-${currentChatType.value}`);
        }
      },
    }
  );

  const sendPrivateMessageMutation = useMutation(
    (data: { content: string; recipientId: string }) => sendPrivateMessage(data.content, data.recipientId),
    {
      onSuccess: () => {
        setText('');
        queryClient.invalidateQueries('fetchOtherChats');
      },
    }
  );

  // Build WebSocket URL based on chat type
  const buildWebSocketUrl = (chatType: chatRoomType): string | null => {
    const baseUrl = `wss://${sitename}/ws`;

    switch (chatType.type) {
      case 'general':
        return `${baseUrl}/chat/${TENANT}/general/`;

      case 'group':
        return `${baseUrl}/chat/${TENANT}/group/${chatType.value}/`;

      case 'commitee':
        return `${baseUrl}/commitee_chat/${TENANT}/${chatType.value}/`;

      case 'exco':
        return null;

      case 'single-chat': {
        const loggedInUser = getUserOrNull();
        const receiverId: any = chatType.value;

        if (loggedInUser) {
          const roomName = loggedInUser.id > receiverId
            ? `${loggedInUser.id}and${receiverId}`
            : `${receiverId}and${loggedInUser.id}`;
          return `${baseUrl}/chat/${TENANT}/${roomName}/`;
        }
        return null;
      }

      default:
        return null;
    }
  };

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (event: MessageEvent) => {
    const response = JSON.parse(event.data);
    
    const newMessage: ChatMessageDataType = {
      user__id: response.send_user_id,
      message: response.message,
      full_name: response.full_name,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
    
    setNewChats((prev) => [...prev, newMessage]);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Setup WebSocket connection
  useEffect(() => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }

    setNewChats([]);

    if (!currentChatType) return;

    const url = buildWebSocketUrl(currentChatType);

    if (!url) return;

    setConnecting(true);
    const ws = new WebSocket(url);
    
    ws.onopen = (event) => {
      console.log('WebSocket connected', event);
      setConnecting(false);
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket closed', event);
      setConnecting(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error', error);
      setConnecting(false);
    };
    
    ws.onmessage = handleWebSocketMessage;
    
    webSocketRef.current = ws;
    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, [currentChatType]);

  const allChats = data ? [...data, ...newChats] : newChats;
  const isLoadingOrConnecting = isLoading || connecting;


  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allChats]);

  const sendMessage = () => {
    const trimmedText = text.trim();

    if (!trimmedText) return;

    if (currentChatType.type === 'general') {
      sendMessageMutation.mutate({ content: trimmedText });
    } else if (currentChatType.type === 'group') {
      sendMessageMutation.mutate({
        content: trimmedText,
        groupId: typeof currentChatType.value === 'string' ? currentChatType.value : undefined
      });
    } else if (currentChatType.type === 'single-chat') {
      // Send private message via API
      const recipient = currentChatType.value;
      if (recipient && typeof recipient === 'object' && recipient?._id) {
        sendPrivateMessageMutation.mutate({
          content: trimmedText,
          recipientId: recipient?._id,
        });
      }
    } else if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify({
        message: trimmedText,
        type: 'chat_message',
      }));
      setText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };


  if (!currentChatType) {
    return (
      <section className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
        <ChatHeaderSkeleton />
        <div className="flex items-center justify-center flex-1 text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <BsPeople className="w-8 h-8" />
            </div>
            <p className="text-sm">Select a group to start chatting</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-org-primary to-org-primary/90 text-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold">
              {currentChatType.display.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-base">
              {currentChatType.display} Chat
            </h3>
            <p className="text-xs text-white/80">
              {connecting ? 'Connecting...' : 'Active now'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowChatInfo(true)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          title="Chat info"
        >
          <AiOutlineInfoCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 min-h-[400px] max-h-[calc(100vh-300px)]">
        {isLoadingOrConnecting ? (
          <ChatMessagesSkeleton />
        ) : allChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              {currentChatType.type === 'group' ? (
                <BsPeople className="w-8 h-8" />
              ) : (
                <AiOutlineSend className="w-8 h-8" />
              )}
            </div>
            <p className="text-sm">
              {currentChatType.type === 'group'
                ? 'No messages in this group yet'
                : 'No messages yet'
              }
            </p>
            <p className="text-xs mt-1">
              {currentChatType.type === 'group'
                ? 'Group conversations will appear here'
                : 'Start the conversation!'
              }
            </p>
          </div>
        ) : (
          <>
            {allChats.map((chat: ChatMessageDataType, index: number) => (
              <ChatItem
                key={`${chat.user__id}-${index}`}
                by={chat.full_name}
                time={chat.time || '6:00pm'}
                sender={user?.id === chat.user__id || user?._id === chat.user__id}
                message={chat?.message}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-end gap-2 relative">
          {/* Emoji Picker Button */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-org-primary"
              title="Add emoji"
            >
              <BsEmojiSmile className="w-5 h-5" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50 shadow-xl">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
              placeholder="Type a message..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isLoading}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!text.trim() || sendMessageMutation.isLoading}
            className="p-3 rounded-full bg-org-primary text-white hover:bg-org-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-org-primary shadow-md hover:shadow-lg"
            title="Send message"
          >
            <AiOutlineSend className="w-5 h-5" />
          </button>
        </div>

        {/* Character count or typing indicator can go here */}
        {text.length > 0 && (
          <div className="text-xs text-gray-400 mt-1 px-2">
            {text.length} characters
          </div>
        )}
      </div>

      {/* Chat Info Modal */}
      {showChatInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat Information</h3>
              <button
                onClick={() => setShowChatInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">Chat Type</h4>
                <p className="text-gray-600">{currentChatType.display}</p>
              </div>

              {currentChatType.type === 'single-chat' && currentChatType.value && typeof currentChatType.value === 'object' && (
                <div>
                  <h4 className="font-medium text-gray-900">Participant</h4>
                  <p className="text-gray-600">{currentChatType.value?.name || 'Unknown'}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900">Messages</h4>
                <p className="text-gray-600">{allChats.length} messages</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Status</h4>
                <p className="text-gray-600">
                  {connecting ? 'Connecting...' : 'Active'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowChatInfo(false)}
                className="px-4 py-2 bg-org-primary text-white rounded-md hover:bg-org-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatBoxContainer;