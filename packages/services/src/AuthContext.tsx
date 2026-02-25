"use client";
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, userService } from "./services/user";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (token: string, shouldRedirect?: boolean) => Promise<void>;
    logout: () => void;
    refetch: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const posthog = usePostHog();

    const fetchUser = async (explicitToken?: string) => {
        try {
            // If an explicit token is provided, we set it in local storage first
            // and then make the call. The interceptor will pick it up.
            if (explicitToken) {
                localStorage.setItem("token", explicitToken);
            }

            const profile = await userService.getMe();
            setUser(profile);

            if (profile && profile.id) {
                posthog.identify(profile.id, {
                    email: profile.email,
                    name: profile.full_name,
                    role: profile.role,
                });
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            // Only remove token if it was already there and failed
            if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check for token in URL for cross-subdomain sync
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");

        if (tokenFromUrl) {
            // Save to local storage for this subdomain
            localStorage.setItem("token", tokenFromUrl);

            // Clean up the URL to hide the token but keep other params
            const url = new URL(window.location.href);
            url.searchParams.delete("token");
            window.history.replaceState({}, "", url.toString());

            fetchUser(tokenFromUrl);
        } else {
            // Always attempt to fetch the user profile on mount.
            // Even if localStorage is empty, the browser may have a session cookie.
            fetchUser();
        }
    }, []);

    const login = async (token?: string, shouldRedirect = true) => {
        // We pass the token explicitly to fetchUser to avoid race conditions
        await fetchUser(token);

        if (shouldRedirect && token) {
            const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";
            const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "";
            const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_URL || "";

            // Re-fetch user to get the latest role
            const profile = await userService.getMe();

            // Check if there's a returnTo parameter in the current URL
            const params = new URLSearchParams(window.location.search);
            const returnTo = params.get("returnTo");

            if (returnTo) {
                // If it's a known sibling host, redirect there with token
                const targetUrl = returnTo.includes("admin") ? ADMIN_URL :
                    returnTo.includes("vendor") ? VENDOR_URL : APP_URL;
                window.location.href = `${targetUrl}/dashboard?token=${token}`;
                return;
            }

            if (profile && ["admin", "super_admin"].includes(profile.role)) {
                // Redirect with token for synchronization
                window.location.href = `${ADMIN_URL}/?token=${token}`;
            } else if (profile && profile.vendor_profile_exists) {
                window.location.href = `${VENDOR_URL}/dashboard?token=${token}`;
            } else {
                // Redirect with token for synchronization
                window.location.href = `${APP_URL}/dashboard?token=${token}`;
            }
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        posthog.reset();
        const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "";
        window.location.href = `${AUTH_URL}/login`;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refetch: fetchUser,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
