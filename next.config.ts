import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.bventy.in",
      },
      {
        protocol: "https",
        hostname: "va.vercel-scripts.com", // For manual loading if needed, though we'll use local proxy
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://bventy-api.onrender.com/:path*",
      },
      {
        source: "/metrics/script.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/metrics/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
      // Vercel Analytics Proxy
      {
        source: "/va/script.js",
        destination: "/_vercel/insights/script.js",
      },
      // PostHog Proxy (renamed from /events/ to /ingest/ to avoid conflict with /events page)
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/s/:path*",
        destination: "https://us.i.posthog.com/s/:path*",
      },
      {
        source: "/ingest/e/:path*",
        destination: "https://us.i.posthog.com/e/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
