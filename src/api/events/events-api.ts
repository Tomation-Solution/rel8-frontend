import {  EventsResponseType } from "../../types/myTypes";
import apiTenant, { apiTenantAxiosForm } from "../baseApi";

export const fetchAllUserEvents = async (): Promise<any> => {
    const response = await apiTenant.get(`/api/events/eventview/get_events/`);
    return response.data
}

export const registerForFreeEvent = async (data: any) => {
    // console.log(data,'----->testing')
    const response = await apiTenantAxiosForm.post("/api/events/eventview/register_for_free_event/", data);
    return response.data;
}

export async function getEventRegisteredMembers(eventId: string): Promise<any> {
    // const token = await retrieveAppData("token");
    const response = await apiTenant.post("/api/events/eventview/list_of_register_members/", {
        eventId: eventId
    });
    return response.data;
}

export async function getEventAttendees(eventId: string): Promise<any> {
    const response = await apiTenant.post("/api/events/eventview/view_attendies/", {
        eventId: eventId
    });
    return response.data;
}

export async function registerForPaidEvent(eventId: any, amount: number): Promise<any> {
    const data = {
      amount: amount,
      project_id: eventId,
      callback_url: `${window.location.origin}/event/success/${eventId}?project_id=${eventId}&amount=${amount}`, // Your callback URL
    };
    const response = await apiTenant.post(`/api/events/payment/`, data);
    return response.data;
  }

export const postEventPaymentSuccess = async (data: any): Promise<any> => {
    try {
        const response = await apiTenant.post(`/api/events/save/payment/`, data);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function requestReschedule(data: any): Promise<any> {
    const response = await apiTenant.post("/api/events/eventview/request-reschedule/", { ...data.data }, {
        params: {
            ...data.params
        }
    })
    return response.data;
}

export async function getReschedule(eventId: string): Promise<any> {
    const response = await apiTenant.get("/api/events/eventview/request-reschedule/", {
        params: {
            event_id: eventId
        }
    })
    return response.data;
}