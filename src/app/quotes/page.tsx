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
import { Loader2, ReceiptText, Check, X, ArrowLeft, Eye } from "lucide-react";
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
                                                                    quote.status === 'quoted' ? 'secondary' : 'outline'
                                                        }
                                                        className="capitalize"
                                                    >
                                                        {quote.status}
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
                                                        selectedQuote.status === 'quoted' ? 'secondary' : 'outline'
                                            }
                                            className="capitalize"
                                        >
                                            {selectedQuote.status}
                                        </Badge>
                                    </div>

                                    {selectedQuote.status === 'pending' ? (
                                        <p className="text-sm text-muted-foreground italic mt-2">
                                            The vendor has not responded yet.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Quoted Price</p>
                                                <p className="text-xl font-bold">₹{selectedQuote.quoted_price}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Message from Vendor</p>
                                                <div className="bg-primary/5 border border-primary/20 p-3 rounded-md text-sm whitespace-pre-wrap">
                                                    {selectedQuote.response || "No response details."}
                                                </div>
                                            </div>
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

                        {selectedQuote?.status === 'quoted' && (
                            <DialogFooter className="gap-2 sm:gap-0">
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
                                    disabled={!!actionLoading}
                                    onClick={() => handleAccept(selectedQuote.id)}
                                >
                                    {actionLoading === selectedQuote.id + "-accept" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                    Accept Quote
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
