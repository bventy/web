"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
// import { authService } from "@/services/auth";
import { vendorService } from "@/services/vendor";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
    // User Details
    full_name: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    // Vendor Details
    business_name: z.string().min(2, {
        message: "Business name must be at least 2 characters.",
    }),
    category: z.string().min(1, {
        message: "Please select a category.",
    }),
    city: z.string().min(2, {
        message: "City must be at least 2 characters.",
    }),
    bio: z.string().min(10, {
        message: "Bio must be at least 10 characters.",
    }),
    whatsapp_link: z.string().url({
        message: "Please enter a valid URL.",
    }),
});

export function VendorSignupForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            business_name: "",
            category: "",
            city: "",
            bio: "",
            whatsapp_link: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Create User Account (Firebase)
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);

            // Update profile
            await updateProfile(userCredential.user, {
                displayName: values.full_name,
            });

            // Send verification email
            await sendEmailVerification(userCredential.user);

            // 2. Create Vendor Profile (Backend)
            // Note: Firebase automatically signs in the user, so auth.currentUser is set
            // The api interceptor will pick up the token
            await vendorService.createProfile({
                business_name: values.business_name,
                category: values.category,
                city: values.city,
                bio: values.bio,
                whatsapp_link: values.whatsapp_link,
            });

            // 3. Redirect
            router.push("/dashboard");

        } catch (err: any) {
            console.error("Vendor signup error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email is already in use.");
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to create vendor account. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Column 1: Personal Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Personal Details</h3>

                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                        </div>

                        {/* Column 2: Business Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Business Details</h3>

                            <FormField
                                control={form.control}
                                name="business_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Business Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Beats by Dre" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="DJ">DJ</SelectItem>
                                                    <SelectItem value="Decor">Decor</SelectItem>
                                                    <SelectItem value="Venue">Venue</SelectItem>
                                                    <SelectItem value="Catering">Catering</SelectItem>
                                                    <SelectItem value="Photography">Photography</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Mumbai" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="whatsapp_link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://wa.me/91..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your services..."
                                        className="resize-none h-[60px]"
                                        {...field}
                                    />
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

                    <div className="flex justify-center">
                        <Button type="submit" className="min-w-[200px]" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Vendor Account
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
