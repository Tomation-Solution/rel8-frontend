    // const { register, handleSubmit, formState: { errors } } = useForm<ChatBoxFormFields>();

    
  //  const sendMessage=()=>{
     
    
  //   const data ={
  //       'message':text,
  //       'user__id':user?.user_id,
  //       'full_name':'hahah'
  //   }
  //   console.log(data)
    
  //   try{
  //     console.log('trying ahahahahahahahahah')
  //     console.log('trying ahahahahahahahahah')
  //     console.log('trying ahahahahahahahahah')
  //     console.log('trying ahahahahahahahahah')
  //       web_socket?.send(JSON.stringify(data))
  //       console.log('------------------------------')
  //       console.log('------------------------------')
  //       console.log('------------------------------')
  //       console.log('------------------------------')
  //      }
      
  //      catch(e){
  //        console.log('catch',e)
  //      }

       


  //     }

      const sendMessage = () => {
        // if (web_socket && web_socket === WebSocket.OPEN && message) {
          web_socket?.send(
            {
              'user__id':user?.user_id,
              'message':"rext",
              'full_name':"Ajangdgd"
          }
          );
          // setMessage('');
        // }
      };

      



// const url = 'ws://rel8backend-production-adfb.up.railway.app/ws/chat/nimn/general/'
// useEffect(()=>{
// if(web_socket){
//     //to avoid duplicate connection
//     web_socket.close()}

// if(currentChatType){
//   if(currentChatType=='general'){
//         // dispatch(get_old_chats(`?room_name=general`))
        
//     }
   

//     const ws = new WebSocket(url)
//     setWeb_socket(ws)
//     ws.onopen = (e) => {
//         console.log('connected',e)
//         setConnecting(false)
//       }
//       ws.onclose = (e) => {
//         console.log('err',e)
//       }

// }
// },[currentChatType])