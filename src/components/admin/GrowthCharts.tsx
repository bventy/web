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
    userGrowth: GrowthDetail;
    vendorGrowth: GrowthDetail;
    eventGrowth: GrowthDetail;
    quoteGrowth: GrowthDetail;
    granularity?: 'day' | 'week' | 'month';
}

export function GrowthCharts({ data, loading }: { data?: GrowthData; loading: boolean }) {
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse border-none shadow-sm bg-card/50">
                        <CardHeader className="pb-2">
                            <div className="h-5 w-24 bg-muted rounded-full"></div>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                            <div className="w-full h-full bg-muted/30 rounded-xl"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) return null;

    const renderChart = (detail: GrowthDetail, title: string, color: string, id: string) => {
        const granularity = data.granularity || 'day';
        const chartData = detail.series;

        // Calculate Trend based on backend numbers
        const past = detail.new_past_30_days;
        const prev = detail.new_previous_30_days;
        let trend = 0;
        if (prev > 0) {
            trend = Math.round(((past - prev) / prev) * 100);
        } else if (past > 0) {
            trend = 100;
        }

        const status = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';

        const formatDate = (val: string) => {
            const date = new Date(val);
            if (granularity === 'month') return date.toLocaleDateString('en-US', { month: 'short' });
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        };

        return (
            <Card className="flex flex-col border-none shadow-sm bg-card hover:shadow-md transition-all duration-300 overflow-hidden ring-1 ring-border/50">
                <CardHeader className="pb-0 pt-5 px-5">
                    <CardTitle className="text-[13px] font-medium text-muted-foreground/80 flex justify-between items-center tracking-tight">
                        {title}
                        <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">{granularity}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="px-5 pt-3">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold tracking-tight text-foreground">{detail.total_all_time.toLocaleString()}</h3>
                            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                +{detail.new_past_30_days} this month
                            </span>
                        </div>
                    </div>

                    <div className="h-[120px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" hide />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '10px',
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
                                    animationDuration={1000}
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="px-5 pb-5 pt-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <div className={`p-1 rounded-full ${status === 'up' ? 'bg-emerald-500/10 text-emerald-500' :
                                    status === 'down' ? 'bg-rose-500/10 text-rose-500' : 'bg-muted text-muted-foreground'
                                }`}>
                                {status === 'up' && <TrendingUp className="h-3 w-3" />}
                                {status === 'down' && <TrendingDown className="h-3 w-3" />}
                                {status === 'neutral' && <Minus className="h-3 w-3" />}
                            </div>
                            <span className={status === 'up' ? 'text-emerald-500' : status === 'down' ? 'text-rose-500' : 'text-muted-foreground'}>
                                {trend > 0 ? `+${trend}%` : `${trend}%`}
                            </span>
                            <span className="text-muted-foreground/60 font-normal">vs last month</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {renderChart(data.userGrowth, "Users", "#3b82f6", "users")}
            {renderChart(data.vendorGrowth, "Vendors", "#10b981", "vendors")}
            {renderChart(data.eventGrowth, "Events", "#f59e0b", "events")}
            {renderChart(data.quoteGrowth, "Quotes", "#8b5cf6", "quotes")}
        </div>
    );
}
