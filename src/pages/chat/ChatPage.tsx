import { useState } from "react";
import {
  fetchOldGeneralChats,
  getAllChatsUsers,
  fetchPrivateChats,
} from "../../api/chats/chats";
import Button from "../../components/button/Button";
import ChatUser from "../../components/chat/ChatUser";
import ChatBoxContainer, {
  chatRoomType,
} from "../../components/chat/ChatBoxContainer";
import { useQuery } from "react-query";
import CircleLoader from "../../components/loaders/CircleLoader";
import dummyImage from "../../assets/images/dummy.jpg";
import { useAppContext } from "../../context/authContext";

const ChatPage = () => {
  const [currentChatType, setCurrentChatType] = useState<chatRoomType>({
    type: "general",
    display: "General",
    value: -1,
  });
  const [currentChatTab, setCurrentChatTab] = useState<
    "group-chat" | "single-chat"
  >("group-chat");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAppContext();

  const allChatUsers = useQuery("chatUsers", getAllChatsUsers);

  // Fetch messages based on chat type
  const { data, isLoading } = useQuery(
    ["chatMessages", currentChatType.type, currentChatType.value],
    () => {
      if (currentChatType.type === "general") {
        return fetchOldGeneralChats(); // Fetch group messages
      } else if (currentChatType.type === "single-chat") {
        return fetchPrivateChats(); // Fetch private messages with this user
      }
      return Promise.resolve([]);
    }
  );

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allChatUsers?.data?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(allChatUsers?.data?.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  console.log(allChatUsers, "Chat Data");

  return (
    <main className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-4">
        <div className="flex flex-col space-y-2 ">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setCurrentChatTab("group-chat")}
              text="Group Chat"
              type={currentChatTab === "group-chat" ? "primary" : "secondary"}
              textColor={
                currentChatTab === "group-chat" ? "text-white" : "text-Color"
              }
            />
            <Button
              onClick={() => setCurrentChatTab("single-chat")}
              text="Primary Chat"
              type={currentChatTab === "single-chat" ? "primary" : "secondary"}
              textColor={
                currentChatTab === "single-chat" ? "text-white" : "text-Color"
              }
            />
          </div>

          {/* Private Chat Users List */}
          <div
            className={`space-y-2 w-full ${
              currentChatTab === "group-chat" ? "hidden" : ""
            }`}
          >
            {allChatUsers.isLoading && <CircleLoader />}
            {currentItems
              ?.filter((chatUser: any) => chatUser?._id !== user?._id)
              ?.map((chatUser: any, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentChatType({
                      type: "single-chat",
                      display: chatUser?.name,
                      value: chatUser._id,
                    });
                  }}
                  className="relative hover:cursor-pointer p-2 flex items-center rounded-md"
                >
                  <img
                    src={dummyImage}
                    className="rounded-md w-fit h-10"
                    alt=""
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-capitalize ml-2">
                      {chatUser?.name}
                    </h4>
                  </div>
                </div>
              ))}

            {pageNumbers.length > 0 && (
              <ul className="flex space-x-2 items-center justify-center my-2 flex-wrap ">
                {pageNumbers?.map((number, index) => (
                  <li key={index} className="my-1">
                    <button
                      className={`${
                        currentPage === number
                          ? "bg-primary-blue text-white"
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

          {/* Group Chat List */}
          <div
            className={`space-y-2 w-full ${
              currentChatTab === "single-chat" ? "hidden" : ""
            }`}
          >
            <div
              onClick={() => {
                setCurrentChatType({
                  type: "general",
                  display: "General",
                  value: -1,
                });
              }}
            >
              <ChatUser
                chatUser={{
                  email: "Group Chat",
                  id: 1,
                }}
                online
                selected={false}
                lastMessage={user?.name}
              />
            </div>
          </div>
        </div>

        {/* Chat Box */}
        <div>
          <ChatBoxContainer
            isLoading={isLoading}
            data={data || []}
            currentChatType={currentChatType}
            currentTab={currentChatTab}
          />
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
