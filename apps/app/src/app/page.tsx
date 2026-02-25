"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@bventy/services";
import { Loader2 } from "lucide-react";

/**
 * Root page for app.bventy.in
 * Redirects to dashboard if logged in, or the marketing site if not.
 */
export default function AppPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.push("/dashboard");
            } else {
                // If not logged in, redirect to the marketing site
                window.location.href = process.env.NEXT_PUBLIC_WWW_URL || "https://bventy.in";
            }
        }
    }, [user, loading, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
