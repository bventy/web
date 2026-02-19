"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { vendorService } from "@/services/vendor";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const formSchema = z.object({
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

export function VendorOnboardingForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            business_name: "",
            city: "",
            bio: "",
            whatsapp_link: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            await vendorService.createProfile(values);
            setSuccess(true);
        } catch (err: any) {
            // Check for 409 Conflict
            if (err.response && err.response.status === 409) {
                // If 409, it means profile exists (or slug conflict).
                // Let's try to UPDATE the profile with these values as a recovery mechanism.
                try {
                    await vendorService.updateProfile(values);
                    setSuccess(true);
                    return;
                } catch (updateErr) {
                    console.error("Failed to recover/update profile:", updateErr);
                    // If update ALSO fails, then it's likely a slug conflict (name taken by someone else)
                    setError("This Business Name or City combination is already taken. Please try a different name.");
                    // Or if update failed for other reasons, show generic error
                }
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to create profile. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Profile Created!</h3>
                <p className="max-w-xs text-muted-foreground">
                    Your vendor profile has been set up successfully.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/vendor/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
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
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us about your services..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="whatsapp_link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>WhatsApp Link</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://wa.me/919876543210" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your direct contact link for leads.
                                </FormDescription>
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
                        Submit Profile
                    </Button>
                </form>
            </Form>
        </div>
    );
}
