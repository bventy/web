"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Store, Calendar, ShieldCheck, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function DashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await userService.getMe();
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

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
            </main>
            <Footer />
        </div>
    );
}
