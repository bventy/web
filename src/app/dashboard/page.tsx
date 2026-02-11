"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Store, Calendar, ShieldCheck, User } from "lucide-react";
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
                // If 401, the interceptor handles redirect, but we can catch other errors here
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return null; // Handle error state better if needed
    }

    const isAdminOrStaff = ["admin", "super_admin", "staff"].includes(profile.role);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto p-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Vendor Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Store className="h-5 w-5" />
                                Vendor Profile
                            </CardTitle>
                            <CardDescription>
                                Manage your vendor services and leads.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profile.vendor_profile_exists ? (
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-medium text-green-600">Status: Verified</p>
                                    <Button className="w-full" asChild>
                                        <Link href="/vendor/dashboard">Go to Vendor Dashboard</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm text-muted-foreground">
                                        Expand your business by listing your services on Bventy.
                                    </p>
                                    <Button className="w-full" asChild>
                                        <Link href="/vendor/onboard">Become a Vendor</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Organizer Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Event Organizer
                            </CardTitle>
                            <CardDescription>
                                Plan events and find the best vendors.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profile.organizer_profile_exists ? (
                                <div className="flex flex-col gap-4">
                                    <Button className="w-full" variant="outline" asChild>
                                        <Link href="/vendors">Browse Vendors</Link>
                                    </Button>
                                    <Button className="w-full" asChild>
                                        <Link href="/organizer/dashboard">My Events</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm text-muted-foreground">
                                        Planning an event? Create a profile to manage inquiries.
                                    </p>
                                    <Button className="w-full" asChild>
                                        <Link href="/organizer/onboard">Plan an Event</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Admin Tools (Conditional) */}
                    {isAdminOrStaff && (
                        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                    <ShieldCheck className="h-5 w-5" />
                                    Admin Tools
                                </CardTitle>
                                <CardDescription className="text-red-600/80 dark:text-red-400/80">
                                    Internal management tools.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="secondary" className="w-full" asChild>
                                    <Link href="/admin">Go to Admin Panel</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* User Profile Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                My Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Role:</span> <span className="capitalize">{profile.role.replace('_', ' ')}</span></p>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>
            <Footer />
        </div>
    );
}
