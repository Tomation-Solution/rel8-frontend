// import { EventDataType } from "../../types/myTypes";
import apiTenant, { apiTenantAxiosForm } from "../baseApi";

export const fetchAllUserEvents = async () =>{
    const response = await apiTenant.get(`/event/eventview/get_events/`);
    return response.data
}

export const registerForFreeEvent = async (data:any)=>{
    // console.log(data,'----->testing')
    const response = await apiTenantAxiosForm.post("/event/eventview/register_for_free_event/", data);
    return response.data;
}

export async function getEventRegisteredMembers(eventId: string) {
    // const token = await retrieveAppData("token");

    const response = await apiTenant.post("/event/eventview/list_of_register_members/", {
        eventId: eventId
    });

    return response.data;
}

export async function getEventAttendees(eventId: string) {
   
    const response = await apiTenant.post("/event/eventview/view_attendies/", {
        eventId: eventId
    });

    return response.data;
}

// export async function registerFreeEvent(data: any) {
    

//     const response = await apiTenant.post("/event/eventview/register_for_free_event/", {...data});

//     return response.data;
// }

// export async function  registerForPaidEvent(eventId:any,data: any) {
export async function  registerForPaidEvent(eventId:any) {
  
    const response = await apiTenant.post(`/dues/process_payment/event_payment/${eventId}/`, );
    // const response = await apiTenant.post(`/dues/process_payment/event_payment/${eventId}/`, {...data});

    return response.data;
}

export async function requestReschedule(data: any) {
  

    const response = await apiTenant.post("/event/eventview/request-reschedule/", { ...data.data }, {
        params: {
            ...data.params
        }
    })

    return response.data;
}

export async function getReschedule(eventId: string) {
   

    const response = await apiTenant.get("/event/eventview/request-reschedule/", {
        params: {
            event_id: eventId
        }
    })

    return response.data;
}