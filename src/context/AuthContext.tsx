"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, userService } from "@/services/user";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // Force token refresh to ensure we have valid claims if custom claims are used
                    await firebaseUser.getIdToken(true);
                    const profile = await userService.getMe();
                    setUser(profile);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await auth.signOut();
        setUser(null);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                logout,
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
