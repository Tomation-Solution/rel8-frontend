import { AiOutlineInfoCircle, AiOutlineSend } from 'react-icons/ai'
import { BsEmojiSmile, BsTelephone } from 'react-icons/bs'
import ChatItem from './ChatItem';
// import FormError from '../form/FormError';
// import TextInputWithImage from '../form/TextInputWithImage';
// import { useForm, SubmitHandler } from 'react-hook-form';
import { ChatMessageDataType } from '../../types/myTypes';
import { useAppContext } from '../../context/authContext';
import CircleLoader from '../loaders/CircleLoader';
import {  useState,useEffect } from 'react';
import { TENANT, sitename } from '../../utils/constants';
import {  getUserOrNull } from '../../utils/extra_functions';

interface Props{
    currentChatType:chatRoomType;
    data:ChatMessageDataType[];
    isLoading:boolean,
    currentTab?:'group-chat'|'single-chat'
}

export type ChatBoxFormFields = {
    message: string;
  };

  // const onSubmit: SubmitHandler<ChatBoxFormFields> = (data) => console.log(data) 

export  type chatRoomType ={
    type:'general'|'commitee'|'exco'|'single-chat',
    display:string,
    value:number,
  }

  

const ChatBoxContainer = ({currentChatType,data,isLoading,}:Props) => {

  const { user } = useAppContext();
  // const [web_socket, setWeb_socket] = useState<WebSocket | null>(null);

  const [text,setText] = useState('')
 
  // const [chatroom,setChatRoom] = useState<>(null)
  const [web_socket,setWeb_socket] = useState<WebSocket | null>(null);
  const [connecting,setConnecting] = useState(false)
  const [newchats,setNewchats] = useState<ChatMessageDataType[]>([])

// console.log({data})


  useEffect(()=>{
    if(web_socket){
        //to avoid duplicate connection
        web_socket.close()}

    if(currentChatType){
        let url =''
        if(currentChatType.type=='general'){
            // dispatch(get_old_chats(`?room_name=general`))
            url = `wss://${sitename}/ws/chat/${TENANT}/general/`
        }
        if(currentChatType.type==='commitee'){
            // dispatch(get_old_chats(`?room_name=${chatroom.value}commitee`))
            url = `wss://${sitename}/ws/commitee_chat/${TENANT}/${currentChatType.value}/`
        }
        if(currentChatType.type==='exco'){
            // dispatch(get_old_chats(`?room_name=${chatroom.value}exco`))
        }
        if(currentChatType.type ==='single-chat'){
          const logged_in_user =  getUserOrNull()
          // console.log(currentChatType)
          const reciver_id:any = currentChatType.value
          if(logged_in_user){
            const room_name = logged_in_user?.user_id>reciver_id?`${logged_in_user?.user_id}and${reciver_id}`:`${reciver_id}and${logged_in_user?.user_id}`
            url = `wss://${sitename}/ws/chat/${TENANT}/${room_name}/`

          }
        }
        if(url){

          const ws = new WebSocket(url)
          setWeb_socket(ws)
          ws.onopen = (e) => {
              console.log('connected',e)
              setConnecting(false)
            }
            ws.onclose = (e) => {
              console.log('err',e)
            }
        }

    }
},[currentChatType])


if(web_socket){
  web_socket.onmessage = (e) => {
      // a message was received
      const response = JSON.parse(e.data)
      console.log({response})
      // dispatch(addChat({
      //     'user__id':response.send_user_id,
      //     'message':response.message,
      //     'full_name':response.full_name
      // }))
    };
}

const sendMessage=()=>{
  const logged_in_user =  getUserOrNull()
  console.log({logged_in_user})
  if(!logged_in_user) return 
   const data ={
       'message':text,
       'send_user_id':logged_in_user.user_id,
       'is_group':true
   }
   
   try{
       web_socket?.send(JSON.stringify(data))
      }
      catch(e){
        console.log('catch',e)
      }

      

}

if(web_socket){
  web_socket.onmessage = (e) => {
      // a message was received
      const response = JSON.parse(e.data)
      console.log({response})
      setNewchats([
        ...newchats,
        {
          'user__id':response.send_user_id,
          'message':response.message,
          'full_name':response.full_name
      }
      ])
    };
}
  return (
    <section className='border-2 border-neutral3 ' >
    <div className='border-b-2 border-[#ececec] flex items-center w-full  justify-between p-3' >
       <h3 className='font-semibold text-[17px]' >{currentChatType.display} Chat</h3>
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
    {(isLoading||connecting) && <CircleLoader />}
{
  data?
  [...data,...newchats].map((chat:ChatMessageDataType,index:number)=>(

     <ChatItem by={chat.full_name} key={index}  time='6:00pm' sender={user?.id === chat.user__id} message={chat?.message} />
  )):''
}
      
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
     <button className='py-2 px-3 grid place-items-center bg-neutral3 rounded-md' 
     onClick={()=>{
      if(!text) return 
      sendMessage()
     }}
     >
       <AiOutlineSend className='w-5 h-5 text-textColor'  />
     </button>
    </div>
   </div>
</section>
  )
}
export default ChatBoxContainer