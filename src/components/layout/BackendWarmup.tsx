"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/**
 * BackendWarmup is a headless component that pings the backend health endpoint
 * immediately upon application hydration. This ensures that the Render free-tier
 * instance starts its spin-up process as early as possible.
 */
export function BackendWarmup() {
    const [isWarmingUp, setIsWarmingUp] = useState(false);

    useEffect(() => {
        const warmup = async () => {
            const startTime = Date.now();
            try {
                // Lightweight ping to wake up the backend
                await api.get("/health");
                const duration = Date.now() - startTime;

                // If the backend took more than 3 seconds, it was likely a cold start
                if (duration > 3000) {
                    // Silent warm-up
                }
            } catch (error) {
                console.warn("Backend warm-up ping failed. Instance might still be spinning up.");
                setIsWarmingUp(true);
            }
        };

        warmup();
    }, []);

    // This component is mostly headless, but we could return a small fixed portal or 
    // simply let the global progress bar (if added) handle the visual.
    if (!isWarmingUp) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none">
            {/* Subtle indicator for the developer/user if they are stuck on a cold start */}
            <div className="bg-background/80 backdrop-blur-md border border-border shadow-lg rounded-full px-4 py-2 text-[10px] font-medium animate-pulse flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                Connectivity optimization in progress...
            </div>
        </div>
    );
}
