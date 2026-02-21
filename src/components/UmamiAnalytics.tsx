"use client";

import Script from "next/script";

export default function UmamiAnalytics() {
    return (
        <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="3e89ac7f-6f2d-4006-a387-316d10695e85"
            strategy="afterInteractive"
        />
    );
}
