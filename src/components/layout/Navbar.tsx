import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold sm:inline-block">Bventy</span>
                    </Link>
                </div>
                <nav className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/signup">Join as Vendor</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
