import { ChatUserDataType } from "../../types/myTypes";
import dummyImage from '../../assets/images/dummy.jpg'

interface Props{
    image?:string;
    // name?:string;
    lastMessage?:string;
    selected?:boolean;
    online?:boolean,
    chatUser:ChatUserDataType;
   
}

const ChatUser = ({image,lastMessage,selected,online}:Props) => {
  return (
    <div className={`relative hover:cursor-pointer p-2 flex items-center rounded-md ${selected ? "bg-primary-blue" : "bg-neutral-3"} gap-2 h-[50px]`} >
    <img src={image ? image : dummyImage} className="rounded-md w-fit h-10" alt="" />
    <div className="flex-1" >
{/*         <h4 className={`font-medium text-capitalize ${selected ? "text-white" : "text-textColor"} `} >{chatUser?.full_name}</h4> */}
        <small className={`text-capitalize text-textColor text-xs font-light ${selected ? "text-white" : "text-textColor"} `} >{lastMessage}</small>
    </div>
    <div className={`absolute ${online ? "bg-green-500" :"bg-gray-400"} w-2 h-2 top-0 right-0 m-2 rounded-full`} ></div>
</div>
  )
}

export default ChatUser
