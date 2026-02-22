import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface EventBreakdownData {
    status: { name: string; value: number }[];
    byCity: { city: string; count: number }[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"];

export function EventBreakdown({ data, loading }: { data?: EventBreakdownData; loading: boolean }) {
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="animate-pulse flex flex-col">
                    <CardHeader><div className="h-5 w-40 bg-muted rounded"></div></CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center"><div className="w-48 h-48 rounded-full bg-muted/50"></div></CardContent>
                </Card>
                <Card className="animate-pulse flex flex-col">
                    <CardHeader><div className="h-5 w-40 bg-muted rounded"></div></CardHeader>
                    <CardContent className="h-[300px]"><div className="w-full h-full bg-muted/50 rounded-lg"></div></CardContent>
                </Card>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Events by Status</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px] flex flex-col">
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.status}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.status.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {data.status.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-sm text-muted-foreground">{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Top Events by City</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.byCity} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="city" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                            <Bar dataKey="count" name="Events" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
