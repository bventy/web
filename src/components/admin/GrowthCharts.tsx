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

        const status = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
        const diff = past - prev;

        const formatDate = (val: string) => {
            const date = new Date(val);
            if (granularity === 'month') return date.toLocaleDateString('en-US', { month: 'short' });
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        };

        const dataMax = Math.max(...chartData.map(d => d.count), 0);

        // Ensure we have at least 2 points and they are valid
        let displayData = chartData;
        if (!displayData || displayData.length < 2) {
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            displayData = [
                { date: thirtyDaysAgo.toISOString(), count: 0 },
                { date: now.toISOString(), count: 0 }
            ];
        }

        return (
            <Card className="flex flex-col border-none shadow-sm bg-card hover:shadow-md transition-all duration-300 overflow-hidden ring-1 ring-border/50 h-[300px] group">
                <CardHeader className="pb-0 pt-2 px-5">
                    <CardTitle className="text-[13px] font-bold text-muted-foreground/80 flex justify-between items-center tracking-wide uppercase">
                        {title}
                        <span className="text-[9px] font-bold text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded uppercase tracking-widest">
                            {granularity}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col relative">
                    <div className="px-5 pt-0">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-extrabold tracking-tighter text-foreground leading-none">
                                {total.toLocaleString()}
                            </h3>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded ${status === 'up' ? 'text-emerald-600 bg-emerald-50' :
                                    status === 'down' ? 'text-rose-600 bg-rose-50' : 'text-muted-foreground/60 bg-muted/30'
                                    }`}>
                                    {status === 'up' && <TrendingUp className="h-3 w-3" />}
                                    {status === 'down' && <TrendingDown className="h-3 w-3" />}
                                    {trend > 0 ? `+${trend}%` : `${trend}%`}
                                </div>
                                <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-tighter">this month</span>
                            </div>
                            <span className="text-[12px] font-bold text-muted-foreground/60">
                                {diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '0'}
                            </span>
                        </div>
                    </div>

                    <div className="h-[160px] w-full mt-auto relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayData} margin={{ top: 0, right: 0, bottom: 5, left: 0 }}>
                                <defs>
                                    <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} stroke="#888" />
                                <XAxis dataKey="date" hide />
                                <YAxis hide domain={[-1, dataMax === 0 ? 10 : 'auto']} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '10px',
                                        fontSize: '11px',
                                        padding: '6px 10px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        border: '1px solid hsl(var(--border)/0.5)',
                                    }}
                                    labelFormatter={(val) => formatDate(val as string)}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke={color}
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${id})`}
                                    animationDuration={dataMax === 0 ? 0 : 1500}
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>

                        <div className="absolute bottom-2 left-0 right-0 px-5 flex justify-between items-center text-muted-foreground/40 font-bold pointer-events-none">
                            <span className="text-[9px] uppercase tracking-widest">
                                {displayData[0]?.date ? formatDate(displayData[0].date) : ''}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest">
                                {displayData[displayData.length - 1]?.date ? formatDate(displayData[displayData.length - 1].date) : ''}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {renderChart(data.userGrowth, "Users", "#3b82f6", "users")}
            {renderChart(data.vendorGrowth, "Vendors", "#0ea5e9", "vendors")}
            {renderChart(data.groupGrowth, "Groups", "#ec4899", "groups")}
            {renderChart(data.completedEventGrowth, "Completed Events", "#6366f1", "completed")}
            {renderChart(data.verifiedVendorGrowth, "Verified Vendors", "#10b981", "verified")}
            {renderChart(data.pendingVendorGrowth, "Pending Vendors", "#f59e0b", "pending")}
            {renderChart(data.eventGrowth, "Total Events", "#8b5cf6", "events")}
            {renderChart(data.quoteGrowth, "Quotes", "#f43f5e", "quotes")}
        </div>
    );
}
