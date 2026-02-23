"use client"

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
                api_host: '/_p',
                ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                defaults: '2026-01-30',
                capture_pageview: false,
                disable_session_recording: true, // Silences recorder.js load failures
                enable_recording_console_log: false,
                persistence: 'memory' // More privacy friendly if blocked
            })
        }
    }, [])

    return <PHProvider client={posthog}>{children}</PHProvider>
}
