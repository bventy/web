"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function handleLoginSuccess(user: any) {
        const token = await user.getIdToken();

        // Sync with backend
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/firebase-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.setItem("token", token);
        } catch (error) {
            console.error("Backend sync failed", error);
            // Optionally handle this error, but we might want to let the user in specifically if backend is just for syncing profile
        }

        if (!user.emailVerified) {
            // We can either set a warning state here if we stay on page, or redirect and let Dashboard handle it.
            // The requirement says: if (!user.emailVerified) setWarning("...") 
            // But if we redirect immediately, the warning might be missed. 
            // "You can continue, but please verify soon." 
            // I'll set warning and redirect after a short delay or just redirect and let Dashboard show the banner.
            // User prompt: "if (!user.emailVerified) { setWarning(...) }" 
            // "After login ... router.push('/dashboard')"
            // I will set warning/error and redirect. 
            // Actually, if I redirect, the warning on this component unmounts.
            // Maybe I should redirect immediately and let Dashboard show the banner as per step 5.
            // Step 4 says: "setWarning(...) ... After login ... router.push". 
            // I will show the warning for a moment or just redirect. 
            // Given Step 5 adds a banner to Dashboard, I'll rely on that for persistent warning.
        }
        router.push("/dashboard");
    }

    async function handleGoogleLogin() {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await handleLoginSuccess(result.user);
        } catch (error: any) {
            console.error(error);
            setError("Failed to sign in with Google.");
            setIsLoading(false);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            if (!userCredential.user.emailVerified) {
                // Non-blocking warning
                setError("Email not verified yet. You can continue, but please verify soon.");
                // We don't return here! We continue to success.
            }
            await handleLoginSuccess(userCredential.user);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("Invalid email or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
            setIsLoading(false);
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Google
                    </Button>
                </form>
            </Form>
        </div>
    );
}
