"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VendorOnboardingForm } from "@/components/vendor/VendorOnboardingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">Set up your Business Profile</CardTitle>
                            <CardDescription>
                                Join our network of verified event professionals.
                            </CardDescription>
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
