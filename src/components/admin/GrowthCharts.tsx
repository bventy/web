import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface GrowthDataPoint {
    date: string;
    count: number;
}

export interface GrowthData {
    userGrowth: GrowthDataPoint[];
    vendorGrowth: GrowthDataPoint[];
    eventGrowth: GrowthDataPoint[];
}

export function GrowthCharts({ data, loading }: { data?: GrowthData; loading: boolean }) {
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-5 w-32 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent className="h-[250px] flex items-center justify-center">
                            <div className="w-full h-full bg-muted/50 rounded-lg"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) return null;

    const renderChart = (chartData: GrowthDataPoint[], title: string, color: string) => (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                            labelFormatter={(val) => new Date(val).toLocaleDateString()}
                        />
                        <Line type="monotone" name="Count" dataKey="count" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {renderChart(data.userGrowth, "User Growth (30d)", "hsl(var(--primary))")}
            {renderChart(data.vendorGrowth, "Vendor Growth (30d)", "hsl(var(--chart-2, 160 60% 45%))")}
            {renderChart(data.eventGrowth, "Event Creation (30d)", "hsl(var(--chart-3, 30 80% 55%))")}
        </div>
    );
}
