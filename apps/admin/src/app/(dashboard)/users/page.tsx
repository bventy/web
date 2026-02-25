"use client";

import { useEffect, useState } from "react";
import { adminService  } from "@bventy/services";
import { UserProfile  } from "@bventy/services";
import { useAuth  } from "@bventy/services";
import { Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
 } from "@bventy/ui";
import { Avatar, AvatarFallback, AvatarImage  } from "@bventy/ui";
import { Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
 } from "@bventy/ui";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge  } from "@bventy/ui";

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            toast.success("User role updated");
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
            );
        } catch (error) {
            console.error("Failed to update role", error);
            toast.error("Failed to update user role");
        }
    };

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const canManageRoles = currentUser?.role === "super_admin";

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Avatar</TableHead>
                            <TableHead>Start Info</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Current Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage
                                            src={user.profile_image_url}
                                            alt={user.username || user.full_name}
                                        />
                                        <AvatarFallback>
                                            {(user.full_name || user.username || "U")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {user.full_name || "N/A"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            @{user.username}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {canManageRoles ? (
                                        <Select
                                            value={user.role}
                                            onValueChange={(value) =>
                                                handleRoleChange(user.id, value)
                                            }
                                        >
                                            <SelectTrigger className="w-[130px] ml-auto">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="staff">Staff</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="super_admin">
                                                    Super Admin
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <span className="text-sm text-muted-foreground italic">
                                            View Only
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
