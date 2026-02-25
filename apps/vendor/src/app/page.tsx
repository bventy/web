import { useEffect } from "react";
import { useAuth } from "@bventy/services";

export default function RootPage() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                window.location.href = "/dashboard";
            } else {
                // Check if we have a token in the URL or storage first
                const params = new URLSearchParams(window.location.search);
                if (params.has("token") || localStorage.getItem("token")) {
                    // AuthContext will handle it
                    return;
                }
                const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.bventy.in";
                const returnTo = encodeURIComponent(window.location.host);
                window.location.href = `${AUTH_URL}/login?returnTo=${returnTo}`;
            }
        }
    }, [user, loading]);

    return null;
}
