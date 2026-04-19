"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge,
    Separator,
    Skeleton,
} from "@bventy/ui";
import {
    Calendar,
    MapPin,
    Users,
    ArrowLeft,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Info,
    Loader2,
    Mail,
    Phone,
    ExternalLink,
    Banknote
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { vendorService, quoteService, QuoteContact, getVendorUrl } from "@bventy/services";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@bventy/ui";

export default function LeadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isActioning, setIsActioning] = useState<string | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState<QuoteContact | null>(null);
    const [contactLoading, setContactLoading] = useState(false);

    const { data: lead, error, isLoading } = useSWR(
        id ? [`quote-detail`, id] : null,
        () => vendorService.getQuoteDetail(id)
    );

    const handleAction = async (action: 'confirm' | 'reject') => {
        setIsActioning(action);
        try {
            if (action === 'confirm') {
                await vendorService.confirmHold(id);
                toast.success("Availability confirmed!");
            } else {
                await vendorService.rejectHold(id);
                toast.success("Lead declined.");
            }
            mutate([`quote-detail`, id]);
            mutate("vendor-overview-stats");
            mutate("vendor-quotes");
        } catch (err) {
            console.error(`Failed to ${action} lead:`, err);
            toast.error(`Failed to ${action} lead`);
        } finally {
            setIsActioning(null);
        }
    };

    const handleViewContact = async () => {
        setIsContactOpen(true);
        setContactLoading(true);
        try {
            const data = await quoteService.getQuoteContact(id);
            setContactInfo(data);
        } catch (err: any) {
            console.error("Failed to fetch contact details:", err);
            toast.error(err.response?.data?.error || "Failed to fetch contact information");
            setIsContactOpen(false);
        } finally {
            setContactLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid gap-6 lg:grid-cols-3">
                    <Skeleton className="lg:col-span-2 h-[400px]" />
                    <Skeleton className="h-[400px]" />
                </div>
            </div>
        );
    }

    // Progressive approach: if lead is missing but no error, keep loading or skeleton
    // If error, show error but maybe we can still show a bit of UI?
    // For now, if we have NO lead, we show the error.
    if (!lead && error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <p className="text-muted-foreground font-medium">Unable to load lead details.</p>
                <p className="text-sm text-muted-foreground max-w-md text-center">There might be a temporary issue with this lead's data. Please try again or contact support if the issue persists.</p>
                <Button asChild variant="outline">
                    <Link href="/leads">Back to Leads</Link>
                </Button>
            </div>
        );
    }

    // Safety fallback for rendering parts even if API returned incomplete data
    const safeLead = lead || {
        id: id,
        status: "pending",
        is_premium: false,
        surcharge_details: null,
        event: { title: "Lead Details", event_date: null, city: "TBD", guest_count: null, event_type: null },
        organizer: { full_name: "Organizer" }
    };

    const statusLabel = (safeLead.status || "pending").replace(/_/g, " ");

    const timeline = [
        { status: "Lead Received", time: safeLead.created_at, active: true },
        safeLead.responded_at && { status: "Quote Submitted", time: safeLead.responded_at, active: true },
        safeLead.revision_requested_at && { status: "Revision Requested", time: safeLead.revision_requested_at, active: true },
        safeLead.accepted_at && { status: "Booking Confirmed", time: safeLead.accepted_at, active: true },
        safeLead.rejected_at && { status: "Lead Declined", time: safeLead.rejected_at, active: true },
        !safeLead.responded_at && safeLead.status === 'pending' && { status: "Awaiting Quote Submission", time: "Pending", active: false }
    ].filter(Boolean) as { status: string; time: string; active: boolean }[];

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{safeLead.event.title || "Untitled Event"}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Lead ID: #{safeLead.id.slice(0, 8).toUpperCase()}</span>
                        <span>•</span>
                        <Badge variant="outline" className="capitalize">
                            {statusLabel}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Summary */}
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Event Summary</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</p>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        {safeLead.event.event_date ? format(new Date(safeLead.event.event_date), "MMMM d, yyyy") : "TBD"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</p>
                                    <div className="flex items-center gap-2 font-medium">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {safeLead.event.city || "TBD"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Guests</p>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Users className="h-4 w-4 text-primary" />
                                        {safeLead.event.guest_count ? `Approx. ${safeLead.event.guest_count}` : "Not specified"}
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Description</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {safeLead.message || (safeLead.event.event_type ? `Request for ${safeLead.event.event_type}` : "No description provided.")}
                                </p>
                            </div>
                            {safeLead.is_premium && safeLead.surcharge_details && (
                                <>
                                    <Separator className="my-6" />
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                            <Banknote className="h-4 w-4 text-primary" /> Pricing Surcharges
                                        </h4>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {safeLead.surcharge_details.applied_rules.map((rule: string) => {
                                                const detail = safeLead.surcharge_details?.breakdown[rule === 'weekend_premium' ? 'weekend_premium' : 'last_minute_booking'];
                                                if (!detail) return null;
                                                return (
                                                    <div key={rule} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">
                                                                {rule === 'weekend_premium' ? 'Weekend Premium' : 'Last Minute Booking'}
                                                            </p>
                                                            <p className="text-sm font-medium">{detail.label} Applied</p>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] h-5">
                                                            Premium
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Lead Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {timeline.map((item, index) => (
                                    <div key={index} className="relative flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background z-10 ${item.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                {item.active ? <CheckCircle2 className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold">{item.status}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.time && item.time !== "Pending" ? format(new Date(item.time), "MMM d, h:mm a") : item.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Actions Card */}
                    <Card className="shadow-sm border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-sm">Manage Quote</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Button
                                className="w-full"
                                disabled={!!isActioning || (safeLead.status !== 'pending' && safeLead.status !== 'revision_requested' && safeLead.status !== 'accepted')}
                                onClick={() => safeLead.status === 'accepted' ? handleViewContact() : handleAction('confirm')}
                            >
                                {isActioning === 'confirm' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (safeLead.status === 'accepted' ? <ExternalLink className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />)}
                                {safeLead.status === 'pending' ? 'Confirm Availability' : (safeLead.status === 'accepted' ? 'View Organizer Contact' : 'Resubmit Quote')}
                            </Button>
                            <Button variant="outline" className="w-full" asChild disabled={!!isActioning}>
                                <Link href={safeLead.conversation_id ? `/messages?id=${safeLead.conversation_id}` : "/messages"}>
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message Organizer
                                </Link>
                            </Button>
                            <Separator className="my-2" />
                            <Button
                                variant="ghost"
                                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                                disabled={!!isActioning || safeLead.status === 'rejected'}
                                onClick={() => handleAction('reject')}
                            >
                                {isActioning === 'reject' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="mr-2 h-4 w-4" />}
                                Decline Lead
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Contact Dialog */}
                    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle>Organizer Contact Information</DialogTitle>
                                <DialogDescription>
                                    Direct communication unlocked with {contactInfo?.organizer.name} for {safeLead.event.title}
                                </DialogDescription>
                                {safeLead.contact_expires_at && (
                                    <div className="mt-2 text-[10px] font-semibold text-orange-600 uppercase tracking-tight">
                                        Access ends on {format(new Date(safeLead.contact_expires_at), "MMM d, yyyy h:mm a")}
                                    </div>
                                )}
                            </DialogHeader>

                            {contactLoading ? (
                                <div className="py-12 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : contactInfo ? (
                                <div className="space-y-6 py-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center p-3 border rounded-lg">
                                            <Phone className="h-5 w-5 text-primary mr-3" />
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground uppercase font-semibold">Phone Number</p>
                                                <a href={`tel:${contactInfo.organizer.phone}`} className="text-sm font-medium hover:underline">
                                                    {contactInfo.organizer.phone || "Not provided"}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-center p-3 border rounded-lg">
                                            <Mail className="h-5 w-5 text-primary mr-3" />
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground uppercase font-semibold">Email Address</p>
                                                <a href={`mailto:${contactInfo.organizer.email}`} className="text-sm font-medium hover:underline">
                                                    {contactInfo.organizer.email || "Not provided"}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Failed to load contact information.
                                </div>
                            )}
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsContactOpen(false)} className="w-full">
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Internal Notes */}
                    <InternalNotesCard quoteId={id} initialNotes={safeLead.internal_notes || ""} />
                </div>
            </div>
        </div>
    );
}

function InternalNotesCard({ quoteId, initialNotes }: { quoteId: string; initialNotes: string }) {
    const [notes, setNotes] = useState(initialNotes);
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when initialNotes changes (e.g. after SWR revalidation)
    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await vendorService.updateInternalNotes(quoteId, notes);
            toast.success("Notes saved successfully");
            mutate([`quote-detail`, quoteId]);
        } catch (err) {
            console.error("Failed to save notes:", err);
            toast.error("Failed to save notes");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-sm">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[120px] rounded-md border bg-transparent p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Add private notes for your team (not visible to organizer)..."
                />
                <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    disabled={isSaving || notes === initialNotes}
                    onClick={handleSave}
                >
                    {isSaving ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : "Save Note"}
                </Button>
            </CardContent>
        </Card>
    );
}

