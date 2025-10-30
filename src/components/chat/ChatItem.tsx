interface Props{
    sender?:boolean;
    message:string;
    time?:string;
    by:string;
  }
  
  const ChatItem = ({by,sender,message,time}:Props) => {
    return (
      <div className={ `flex flex-col ${sender ? " ml-auto" : " mr-auto" } w-fit  max-w-[50%] m-2`} >
          <small className="" >{by ? by : "Anonymous"}</small>
          <p className={`text-sm rounded-md text-textColor  ${sender ? 'text-white bg-org-primary' : "text-textColor bg-neutral-3"} p-2 textwrap`} >{message} </p>
          <small className={` my-1 ${sender ? "text-right " : "text-left"}`} >{time}</small>
      </div>
    )
  }
  
  export default ChatItem