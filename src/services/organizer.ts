import { api } from "@/lib/api";

export interface OrganizerProfileRequest {
    display_name: string;
    city?: string;
}

export const organizerService = {
    createProfile: async (data: OrganizerProfileRequest): Promise<void> => {
        await api.post("/organizer/onboard", data);
    },
};
