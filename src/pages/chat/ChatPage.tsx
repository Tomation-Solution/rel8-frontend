import { useState } from "react";
import { fetchOldGeneralChats, getAllChatsUsers, getChats } from "../../api/chats/chats";
// import { ChatUserDataType } from "../../types/myTypes";
import Button from "../../components/button/Button";
import ChatUser from "../../components/chat/ChatUser";
import ChatBoxContainer, { chatRoomType } from "../../components/chat/ChatBoxContainer";
import { useQuery } from "react-query";
import CircleLoader from "../../components/loaders/CircleLoader";
// import { WSS } from "../../utils/constants";
// import { useAppContext } from "../../context/authContext";
// import Toast from "../../components/toast/Toast";
// import Toast from "../../components/toast/Toast"
import dummyImage from '../../assets/images/dummy.jpg';
import { FetchName, getUserOrNull } from "../../utils/extra_functions";

const ChatPage = () => {

  const [currentChatType, setCurrentChatType] = useState<chatRoomType>({
    'type':'general',
    'display':'General',
    'value':-1// here we dont needd the value at all the word  general is enough
});
  const [currentChatTab,setCurrentChatTab] = useState<'group-chat'|'single-chat'>('group-chat')
  // const [open, setOpen] = useState(false);
  // const [web_socket, setWeb_socket] = useState<WebSocket | null>(null);
  // const [chatData,setChatData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  // const [connecting,setConnecting] = useState(false)

  const logged_in_user:any =  getUserOrNull()

  // const { user } = useAppContext();
  // const { notifyUser } = Toast();




  const allChatUsers = useQuery("chatUsers", getAllChatsUsers);

  const queryKey = currentChatType.type === 'general' ? 'fetchOldGeneralChats' : 'fetchOtherChats';

  const { data,  isLoading } = useQuery(queryKey, () => {
    if (currentChatType.type === 'general') {
      return fetchOldGeneralChats();
    } 
    else if(currentChatType.type==='single-chat'){
      const logged_in_user:any =  getUserOrNull()
      // console.log({logged_in_user})
      const reciver_id = currentChatType.value
      if(logged_in_user){
        const room_name = logged_in_user?.user_id>reciver_id?`${logged_in_user?.user_id}and${reciver_id}`:`${reciver_id}and${logged_in_user?.user_id}`
        return getChats(room_name)
      }
      return
    }
    else {
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
      {/* <div className="fixed bottom-4 right-4 bg-yellow-300 text-black p-4 rounded-lg shadow-lg z-50">
        <h2 className="text-lg font-bold mb-2">Coming Soon</h2>
        <p>This page is still in development.</p>
      </div> */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-4">
          <div className='flex flex-col space-y-2 ' >
          <div className='grid grid-cols-2 gap-2' >
            <Button onClick={()=>{
              //
              setCurrentChatTab('group-chat')
            }} text="Group Chat" type={currentChatTab === 'group-chat' ? "primary":"secondary"} textColor={currentChatTab === 'group-chat' ? "text-white":"text-Color"} /> 
            <Button onClick={()=>{
              //
              setCurrentChatTab('single-chat')
            }} text="Primary Chat"  type={currentChatTab === 'single-chat' ? "primary":"secondary"} textColor={currentChatTab === 'single-chat'? "text-white":"text-Color"}/> 
            </div>
            <div className={`space-y-2  w-full ${currentChatTab === 'group-chat' ? "hidden":""}`} >
              {allChatUsers.isLoading && <CircleLoader />}

             

              {currentItems?.filter((d:any)=>d.user!==logged_in_user?.user_id)?.map((chatUser:any,index:number)=>(
                <div
              key={index}
              onClick={()=>{
                console.log({chatUser})
                setCurrentChatType({
                  'type':'single-chat',
                  'display': FetchName(chatUser),
                  
                  'value':chatUser.user
              })
              }}
                className={`relative hover:cursor-pointer p-2 flex items-center rounded-md
                `} 
                  //  ${selected ? "bg-org-primary" : "bg-neutral-3"} gap-2 h-[50px]
                >
    <img src={ dummyImage} className="rounded-md w-fit h-10" alt="" />
    <div className="flex-1" >
        <h4 className={`font-medium text-capitalize 
        `} 
        // ${selected ? "text-white" : "text-textColor"} 
        >
          {
          // chatUser?.email
          FetchName(chatUser)
          }</h4>
        <small className={`text-capitalize text-textColor text-xs font-light `} 
        //  ${selected ? "text-white" : "text-textColor"}
        >
          {/* {lastMessage} */}
          </small>
    </div>
    {/* <div className={`absolute ${online ? "bg-green-500" :"bg-gray-400"} w-2 h-2 top-0 right-0 m-2 rounded-full`} ></div> */}
</div>
              ))}
             
             
              {/* <ChatUser  image={avatarImage2} name='Aweda Rian' lastMessage='Hello sir, how are you today?' />
              <ChatUser  image={avatarImage3} name='Aweda Rian' lastMessage='Hello sir, how are you today?' /> */}

            {pageNumbers.length > 0 && (

            <ul className="flex space-x-2 items-center justify-center my-2 flex-wrap ">
              {pageNumbers?.map((number,index)=>(
                <li key={index} className="my-1" >
                <button
                  className={`${
                    currentPage === number ? 'bg-org-primary text-white' : 'bg-neutral-3'
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

            <div  className={`space-y-2  w-full ${currentChatTab === 'single-chat'  ? "hidden":""}`}>
              
              <div onClick={()=>{
                  setCurrentChatType({
                    'type':'general',
                    'display':'General',
                    'value':-1
                })
            }}>
                <ChatUser    chatUser={{
                'email':"Group Chat",
                'id':1,
                }} online  selected={false} />
              </div>

            </div>
          </div>
          <div>
              <ChatBoxContainer isLoading={isLoading} data={data?.data} currentChatType={currentChatType} currentTab={currentChatTab} />
          </div>
        </div>
    </main>
  )
}

export default ChatPage