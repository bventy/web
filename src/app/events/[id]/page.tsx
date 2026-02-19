"use client";

import { useEffect, useState, use } from "react";
import { eventService, Event } from "@/services/event";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, ArrowLeft, MapPin, Calendar, DollarSign, Trash2, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEvent = async () => {
        try {
            const data = await eventService.getEventById(id);
            setEvent(data);
        } catch (error) {
            console.error("Failed to fetch event", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
            return;
        }

        if (user) {
            fetchEvent();
        }
    }, [user, authLoading, router, id]);

    const handleRemoveShortlist = async (vendorId: string) => {
        if (!event) return;
        try {
            await eventService.removeShortlist(event.id, vendorId);
            fetchEvent(); // Refresh data
        } catch (error) {
            console.error("Failed to remove vendor", error);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-2xl font-bold">Event not found</h1>
                <Button asChild className="mt-4">
                    <Link href="/events">Back to Events</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 max-w-5xl">
            <Button variant="ghost" className="mb-6" asChild>
                <Link href="/events">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Events
                </Link>
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    {event.cover_image_url && (
                        <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-6">
                            <img
                                src={event.cover_image_url}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2">{event.title}</h1>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                                    {event.event_type}
                                </Badge>
                                {event.organizer_group_id && (
                                    <Badge variant="outline" className="text-sm px-3 py-1">
                                        Group Event
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <MapPin className="h-6 w-6 text-muted-foreground mb-2" />
                                <span className="font-medium">{event.city}</span>
                                <span className="text-xs text-muted-foreground">Location</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <Calendar className="h-6 w-6 text-muted-foreground mb-2" />
                                <span className="font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
                                <span className="text-xs text-muted-foreground">Date</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <DollarSign className="h-6 w-6 text-muted-foreground mb-2" />
                                <span className="font-medium">${event.budget_min} - ${event.budget_max}</span>
                                <span className="text-xs text-muted-foreground">Budget</span>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Shortlisted Vendors</h2>
                            <Button asChild variant="outline">
                                <Link href="/vendors">
                                    <Search className="mr-2 h-4 w-4" />
                                    Browse Vendors
                                </Link>
                            </Button>
                        </div>

                        {event.shortlist && event.shortlist.length > 0 ? (
                            <div className="grid gap-4">
                                {event.shortlist.map((vendor) => (
                                    <Card key={vendor.id} className="flex items-center p-4 justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={`/avatars/${vendor.id}.png`} />
                                                <AvatarFallback>{vendor.business_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <Link href={`/vendors/${vendor.slug}`} className="font-semibold hover:underline text-lg">
                                                    {vendor.business_name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground capitalize">{vendor.category} • {vendor.city}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemoveShortlist(vendor.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed p-8 text-center bg-muted/20">
                                <p className="text-muted-foreground mb-4">No vendors shortlisted yet.</p>
                                <Button asChild>
                                    <Link href="/vendors">Find Vendors</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
