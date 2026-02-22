import { api } from "@/lib/api";

export interface QuoteRequestPayload {
    vendor_id: string;
    event_id: string;
    budget_range?: string;
    message?: string;
    special_requirements?: string;
    deadline?: string;
}

export interface Quote {
    id: string;
    event_id: string;
    event_title?: string;
    vendor_id: string;
    vendor_name?: string;
    organizer_user_id: string;
    organizer_name?: string;
    budget_range?: string;
    quoted_price?: number;
    message?: string;
    vendor_response?: string;
    attachment_url?: string;
    status: "pending" | "responded" | "accepted" | "rejected" | "revision_requested" | "archived";
    special_requirements?: string;
    deadline?: string;
    created_at: string;
    updated_at: string;
    responded_at?: string;
    accepted_at?: string;
    rejected_at?: string;
    revision_requested_at?: string;
    contact_unlocked_at?: string;
    contact_expires_at?: string;
    archived_at?: string;
    revision_message?: string;
}

export interface QuoteContact {
    vendor: {
        whatsapp?: string;
        phone?: string;
        email?: string;
    };
    organizer: {
        name: string;
        phone?: string;
        email?: string;
    };
}

export const quoteService = {
    requestQuote: async (data: QuoteRequestPayload): Promise<Quote> => {
        const response = await api.post<Quote>("/quotes/request", data);
        return response.data;
    },
    acceptQuote: async (id: string): Promise<void> => {
        await api.patch(`/quotes/accept/${id}`);
    },
    rejectQuote: async (id: string): Promise<void> => {
        await api.patch(`/quotes/reject/${id}`);
    },
    respondToQuote: async (id: string, quoted_price: number, vendor_response?: string, attachment_url?: string): Promise<void> => {
        await api.patch(`/quotes/respond/${id}`, { quoted_price, vendor_response, attachment_url });
    },
    requestRevision: async (id: string, message?: string): Promise<void> => {
        await api.patch(`/quotes/revision/${id}`, { message });
    },
    getQuoteContact: async (id: string): Promise<QuoteContact> => {
        const response = await api.get<QuoteContact>(`/quotes/${id}/contact`);
        return response.data;
    },
    getMyQuotes: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/quotes/organizer");
        return response.data;
    },
    getQuoteRequests: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/quotes/vendor");
        return response.data;
    }
};
