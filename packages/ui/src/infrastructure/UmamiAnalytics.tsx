"use client";
"use client";

import Script from "next/script";

export function UmamiAnalytics() {
    return (
        <Script
            src="/a/u/m.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            data-host-url="/a/u"
            strategy="afterInteractive"
        />
    );
}
