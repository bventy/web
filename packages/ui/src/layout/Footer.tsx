"use client";
import Link from "next/link";

const WWW_URL = process.env.NEXT_PUBLIC_WWW_URL || "";
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <Link
                            href={WWW_URL || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Bventy
                        </Link>
                        . The source code is available on{" "}
                        <Link
                            href="#"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </Link>
                        .
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href={`${AUTH_URL}/login`} className="text-sm font-medium hover:underline">
                        Login
                    </Link>
                    <Link href={`${AUTH_URL}/signup`} className="text-sm font-medium hover:underline">
                        Signup
                    </Link>
                    <Link href={`${WWW_URL}/vendors`} className="text-sm font-medium hover:underline">
                        Explore
                    </Link>
                </div>
            </div>
        </footer>
    );
}

