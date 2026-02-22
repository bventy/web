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
        source: "/a/u/script.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/a/u/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
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
    ];
  },
};

export default nextConfig;
