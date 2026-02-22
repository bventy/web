import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Store, Eye, MessageCircle, Heart, FileText, Clock } from "lucide-react";

export interface VendorStat {
    id: string;
    business_name: string;
    category?: string;
    city?: string;
    view_count?: number;
    request_count?: number;
    acceptance_rate?: number;
}

export interface MarketplaceData {
    most_viewed_vendors: VendorStat[];
    most_requested_vendors: VendorStat[];
    highest_acceptance_rate_vendors: VendorStat[];
    average_response_time: string;
}

export function MarketplaceAnalytics({ data, loading }: { data?: MarketplaceData; loading: boolean }) {
    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-5 w-40 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map(j => (
                                    <div key={j} className="h-10 w-full bg-muted rounded"></div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) return null;

    const renderTable = (vendors: VendorStat[], title: string, icon: React.ReactNode, valueLabel: string, type: 'number' | 'percentage' = 'number') => (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        {icon}
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {vendors && vendors.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">{valueLabel}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.map((vendor) => {
                                    const value = vendor.view_count || vendor.request_count || (vendor.acceptance_rate !== undefined ? vendor.acceptance_rate : 0);
                                    return (
                                        <TableRow key={vendor.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Store className="h-4 w-4 text-muted-foreground" />
                                                    {vendor.business_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{vendor.category || "-"}</TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {type === 'percentage'
                                                    ? `${(Number(value) * 100).toFixed(1)}%`
                                                    : value}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                        <Store className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">No data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Avg. Vendor Response Time</p>
                            <h3 className="text-2xl font-bold">{data.average_response_time || "N/A"}</h3>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground max-w-[200px] text-right">
                        Calculated from initial request to first vendor response.
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {renderTable(data.most_viewed_vendors, "Most Viewed Vendors", <Eye className="h-4 w-4 text-blue-500" />, "Views")}
                {renderTable(data.most_requested_vendors, "Most Requested Vendors", <FileText className="h-4 w-4 text-purple-500" />, "Quotes")}
                {renderTable(data.highest_acceptance_rate_vendors, "Best Acceptance Rates", <Store className="h-4 w-4 text-emerald-500" />, "Rate", "percentage")}
            </div>
        </div>
    );
}
