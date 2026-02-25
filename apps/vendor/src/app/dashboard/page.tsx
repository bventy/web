"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@bventy/services";
import { vendorService, VendorProfile } from "@bventy/services";
import { quoteService } from "@bventy/services";
import { Navbar } from "@bventy/ui";
import { Footer } from "@bventy/ui";
import { Button } from "@bventy/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bventy/ui";
import { Input } from "@bventy/ui";
import { Textarea } from "@bventy/ui";
import { Label } from "@bventy/ui";
import { Separator } from "@bventy/ui";
import { Badge } from "@bventy/ui";
import { Loader2, ArrowLeft, Store, Save, ExternalLink, Phone, Mail, MessageCircle, X, Archive } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@bventy/ui";
import { GalleryUpload } from "@/components/vendor/GalleryUpload";
import { PortfolioUpload } from "@/components/vendor/PortfolioUpload";
import Link from "next/link";
import { QuoteContact } from "@bventy/services";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@bventy/ui";

export default function VendorDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [vendor, setVendor] = useState<VendorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Tabs & Quotes State
    const [activeTab, setActiveTab] = useState<'profile' | 'quotes'>('profile');
    const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [responses, setResponses] = useState<Record<string, { price: string, message: string, attachment: string }>>({});
    const [quoteTab, setQuoteTab] = useState<"active" | "archived">("active");

    // Contact Modal
    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
    const [contactInfo, setContactInfo] = useState<QuoteContact | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [contactLoading, setContactLoading] = useState(false);

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
                    router.push("/onboard");
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

                    // Fetch quotes if profile exists
                    try {
                        const quotesData = await quoteService.getQuoteRequests();
                        setQuoteRequests(quotesData);
                    } catch (err) {
                        console.error("Failed to fetch quote requests", err);
                    }

                } catch (err: any) {
                    console.error("Failed to fetch vendor profile", err);
                    // If vendor profile not found (404), redirect to onboarding
                    // This handles cases where user flag says true but profile is missing
                    if (err.response && err.response.status === 404) {
                        toast.error("Vendor profile not found. Please complete onboarding.");
                        router.push("/onboard");
                        return;
                    }
                    toast.error("Failed to load vendor profile");
                }
            } catch (error) {
                console.error(error);
                const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.bventy.in";
                const returnTo = encodeURIComponent(window.location.host);
                window.location.href = `${AUTH_URL}/login?returnTo=${returnTo}`;
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
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const errMsg = error.response?.data?.error || "Failed to update profile.";
            toast.error(errMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleRespond = async (id: string) => {
        const responseData = responses[id];
        if (!responseData || !responseData.price) return;

        setActionLoading(id);
        try {
            await quoteService.respondToQuote(id, Number(responseData.price), responseData.message, responseData.attachment);
            toast.success("Quote response sent!");
            const data = await quoteService.getQuoteRequests();
            setQuoteRequests(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to send response.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleContactVendor = async (quote: any) => {
        setSelectedQuote(quote);
        setContactLoading(true);
        setIsContactOpen(true);
        try {
            const info = await quoteService.getQuoteContact(quote.id);
            setContactInfo(info);
        } catch (error: any) {
            console.error("Failed to fetch contact info", error);
            const msg = error.response?.data?.error || "Failed to fetch contact information.";
            toast.error(msg);
            setIsContactOpen(false);
        } finally {
            setContactLoading(false);
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

                {/* Tabs */}
                <div className="mb-8 flex items-center gap-6 border-b">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'profile' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Business Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('quotes')}
                        className={`pb-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'quotes' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                        Quote Requests
                        {quoteRequests.filter(q => q.status === 'pending' || q.status === 'revision_requested').length > 0 && (
                            <span className="ml-2 bg-primary text-primary-foreground text-[10px] py-0.5 px-2 rounded-full">
                                {quoteRequests.filter(q => q.status === 'pending' || q.status === 'revision_requested').length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'profile' ? (
                    <div className="grid gap-6 md:grid-cols-[1fr_300px] animate-in fade-in-50">
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
                                    {formData.portfolio_image_url || user?.profile_image_url ? (
                                        <FileUpload
                                            onUploaded={(url) => setFormData({ ...formData, portfolio_image_url: url })}
                                            defaultUrl={formData.portfolio_image_url || user?.profile_image_url}
                                            label="Upload Brand Image"
                                        />
                                    ) : (
                                        <div className="space-y-4 flex flex-col items-center w-full">
                                            <div className="h-32 w-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-muted-foreground border-2 border-dashed border-muted-foreground/20">
                                                {(user?.full_name || user?.username || "V").charAt(0).toUpperCase()}
                                            </div>
                                            <FileUpload
                                                onUploaded={(url) => setFormData({ ...formData, portfolio_image_url: url })}
                                                label="Upload Brand Image"
                                            />
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-4 text-center">
                                        If not set, we'll use your personal profile picture or initials.
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
                ) : (
                    <div className="space-y-4 animate-in fade-in-50">
                        <div className="flex gap-4 mb-4 border-b pb-1">
                            <button
                                onClick={() => setQuoteTab("active")}
                                className={`pb-2 px-4 transition-colors relative text-xs ${quoteTab === 'active' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                            >
                                Active Requests
                                {quoteTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                            </button>
                            <button
                                onClick={() => setQuoteTab("archived")}
                                className={`pb-2 px-4 transition-colors relative text-xs ${quoteTab === 'archived' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                            >
                                Archived / Expired
                                {quoteTab === 'archived' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />}
                            </button>
                        </div>

                        {quoteRequests.filter(q => quoteTab === 'active' ? q.status !== 'archived' : q.status === 'archived').length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                    <Store className="h-8 w-8 mb-4 opacity-50" />
                                    <h3 className="text-lg font-semibold text-foreground mb-1">No Quote Requests Yet</h3>
                                    <p>When users request pricing for events, they will appear here.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            quoteRequests
                                .filter(q => quoteTab === 'active' ? q.status !== 'archived' : q.status === 'archived')
                                .map((quote) => (
                                    <Card key={quote.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{quote.event_title || quote.event_id}</CardTitle>
                                                    <CardDescription>
                                                        Requested by: {quote.organizer_name} • {quote.created_at ? new Date(quote.created_at).toLocaleDateString() : 'Unknown Date'}
                                                    </CardDescription>
                                                </div>
                                                <Badge
                                                    variant={
                                                        quote.status === 'pending' ? 'outline' :
                                                            quote.status === 'accepted' ? 'default' :
                                                                quote.status === 'responded' ? 'secondary' :
                                                                    quote.status === 'archived' ? 'outline' :
                                                                        quote.status === 'revision_requested' ? 'destructive' : 'secondary'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {quote.status === 'archived' ? 'Contact Expired' : quote.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {quote.message && (
                                                <div className="bg-muted p-4 rounded-md text-sm">
                                                    <p className="font-semibold mb-1 text-muted-foreground">Message from Organizer:</p>
                                                    <p>{quote.message}</p>
                                                </div>
                                            )}
                                            {quote.revision_message && (
                                                <div className="bg-orange-50 border border-orange-200 p-4 rounded-md text-sm">
                                                    <p className="font-semibold mb-1 text-orange-700 font-bold uppercase tracking-wider text-[10px]">Revision Feedback:</p>
                                                    <p className="text-orange-900">{quote.revision_message}</p>
                                                </div>
                                            )}
                                            {quote.budget_range && (
                                                <div className="bg-muted p-4 rounded-md text-sm">
                                                    <p className="font-semibold mb-1 text-muted-foreground">Budget Range:</p>
                                                    <p>{quote.budget_range}</p>
                                                </div>
                                            )}
                                            {quote.special_requirements && (
                                                <div className="bg-primary/5 border border-primary/20 p-4 rounded-md text-sm">
                                                    <p className="font-semibold mb-1 text-primary">Special Requirements:</p>
                                                    <p>{quote.special_requirements}</p>
                                                </div>
                                            )}
                                            {quote.deadline && (
                                                <div className="bg-muted p-4 rounded-md text-sm flex justify-between items-center">
                                                    <p className="font-semibold text-muted-foreground">Response Deadline:</p>
                                                    <p className="font-medium text-red-600">{new Date(quote.deadline).toLocaleDateString()}</p>
                                                </div>
                                            )}

                                            {(quote.status === 'pending' || quote.status === 'revision_requested') && (
                                                <div className="space-y-4 border-t pt-4 mt-4">
                                                    <h4 className="font-semibold text-sm">Send Response</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Your Quoted Price (₹)</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="e.g. 50000"
                                                                value={responses[quote.id]?.price || ''}
                                                                onChange={(e) => setResponses({
                                                                    ...responses,
                                                                    [quote.id]: { ...responses[quote.id], price: e.target.value }
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Response Message (Optional)</Label>
                                                        <Textarea
                                                            placeholder="Explain your pricing or offer details..."
                                                            value={responses[quote.id]?.message || ''}
                                                            onChange={(e) => setResponses({
                                                                ...responses,
                                                                [quote.id]: { ...responses[quote.id], message: e.target.value }
                                                            })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Attachment (Optional - PDF or Image)</Label>
                                                        <FileUpload
                                                            onUploaded={(url) => setResponses({
                                                                ...responses,
                                                                [quote.id]: { ...responses[quote.id], attachment: url }
                                                            })}
                                                            label="Upload Quote/Rate Card"
                                                            accept="image/*,application/pdf"
                                                        />
                                                        {responses[quote.id]?.attachment && (
                                                            <p className="text-xs text-green-600">File uploaded successfully.</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        onClick={() => handleRespond(quote.id)}
                                                        disabled={!responses[quote.id]?.price || actionLoading === quote.id}
                                                        className="w-full md:w-auto"
                                                    >
                                                        {actionLoading === quote.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                        {quote.status === 'revision_requested' ? "Send Revised Quote" : "Send Quote Response"}
                                                    </Button>
                                                </div>
                                            )}

                                            {quote.status === 'accepted' && (
                                                <div className="bg-green-50 border border-green-200 p-4 rounded-md mt-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                                            <p className="font-bold text-green-800">Quote Accepted!</p>
                                                        </div>
                                                        {quote.contact_expires_at && (
                                                            <p className="text-[10px] text-orange-600 font-semibold animate-pulse">
                                                                ACCESS EXPIRES: {new Date(quote.contact_expires_at).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-green-700 mb-4">The organizer has accepted your quote. You can now contact them directly.</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button variant="outline" size="sm" className="bg-white" onClick={() => handleContactVendor(quote)}>
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            View Organizer Contact
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {quote.status === 'archived' && (
                                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mt-4 flex items-center gap-3">
                                                    <X className="h-5 w-5 text-slate-400" />
                                                    <div>
                                                        <p className="font-bold text-slate-700">Contact Access Expired</p>
                                                        <p className="text-xs text-slate-500">The 15-day contact window has closed. This quote is now archived.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {quote.status !== 'pending' && quote.status !== 'revision_requested' && quote.quoted_price && (
                                                <div className="bg-primary/5 p-4 rounded-md mt-4 border border-primary/10">
                                                    <p className="font-semibold mb-1">Your response:</p>
                                                    <p className="font-medium">Quote: ₹{quote.quoted_price}</p>
                                                    {quote.vendor_response && <p className="text-sm mt-2 text-muted-foreground">{quote.vendor_response}</p>}
                                                    {quote.attachment_url && (
                                                        <div className="mt-3">
                                                            <a href={quote.attachment_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                                                <ExternalLink className="h-3 w-3" /> View Attachment
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                        )}
                    </div>
                )}
            </main>

            {/* Contact Dialog */}
            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Organizer Contact Information</DialogTitle>
                        <DialogDescription>
                            Direct communication unlocked with {contactInfo?.organizer.name} for {selectedQuote?.event_title}
                        </DialogDescription>
                        {selectedQuote?.contact_expires_at && (
                            <div className="mt-2 text-[10px] font-semibold text-orange-600 uppercase tracking-tight">
                                Access ends on {new Date(selectedQuote.contact_expires_at).toLocaleString()}
                            </div>
                        )}
                    </DialogHeader>

                    {contactLoading ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : contactInfo ? (
                        <div className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="flex items-center p-3 border rounded-lg">
                                    <Phone className="h-5 w-5 text-primary mr-3" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Phone Number</p>
                                        <a href={`tel:${contactInfo.organizer.phone}`} className="text-sm font-medium hover:underline">
                                            {contactInfo.organizer.phone || "Not provided"}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 border rounded-lg">
                                    <Mail className="h-5 w-5 text-primary mr-3" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Email Address</p>
                                        <a href={`mailto:${contactInfo.organizer.email}`} className="text-sm font-medium hover:underline">
                                            {contactInfo.organizer.email || "Not provided"}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            Failed to load contact information.
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsContactOpen(false)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}
