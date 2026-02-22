import { api } from "@/lib/api";

export interface QuoteRequestPayload {
    vendor_id: string;
    event_id: string;
    budget_range?: string;
    message?: string;
}

export interface Quote {
    id: string;
    event_id: string;
    vendor_id: string;
    user_id: string;
    budget_range?: string;
    quoted_price?: number;
    message?: string;
    vendor_response?: string;
    status: "pending" | "quoted" | "accepted" | "rejected";
    created_at: string;
    updated_at: string;
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
    respondToQuote: async (id: string, quoted_price: number, vendor_response?: string): Promise<void> => {
        await api.patch(`/quotes/respond/${id}`, { quoted_price, vendor_response });
    },
    getMyQuotes: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/quotes/my");
        return response.data;
    },
    getQuoteRequests: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/quotes/requests");
        return response.data;
    }
};
