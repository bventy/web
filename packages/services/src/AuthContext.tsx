"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, userService } from "./services/user";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (shouldRedirect?: boolean) => Promise<void>;
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

    const fetchUser = async () => {
        try {
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
            console.error("Session fetch failed or no session exists", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Source of truth is now the HttpOnly session cookie.
        // We simply check if we have a valid session on mount.
        fetchUser();
    }, []);

    const login = async (shouldRedirect = true) => {
        // The fetchUser call will now automatically use the cookie set by the backend.
        await fetchUser();

        if (shouldRedirect) {
            const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";
            const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "";
            const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_URL || "";

            // Re-fetch user to get the latest role
            const profile = await userService.getMe();

            if (profile && ["admin", "super_admin"].includes(profile.role)) {
                window.location.href = `${ADMIN_URL}/`;
            } else if (profile && profile.vendor_profile_exists) {
                window.location.href = `${VENDOR_URL}/dashboard`;
            } else {
                window.location.href = `${APP_URL}/dashboard`;
            }
        }
    };

    const logout = () => {
        setUser(null);
        posthog.reset();
        const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "";
        // The backend logout endpoint will clear the shared domain cookie
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
