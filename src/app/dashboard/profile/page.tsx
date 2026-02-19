"use client";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user";
import { Loader2, Save, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/ui/FileUpload";
import { mediaService } from "@/services/media";

const profileFormSchema = z.object({
    full_name: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }).regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores.",
    }),
    phone: z.string().optional(),
    city: z.string().optional(),
    bio: z.string().max(300, {
        message: "Bio must not be longer than 300 characters.",
    }).optional(),
    profile_image_url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
    const { user, loading: authLoading, refetch } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            full_name: "",
            username: "",
            phone: "",
            city: "",
            bio: "",
            profile_image_url: "",
        },
    });

    // Load user data into form
    useEffect(() => {
        if (user) {
            form.reset({
                full_name: user.full_name || "",
                username: user.username || "",
                phone: user.phone || "",
                city: user.city || "",
                bio: user.bio || "",
                profile_image_url: user.profile_image_url || "",
            });
        }
    }, [user, form]);

    async function onSubmit(data: ProfileFormValues) {
        setIsSaving(true);
        console.log("Submitting form data:", data);

        try {
            // Filter out empty strings for optional fields to avoid backend validation errors
            // Backend likely rejects "" for phone/url/etc. 
            const payload: any = {};

            // 0. Upload file if selected
            let profileImageUrl = data.profile_image_url;
            if (selectedFile) {
                try {
                    profileImageUrl = await mediaService.uploadMedia(selectedFile);
                } catch (uploadError) {
                    console.error("Failed to upload profile image", uploadError);
                    toast.error("Failed to upload profile image");
                    setIsSaving(false);
                    return;
                }
            }

            // 1. Always include required fields
            payload.full_name = data.full_name;
            payload.username = data.username;

            // 2. Include optional fields ONLY if they are not empty
            if (data.phone && data.phone.trim() !== "") payload.phone = data.phone.replace(/\s/g, ''); // Clean phone
            if (data.city && data.city.trim() !== "") payload.city = data.city;
            if (data.bio && data.bio.trim() !== "") payload.bio = data.bio;

            // Use the potentially updated URL
            if (profileImageUrl && profileImageUrl.trim() !== "") payload.profile_image_url = profileImageUrl;

            console.log("Final payload to send (Sanitized):", payload);

            await userService.updateProfile(payload);
            toast.success("Profile updated successfully");
            window.location.reload();
        } catch (error: any) {
            console.error("Profile update error object:", error);
            console.error("Profile update response data:", error.response?.data);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else if (typeof error.response?.data === 'string') {
                toast.error(`Error: ${error.response.data.slice(0, 50)}`);
            } else {
                toast.error(`Failed to update profile. Status: ${error.response?.status}`);
            }
        } finally {
            setIsSaving(false);
        }
    }

    if (authLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        router.push("/auth/login");
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your personal information and public profile.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-[250px_1fr]">
                    {/* Sidebar / Photo */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>
                                This will be displayed on your public profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage
                                    key={form.watch("profile_image_url") || user.profile_image_url}
                                    src={form.watch("profile_image_url") || user.profile_image_url || "/avatars/01.png"}
                                />
                                <AvatarFallback className="text-4xl">
                                    {(user.full_name || user.username || "U").charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-xs text-muted-foreground text-center">
                                Use the form to update your image URL.
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Details</CardTitle>
                            <CardDescription>
                                Update your personal information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                    <div className="grid md:grid-cols-2 gap-4">
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
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="johndoe" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Unique handle for your profile.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="profile_image_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profile Picture</FormLabel>
                                                <FormControl>
                                                    <FileUpload
                                                        onFileSelect={(file) => setSelectedFile(file)}
                                                        defaultUrl={field.value}
                                                        label="Upload Profile Picture"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Your public avatar.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+1 234 567 890" {...field} />
                                                    </FormControl>
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
                                                        <Input placeholder="New York, NY" {...field} />
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
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us a little about yourself"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Can be mentioned in community groups.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
