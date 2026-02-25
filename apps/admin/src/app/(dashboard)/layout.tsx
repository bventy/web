"use client";

import { useAuth } from "@bventy/services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.bventy.in";
                const returnTo = encodeURIComponent(window.location.host);
                window.location.href = `${AUTH_URL}/login?returnTo=${returnTo}`;
            } else if (!["admin", "super_admin"].includes(user.role)) {
                router.push(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || !["admin", "super_admin"].includes(user.role)) {
        return null;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-1">
                <AdminSidebar />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
