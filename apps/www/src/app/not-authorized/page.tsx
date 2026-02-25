"use client";

import { Button  } from "@bventy/ui";
import Link from "next/link";
import { ShieldAlert, LogOut } from "lucide-react";
import { useAuth  } from "@bventy/services";

export default function NotAuthorizedPage() {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-muted/40">
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                    <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
                <p className="text-muted-foreground">
                    You don’t have access to this page.
                </p>
            </div>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
