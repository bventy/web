"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@bventy/ui";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@bventy/ui";
import { Input } from "@bventy/ui";
import { useState } from "react";
import { authService } from "@bventy/services";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@bventy/ui"; // We might need an Alert component, or simpler div
import { useAuth } from "@bventy/services";
import Link from "next/link";

const formSchema = z.object({
    full_name: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

export function SignupForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.signup(values);
            await login();
        } catch (err: any) {
            // Simple error handling
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="John Doe"
                                        {...field}
                                        className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        {...field}
                                        className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        {...field}
                                        className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <Alert variant="destructive" className="py-2.5">
                            <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full h-11 text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Creating account..." : "Create Account"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto">
                        By signing up, you agree to our{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors font-medium">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </form>
            </Form>
        </div>
    );
}
