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
        // Always attempt to fetch the user profile on mount.
        // Even if localStorage is empty, the browser may have a session cookie.
        fetchUser();
    }, []);

    const login = async (token?: string, shouldRedirect = true) => {
        // We pass the token explicitly to fetchUser to avoid race conditions
        await fetchUser(token);

        if (shouldRedirect && token) {
            const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";
            const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "";

            // Re-fetch user to get the latest role
            const profile = await userService.getMe();

            if (profile && ["admin", "super_admin"].includes(profile.role)) {
                window.location.href = ADMIN_URL || "/";
            } else {
                window.location.href = `${APP_URL}/dashboard`;
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
