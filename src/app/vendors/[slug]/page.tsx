"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VendorProfile, vendorService } from "@/services/vendor";
import { eventService, Event } from "@/services/event";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, MapPin, BadgeCheck, MessageCircle, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Assuming sonner is installed, or use standard alert

export default function VendorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [vendor, setVendor] = useState<VendorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Shortlist state
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [shortlistLoading, setShortlistLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                if (typeof params.slug === "string") {
                    const data = await vendorService.getVendorBySlug(params.slug);
                    setVendor(data);
                }
            } catch (err) {
                console.error("Failed to fetch vendor", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchVendor();
        }
    }, [params.slug]);

    useEffect(() => {
        if (user && dialogOpen) {
            eventService.getEvents().then(setEvents).catch(console.error);
        }
    }, [user, dialogOpen]);

    const handleShortlist = async () => {
        if (!selectedEventId || !vendor) return;
        setShortlistLoading(true);
        try {
            await eventService.shortlistVendor(selectedEventId, vendor.id);
            setDialogOpen(false);
            // Ideally show a toast here
            alert("Vendor shortlisted successfully!");
        } catch (error) {
            console.error("Failed to shortlist", error);
            alert("Failed to shortlist vendor.");
        } finally {
            setShortlistLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold">Vendor Not Found</h1>
                    <p className="text-muted-foreground">The vendor you are looking for does not exist.</p>
                    <Button asChild variant="outline">
                        <Link href="/vendors">Back to Marketplace</Link>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Helper Banner for Context */}
                <div className="bg-muted/30 border-b">
                    <div className="container mx-auto px-4 py-2 text-sm text-muted-foreground">
                        <Link href="/vendors" className="hover:underline">Vendors</Link> / {vendor.category} / {vendor.business_name}
                    </div>
                </div>

                <div className="container mx-auto max-w-4xl px-4 py-12">

                    <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                        {/* Left Column: Details */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="outline" className="text-sm font-normal">{vendor.category}</Badge>
                                    {vendor.verified && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 gap-1">
                                            <BadgeCheck className="h-3 w-3" /> Verified
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight mb-2">{vendor.business_name}</h1>
                                <div className="flex items-center text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {vendor.city}
                                </div>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-xl font-semibold mb-2">About</h3>
                                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                                    {vendor.bio}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: CTA Card */}
                        <div className="space-y-6">
                            <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Contact Vendor</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Chat directly with the vendor on WhatsApp.
                                    </p>
                                    <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" size="lg" asChild>
                                        <a href={vendor.whatsapp_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                            <MessageCircle className="h-5 w-5" />
                                            Chat on WhatsApp
                                        </a>
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-2">
                                        Response time: Usually within 1 hour
                                    </p>
                                </div>

                                <div className="pt-4 border-t">
                                    <h3 className="font-semibold text-lg mb-1">Shortlist</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Save this vendor to one of your events.
                                    </p>
                                    {user ? (
                                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <Plus className="mr-2 h-4 w-4" /> Add to Event
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Shortlist Vendor</DialogTitle>
                                                    <DialogDescription>
                                                        Select an event to add <strong>{vendor.business_name}</strong> to.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <Select onValueChange={setSelectedEventId}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select an event" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {events.map((event) => (
                                                                <SelectItem key={event.id} value={event.id}>
                                                                    {event.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleShortlist} disabled={!selectedEventId || shortlistLoading}>
                                                        {shortlistLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                        Add to Shortlist
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="/auth/login?redirect=/vendors">Login to Shortlist</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
