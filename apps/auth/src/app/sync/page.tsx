"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Sync Content Component
 * Handles the actual sync logic using search params.
 */
function SyncContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const returnTo = searchParams.get("returnTo");
        const token = localStorage.getItem("token");

        if (!returnTo) {
            router.push("/");
            return;
        }

        try {
            const targetUrl = new URL(returnTo.startsWith("http") ? returnTo : `https://${returnTo}`);
            if (token) {
                targetUrl.searchParams.set("token", token);
            }
            // Mark sync as attempted for this target to prevent loops
            targetUrl.searchParams.set("synced", "true");

            window.location.href = targetUrl.toString();
        } catch (e) {
            console.error("Invalid returnTo URL", e);
            router.push("/");
        }
    }, [router, searchParams]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium animate-pulse">Syncing your session...</p>
        </div>
    );
}

/**
 * Sync Authority Page
 * Acts as a bridge to share localStorage tokens across subdomains on Safari iOS.
 */
export default function SyncPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground font-medium animate-pulse">Initializing sync...</p>
                </div>
            }>
                <SyncContent />
            </Suspense>
        </div>
    );
}

