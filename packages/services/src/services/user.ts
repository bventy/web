import { api } from "../api";

export interface UserProfile {
    id: string;
    email: string;
    role: "user" | "staff" | "admin" | "super_admin";
    full_name: string;
    username: string;
    phone?: string;
    city?: string;
    bio?: string;
    profile_image_url?: string;
    vendor_profile_exists: boolean;
    // organizer_profile_exists is deprecated in V8
    groups: any[]; // We will define Group type later
    permissions: string[];
}

export const userService = {
    getMe: async (): Promise<UserProfile> => {
        const response = await api.get<UserProfile>("/me");
        return response.data;
    },
    updateProfile: async (data: Partial<UserProfile>) => {
        const response = await api.put<UserProfile>("/me", data);
        return response.data;
    },
};
