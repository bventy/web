import { Card, CardContent, CardHeader, CardTitle  } from "@bventy/ui";
import { AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button  } from "@bventy/ui";

export function RiskSection({ pendingCount, loading }: { pendingCount: number; loading: boolean }) {
    if (loading) {
        return (
            <Card className="border-border/50 bg-background/50 animate-pulse">
                <CardHeader><div className="h-5 w-32 bg-muted rounded"></div></CardHeader>
                <CardContent><div className="h-16 w-full bg-muted/50 rounded"></div></CardContent>
            </Card>
        );
    }

    return (
        <Card className={pendingCount > 0 ? "border-orange-500/50 shadow-sm shadow-orange-500/10" : ""}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    Attention Required
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium">Pending Vendor Approvals</p>
                            <p className="text-sm text-muted-foreground">
                                {pendingCount} vendor{pendingCount !== 1 && "s"} waiting for review
                            </p>
                        </div>
                    </div>
                    {pendingCount > 0 && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/vendors">Review Now</Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
