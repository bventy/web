"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin";
import { OverviewCards, OverviewData } from "@/components/admin/OverviewCards";
import { GrowthCharts, GrowthData } from "@/components/admin/GrowthCharts";
import { MarketplaceAnalytics, MarketplaceData } from "@/components/admin/MarketplaceAnalytics";
import { RiskSection } from "@/components/admin/RiskSection";

export default function AdminOverviewPage() {
    const [overviewData, setOverviewData] = useState<OverviewData | undefined>();
    const [growthData, setGrowthData] = useState<GrowthData | undefined>();
    const [marketplaceData, setMarketplaceData] = useState<MarketplaceData | undefined>();

    const [loadingOverview, setLoadingOverview] = useState(true);
    const [loadingGrowth, setLoadingGrowth] = useState(true);
    const [loadingMarketplace, setLoadingMarketplace] = useState(true);

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

            adminService.getMetricsMarketplace()
                .then(setMarketplaceData)
                .catch(console.error)
                .finally(() => setLoadingMarketplace(false));
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

            <div className="mt-2">
                <GrowthCharts data={growthData} loading={loadingGrowth} />
            </div>

            <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold tracking-tight">Marketplace Analytics</h2>
                        <MarketplaceAnalytics data={marketplaceData} loading={loadingMarketplace} />
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
