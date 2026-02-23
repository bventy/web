import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface GrowthDataPoint {
    date: string;
    count: number;
}

export interface GrowthDetail {
    series: GrowthDataPoint[];
    total_all_time: number;
    new_past_30_days: number;
    new_previous_30_days: number;
}

export interface GrowthData {
    userGrowth: GrowthDetail | GrowthDataPoint[];
    vendorGrowth: GrowthDetail | GrowthDataPoint[];
    verifiedVendorGrowth: GrowthDetail | GrowthDataPoint[];
    pendingVendorGrowth: GrowthDetail | GrowthDataPoint[];
    eventGrowth: GrowthDetail | GrowthDataPoint[];
    completedEventGrowth: GrowthDetail | GrowthDataPoint[];
    groupGrowth: GrowthDetail | GrowthDataPoint[];
    quoteGrowth: GrowthDetail | GrowthDataPoint[];
    granularity?: 'day' | 'week' | 'month';
}

export function GrowthCharts({ data, loading }: { data?: GrowthData; loading: boolean }) {
    if (loading) {
        return (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Card key={i} className="animate-pulse border-none shadow-sm bg-card/50 h-[180px]">
                        <div className="w-full h-full bg-muted/20 rounded-xl"></div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) return null;

    const renderChart = (detail: GrowthDetail | GrowthDataPoint[], title: string, color: string, id: string) => {
        const granularity = data.granularity || 'day';

        const isNewFormat = detail && 'series' in detail;
        const chartData = isNewFormat ? detail.series : (Array.isArray(detail) ? detail : []);
        const total = isNewFormat ? (detail.total_all_time ?? 0) : chartData.reduce((sum, p) => sum + p.count, 0);
        const past = isNewFormat ? (detail.new_past_30_days ?? 0) : 0;
        const prev = isNewFormat ? (detail.new_previous_30_days ?? 0) : 0;

        let trend = 0;
        if (prev > 0) {
            trend = Math.round(((past - prev) / prev) * 100);
        } else if (past > 0) {
            trend = 100;
        }

        const formatDate = (val: string) => {
            const date = new Date(val);
            if (granularity === 'month') return date.toLocaleDateString('en-US', { month: 'short' });
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        };

        return (
            <Card className="flex flex-col border-none shadow-sm bg-card hover:shadow-md transition-all duration-300 overflow-hidden ring-1 ring-border/50 group">
                <CardHeader className="pb-0 pt-4 px-4">
                    <CardTitle className="text-[10px] font-bold text-muted-foreground/40 flex justify-between items-center tracking-widest uppercase">
                        {title}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">{granularity}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="px-4 pt-2">
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-extrabold tracking-tighter text-foreground leading-tight">
                                {total.toLocaleString()}
                            </h3>
                            {isNewFormat && (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className={`text-[10px] font-bold ${trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-rose-500' : 'text-muted-foreground/60'}`}>
                                        {trend > 0 ? `+${trend}%` : `${trend}%`}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground/40 font-medium">this month</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-[80px] w-full mt-3 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    hide
                                />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '10px',
                                        fontSize: '10px',
                                        padding: '4px 8px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    }}
                                    labelFormatter={(val) => formatDate(val as string)}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke={color}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${id})`}
                                    animationDuration={1500}
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="px-4 pb-3 pt-2 text-[10px] text-muted-foreground/30 font-medium flex justify-between">
                        <span>{chartData[0]?.date ? new Date(chartData[0].date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : ''}</span>
                        <span>{chartData[chartData.length - 1]?.date ? new Date(chartData[chartData.length - 1].date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : ''}</span>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {renderChart(data.userGrowth, "Users", "#3b82f6", "users")}
            {renderChart(data.vendorGrowth, "Total Vendors", "#10b981", "vendors")}
            {renderChart(data.verifiedVendorGrowth, "Verified Vendors", "#10b981", "verified")}
            {renderChart(data.pendingVendorGrowth, "Pending Vendors", "#f59e0b", "pending")}
            {renderChart(data.eventGrowth, "Total Events", "#f59e0b", "events")}
            {renderChart(data.completedEventGrowth, "Completed Events", "#3b82f6", "completed")}
            {renderChart(data.groupGrowth, "Groups", "#8b5cf6", "groups")}
            {renderChart(data.quoteGrowth, "Quotes", "#8b5cf6", "quotes")}
        </div>
    );
}
