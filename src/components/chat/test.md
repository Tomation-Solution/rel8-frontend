  const sendMessage=()=>{
  
    if(!user) return 
     const data ={
         'message':text,
         'user__id':user.user_id,
         'full_name':"ADEBAYO ADEBOWALE PETER"
     }
     
    //  const data ={
    //      'message':text,
    //      'send_user_id':user.user_id,
    //      'is_group':true
    //  }
     
     try{
      console.log('its working o ')
     
         web_socket?.send(JSON.stringify(data))
         console.log('Message sent successfully'); // Set a success message
  
        }
        catch(e){
          console.log('failed ')
          console.log('catch',e)
        }

        

 }

 useEffect(()=>{
   if (web_socket){
     //to avoid duplicate connection
     web_socket.close()}
     
     if (currentChatType){
      let url =''
        if(currentChatType==='general-chat'){
            // dispatch(get_old_chats(`?room_name=general`))
            // url = `ws://rel8backend-production-adfb.up.railway.app/ws/chat/nimn/general/`
            url = `ws://rel8.watchdoglogisticsng.com/ws/chat/nimn/general/`
            // url = `ws://rel8.watchdoglogisticsng.com/ws/chat/ws/chat/nimn/general/`
        }
        
        // if (url){
          
        // }
        const ws = new WebSocket(url)
        setWeb_socket(ws)
        ws.onopen = (e) => {
            console.log('connected',e)
            // setConnecting(false)
          }
          ws.onclose = (e) => {
            console.log('err',e)
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
