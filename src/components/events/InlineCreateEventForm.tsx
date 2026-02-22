import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { eventService } from "@/services/event";
import { groupService, Group } from "@/services/group";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface InlineCreateEventFormProps {
    onSuccess: (eventId: string) => void;
    onCancel?: () => void;
}

export function InlineCreateEventForm({ onSuccess, onCancel }: InlineCreateEventFormProps) {
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
            organizer_group_id: "none",
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
            const response: any = await eventService.createEvent(payload);
            onSuccess(response.event_id || response.id || ""); // Respond dynamically based on how API structure looks
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
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
                        name="event_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Simplifying the inline form by making min_budget, image and group implicit or hidden initially to save space, but keeping them to satisfy schema */}
                <div className="hidden">
                    <FormField control={form.control} name="budget_min" render={({ field }) => <Input type="hidden" {...field} value={0} />} />
                    <FormField control={form.control} name="organizer_group_id" render={({ field }) => <Input type="hidden" {...field} value="none" />} />
                    <FormField control={form.control} name="cover_image_url" render={({ field }) => <Input type="hidden" {...field} value="" />} />
                </div>

                {error && (
                    <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-xs">{error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex gap-2 justify-end pt-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Event
                    </Button>
                </div>
            </form>
        </Form>
    );
}
