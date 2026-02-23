"use client";

import Script from "next/script";

export default function UmamiAnalytics() {
    return (
        <Script
            src="/umami-relay/s.js"
            data-website-id="3e89ac7f-6f2d-4006-a387-316d10695e85"
            data-host-url="/umami-relay"
            strategy="afterInteractive"
        />
    );
}
