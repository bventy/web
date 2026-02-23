import { api } from "@/lib/api";

export interface VendorProfileRequest {
    business_name: string;
    category: string;
    city: string;
    bio: string;
    whatsapp_link: string;
    portfolio_image_url?: string;
}

export interface VendorProfile {
    id: string;
    business_name: string;
    slug: string;
    category: string;
    city: string;
    bio: string;
    whatsapp_link: string;
    profile_picture?: string;
    primary_profile_image_url?: string;
    verified: boolean;
    owner_full_name?: string;
    owner_profile_image?: string;
    // New fields
    portfolio_image_url?: string;
    gallery_images?: string[];
    portfolio_files?: any[]; // JSONB array
    average_rating: number;
    review_count: number;
}

export interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    organizer_name: string;
    profile_image?: string;
}

export const vendorService = {
    createProfile: async (data: VendorProfileRequest): Promise<void> => {
        await api.post("/vendor/onboard", data);
    },
    updateProfile: async (data: Partial<VendorProfileRequest> & { gallery_images?: string[]; portfolio_files?: any[] }): Promise<void> => {
        await api.put("/vendor/me", data);
    },
    getVendors: async (): Promise<VendorProfile[]> => {
        const response = await api.get<VendorProfile[]>("/vendors");
        return response.data || [];
    },
    getVendorBySlug: async (slug: string): Promise<VendorProfile> => {
        const response = await api.get<VendorProfile>(`/vendors/slug/${slug}`);
        const data = response.data;
        // Ensure arrays are initialized if null
        if (!data.gallery_images) data.gallery_images = [];
        if (!data.portfolio_files) data.portfolio_files = [];
        return data;
    },
    getMyProfile: async (): Promise<VendorProfile> => {
        const response = await api.get<VendorProfile>("/vendor/me");
        const data = response.data;
        // Ensure arrays are initialized if null
        if (!data.gallery_images) data.gallery_images = [];
        if (!data.portfolio_files) data.portfolio_files = [];
        return data;
    },
    getVendorReviews: async (vendorId: string): Promise<Review[]> => {
        const response = await api.get<Review[]>(`/vendors/${vendorId}/reviews`);
        return response.data || [];
    },
    submitReview: async (vendorId: string, rating: number, comment: string, quoteId?: string): Promise<void> => {
        await api.post(`/vendors/${vendorId}/reviews`, { rating, comment, quote_id: quoteId });
    },
    checkReviewEligibility: async (vendorId: string): Promise<{ eligible: boolean }> => {
        const response = await api.get<{ eligible: boolean }>(`/vendors/${vendorId}/reviews/eligibility`);
        return response.data;
    }
};
