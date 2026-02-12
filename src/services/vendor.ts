import { api } from "@/lib/api";

export interface VendorProfileRequest {
    business_name: string;
    category: string;
    city: string;
    bio: string;
    whatsapp_link: string;
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
    verified: boolean;
}

export const vendorService = {
    createProfile: async (data: VendorProfileRequest): Promise<void> => {
        await api.post("/vendor/onboard", data);
    },
    getVendors: async (): Promise<VendorProfile[]> => {
        const response = await api.get<VendorProfile[]>("/vendors");
        return response.data;
    },
    getVendorBySlug: async (slug: string): Promise<VendorProfile> => {
        const response = await api.get<VendorProfile>(`/vendors/slug/${slug}`);
        return response.data;
    },
};
