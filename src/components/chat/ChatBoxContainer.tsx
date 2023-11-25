import { AiOutlineInfoCircle, AiOutlineSend } from 'react-icons/ai'
import { BsEmojiSmile, BsTelephone } from 'react-icons/bs'
import ChatItem from './ChatItem';
// import FormError from '../form/FormError';
// import TextInputWithImage from '../form/TextInputWithImage';
// import { useForm, SubmitHandler } from 'react-hook-form';
import { ChatMessageDataType } from '../../types/myTypes';
import { useAppContext } from '../../context/authContext';
import CircleLoader from '../loaders/CircleLoader';
import {  useState } from 'react';

interface Props{
    currentChatType:string;
    data:ChatMessageDataType[];
    isLoading:boolean;
}

export type ChatBoxFormFields = {
    message: string;
  };

  // const onSubmit: SubmitHandler<ChatBoxFormFields> = (data) => console.log(data)


  

const ChatBoxContainer = ({currentChatType,data,isLoading}:Props) => {

  const { user } = useAppContext();
  // const [web_socket, setWeb_socket] = useState<WebSocket | null>(null);

  const [text,setText] = useState('')
 
  // const [chatroom,setChatRoom] = useState<null|ChatRoomType>(null)
  // const [web_socket,setWeb_socket] = useState<WebSocket | null>(null);
  // const [connecting,setConnecting] = useState(false)
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  // const [message, setMessage] = useState('');




  // useEffect(() => {
  //   // Create a new WebSocket instance
  //   const newSocket = new WebSocket('wss://rel8.watchdoglogisticsng.com/ws/chat/nimn');

  //   // Set up event listeners for the WebSocket
  //   newSocket.addEventListener('open', () => {
  //     console.log('WebSocket connection opened');
  //   });

  //   newSocket.addEventListener('message', (event) => {
  //     console.log('Received message:', event.data);
  //     // Handle incoming messages
  //   });

  //   newSocket.addEventListener('close', (event) => {
  //     console.log('WebSocket connection closed:', event);
  //   });

  //   newSocket.addEventListener('error', (error) => {
  //     console.error('WebSocket error:', error);
  //   });

  //   // Save the WebSocket instance to state
  //   setSocket(newSocket);

  //   // Clean up WebSocket on component unmount
  //   // return () => {
  //   //   newSocket.close();
  //   // };
  // }, []); // Empty dependency array means this effect runs once on mount

  // const sendMessage = () => {
  //    const data ={
  //           'message':text,
  //           'send_user_id':19,
  //           'is_group':true
  //       }
        
  //   if (socket && socket.readyState === WebSocket.OPEN) {
  //     socket.send(JSON.stringify(data));
  //     console.log('Message sent successfully');
  //   }
  // };






    
  return (
    <section className='border-2 border-neutral3 ' >
    <div className='border-b-2 border-[#ececec] flex items-center w-full  justify-between p-3' >
       <h3 className='font-semibold text-[17px]' >{currentChatType === 'general-chat' ? "General Chat" : "Aweda Rian"}</h3>
       <div className='flex items-center justify-between gap-3 text-white' >
           <span className='bg-primary-blue p-2 rounded-md' >

           <BsTelephone className='w-5 h-5' />
           </span>
           <span  className='bg-primary-blue p-2 rounded-md'>

           <AiOutlineInfoCircle className='w-5 h-5' />
           </span>
       </div>
   </div>
   <div className='overflow-y-auto max-h-[80vh]' >
    {isLoading && <CircleLoader />}
    {data?.map((chat:ChatMessageDataType,index:number)=>(

       <ChatItem by={chat.full_name} key={index}  time='6:00pm' sender={user?.user_id === chat.user__id} message={chat?.message} />
    ))}
      
   </div>
   <div className='flex items-center p-2 gap-2' >
    <BsEmojiSmile className='w-5 h-5' />
    <div className='flex-1 flex items-center'  >   
    {/* up meant to be form */}
    <div className='flex-1' >

        {/* {errors.message?.type === 'required' && (<FormError message="Message is required" />)}
        <TextInputWithImage   register={register}  name="message" placeHolder="Type a message"  /> */}
      
        <input type="text" className='form-control' placeholder="Type a message" value={text} onChange={(event) => setText(event.target.value)} />

    </div>
     <button className='py-2 px-3 grid place-items-center bg-neutral3 rounded-md' >
       <AiOutlineSend className='w-5 h-5 text-textColor'  />
     </button>
    </div>
   </div>
</section>
  )
}
export default ChatBoxContainer