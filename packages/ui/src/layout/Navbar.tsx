"use client";
"use client";

import Link from "next/link";
import { Button  } from "@bventy/ui";
import { useAuth  } from "@bventy/services";
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
 } from "@bventy/ui";
import { Avatar, AvatarFallback, AvatarImage  } from "@bventy/ui";
import { User, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                        <span className="text-xl font-bold tracking-tight">Bventy</span>
                    </Link>
                </div>
                <nav className="flex items-center gap-3">
                    <Button variant="ghost" asChild className="hidden text-sm font-medium transition-colors hover:text-primary sm:inline-flex">
                        <Link href="/vendors">Explore</Link>
                    </Button>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 gap-2 rounded-full ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                        <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                            <AvatarImage src={user.profile_image_url} alt={user.username || user.full_name} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {(user.full_name || user.username || "U").charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 animate-in fade-in-0 zoom-in-95" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-2 py-1">
                                            <p className="text-sm font-semibold leading-none">
                                                {user.full_name || user.username}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground opacity-70">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link href="/dashboard" className="flex w-full items-center">
                                            <LayoutDashboard className="mr-2 h-4 w-4 opacity-70" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link href="/dashboard/profile" className="flex w-full items-center">
                                            <User className="mr-2 h-4 w-4 opacity-70" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4 opacity-70" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
                                <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button size="sm" className="hidden h-9 px-5 text-sm font-medium sm:inline-flex" asChild>
                                <Link href="/auth/signup">Join Bventy</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
