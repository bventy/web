"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button  } from "@bventy/ui";
import { Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
 } from "@bventy/ui";
import { Input  } from "@bventy/ui";
import { Textarea  } from "@bventy/ui";
import { Loader2, X } from "lucide-react";
import { groupService  } from "@bventy/services";
import { Alert, AlertDescription  } from "@bventy/ui";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle  } from "@bventy/ui";
import { FileUpload  } from "@bventy/ui";

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Group name must be at least 3 characters.",
    }),
    city: z.string().min(2, {
        message: "City must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    banner_image_url: z.string().optional(),
});

export default function CreateGroupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            city: "",
            description: "",
            banner_image_url: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            await groupService.createGroup({
                name: values.name,
                city: values.city,
                description: values.description,
                banner_image_url: values.banner_image_url,
            });
            router.push("/groups");
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to create group. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>Create a Community</CardTitle>
                        <CardDescription>
                            Start a new group to organize events and connect with others in your city.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/groups">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="banner_image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Banner Image</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                onUploaded={(url) => field.onChange(url)}
                                                defaultUrl={field.value}
                                                label="Upload Group Banner"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Pune Tech Events" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public community name.
                                        </FormDescription>
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
                                            <Input placeholder="e.g. Pune" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about your community..."
                                                className="resize-none"
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

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Group
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
