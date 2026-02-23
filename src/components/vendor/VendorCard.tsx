import Link from "next/link";
import { VendorProfile } from "@/services/vendor";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Store, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VendorCardProps {
    vendor: VendorProfile;
}

export function VendorCard({ vendor }: VendorCardProps) {
    const images = vendor.gallery_images || [];
    const coverImage = images.length > 0 ? images[0] : null;

    // Brand Image Fallback Hierarchy: uploaded brand -> personal profile -> initials
    const brandImage = vendor.portfolio_image_url || vendor.owner_profile_image;
    const initials = (vendor.owner_full_name || vendor.business_name || "V").charAt(0).toUpperCase();

    return (
        <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md group">
            {/* Cover Image */}
            <div className="relative aspect-video w-full bg-muted/50 dark:bg-muted/20 overflow-hidden">
                {coverImage ? (
                    <Image
                        src={coverImage}
                        alt={vendor.business_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
                        <Store className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                )}
            </div>

            <CardHeader className="pb-3 border-b border-muted/30">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Profile Image */}
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-full border-2 border-background overflow-hidden shadow-sm bg-muted ring-1 ring-muted">
                            {brandImage ? (
                                <Image
                                    src={brandImage}
                                    alt={vendor.business_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-xs font-bold text-muted-foreground">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <CardTitle className="text-base line-clamp-1 truncate">{vendor.business_name}</CardTitle>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {vendor.city}
                                </div>
                                {vendor.review_count > 0 && (
                                    <div className="flex items-center gap-1 text-xs">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold">{vendor.average_rating.toFixed(1)}</span>
                                        <span className="text-muted-foreground">({vendor.review_count})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-medium">{vendor.category}</Badge>
                    {vendor.verified && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 px-2 py-0.5 bg-green-50 dark:bg-green-950/30 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            VERIFIED
                        </div>
                    )}
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                    {vendor.bio || "No bio available."}
                </p>
            </CardContent>
            <CardFooter className="pt-0">
                <Button asChild className="w-full font-semibold" variant="outline">
                    <Link href={`/vendors/${vendor.slug}`}>View Profile</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
