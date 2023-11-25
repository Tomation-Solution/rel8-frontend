import apiTenant from '../baseApi';



export const getChats = async (roomName:string)=>{
    
        const response = await apiTenant.get("/chat/?room_name=" + roomName);
        return response.data
    
}
export const getAllChatsUsers = async ()=>{
   
    
        const response = await apiTenant.get("chat/get_users/");
        return response.data
    }


export const fetchOldGeneralChats = async () =>{
    const response = await apiTenant.get(`/chat/?room_name=general`);
    return response.data
}

