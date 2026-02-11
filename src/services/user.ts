import { api } from "@/lib/api";

export interface UserProfile {
    role: "user" | "staff" | "admin" | "super_admin";
    vendor_profile_exists: boolean;
    organizer_profile_exists: boolean;
    permissions: string[];
}

export const userService = {
    getMe: async (): Promise<UserProfile> => {
        const response = await api.get<UserProfile>("/me");
        return response.data;
    },
};
