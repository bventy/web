import { Card, CardContent, CardHeader, CardTitle  } from "@bventy/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow  } from "@bventy/ui";
import { Store, Eye, MessageCircle, Heart, FileText } from "lucide-react";

export interface VendorStat {
    id: string;
    business_name: string;
    category: string;
    city: string;
    value: number; // The view count, contact count, shortlist count, or quote count
}

export interface MarketplaceData {
    most_viewed: VendorStat[];
    most_contacted: VendorStat[];
    most_shortlisted: VendorStat[];
    top_quoted: VendorStat[];
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

    const renderTable = (vendors: VendorStat[], title: string, icon: React.ReactNode, valueLabel: string) => (
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
                                {vendors.map((vendor) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Store className="h-4 w-4 text-muted-foreground" />
                                                {vendor.business_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{vendor.category}</TableCell>
                                        <TableCell className="text-right font-semibold">{vendor.value}</TableCell>
                                    </TableRow>
                                ))}
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
        <div className="grid gap-6 md:grid-cols-2">
            {renderTable(data.most_viewed, "Most Viewed Vendors", <Eye className="h-4 w-4 text-blue-500" />, "Views")}
            {renderTable(data.most_contacted, "Most Contacted", <MessageCircle className="h-4 w-4 text-green-500" />, "Contacts")}
            {renderTable(data.most_shortlisted, "Most Shortlisted", <Heart className="h-4 w-4 text-red-500" />, "Shortlists")}
            {renderTable(data.top_quoted, "Top Quoted Vendors", <FileText className="h-4 w-4 text-purple-500" />, "Quotes")}
        </div>
    );
}
