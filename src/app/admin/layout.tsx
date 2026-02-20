"use client";

import { useAuth } from "@/context/AuthContext";
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
                router.push("/auth/login");
            } else if (!["admin", "super_admin"].includes(user.role)) {
                router.push("/dashboard");
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
