import { api } from "@/lib/api";

export interface Group {
    id: string;
    name: string;
    city: string;
    description: string;
    image_url?: string;
    role: "owner" | "member";
    member_count: number;
}

export interface CreateGroupRequest {
    name: string;
    city: string;
    description: string;
    banner_image_url?: string;
}

export const groupService = {
    getMyGroups: async (): Promise<Group[]> => {
        const response = await api.get<Group[]>("/groups/my");
        return response.data || [];
    },
    createGroup: async (data: CreateGroupRequest): Promise<Group> => {
        const response = await api.post<Group>("/groups", data);
        return response.data;
    },
};
