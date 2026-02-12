import Link from "next/link";
import { VendorProfile } from "@/services/vendor";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VendorCardProps {
    vendor: VendorProfile;
}

export function VendorCard({ vendor }: VendorCardProps) {
    return (
        <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video w-full bg-muted/50 dark:bg-muted/20" /> {/* Placeholder for image */}
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="line-clamp-1">{vendor.business_name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {vendor.city}
                        </CardDescription>
                    </div>
                    {vendor.verified && (
                        <Badge variant="secondary" className="flex gap-1 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <Badge variant="outline" className="mb-2">{vendor.category}</Badge>
                <p className="line-clamp-2 text-sm text-muted-foreground">{vendor.bio}</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/vendors/${vendor.slug}`}>View Profile</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
