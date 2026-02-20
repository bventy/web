"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin";
import { VendorProfile } from "@/services/vendor";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminVendorsPage() {
    const [pendingVendors, setPendingVendors] = useState<VendorProfile[]>([]);
    const [verifiedVendors, setVerifiedVendors] = useState<VendorProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            const [pending, verified] = await Promise.all([
                adminService.getVendors("pending"),
                adminService.getVendors("verified"),
            ]);
            setPendingVendors(pending);
            setVerifiedVendors(verified);
        } catch (error) {
            console.error("Failed to fetch vendors", error);
            toast.error("Failed to fetch vendors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await adminService.approveVendor(id);
            toast.success("Vendor approved successfully");
            setPendingVendors((prev) => prev.filter((v) => v.id !== id));
            // Optionally move to verified list immediately, but fetching again or manual move ensures consistency
            // For better UX, let's manually move it to verified list if we have the object
            const approvedVendor = pendingVendors.find(v => v.id === id);
            if (approvedVendor) {
                setVerifiedVendors(prev => [...prev, { ...approvedVendor, status: 'verified' }]);
            }
        } catch (error) {
            console.error("Failed to approve vendor", error);
            toast.error("Failed to approve vendor");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await adminService.rejectVendor(id);
            toast.success("Vendor rejected");
            setPendingVendors((prev) => prev.filter((v) => v.id !== id));
        } catch (error) {
            console.error("Failed to reject vendor", error);
            toast.error("Failed to reject vendor");
        }
    };

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Pending Vendors</h1>
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>Business Name</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingVendors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No pending vendors.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingVendors.map((vendor) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage
                                                    src={vendor.primary_profile_image_url}
                                                    alt={vendor.business_name}
                                                />
                                                <AvatarFallback>
                                                    {vendor.business_name?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {vendor.business_name}
                                        </TableCell>
                                        <TableCell>{vendor.city}</TableCell>
                                        <TableCell className="capitalize">
                                            {vendor.category}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleApprove(vendor.id)}
                                                >
                                                    <Check className="h-4 w-4" />
                                                    <span className="sr-only">Approve</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleReject(vendor.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span className="sr-only">Reject</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Verified Vendors</h1>
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>Business Name</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {verifiedVendors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No verified vendors found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                verifiedVendors.map((vendor) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage
                                                    src={vendor.primary_profile_image_url}
                                                    alt={vendor.business_name}
                                                />
                                                <AvatarFallback>
                                                    {vendor.business_name?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {vendor.business_name}
                                        </TableCell>
                                        <TableCell>{vendor.city}</TableCell>
                                        <TableCell className="capitalize">
                                            {vendor.category}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Verified
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
