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
      {
        source: "/events/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/events/s/:path*",
        destination: "https://us.i.posthog.com/s/:path*",
      },
      {
        source: "/events/e/:path*",
        destination: "https://us.i.posthog.com/e/:path*",
      },
      {
        source: "/events/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      {
        source: "/events/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
