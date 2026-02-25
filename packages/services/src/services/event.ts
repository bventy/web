import { api } from "../api";
import { VendorProfile } from "./vendor";

export interface Event {
    id: string;
    title: string;
    event_type: string;
    city: string;
    event_date: string;
    budget_min: number;
    budget_max: number;
    organizer_group_id?: string;
    status: string;
    cover_image_url?: string;
    shortlist: VendorProfile[];
}

export interface CreateEventRequest {
    title: string;
    event_type: string;
    city: string;
    event_date: string;
    budget_min: number;
    budget_max: number;
    organizer_group_id?: string;
    cover_image_url?: string;
}

export const eventService = {
    getEvents: async (): Promise<Event[]> => {
        const response = await api.get<Event[]>("/events");
        return response.data || [];
    },
    getEventById: async (id: string): Promise<Event> => {
        const response = await api.get<Event>(`/events/${id}`);
        return response.data;
    },
    createEvent: async (data: CreateEventRequest): Promise<Event> => {
        const response = await api.post<Event>("/events", data);
        return response.data;
    },
    shortlistVendor: async (eventId: string, vendorId: string): Promise<void> => {
        await api.post(`/events/${eventId}/shortlist/${vendorId}`);
    },
    removeShortlist: async (eventId: string, vendorId: string): Promise<void> => {
        await api.delete(`/events/${eventId}/shortlist/${vendorId}`);
    },
};
