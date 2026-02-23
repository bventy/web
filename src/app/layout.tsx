import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bventy",
  description: "Bventy Web Application",
};

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import UmamiAnalytics from "@/components/UmamiAnalytics";
import PostHogPageView from "@/components/PostHogPageView";
import Script from "next/script";
import { Suspense } from "react";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { BackendWarmup } from "@/components/layout/BackendWarmup";
import { ProgressProvider } from "@/components/layout/ProgressProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <ProgressProvider />
        </Suspense>
        <PostHogProvider>
          <AuthProvider>
            <BackendWarmup />
            {children}
            <Toaster />
            {process.env.NODE_ENV === 'production' && (
              <Script
                src="/vercel-relay/s.js"
                strategy="lazyOnload"
                data-debug="false"
              />
            )}
            {process.env.NEXT_PUBLIC_UMAMI_ID && <UmamiAnalytics />}
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
