"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { eventService } from "@/services/event";
import { groupService, Group } from "@/services/group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { FileUpload } from "@/components/ui/FileUpload";

const formSchema = z.object({
    title: z.string().min(3, {
        message: "Event title must be at least 3 characters.",
    }),
    event_type: z.string().min(2, {
        message: "Please select an event type.",
    }),
    city: z.string().min(2, {
        message: "City must be at least 2 characters.",
    }),
    event_date: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Event date must be in the future.",
    }),
    budget_min: z.coerce.number().min(0, {
        message: "Minimum budget cannot be negative",
    }),
    budget_max: z.coerce.number().min(0, {
        message: "Maximum budget cannot be negative",
    }),
    organizer_group_id: z.string().optional(),
    cover_image_url: z.string().optional(),
});

function CreateEventForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect");
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        if (user) {
            groupService.getMyGroups().then(setGroups).catch(console.error);
        }
    }, [user]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            event_type: "",
            city: "",
            event_date: "",
            budget_min: 0,
            budget_max: 0,
            organizer_group_id: "none", // Use "none" as sentinel for optional select
            cover_image_url: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const payload = {
                ...values,
                organizer_group_id: values.organizer_group_id === "none" ? undefined : values.organizer_group_id,
                cover_image_url: values.cover_image_url,
            };
            await eventService.createEvent(payload);
            if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push("/events");
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to create event. Please try again.");
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
                        <CardTitle>Plan a New Event</CardTitle>
                        <CardDescription>
                            Create an event to start finding vendors.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/events">
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
                                name="cover_image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cover Image</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                onUploaded={(url) => field.onChange(url)}
                                                defaultUrl={field.value}
                                                label="Upload Event Cover"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. John's Birthday Bash" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="event_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="wedding">Wedding</SelectItem>
                                                    <SelectItem value="birthday">Birthday</SelectItem>
                                                    <SelectItem value="corporate">Corporate</SelectItem>
                                                    <SelectItem value="party">Private Party</SelectItem>
                                                    <SelectItem value="concert">Concert</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
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
                                name="event_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="budget_min"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Min Budget</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="budget_max"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Max Budget</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {groups.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name="organizer_group_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Organize as Group (Optional)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Personal Event" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">Personal Event</SelectItem>
                                                    {groups.map(group => (
                                                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>Select a group if this event belongs to a community.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Event
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CreateEventPage() {
    return (
        <Suspense fallback={<div className="container mx-auto max-w-2xl py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <CreateEventForm />
        </Suspense>
    );
}
