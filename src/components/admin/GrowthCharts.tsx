import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
            <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse border-none shadow-sm bg-card/50">
                        <CardHeader>
                            <div className="h-6 w-40 bg-muted rounded-full"></div>
                        </CardHeader>
                        <CardContent className="h-[400px] flex items-center justify-center">
                            <div className="w-full h-full bg-muted/30 rounded-2xl"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) return null;

    const renderChart = (chartData: GrowthDataPoint[], title: string, color: string, id: string) => {
        const granularity = data.granularity || 'day';

        const formatDate = (val: string) => {
            const date = new Date(val);
            if (granularity === 'month') {
                return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }
            if (granularity === 'week') {
                return `W${Math.ceil(date.getDate() / 7)} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
            }
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        };

        return (
            <Card className="flex flex-col border-none shadow-xl bg-gradient-to-br from-card to-muted/20 overflow-hidden group">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[400px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                            <defs>
                                <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                allowDecimals={false}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ stroke: color, strokeWidth: 1 }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    border: '1px solid hsl(var(--border))'
                                }}
                                labelFormatter={(val) => new Date(val).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                itemStyle={{ color: color, fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke={color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#gradient-${id})`}
                                animationDuration={1500}
                                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            {renderChart(data.userGrowth, "User Growth", "#3b82f6", "users")}
            {renderChart(data.vendorGrowth, "Vendor Growth", "#10b981", "vendors")}
            {renderChart(data.eventGrowth, "Event Creation", "#f59e0b", "events")}
            {renderChart(data.quoteGrowth, "Quote Requests", "#8b5cf6", "quotes")}
        </div>
    );
}
