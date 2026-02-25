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
            console.error("Failed to fetch user profile", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (token: string, shouldRedirect = true) => {
        localStorage.setItem("token", token);
        await fetchUser();
        if (shouldRedirect) {
            router.push("/dashboard");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        posthog.reset();
        router.push("/auth/login");
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
