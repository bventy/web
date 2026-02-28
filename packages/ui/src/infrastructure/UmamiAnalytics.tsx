"use client";
"use client";

import Script from "next/script";

export function UmamiAnalytics() {
    return (
        <Script
            src="/umami-relay/s.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            data-host-url="/umami-relay"
            strategy="afterInteractive"
        />
    );
}
