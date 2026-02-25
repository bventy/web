"use client";
"use client"

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
                api_host: '/posth-relay',
                ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                cross_subdomain_cookie: true,
                defaults: '2026-01-30',
                capture_pageview: false,
                disable_session_recording: true,
                enable_recording_console_log: false,
                persistence: 'cookie'
            })
        }
    }, [])

    return <PHProvider client={posthog}>{children}</PHProvider>
}
