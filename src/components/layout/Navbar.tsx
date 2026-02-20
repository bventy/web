"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold sm:inline-block">Bventy</span>
                    </Link>
                </div>
                <nav className="flex items-center gap-2">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            {["admin", "super_admin"].includes(user.role) && (
                                <Button variant="ghost" asChild>
                                    <Link href="/admin">Admin</Link>
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.profile_image_url || "/avatars/01.png"} alt={user.username || user.full_name} />
                                            <AvatarFallback>
                                                {(user.full_name || user.username || "U").charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user.full_name || user.username}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/profile">
                                            <User className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    {["admin", "super_admin", "staff"].includes(user.role) && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin">
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button variant="outline" asChild className="hidden sm:inline-flex">
                                <Link href="/auth/signup">Sign Up</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/join-vendor">Join as Vendor</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header >
    );
}
