"use client";

import { useEffect, useState } from "react";
import { eventService, Event  } from "@bventy/services";
import { Button  } from "@bventy/ui";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle  } from "@bventy/ui";
import { Plus, Calendar, MapPin, Loader2, ArrowRight } from "lucide-react";
import { useAuth  } from "@bventy/services";
import { useRouter } from "next/navigation";
import { Badge  } from "@bventy/ui";

export default function MyEventsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
            return;
        }

        if (user) {
            const fetchEvents = async () => {
                try {
                    const data = await eventService.getEvents();
                    setEvents(data || []);
                } catch (error) {
                    console.error("Failed to fetch events", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchEvents();
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                    <p className="text-muted-foreground">
                        Manage your upcoming events and shortlisted vendors.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/events/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Link>
                </Button>
            </div>

            {!events || events.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No events found</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                        You haven't planned any events yet. Start by creating one to find the best vendors.
                    </p>
                    <Button asChild>
                        <Link href="/events/new">Create Event</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(events || []).map((event) => (
                        <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader className="bg-muted/40 pb-4">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl truncate" title={event.title}>{event.title}</CardTitle>
                                    <Badge variant="secondary" className="capitalize">
                                        {event.event_type}
                                    </Badge>
                                </div>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" /> {event.city}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {new Date(event.event_date).toLocaleDateString()}
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm font-medium">Budget: ${event.budget_min} - ${event.budget_max}</span>
                                </div>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={`/events/${event.id}`}>
                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
