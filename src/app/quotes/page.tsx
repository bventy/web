"use client";

import { useEffect, useState } from "react";
import { quoteService, Quote } from "@/services/quote";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ReceiptText, Check, X, ArrowLeft, Eye, RefreshCcw, Download, Clock, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function MyQuotesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const openDetails = (quote: any) => {
        setSelectedQuote(quote);
        setIsDetailsOpen(true);
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
            return;
        }

        if (user) {
            fetchQuotes();
        }
    }, [user, authLoading, router]);

    const fetchQuotes = async () => {
        try {
            const data = await quoteService.getMyQuotes();
            setQuotes(data);
        } catch (error) {
            console.error("Failed to fetch quotes", error);
            toast.error("Failed to load quotes.");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id: string) => {
        setActionLoading(id + "-accept");
        try {
            await quoteService.acceptQuote(id);
            toast.success("Quote accepted successfully!");
            setIsDetailsOpen(false);
            await fetchQuotes();
        } catch (error) {
            console.error(error);
            toast.error("Failed to accept quote.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id + "-reject");
        try {
            await quoteService.rejectQuote(id);
            toast.success("Quote rejected.");
            setIsDetailsOpen(false);
            await fetchQuotes();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject quote.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRequestRevision = async (id: string) => {
        setActionLoading(id + "-revision");
        try {
            await quoteService.requestRevision(id);
            toast.success("Revision requested.");
            setIsDetailsOpen(false);
            await fetchQuotes();
        } catch (error) {
            console.error(error);
            toast.error("Failed to request revision.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDownloadAttachment = async (id: string) => {
        try {
            const url = await quoteService.getAttachmentSignedUrl(id);
            window.open(url, "_blank");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download attachment.");
        }
    };

    if (authLoading || loading) {
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

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Quotes</h1>
                        <p className="text-muted-foreground">Manage quotes you have requested from vendors.</p>
                    </div>
                </div>

                <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
                    {quotes.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center text-center p-8 animate-in fade-in-50">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <ReceiptText className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No Quotes Found</h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                                You haven&apos;t requested any quotes from vendors yet.
                            </p>
                            <Button asChild>
                                <Link href="/vendors">Find Vendors</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Requested Budget</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Quoted Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quotes.map((quote) => {
                                        const vendorName = quote.vendor_name || quote.vendor_id;
                                        const eventTitle = quote.event_title || quote.event_id;

                                        return (
                                            <TableRow key={quote.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(quote)}>
                                                <TableCell className="font-medium">{vendorName}</TableCell>
                                                <TableCell>{eventTitle}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                    {quote.budget_range || "-"}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                                    {quote.created_at ? new Date(quote.created_at).toLocaleDateString() : '-'}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {quote.quoted_price ? `₹${quote.quoted_price}` : 'Pending response'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            quote.status === 'accepted' ? 'default' :
                                                                quote.status === 'rejected' ? 'destructive' :
                                                                    (quote.status === 'quoted' || quote.status === 'responded') ? 'secondary' :
                                                                        quote.status === 'revision_requested' ? 'outline' : 'outline'
                                                        }
                                                        className="capitalize"
                                                    >
                                                        {quote.status === 'revision_requested' ? 'Revision Pending' : quote.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" variant="ghost" className="h-8 shadow-none" onClick={(e) => { e.stopPropagation(); openDetails(quote); }}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Quote Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Quote Details</DialogTitle>
                            <DialogDescription>
                                Review the quote response from the vendor.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedQuote && (
                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Vendor</p>
                                        <p className="font-medium">{selectedQuote.vendor_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Event</p>
                                        <p className="font-medium">{selectedQuote.event_title}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Your Message</p>
                                    <div className="bg-muted p-3 flex rounded-md text-sm whitespace-pre-wrap">
                                        {selectedQuote.message || "No message provided."}
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-base">Vendor Response</h4>
                                        <Badge
                                            variant={
                                                selectedQuote.status === 'accepted' ? 'default' :
                                                    selectedQuote.status === 'rejected' ? 'destructive' :
                                                        (selectedQuote.status === 'quoted' || selectedQuote.status === 'responded') ? 'secondary' : 'outline'
                                            }
                                            className="capitalize"
                                        >
                                            {selectedQuote.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        {selectedQuote.special_requirements && (
                                            <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-md text-sm border border-orange-100 dark:border-orange-900/30">
                                                <p className="font-semibold mb-1 text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
                                                    <AlertCircle className="h-3.5 w-3.5" /> Special Requirements:
                                                </p>
                                                <p>{selectedQuote.special_requirements}</p>
                                            </div>
                                        )}
                                        {selectedQuote.deadline && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>Requested Deadline: {new Date(selectedQuote.deadline).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-base">Vendor Response</h4>
                                    </div>

                                    {(selectedQuote.status === 'pending' || selectedQuote.status === 'revision_requested') ? (
                                        <p className="text-sm text-muted-foreground italic mt-2">
                                            {selectedQuote.status === 'revision_requested'
                                                ? "Waiting for vendor to provide revised quote..."
                                                : "The vendor has not responded yet."}
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Budget Requested</p>
                                                    <p className="font-semibold">{selectedQuote.budget_range || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Quoted Price</p>
                                                    <p className="font-semibold text-primary">{selectedQuote.quoted_price ? `₹${selectedQuote.quoted_price}` : 'Pending'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Message from Vendor</p>
                                                <div className="bg-primary/5 border border-primary/20 p-3 rounded-md text-sm whitespace-pre-wrap">
                                                    {selectedQuote.response || "No response details provided."}
                                                </div>
                                            </div>

                                            {selectedQuote.attachment_url && (
                                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-dashed">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-500" />
                                                        <span className="text-sm font-medium">Quote Attachment</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDownloadAttachment(selectedQuote.id)}>
                                                        <Download className="h-4 w-4 mr-2" /> Download
                                                    </Button>
                                                </div>
                                            )}
                                            {selectedQuote.responded_at && (
                                                <p className="text-xs text-muted-foreground">
                                                    Responded on {new Date(selectedQuote.responded_at).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {(selectedQuote?.status === 'quoted' || selectedQuote?.status === 'responded') && (
                            <DialogFooter className="grid grid-cols-3 gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!!actionLoading}
                                    onClick={() => handleReject(selectedQuote.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    {actionLoading === selectedQuote.id + "-reject" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                                    Reject
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!!actionLoading}
                                    onClick={() => handleRequestRevision(selectedQuote.id)}
                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                >
                                    {actionLoading === selectedQuote.id + "-revision" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
                                    Ask Revision
                                </Button>
                                <Button
                                    type="button"
                                    disabled={!!actionLoading}
                                    onClick={() => handleAccept(selectedQuote.id)}
                                >
                                    {actionLoading === selectedQuote.id + "-accept" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                    Accept
                                </Button>
                            </DialogFooter>
                        )}
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
}
