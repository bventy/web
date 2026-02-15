"use client";

import { useEffect, useState } from "react";
import { groupService, Group } from "@/services/group";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MyGroupsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
            return;
        }

        if (user) {
            const fetchGroups = async () => {
                try {
                    const data = await groupService.getMyGroups();
                    setGroups(data || []);
                } catch (error) {
                    console.error("Failed to fetch groups", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchGroups();
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
                    <h1 className="text-3xl font-bold tracking-tight">My Communities</h1>
                    <p className="text-muted-foreground">
                        Manage the groups you own or are a member of.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/groups/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Group
                    </Link>
                </Button>
            </div>

            {!groups || groups.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No groups found</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                        You haven't joined or created any communities yet. Start by creating one to bring people together.
                    </p>
                    <Button asChild>
                        <Link href="/groups/new">Create Group</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(groups || []).map((group) => (
                        <Card key={group.id} className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader className="bg-muted/40 pb-4">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{group.name}</CardTitle>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                                        {group.role}
                                    </span>
                                </div>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" /> {group.city}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {group.description}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="mr-2 h-4 w-4" />
                                    {group.member_count} Members
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
