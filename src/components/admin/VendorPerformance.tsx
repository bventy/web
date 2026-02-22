import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award } from "lucide-react";

export interface TopVendor {
    id: string;
    business_name: string;
    city: string;
    category: string;
    shortlists: number;
}

export interface VendorPerformanceData {
    topShortlisted: TopVendor[];
    topViewed: any[];
}

export function VendorPerformance({ data, loading }: { data?: VendorPerformanceData; loading: boolean }) {
    if (loading) {
        return (
            <Card className="animate-pulse flex flex-col">
                <CardHeader><div className="h-5 w-48 bg-muted rounded"></div></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-full bg-muted/50 rounded"></div>)}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Top Performing Vendors
                </CardTitle>
                <CardDescription>Vendors with the most shortlists</CardDescription>
            </CardHeader>
            <CardContent>
                {(!data.topShortlisted || data.topShortlisted.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">No data available</div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Business Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead className="text-right">Shortlists</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.topShortlisted.map((vendor) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell className="font-medium">{vendor.business_name}</TableCell>
                                        <TableCell className="capitalize">{vendor.category}</TableCell>
                                        <TableCell>{vendor.city}</TableCell>
                                        <TableCell className="text-right font-semibold">{vendor.shortlists}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
