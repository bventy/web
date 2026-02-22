import { api } from "@/lib/api";

export interface QuoteRequestPayload {
    vendor_id: string;
    event_id?: string;
    budget_range?: string;
    message?: string;
    special_requirements?: string;
    deadline?: string;
    // Inline event creation
    event_title?: string;
    event_type?: string;
    event_city?: string;
    event_date?: string;
    event_budget_min?: number;
    event_budget_max?: number;
}

export interface Quote {
    id: string;
    event_id: string;
    event_title: string;
    vendor_id: string;
    vendor_name: string;
    organizer_id: string;
    organizer_name: string;
    budget_range?: string;
    quoted_price?: number;
    message?: string;
    response?: string;
    special_requirements?: string;
    deadline?: string;
    attachment_url?: string;
    status: "pending" | "quoted" | "responded" | "accepted" | "rejected" | "revision_requested";
    created_at: string;
    updated_at: string;
    responded_at?: string;
    revision_requested_at?: string;
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
    respondToQuote: async (id: string, quoted_price: number, vendor_response?: string, attachment?: File): Promise<void> => {
        const formData = new FormData();
        formData.append("quoted_price", quoted_price.toString());
        if (vendor_response) formData.append("vendor_response", vendor_response);
        if (attachment) formData.append("attachment", attachment);

        await api.patch(`/quotes/respond/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    requestRevision: async (id: string): Promise<void> => {
        await api.patch(`/quotes/request-revision/${id}`);
    },
    getAttachmentSignedUrl: async (id: string): Promise<string> => {
        const response = await api.get<{ url: string }>(`/quotes/${id}/attachment`);
        return response.data.url;
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
