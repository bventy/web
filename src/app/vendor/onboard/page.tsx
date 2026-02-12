"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VendorOnboardingForm } from "@/components/vendor/VendorOnboardingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VendorOnboardingPage() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
        } else {
            setCheckingAuth(false);
        }
    }, [router]);

    if (checkingAuth) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-2xl">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="flex flex-col space-y-1.5 text-center w-full">
                                {/* ^ adjusting text-center to work with flex might be tricky if we want perfect centering. 
                                    If we want 'X' on right and title centered, we need 3 cols or absolute positioning.
                                    For simplicity, I will stick to "Title Left, X Right" pattern to be consistent with others.
                                */}
                                <div className="text-left">
                                    <CardTitle className="text-2xl font-bold">Set up your Business Profile</CardTitle>
                                    <CardDescription>
                                        Join our network of verified event professionals.
                                    </CardDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" asChild className="shrink-0">
                                <Link href="/dashboard">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <VendorOnboardingForm />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
