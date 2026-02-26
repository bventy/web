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
        destination: "https://api.bventy.in/:path*",
      },
      {
        source: "/vercel-relay/s.js",
        destination: "https://va.vercel-scripts.com/v1/script.js",
      },
      // PostHog Relay
      {
        source: "/posth-relay/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/posth-relay/s/:path*",
        destination: "https://us.i.posthog.com/s/:path*",
      },
      {
        source: "/posth-relay/e/:path*",
        destination: "https://us.i.posthog.com/e/:path*",
      },
      {
        source: "/posth-relay/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      {
        source: "/posth-relay/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      // Umami Relay
      {
        source: "/umami-relay/s.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/umami-relay/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
    ];
  },
};

export default nextConfig;
