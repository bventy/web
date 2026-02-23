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
        source: "/_v/s.js",
        destination: "/_vercel/insights/script.js",
      },
      // PostHog Proxy (Deep Obfuscation)
      {
        source: "/_p/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/_p/s/:path*",
        destination: "https://us.i.posthog.com/s/:path*",
      },
      {
        source: "/_p/e/:path*",
        destination: "https://us.i.posthog.com/e/:path*",
      },
      {
        source: "/_p/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      {
        source: "/_p/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      // Umami Proxy
      {
        source: "/_u/s.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/_u/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
    ];
  },
};

export default nextConfig;
