import { api } from "@/lib/api";
import { VendorProfile } from "./vendor";

export const adminService = {
    getPendingVendors: async (): Promise<VendorProfile[]> => {
        const response = await api.get<VendorProfile[]>("/admin/vendors/pending");
        return response.data;
    },
    verifyVendor: async (id: string): Promise<void> => {
        await api.post(`/admin/vendors/${id}/verify`);
    },
    rejectVendor: async (id: string): Promise<void> => {
        await api.post(`/admin/vendors/${id}/reject`);
    },
};
