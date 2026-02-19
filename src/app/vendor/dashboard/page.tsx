"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/user";
import { vendorService, VendorProfile } from "@/services/vendor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Store, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/FileUpload";
import { GalleryUpload } from "@/components/vendor/GalleryUpload";
import { PortfolioUpload } from "@/components/vendor/PortfolioUpload";
import Link from "next/link";

export default function VendorDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [vendor, setVendor] = useState<VendorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        business_name: "",
        category: "",
        city: "",
        bio: "",
        whatsapp_link: "",
        portfolio_image_url: "",
        gallery_images: [] as string[],
        portfolio_files: [] as any[]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await userService.getMe();
                setUser(userData);

                if (!userData.vendor_profile_exists) {
                    router.push("/vendor/onboard");
                    return;
                }

                // Fetch vendor profile
                try {
                    const vendorData = await vendorService.getMyProfile();
                    setVendor(vendorData);
                    setFormData({
                        business_name: vendorData.business_name || "",
                        category: vendorData.category || "",
                        city: vendorData.city || "",
                        bio: vendorData.bio || "",
                        whatsapp_link: vendorData.whatsapp_link || "",
                        portfolio_image_url: vendorData.portfolio_image_url || "",
                        gallery_images: vendorData.gallery_images || [],
                        portfolio_files: vendorData.portfolio_files || []
                    });
                } catch (err) {
                    console.error("Failed to fetch vendor profile", err);
                    toast.error("Failed to load vendor profile");
                }
            } catch (error) {
                console.error(error);
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await vendorService.updateProfile(formData);
            toast.success("Vendor profile updated successfully");
            // Optional: Refresh data to be sure
            const updated = await vendorService.getMyProfile();
            setVendor(updated);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
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

    if (!vendor) return null;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Vendor Dashboard</h1>
                        <p className="text-muted-foreground">Manage your business profile, gallery, and portfolio.</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/vendors/${vendor.slug}`} target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Public Profile
                            </Link>
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <div className="space-y-6">
                        {/* Media Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Media Gallery</CardTitle>
                                <CardDescription>
                                    Showcase your work with a gallery of images (max 25).
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <GalleryUpload
                                    images={formData.gallery_images}
                                    onChange={(imgs) => setFormData({ ...formData, gallery_images: imgs })}
                                    maxImages={25}
                                />
                            </CardContent>
                        </Card>

                        {/* Portfolio / Files Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Portfolio & Documents</CardTitle>
                                <CardDescription>
                                    Upload PDF portfolios, rate cards, or brochures (max 20).
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PortfolioUpload
                                    files={formData.portfolio_files}
                                    onChange={(files) => setFormData({ ...formData, portfolio_files: files })}
                                    maxFiles={20}
                                />
                            </CardContent>
                        </Card>

                        {/* Basic Info Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Business Details</CardTitle>
                                <CardDescription>Update your basic business information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="business_name">Business Name</Label>
                                        <Input
                                            id="business_name"
                                            value={formData.business_name}
                                            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            id="category"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp">WhatsApp Link</Label>
                                        <Input
                                            id="whatsapp"
                                            value={formData.whatsapp_link}
                                            onChange={(e) => setFormData({ ...formData, whatsapp_link: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Primary Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Primary Image</CardTitle>
                                <CardDescription>
                                    This is the main image shown on your profile card.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                <FileUpload
                                    onUploaded={(url) => setFormData({ ...formData, portfolio_image_url: url })}
                                    defaultImage={formData.portfolio_image_url || user?.profile_image_url}
                                    label="Upload Brand Image"
                                />
                                <p className="text-xs text-muted-foreground mt-4 text-center">
                                    If not set, we'll use your personal profile picture.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Satus</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${vendor.verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="font-medium capitalize">{vendor.verified ? 'Verified' : 'Pending Verification'}</span>
                                </div>
                                {!vendor.verified && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Your profile is under review by our team.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
