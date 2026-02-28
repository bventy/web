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
      // PostHog Obscure Relay
      {
        source: "/a/p/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/a/p/s/:path*",
        destination: "https://us.i.posthog.com/s/:path*",
      },
      {
        source: "/a/p/e/:path*",
        destination: "https://us.i.posthog.com/e/:path*",
      },
      {
        source: "/a/p/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      {
        source: "/a/p/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      // Umami Obscure Relay
      {
        source: "/a/u/m.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/a/u/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
    ];
  },
};

export default nextConfig;
