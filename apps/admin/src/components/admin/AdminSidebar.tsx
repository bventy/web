"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@bventy/ui";
import { LayoutDashboard, Users, Store, Settings } from "lucide-react";
import { Button } from "@bventy/ui";

const sidebarItems = [
    {
        title: "Overview",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Vendors",
        href: "/vendors",
        icon: Store,
    },
    {
        title: "Users",
        href: "/users",
        icon: Users,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72 h-[calc(100vh-3.5rem)] sticky top-14">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    pathname === item.href
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
