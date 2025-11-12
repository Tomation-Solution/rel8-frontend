import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  fetchOldGeneralChats,
  getAllChatsUsers,
  getChats,
  getGroupChats,
  getGroupMessagesById,
} from "../../api/chats/chats";
import Button from "../../components/button/Button";
import ChatUser from "../../components/chat/ChatUser";
import GroupChatItem from "../../components/chat/GroupChatItem";
import GeneralChatItem from "../../components/chat/GeneralChatItem";
import ChatBoxContainer, {
  chatRoomType,
} from "../../components/chat/ChatBoxContainer";
import CircleLoader from "../../components/loaders/CircleLoader";
import { ChatListSkeleton } from "../../components/loaders/ChatSkeletons";
import dummyImage from "../../assets/images/dummy.jpg";
import { FetchName, getUserOrNull } from "../../utils/extra_functions";

type ChatTab = "group-chat" | "single-chat";

const ITEMS_PER_PAGE = 10;

const ChatPage = () => {
  const [currentChatType, setCurrentChatType] = useState<chatRoomType | null>(null);

  const [currentChatTab, setCurrentChatTab] = useState<ChatTab>("group-chat");
  
  const [currentPage, setCurrentPage] = useState(1);

  const loggedInUser = getUserOrNull();

  // Fetch all chat users
  const allChatUsers = useQuery("chatUsers", getAllChatsUsers);

  const groupChats = useQuery("groupChats", getGroupChats);

  // Set initial group when groups are loaded
  useEffect(() => {
    if (groupChats.data && groupChats.data.length > 0 && !currentChatType) {
      const firstGroup = groupChats.data[0];
      setCurrentChatType({
        type: "group",
        display: firstGroup.name,
        value: firstGroup._id,
      });
    }
  }, [groupChats.data, currentChatType]);

  // Dynamic query for chat messages
  const queryKey = currentChatType?.type === "group"
    ? `fetchGroupChats-${currentChatType.value}`
    : "fetchOtherChats";

  const { data, isLoading } = useQuery(queryKey, () => {
    if (currentChatType?.type === "group") {
      return getGroupMessagesById(currentChatType.value as string);
    }

    if (currentChatType?.type === "single-chat" && loggedInUser) {
      const receiverId = currentChatType.value;
      if (receiverId && typeof receiverId === 'object' && (receiverId as any)._id) {
        const userId = (receiverId as any)._id;
        const roomName = loggedInUser.id > userId
          ? `${loggedInUser.id}and${userId}`
          : `${userId}and${loggedInUser.id}`;
        return getChats(roomName);
      }
    }

    return Promise.resolve([]);
  }, {
    enabled: !!currentChatType,
  });

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = allChatUsers?.data?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((allChatUsers?.data?.length || 0) / ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Filter out logged-in user from chat list
  const filteredItems = currentItems?.filter(
    (user: any) => user._id !== loggedInUser?.id
  );

  const handleChatTabChange = (tab: ChatTab) => {
    setCurrentChatTab(tab);
  };

  const handleUserSelect = (chatUser: any) => {
    setCurrentChatType({
      type: "single-chat",
      display: chatUser.name,
      value: chatUser,
    });
  };

  const handleGeneralChatSelect = () => {
    setCurrentChatType({
      type: "general",
      display: "General",
      value: -1,
    });
  };

  return (
    <main className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-4">
        {/* Left Panel - Chat List */}
        <div className="flex flex-col space-y-2">
          {/* Tab Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleChatTabChange("group-chat")}
              text="Group Chat"
              type={currentChatTab === "group-chat" ? "primary" : "secondary"}
              textColor={currentChatTab === "group-chat" ? "text-white" : "text-Color"}
            />
            <Button
              onClick={() => handleChatTabChange("single-chat")}
              text="Primary Chat"
              type={currentChatTab === "single-chat" ? "primary" : "secondary"}
              textColor={currentChatTab === "single-chat" ? "text-white" : "text-Color"}
            />
          </div>

          {/* Single Chat List */}
          {currentChatTab === "single-chat" && (
            <div className="space-y-2 w-full">
              {allChatUsers.isLoading ? (
                <ChatListSkeleton />
              ) : (
                filteredItems?.map((chatUser: any, index: number) => (
                  <ChatUser
                    key={chatUser._id || index}
                    name={FetchName(chatUser)}
                    image={chatUser.image || dummyImage}
                    selected={currentChatType?.type === "single-chat" && currentChatType.value === chatUser}
                    online={true} // You can implement online status logic here
                    chatUser={chatUser}
                    onClick={() => handleUserSelect(chatUser)}
                  />
                ))
              )}

              {/* Pagination */}
              {pageNumbers.length > 0 && (
                <ul className="flex space-x-2 items-center justify-center my-2 flex-wrap">
                  {pageNumbers.map((number) => (
                    <li key={number} className="my-1">
                      <button
                        className={`${
                          currentPage === number
                            ? "bg-org-primary text-white"
                            : "bg-neutral-3"
                        } px-3 py-2 rounded-sm focus:outline-none`}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Group Chat List */}
          {currentChatTab === "group-chat" && (
            <div className="space-y-2 w-full">
              {groupChats.isLoading ? (
                <ChatListSkeleton />
              ) : (
                <>
                  {/* Group Chats */}
                  {groupChats.data?.map((group: any) => (
                    <GroupChatItem
                      key={group._id}
                      group={group}
                      selected={currentChatType?.type === "group" && currentChatType.value === group._id}
                      onClick={() => {
                        setCurrentChatType({
                          type: "group",
                          display: group.name,
                          value: group._id,
                        });
                      }}
                    />
                  ))}

                  {groupChats.data?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No groups available</p>
                      <p className="text-sm">Groups will be created by administrators</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Chat Box */}
        <div>
          <ChatBoxContainer
            isLoading={isLoading}
            data={data}
            currentChatType={currentChatType}
            currentTab={currentChatTab}
          />
        </div>
      </div>
    </main>
  );
};

export default ChatPage;