
/**
 * Event API.
 *
 * MP-2: eight functions were removed from this file because the endpoints they called
 * do not exist on this backend — `/api/events/eventview/register_for_free_event/`,
 * `/api/events/eventview/list_of_register_members/`, `/api/events/eventview/view_attendies/`,
 * `/api/events/eventview/request-reschedule/`, `/api/events/payment/` and
 * `/api/events/save/payment/`. They could only ever have 404'd.
 *
 * `registerForEvent` also went: registration now starts at `startEventRegistration` in
 * `api/paystack-api.ts`, which returns the unified `checkout` (X-1/X-7).
 */
import apiTenant from "../baseApi";

export const fetchAllUserEvents = async (): Promise<any> => {
  const response = await apiTenant.get(`/api/events/eventview/get_events/`);
  return response.data;
};

export const fetchEventById = async (eventId: string): Promise<any> => {
  const response = await apiTenant.get(`/api/events/${eventId}`);
  return response.data.event || response.data;
};

// New registration endpoints

export const unregisterFromEvent = async (eventId: string): Promise<any> => {
  const response = await apiTenant.delete(`/api/events/${eventId}/register`);
  return response.data;
};

export const fetchMyRegistrations = async (): Promise<any> => {
  const response = await apiTenant.get(`/api/events/my-registrations`);
  return response.data.registrations || response.data || [];
};







