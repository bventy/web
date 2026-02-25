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
                // Check if we have a token in the URL or storage first
                const params = new URLSearchParams(window.location.search);
                if (params.has("token") || localStorage.getItem("token")) {
                    // Stay here, the AuthContext mount effect will handle it
                    return;
                }
                // Only redirect if we are truly unauthenticated
                const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.bventy.in";
                const returnTo = encodeURIComponent(window.location.host);
                window.location.href = `${AUTH_URL}/login?returnTo=${returnTo}`;
            }
        }
    }, [user, loading, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
