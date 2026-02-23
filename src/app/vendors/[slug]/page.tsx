"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VendorProfile, vendorService } from "@/services/vendor";
import { eventService, Event } from "@/services/event";
import { quoteService } from "@/services/quote";
import { trackService } from "@/services/track";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, MapPin, BadgeCheck, MessageCircle, Plus, Check, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    SelectSeparator,
} from "@/components/ui/select";
import { toast } from "sonner"; // Assuming sonner is installed, or use standard alert
import { InlineCreateEventForm } from "@/components/events/InlineCreateEventForm";
import { ReviewSection } from "@/components/vendor/ReviewSection";
import { Star } from "lucide-react";

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

    // Quote state
    const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [quoteMessage, setQuoteMessage] = useState("");
    const [quoteBudget, setQuoteBudget] = useState("");
    const [myQuotes, setMyQuotes] = useState<any[]>([]);

    const [isCreatingEventInQuote, setIsCreatingEventInQuote] = useState(false);
    const [isCreatingEventInShortlist, setIsCreatingEventInShortlist] = useState(false);

    // New Quote fields
    const [specialRequirements, setSpecialRequirements] = useState("");
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                if (typeof params.slug === "string") {
                    const data = await vendorService.getVendorBySlug(params.slug);
                    setVendor(data);
                    trackService.trackVendorView(data.id);
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
        if (user && (dialogOpen || quoteDialogOpen)) {
            eventService.getEvents().then(setEvents).catch(console.error);
        }
    }, [user, dialogOpen, quoteDialogOpen]);

    useEffect(() => {
        if (user) {
            quoteService.getMyQuotes().then(setMyQuotes).catch(console.error);
        }
    }, [user]);



    useEffect(() => {
        if (selectedEventId) {
            const ev = events.find(e => e.id === selectedEventId);
            if (ev) {
                setQuoteBudget(`₹${ev.budget_min} - ₹${ev.budget_max}`);
            }
        }
    }, [selectedEventId, events]);

    const handleQuoteRequest = async () => {
        if (!selectedEventId || !vendor) return;
        setQuoteLoading(true);
        try {
            console.log("Sending quote request:", {
                vendor_id: vendor.id,
                event_id: selectedEventId,
                budget_range: quoteBudget || "Not specified",
                message: quoteMessage
            });
            await quoteService.requestQuote({
                vendor_id: vendor.id,
                event_id: selectedEventId,
                budget_range: quoteBudget || "Not specified",
                message: quoteMessage,
                special_requirements: specialRequirements,
                deadline: deadline || undefined
            });
            setQuoteDialogOpen(false);
            setQuoteMessage("");
            toast.success("Quote request sent successfully!");
            // Refresh quotes after request
            quoteService.getMyQuotes().then(setMyQuotes).catch(console.error);
        } catch (error: any) {
            console.error("Failed to request quote", error);
            const errMsg = error.response?.data?.error || "Failed to send quote request.";
            toast.error(errMsg);
        } finally {
            setQuoteLoading(false);
        }
    };

    const handleShortlist = async () => {
        if (!selectedEventId || !vendor) return;
        setShortlistLoading(true);
        try {
            await eventService.shortlistVendor(selectedEventId, vendor.id);
            setDialogOpen(false);
            toast.success("Vendor shortlisted successfully!");
        } catch (error) {
            console.error("Failed to shortlist", error);
            toast.error("Failed to shortlist vendor.");
        } finally {
            setShortlistLoading(false);
        }
    };

    const handleEventCreatedInQuote = (eventId: string) => {
        setIsCreatingEventInQuote(false);
        eventService.getEvents().then((newEvents) => {
            setEvents(newEvents);
            setSelectedEventId(eventId);
            toast.success("Event created successfully! You can now request a quote.");
        }).catch(console.error);
    };

    const handleEventCreatedInShortlist = (eventId: string) => {
        setIsCreatingEventInShortlist(false);
        eventService.getEvents().then((newEvents) => {
            setEvents(newEvents);
            setSelectedEventId(eventId);
            toast.success("Event created successfully! You can now shortlist this vendor.");
        }).catch(console.error);
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
                        <div className="space-y-8">
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
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1 text-primary" />
                                        {vendor.city}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="ml-1 font-bold text-foreground">
                                                {vendor.average_rating > 0 ? vendor.average_rating.toFixed(1) : "N/A"}
                                            </span>
                                        </div>
                                        <span className="text-sm">({vendor.review_count} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-xl font-semibold mb-2">About</h3>
                                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                                    {vendor.bio}
                                </p>
                            </div>

                            {/* Gallery Section */}
                            {vendor.gallery_images && vendor.gallery_images.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {vendor.gallery_images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src={img}
                                                    alt={`${vendor.business_name} gallery ${idx + 1}`}
                                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Portfolio Section */}
                            {vendor.portfolio_files && vendor.portfolio_files.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Portfolio & Documents</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vendor.portfolio_files.map((file: any, idx) => (
                                            <a
                                                key={idx}
                                                href={file.file_url || file.url} // Handle various possible structures
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                                            >
                                                <div className="h-10 w-10 rounded bg-red-50 text-red-600 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{file.title || file.name || `Document ${idx + 1}`}</p>
                                                    <p className="text-xs text-muted-foreground">PDF Document</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Review Section */}
                            <ReviewSection vendorId={vendor.id} vendorName={vendor.business_name} />
                        </div>

                        {/* Right Column: CTA Card */}
                        <div className="space-y-6">
                            <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Request Quote</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Get a customized pricing quote for your event.
                                    </p>

                                    {user ? (
                                        <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="w-full mb-3" size="lg">
                                                    <FileText className="mr-2 h-5 w-5" /> Request Quote
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className={isCreatingEventInQuote ? "sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto" : "sm:max-w-[425px]"}>
                                                <DialogHeader>
                                                    <DialogTitle>Request a Quote</DialogTitle>
                                                    <DialogDescription>
                                                        Provide details so <strong>{vendor.business_name}</strong> can give you an accurate estimate.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {isCreatingEventInQuote ? (
                                                    <div className="py-4 border rounded-md p-4 bg-muted/20">
                                                        <h4 className="font-semibold mb-3">Create New Event</h4>
                                                        <InlineCreateEventForm
                                                            onSuccess={handleEventCreatedInQuote}
                                                            onCancel={() => setIsCreatingEventInQuote(false)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="py-4 space-y-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label>Select Event</Label>
                                                            </div>
                                                            <Select onValueChange={setSelectedEventId} value={selectedEventId}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Which event is this for?" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <div
                                                                        className="flex items-center text-sm px-2 py-1.5 cursor-pointer text-primary hover:bg-muted font-medium transition-colors"
                                                                        onClick={() => setIsCreatingEventInQuote(true)}
                                                                    >
                                                                        <Plus className="h-4 w-4 mr-2" />
                                                                        Create new event
                                                                    </div>
                                                                    <SelectSeparator />
                                                                    {events.map((event) => (
                                                                        <SelectItem key={event.id} value={event.id}>
                                                                            {event.title} - {new Date(event.event_date).toLocaleDateString()}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Budget Range (Prefilled from event)</Label>
                                                            <Input
                                                                placeholder="e.g. ₹50,000 - ₹1,00,000"
                                                                value={quoteBudget}
                                                                onChange={(e) => setQuoteBudget(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Special Requirements (Optional)</Label>
                                                            <Textarea
                                                                placeholder="e.g. Stage size, specific equipment, dietary needs..."
                                                                value={specialRequirements}
                                                                onChange={(e) => setSpecialRequirements(e.target.value)}
                                                                rows={2}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Response Deadline (Optional)</Label>
                                                            <Input
                                                                type="date"
                                                                value={deadline}
                                                                onChange={(e) => setDeadline(e.target.value)}
                                                            />
                                                            <p className="text-[10px] text-muted-foreground">When do you need a response by?</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label>Additional Message <span className="text-red-500">*</span></Label>
                                                            </div>
                                                            <Textarea
                                                                placeholder="Tell the vendor more about your requirements..."
                                                                value={quoteMessage}
                                                                onChange={(e) => setQuoteMessage(e.target.value)}
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {!isCreatingEventInQuote && (
                                                    <DialogFooter>
                                                        <Button
                                                            onClick={handleQuoteRequest}
                                                            disabled={!selectedEventId || !quoteMessage.trim() || quoteLoading}
                                                        >
                                                            {quoteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            Send Request
                                                        </Button>
                                                    </DialogFooter>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <Button className="w-full mb-3" size="lg" asChild>
                                            <Link href="/auth/login?redirect=/vendors">Login to Request Quote</Link>
                                        </Button>
                                    )}

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
                                            <DialogContent className={isCreatingEventInShortlist ? "sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto" : "sm:max-w-[425px]"}>
                                                <DialogHeader>
                                                    <DialogTitle>Shortlist Vendor</DialogTitle>
                                                    <DialogDescription>
                                                        Select an event to add <strong>{vendor.business_name}</strong> to.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {isCreatingEventInShortlist ? (
                                                    <div className="py-4 border rounded-md p-4 bg-muted/20">
                                                        <h4 className="font-semibold mb-3">Create New Event</h4>
                                                        <InlineCreateEventForm
                                                            onSuccess={handleEventCreatedInShortlist}
                                                            onCancel={() => setIsCreatingEventInShortlist(false)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="py-4">
                                                        <Select onValueChange={setSelectedEventId} value={selectedEventId}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select an event" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <div
                                                                    className="flex items-center text-sm px-2 py-1.5 cursor-pointer text-primary hover:bg-muted font-medium transition-colors"
                                                                    onClick={() => setIsCreatingEventInShortlist(true)}
                                                                >
                                                                    <Plus className="h-4 w-4 mr-2" />
                                                                    Create new event
                                                                </div>
                                                                <SelectSeparator />
                                                                {events.map((event) => (
                                                                    <SelectItem key={event.id} value={event.id}>
                                                                        {event.title}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                                {!isCreatingEventInShortlist && (
                                                    <DialogFooter>
                                                        <Button onClick={handleShortlist} disabled={!selectedEventId || shortlistLoading}>
                                                            {shortlistLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            Add to Shortlist
                                                        </Button>
                                                    </DialogFooter>
                                                )}
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
            </main >
            <Footer />
        </div >
    );
}
