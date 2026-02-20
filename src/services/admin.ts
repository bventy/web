import { api } from "@/lib/api";
import { VendorProfile } from "./vendor";

export const adminService = {
    getVendors: async (status?: string): Promise<VendorProfile[]> => {
        const response = await api.get<VendorProfile[]>("/admin/vendors", {
            params: { status },
        });
        return response.data;
    },
    approveVendor: async (id: string): Promise<void> => {
        await api.patch(`/admin/vendors/${id}/approve`);
    },
    rejectVendor: async (id: string): Promise<void> => {
        await api.patch(`/admin/vendors/${id}/reject`);
    },
    getStats: async (): Promise<any> => {
        const response = await api.get("/admin/stats");
        return response.data;
    },
    getUsers: async (): Promise<any[]> => {
        const response = await api.get("/admin/users");
        return response.data;
    },
    updateUserRole: async (id: string, role: string): Promise<void> => {
        await api.patch(`/admin/users/${id}/role`, { role });
    },
};
