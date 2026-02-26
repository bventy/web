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
import { Textarea } from "@bventy/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@bventy/ui";
import { cn } from "@bventy/ui";
import { useState } from "react";
import { authService } from "@bventy/services";
import { vendorService } from "@bventy/services";
import { userService } from "@bventy/services";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@bventy/ui";
import { useAuth } from "@bventy/services";
import { FileUpload } from "@bventy/ui";
import { mediaService } from "@bventy/services";

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
    portfolio_image_url: z.string().optional(),
});



export function VendorSignupForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            portfolio_image_url: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Create User Account
            const authResponse = await authService.signup({
                full_name: values.full_name,
                email: values.email,
                password: values.password,
            });

            // 2. Login (to get token for next step) - suppress redirect
            // We need to keep the user on this page to finish the upload logic
            await login(false);


            // 3. Upload Media (if selected) - NOW that we are logged in
            let portfolioImageUrl = values.portfolio_image_url;
            if (selectedFile) {
                try {
                    portfolioImageUrl = await mediaService.uploadMedia(selectedFile);
                    try {
                        // Sync to user profile
                        await userService.updateProfile({ profile_image_url: portfolioImageUrl });
                        // Refetch auth context to update UI immediately
                        await login(false);

                        // Wait, I just exposed refetch. Let's use it. Actually, I need to destructure it first.
                        // Since I can't change the destructuring in this block easily, I'll rely on calling login again or just assume the user will reload.
                        // BUT, calling login() again forces a fetchUser()!
                    } catch (e) { console.error("Sync failed", e); }
                } catch (uploadError) {
                    console.error("Failed to upload portfolio image", uploadError);
                    // Continue without image or handle error? For now, we continue but warn user (implicitly by missing image)
                    // or we can throw here. Let's log it.
                }
            }

            // 4. Create Vendor Profile
            await vendorService.createProfile({
                business_name: values.business_name,
                category: values.category,
                city: values.city,
                bio: values.bio,
                whatsapp_link: values.whatsapp_link,
                portfolio_image_url: portfolioImageUrl,
            });

            // Refetch one last time to be sure we have everything? No need, createProfile doesn't change user object usually.
            // But just in case, let's call login again to be safe and redirect manually.
            // Actually, simply redirecting now is fine if we updated the profile.
            // To ensure the context is fresh:
            await login(true); // This fetches and redirects

            // router.push("/dashboard"); // Handled by login

        } catch (err: any) {
            console.error("Vendor signup error:", err);
            if (err.response && err.response.data && err.response.data.message) {
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {/* Column 1: Personal Details */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
                                <span className="h-4 w-1 bg-primary rounded-full" />
                                Personal Details
                            </h3>

                            <div className="space-y-4">
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
                            </div>
                        </div>

                        {/* Column 2: Business Details */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
                                <span className="h-4 w-1 bg-primary rounded-full" />
                                Business Details
                            </h3>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="business_name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Business Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Beats by Dre"
                                                    {...field}
                                                    className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all">
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
                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">City</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Mumbai"
                                                        {...field}
                                                        className="h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[10px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="whatsapp_link"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">WhatsApp Link</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://wa.me/91..."
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
                                    name="portfolio_image_url"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Portfolio Image</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    onFileSelect={(file) => setSelectedFile(file)}
                                                    defaultUrl={field.value}
                                                    label="Upload Portfolio Image"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Business Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about your services, awards, and experience..."
                                            className="resize-none h-24 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive" className="py-2.5">
                            <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-center pt-4">
                        <Button type="submit" className="min-w-[280px] h-12 text-base font-bold shadow-sm hover:shadow-lg transition-all active:scale-[0.98]" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {isLoading ? "Creating Account..." : "Join as a Vendor"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
