import { useState } from "react";
import { fetchOldGeneralChats, getAllChatsUsers } from "../../api/chats/chats";
import { ChatUserDataType } from "../../types/myTypes";
import Button from "../../components/button/Button";
import ChatUser from "../../components/chat/ChatUser";
import ChatBoxContainer from "../../components/chat/ChatBoxContainer";
import { useQuery } from "react-query";
import CircleLoader from "../../components/loaders/CircleLoader";
// import { WSS } from "../../utils/constants";
// import { useAppContext } from "../../context/authContext";
// import Toast from "../../components/toast/Toast";
// import Toast from "../../components/toast/Toast";

const ChatPage = () => {

  const [currentChatType, setCurrentChatType] = useState('general-chat');
  // const [open, setOpen] = useState(false);
  // const [web_socket, setWeb_socket] = useState<WebSocket | null>(null);
  // const [chatData,setChatData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  // const [connecting,setConnecting] = useState(false)


  // const { user } = useAppContext();
  // const { notifyUser } = Toast();


  const handleGeneralChat = () =>{
    setCurrentChatType('general-chat')
  }
  const handlePrimaryChat = () =>{
    setCurrentChatType('primary-chat')
  }


  const allChatUsers = useQuery("chatUsers", getAllChatsUsers);

  const queryKey = currentChatType === 'general-chat' ? 'fetchOldGeneralChats' : 'fetchOtherChats';

  const { data,  isLoading } = useQuery(queryKey, () => {
    if (currentChatType === 'general-chat') {
      return fetchOldGeneralChats();
    } else {
      return ;
    }
  });

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =  allChatUsers?.data?.data?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allChatUsers?.data?.data?.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);





  

  return (
    <main className=''>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-4">
          <div className='flex flex-col space-y-2 ' >
          <div className='grid grid-cols-2 gap-2' >
            <Button onClick={handleGeneralChat} text="General Chat" type={currentChatType === 'general-chat' ? "primary":"secondary"} textColor={currentChatType === 'general-chat' ? "text-white":"text-Color"} /> 
            <Button onClick={handlePrimaryChat} text="Primary Chat"  type={currentChatType === 'primary-chat' ? "primary":"secondary"} textColor={currentChatType === 'primary-chat' ? "text-white":"text-Color"}/> 
            </div>
            <div className={`space-y-2  w-full ${currentChatType === 'general-chat' ? "hidden":""}`} >
              {allChatUsers.isLoading && <CircleLoader />}

             

              {currentItems?.map((chatUser:ChatUserDataType,index:number)=>(

              <ChatUser key={index}   chatUser={chatUser} online  selected />
              ))}
             
             
              {/* <ChatUser  image={avatarImage2} name='Aweda Rian' lastMessage='Hello sir, how are you today?' />
              <ChatUser  image={avatarImage3} name='Aweda Rian' lastMessage='Hello sir, how are you today?' /> */}

            {pageNumbers.length > 0 && (

            <ul className="flex space-x-2 items-center justify-center my-2 flex-wrap ">
              {pageNumbers?.map((number,index)=>(
                <li key={index} className="my-1" >
                <button
                  className={`${
                    currentPage === number ? 'bg-primary-blue text-white' : 'bg-neutral-3'
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
          </div>
          <div>
              <ChatBoxContainer isLoading={isLoading} data={data?.data} currentChatType={currentChatType} />
          </div>
        </div>
    </main>
  )
}

export default ChatPage