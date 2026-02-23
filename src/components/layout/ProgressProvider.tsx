"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * ProgressProvider handles the global top-loading bar.
 */
export function ProgressProvider() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Configure NProgress
        NProgress.configure({
            showSpinner: false,
            minimum: 0.3,
            easing: 'ease',
            speed: 500
        });
    }, []);

    useEffect(() => {
        // Complete the progress bar when the route changes
        NProgress.done();
    }, [pathname, searchParams]);

    return null;
}
