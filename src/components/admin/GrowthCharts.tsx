import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface GrowthDataPoint {
    date: string;
    count: number;
}

export interface GrowthData {
    userGrowth: GrowthDataPoint[];
    vendorGrowth: GrowthDataPoint[];
    eventGrowth: GrowthDataPoint[];
    quoteGrowth: GrowthDataPoint[];
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

    const calculateStats = (chartData: GrowthDataPoint[]) => {
        if (chartData.length < 2) return { total: 0, trend: 0, status: 'neutral' as const };

        const total = chartData.reduce((sum, p) => sum + p.count, 0);
        const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
        const secondHalf = chartData.slice(Math.floor(chartData.length / 2));

        const firstSum = firstHalf.reduce((sum, p) => sum + p.count, 0);
        const secondSum = secondHalf.reduce((sum, p) => sum + p.count, 0);

        let trend = 0;
        if (firstSum > 0) {
            trend = Math.round(((secondSum - firstSum) / firstSum) * 100);
        } else if (secondSum > 0) {
            trend = 100;
        }

        return {
            total,
            trend,
            status: trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral' as const
        };
    };

    const renderChart = (chartData: GrowthDataPoint[], title: string, color: string, id: string) => {
        const granularity = data.granularity || 'day';
        const stats = calculateStats(chartData);

        const formatDate = (val: string) => {
            const date = new Date(val);
            if (granularity === 'month') return date.toLocaleDateString('en-US', { month: 'short' });
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        };

        return (
            <Card className="flex flex-col border-none shadow-md bg-card/50 hover:shadow-lg transition-all duration-300 overflow-hidden border border-border/50">
                <CardHeader className="pb-0 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold text-muted-foreground flex justify-between items-center">
                        {title}
                        <span className="text-xs font-normal opacity-50 uppercase tracking-wider">{granularity}ly</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="h-[180px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                                <defs>
                                    <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
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
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        padding: '4px 8px'
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
                    <div className="px-4 pb-4 pt-2 border-t border-border/30 bg-muted/5">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-bold tracking-tight">{stats.total}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">Total period</p>
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stats.status === 'up' ? 'text-emerald-500' :
                                    stats.status === 'down' ? 'text-rose-500' : 'text-muted-foreground'
                                }`}>
                                {stats.status === 'up' && <TrendingUp className="h-3 w-3" />}
                                {stats.status === 'down' && <TrendingDown className="h-3 w-3" />}
                                {stats.status === 'neutral' && <Minus className="h-3 w-3" />}
                                {stats.trend > 0 ? `+${stats.trend}%` : `${stats.trend}%`}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {renderChart(data.userGrowth, "Users", "#3b82f6", "users")}
            {renderChart(data.vendorGrowth, "Vendors", "#10b981", "vendors")}
            {renderChart(data.eventGrowth, "Events", "#f59e0b", "events")}
            {renderChart(data.quoteGrowth, "Quotes", "#8b5cf6", "quotes")}
        </div>
    );
}
