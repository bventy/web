import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "media.bventy.in",
            },
            {
                protocol: "https",
                hostname: "va.vercel-scripts.com",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://api.bventy.in/:path*",
            },
            {
                source: "/vercel-relay/s.js",
                destination: "https://va.vercel-scripts.com/v1/script.js",
            },
            // PostHog Relay
            {
                source: "/posth-relay/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
            // Umami Relay
            {
                source: "/umami-relay/s.js",
                destination: "https://cloud.umami.is/script.js",
            },
        ];
    },
};

export default nextConfig;
