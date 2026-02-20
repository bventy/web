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
    const [vendors, setVendors] = useState<VendorProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVendors = async () => {
        try {
            const data = await adminService.getPendingVendors();
            setVendors(data);
        } catch (error) {
            console.error("Failed to fetch pending vendors", error);
            toast.error("Failed to fetch pending vendors");
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
            setVendors((prev) => prev.filter((v) => v.id !== id));
        } catch (error) {
            console.error("Failed to approve vendor", error);
            toast.error("Failed to approve vendor");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await adminService.rejectVendor(id);
            toast.success("Vendor rejected");
            setVendors((prev) => prev.filter((v) => v.id !== id));
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
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Pending Vendors</h1>
            <div className="rounded-md border">
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
                        {vendors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No pending vendors.
                                </TableCell>
                            </TableRow>
                        ) : (
                            vendors.map((vendor) => (
                                <TableRow key={vendor.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage
                                                src={vendor.primary_profile_image_url}
                                                alt={vendor.business_name}
                                            />
                                            <AvatarFallback>
                                                {vendor.business_name.charAt(0)}
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
    );
}
