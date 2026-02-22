import { api } from "@/lib/api";

export const trackService = {
    trackActivity: (entityType: string, entityId: string, actionType: string) => {
        if (!entityId) return;
        // Fire and forget
        api.post("/track/activity", {
            entity_type: entityType,
            entity_id: entityId,
            action_type: actionType
        }).catch((err) => console.error("Tracking error:", err));
    },
    trackVendorView: (vendorId?: string) => {
        if (!vendorId) return;
        trackService.trackActivity("vendor", vendorId, "view");
    },
    trackEventView: (eventId?: string) => {
        if (!eventId) return;
        trackService.trackActivity("event", eventId, "view");
    },
    trackContactClick: (vendorId?: string) => {
        if (!vendorId) return;
        trackService.trackActivity("vendor", vendorId, "contact_click");
    }
};
