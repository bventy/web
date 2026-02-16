import { api } from "@/lib/api";

export interface UserProfile {
    role: "user" | "staff" | "admin" | "super_admin";
    full_name: string;
    username: string;
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
};
