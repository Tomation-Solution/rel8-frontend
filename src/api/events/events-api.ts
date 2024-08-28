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

export async function registerForPaidEvent(eventId: any, amount: number) {
    const data = {
      amount: amount, 
      project_id: eventId, 
      callback_url: `${window.location.origin}/event/success/${eventId}?project_id=${eventId}&amount=${amount}`, // Your callback URL
    };
    const response = await apiTenant.post(`/event/payment/`, data);
    return response.data;
  }

  export const postEventPaymentSuccess = async (data: any) => {
    try {
        const response = await apiTenant.post(`/event/save/payment/`, data);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};

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