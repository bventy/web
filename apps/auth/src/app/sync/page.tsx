"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy Sync Page
 * This page is now deprecated as we have moved to industry-standard 
 * shared-domain HttpOnly cookies for cross-subdomain authentication.
 */
export default function SyncPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login or home since sync is now handled by the browser
        router.push("/login");
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground font-medium">Redirecting...</p>
            </div>
        </div>
    );
}


