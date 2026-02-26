import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@bventy/services";
import { 
  Toaster, 
  PostHogProvider, 
  BackendWarmup, 
  ProgressProvider, 
  UmamiAnalytics, 
  PostHogPageView 
} from "@bventy/ui";
import Script from "next/script";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <SpeedInsights />
      </body>
    </html>
  );
}
