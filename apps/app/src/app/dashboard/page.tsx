"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile, useAuth } from "@bventy/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bventy/ui";
import { Button } from "@bventy/ui";
import { Loader2, Store, Calendar, ShieldCheck, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@bventy/ui";
import { Footer } from "@bventy/ui";
import { quoteService } from "@bventy/services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bventy/ui";
import { Badge } from "@bventy/ui";
import { Check, X, ReceiptText } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
    const router = useRouter();
    const { user: profile, loading: authLoading } = useAuth();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!profile) {
            const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "";
            window.location.href = `${AUTH_URL}/login`;
            return;
        }

        const fetchData = async () => {
            try {
                // Try to fetch quotes, but don't fail the whole page if it 404s
                try {
                    const quotesData = await quoteService.getMyQuotes();
                    setQuotes(quotesData);
                } catch (quoteErr: any) {
                    console.error("Failed to fetch quotes (possibly not implemented yet)", quoteErr);
                    setQuotes([]);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [profile, authLoading, router]);

    const handleAccept = async (id: string) => {
        setActionLoading(id + "-accept");
        try {
            await quoteService.acceptQuote(id);
            toast.success("Quote accepted successfully!");
            const quotesData = await quoteService.getMyQuotes();
            setQuotes(quotesData);
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
            const quotesData = await quoteService.getMyQuotes();
            setQuotes(quotesData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject quote.");
        } finally {
            setActionLoading(null);
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

    if (!profile) {
        return null;
    }

    const isAdminOrStaff = ["admin", "super_admin", "staff"].includes(profile.role);
    const firstName = profile.full_name ? profile.full_name.split(" ")[0] : "there";

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {firstName}.
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        What would you like to focus on today?
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                    {/* Mode 1: Plan Events */}
                    <Card className="flex flex-col border-0 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 transition-all hover:translate-y-[-4px] hover:shadow-xl">
                        <CardHeader>
                            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <CardTitle>Plan Events</CardTitle>
                            <CardDescription>
                                Create and manage your events. Find vendors and track budgets.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-4">
                            <Button className="w-full justify-between group" asChild>
                                <Link href="/events">
                                    My Events
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Mode 2: Groups */}
                    <Card className="flex flex-col border-0 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 transition-all hover:translate-y-[-4px] hover:shadow-xl">
                        <CardHeader>
                            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <CardTitle>Groups</CardTitle>
                            <CardDescription>
                                Manage not-for-profit groups, communities, and agencies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-4">
                            <Button className="w-full justify-between group" variant="secondary" asChild>
                                <Link href="/groups">
                                    My Groups
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Mode 3: Vendor Mode */}
                    <Card className="flex flex-col border-0 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 transition-all hover:translate-y-[-4px] hover:shadow-xl">
                        <CardHeader>
                            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Store className="h-5 w-5" />
                            </div>
                            <CardTitle>Vendor Mode</CardTitle>
                            <CardDescription>
                                {profile.vendor_profile_exists
                                    ? "Manage your business profile and incoming leads."
                                    : "List your services and start getting leads today."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-4">
                            {profile.vendor_profile_exists ? (
                                <Button className="w-full justify-between group" variant="outline" asChild>
                                    <Link href="/vendor/dashboard">
                                        Vendor Dashboard
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button className="w-full justify-between group" variant="outline" asChild>
                                    <Link href="/vendor/onboard">
                                        Become a Vendor
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mode 4: Internal Tools (Admin) */}
                    {isAdminOrStaff && (
                        <Card className="flex flex-col border-0 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-red-200 dark:ring-red-900/50 bg-red-50/50 dark:bg-red-950/10 transition-all hover:translate-y-[-4px] hover:shadow-xl">
                            <CardHeader>
                                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <CardTitle>Internal Tools</CardTitle>
                                <CardDescription>
                                    Admin dashboard for platform management and moderation.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pt-4">
                                <Button className="w-full justify-between group" variant="destructive" asChild>
                                    <Link href="/admin">
                                        Admin Panel
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* My Quotes Section */}
                <div className="mt-16 space-y-6 animate-in fade-in-50 slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">My Quotes</h2>
                            <p className="text-muted-foreground">Manage quotes you have requested from vendors.</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/quotes">View All Quotes</Link>
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
                        {quotes.length === 0 ? (
                            <div className="flex min-h-[200px] flex-col items-center justify-center text-center p-8">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
                                    <ReceiptText className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-base font-semibold">No Quotes Found</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                                    You haven't requested any quotes from vendors yet.
                                </p>
                                <Button size="sm" asChild>
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
                                        {quotes.slice(0, 5).map((quote) => {
                                            const vendorName = quote.vendor_name || quote.vendor_id;
                                            const eventTitle = quote.event_title || quote.event_id;
                                            const isQuoted = quote.status === 'responded';

                                            return (
                                                <TableRow key={quote.id}>
                                                    <TableCell className="font-medium">{vendorName}</TableCell>
                                                    <TableCell>{eventTitle}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                        {quote.budget_range || "-"}
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                        {quote.quoted_price ? `₹${quote.quoted_price}` : 'Pending response'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                quote.status === 'accepted' ? 'default' :
                                                                    quote.status === 'rejected' ? 'destructive' :
                                                                        quote.status === 'responded' ? 'secondary' : 'outline'
                                                            }
                                                            className="capitalize"
                                                        >
                                                            {quote.status.replace('_', ' ')}
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
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 text-xs"
                                                                >
                                                                    {actionLoading === quote.id + "-reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3 mr-1" />}
                                                                    Reject
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    disabled={!!actionLoading}
                                                                    onClick={() => handleAccept(quote.id)}
                                                                    className="h-8 text-xs"
                                                                >
                                                                    {actionLoading === quote.id + "-accept" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
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
                </div>
            </main>
            <Footer />
        </div>
    );
}
