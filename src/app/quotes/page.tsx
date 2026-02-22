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
import { Loader2, ReceiptText, Check, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function MyQuotesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

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
                                        <TableHead>Requested Budget</TableHead>
                                        <TableHead>Quoted Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quotes.map((quote) => {
                                        // Optional safety if nested objects are joined in backend
                                        const vendorName = quote.vendor?.business_name || quote.vendor_id;
                                        const eventTitle = quote.event?.title || quote.event_id;
                                        const isPending = quote.status === 'pending';
                                        const isQuoted = quote.status === 'quoted';

                                        return (
                                            <TableRow key={quote.id}>
                                                <TableCell className="font-medium">{vendorName}</TableCell>
                                                <TableCell>{eventTitle}</TableCell>
                                                <TableCell>{quote.budget_range || '-'}</TableCell>
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
                                                    {isQuoted && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={!!actionLoading}
                                                                onClick={() => handleReject(quote.id)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                {actionLoading === quote.id + "-reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                                                                Reject
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                disabled={!!actionLoading}
                                                                onClick={() => handleAccept(quote.id)}
                                                            >
                                                                {actionLoading === quote.id + "-accept" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                                                                Accept
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
