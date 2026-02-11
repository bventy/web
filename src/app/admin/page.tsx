"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/user";
import { adminService } from "@/services/admin";
import { VendorProfile } from "@/services/vendor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Check, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [pendingVendors, setPendingVendors] = useState<VendorProfile[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const user = await userService.getMe();
                if (!["admin", "super_admin", "staff"].includes(user.role)) {
                    router.push("/not-authorized");
                    return;
                }
                setProfile(user);

                const vendors = await adminService.getPendingVendors();
                setPendingVendors(vendors);

            } catch (err) {
                console.error("Admin access check failed", err);
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleVerify = async (id: string) => {
        try {
            await adminService.verifyVendor(id);
            setPendingVendors(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            console.error("Failed to verify vendor", err);
            setError("Failed to verify vendor. Please try again.");
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure you want to reject this vendor?")) return;
        try {
            await adminService.rejectVendor(id);
            setPendingVendors(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            console.error("Failed to reject vendor", err);
            setError("Failed to reject vendor. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto p-4 py-8">
                <div className="flex items-center gap-2 mb-8">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground text-sm">Welcome, {profile.role}</p>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Pending Vendor Approvals</h2>

                    {pendingVendors.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-12 text-center">
                            <p className="text-muted-foreground">No pending vendors to review.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingVendors.map((vendor) => (
                                <Card key={vendor.id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle>{vendor.name}</CardTitle>
                                                <CardDescription>{vendor.city} • {vendor.category}</CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20" onClick={() => handleReject(vendor.id)}>
                                                    <X className="mr-1 h-4 w-4" />
                                                    Reject
                                                </Button>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleVerify(vendor.id)}>
                                                    <Check className="mr-1 h-4 w-4" />
                                                    Approve
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium">Bio:</p>
                                            <p className="text-sm text-muted-foreground">{vendor.bio}</p>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                                            <a href={vendor.whatsapp_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                Check WhatsApp Link
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
