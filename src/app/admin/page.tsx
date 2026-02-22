"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin";
import { OverviewCards, OverviewData } from "@/components/admin/OverviewCards";
import { GrowthCharts, GrowthData } from "@/components/admin/GrowthCharts";
import { EventBreakdown, EventBreakdownData } from "@/components/admin/EventBreakdown";
import { VendorPerformance, VendorPerformanceData } from "@/components/admin/VendorPerformance";
import { RiskSection } from "@/components/admin/RiskSection";

export default function AdminOverviewPage() {
    const [overviewData, setOverviewData] = useState<OverviewData | undefined>();
    const [growthData, setGrowthData] = useState<GrowthData | undefined>();
    const [eventData, setEventData] = useState<EventBreakdownData | undefined>();
    const [vendorData, setVendorData] = useState<VendorPerformanceData | undefined>();

    const [loadingOverview, setLoadingOverview] = useState(true);
    const [loadingGrowth, setLoadingGrowth] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingVendors, setLoadingVendors] = useState(true);

    useEffect(() => {
        const fetchAll = () => {
            adminService.getMetricsOverview()
                .then(setOverviewData)
                .catch(console.error)
                .finally(() => setLoadingOverview(false));

            adminService.getMetricsGrowth()
                .then(setGrowthData)
                .catch(console.error)
                .finally(() => setLoadingGrowth(false));

            adminService.getMetricsEvents()
                .then(setEventData)
                .catch(console.error)
                .finally(() => setLoadingEvents(false));

            adminService.getMetricsVendors()
                .then(setVendorData)
                .catch(console.error)
                .finally(() => setLoadingVendors(false));
        };

        fetchAll();
    }, []);

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Control Center</h1>
                <p className="text-muted-foreground mt-2">
                    Monitor platform performance, user growth, and vendor activity.
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
                <OverviewCards data={overviewData} loading={loadingOverview} />
            </section>

            <section className="space-y-4">
                <GrowthCharts data={growthData} loading={loadingGrowth} />
            </section>

            <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight">Event Intelligence</h2>
                        <EventBreakdown data={eventData} loading={loadingEvents} />
                    </section>

                    <section className="space-y-4">
                        <VendorPerformance data={vendorData} loading={loadingVendors} />
                    </section>
                </div>

                <div className="xl:col-span-1 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight">Platform Risks</h2>
                        <RiskSection
                            pendingCount={overviewData?.pending_vendors ?? 0}
                            loading={loadingOverview}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
