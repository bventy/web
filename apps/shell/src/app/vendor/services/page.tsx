"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Button,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Input,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Textarea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Label
} from "@bventy/ui";
import {
    Plus,
    Edit2,
    Trash2,
    ShieldCheck,
    MapPin,
    LayoutGrid,
    Settings2,
    Loader2,
    Percent,
    Banknote,
    Clock,
    CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { vendorService, VendorServiceItem, VendorPricingRules, VendorCancellationPolicy, VendorServiceArea } from "@bventy/services";
import { toast } from "sonner";

export default function ServicesPricingPage() {
    const [services, setServices] = useState<VendorServiceItem[]>([]);
    const [rules, setRules] = useState<VendorPricingRules | null>(null);
    const [policy, setPolicy] = useState<VendorCancellationPolicy | null>(null);
    const [areas, setAreas] = useState<VendorServiceArea[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

    // Form states
    const [editingService, setEditingService] = useState<VendorServiceItem | null>(null);
    const [serviceForm, setServiceForm] = useState({
        name: "",
        base_price: 0,
        price_unit: "/ Participant",
        status: "active",
        description: ""
    });
    const [isCustomUnit, setIsCustomUnit] = useState(false);
    const [customUnit, setCustomUnit] = useState("");
    const [areaName, setAreaName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [s, r, p, a] = await Promise.all([
                vendorService.getServices(),
                vendorService.getPricingRules(),
                vendorService.getCancellationPolicy(),
                vendorService.getServiceAreas()
            ]);
            setServices(s);
            setRules(r);
            setPolicy(p);
            setAreas(a);
        } catch (err) {
            console.error("Failed to load services data:", err);
            toast.error("Failed to load your services and pricing data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSaveService = async () => {
        try {
            setIsSaving(true);
            const finalUnit = isCustomUnit ? `/ ${customUnit}` : serviceForm.price_unit;
            const payload = { ...serviceForm, price_unit: finalUnit };

            if (editingService) {
                await vendorService.updateService(editingService.id, payload);
                toast.success("Service updated successfully");
            } else {
                await vendorService.addService(payload);
                toast.success("Service added successfully");
            }
            setIsServiceModalOpen(false);
            setEditingService(null);
            setServiceForm({ name: "", base_price: 0, price_unit: "/ Participant", status: "active", description: "" });
            setIsCustomUnit(false);
            setCustomUnit("");
            loadData();
        } catch (err) {
            toast.error("Failed to save service");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            await vendorService.deleteService(id);
            toast.success("Service deleted");
            loadData();
        } catch (err) {
            toast.error("Failed to delete service");
        }
    };

    const toggleRule = async (key: keyof VendorPricingRules) => {
        if (!rules) return;
        try {
            const newRules = { ...rules, [key]: !rules[key] };
            setRules(newRules); // Optimistic update
            await vendorService.updatePricingRules({ [key]: newRules[key] });
        } catch (err) {
            toast.error("Failed to update pricing rule");
            loadData();
        }
    };

    const updateRules = async (updates: Partial<VendorPricingRules>) => {
        if (!rules) return;
        try {
            const newRules = { ...rules, ...updates };
            setRules(newRules);
            await vendorService.updatePricingRules(updates);
        } catch (err) {
            toast.error("Failed to update pricing rules");
            loadData();
        }
    };

    const handleSavePolicy = async () => {
        if (!policy) return;
        try {
            setIsSaving(true);
            await vendorService.updateCancellationPolicy(policy);
            toast.success("Cancellation policy updated");
            setIsPolicyModalOpen(false);
        } catch (err) {
            toast.error("Failed to update policy");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddArea = async () => {
        if (!areaName.trim()) return;
        try {
            setIsSaving(true);
            await vendorService.addServiceArea(areaName);
            setAreaName("");
            setIsAreaModalOpen(false);
            loadData();
            toast.success("Service area added");
        } catch (err) {
            toast.error("Failed to add area");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteArea = async (id: string) => {
        try {
            await vendorService.deleteServiceArea(id);
            loadData();
            toast.success("Area removed");
        } catch (err) {
            toast.error("Failed to remove area");
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services & Pricing</h1>
                    <p className="text-muted-foreground">Define your services, packages, and booking rules.</p>
                </div>
                <Button size="sm" onClick={() => {
                    setEditingService(null);
                    setServiceForm({ name: "", base_price: 0, price_unit: "/ Participant", status: "active", description: "" });
                    setIsCustomUnit(false);
                    setCustomUnit("");
                    setIsServiceModalOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Service
                </Button>
            </div>

            <div className="grid gap-8">
                {/* Services List */}
                <Card className="shadow-sm border-border/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Services List</CardTitle>
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Service Name</TableHead>
                                    <TableHead>Base Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No services defined. Add your first service to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    services.map((service) => (
                                        <TableRow key={service.id} className="group transition-colors hover:bg-muted/30">
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p>{service.name}</p>
                                                    {service.description && <p className="text-[10px] text-muted-foreground max-w-xs truncate">{service.description}</p>}
                                                </div>
                                            </TableCell>
                                            <TableCell>₹{service.base_price.toLocaleString()} <span className="text-xs text-muted-foreground">{service.price_unit}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={service.status === "active" ? "default" : "secondary"} className="capitalize">
                                                    {service.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => {
                                                        setEditingService(service);
                                                        setServiceForm({
                                                            name: service.name,
                                                            base_price: service.base_price,
                                                            price_unit: service.price_unit,
                                                            status: service.status,
                                                            description: service.description
                                                        });
                                                        setIsServiceModalOpen(true);
                                                    }}>
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteService(service.id)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pricing Rules */}
                    <Card className="shadow-sm border-border/40">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings2 className="h-4 w-4" /> Pricing Rules
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Weekend Rule */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-xl border border-border/40 p-4 transition-colors hover:bg-muted/10">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${rules?.weekend_premium_enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            <CalendarDays className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-semibold">Weekend Premium</p>
                                            <p className="text-xs text-muted-foreground">Surcharge on Fri, Sat, Sun</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => toggleRule('weekend_premium_enabled')}
                                        className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors duration-200 ${rules?.weekend_premium_enabled ? 'bg-primary' : 'bg-muted'}`}
                                    >
                                        <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all duration-200 ${rules?.weekend_premium_enabled ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {rules?.weekend_premium_enabled && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                            animate={{ height: "auto", opacity: 1, marginTop: -8 }}
                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                            className="overflow-hidden px-1"
                                        >
                                            <div className="p-4 rounded-xl border border-border/40 bg-muted/5 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</Label>
                                                        <Select value={rules.weekend_premium_type} onValueChange={v => updateRules({ weekend_premium_type: v as any })}>
                                                            <SelectTrigger className="h-9">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                                <SelectItem value="fixed">Fixed (₹)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Value</Label>
                                                        <div className="relative">
                                                            <Input 
                                                                type="number"
                                                                value={rules.weekend_premium_percentage || 0}
                                                                onChange={e => updateRules({ weekend_premium_percentage: Number(e.target.value) })}
                                                                className="h-9 pl-8"
                                                            />
                                                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                                                                {rules.weekend_premium_type === 'percentage' ? <Percent className="h-3 w-3" /> : <Banknote className="h-3 w-3" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Last Minute Rule */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-xl border border-border/40 p-4 transition-colors hover:bg-muted/10">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${rules?.last_minute_booking_enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-semibold">Last Minute Booking</p>
                                            <p className="text-xs text-muted-foreground">Surcharge for bookings within 7 days</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => toggleRule('last_minute_booking_enabled')}
                                        className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors duration-200 ${rules?.last_minute_booking_enabled ? 'bg-primary' : 'bg-muted'}`}
                                    >
                                        <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all duration-200 ${rules?.last_minute_booking_enabled ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {rules?.last_minute_booking_enabled && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                            animate={{ height: "auto", opacity: 1, marginTop: -8 }}
                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                            className="overflow-hidden px-1"
                                        >
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</Label>
                                                        <Select value={rules.last_minute_booking_type} onValueChange={v => updateRules({ last_minute_booking_type: v as any })}>
                                                            <SelectTrigger className="h-9">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                                <SelectItem value="fixed">Fixed (₹)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Value</Label>
                                                        <div className="relative">
                                                            <Input 
                                                                type="number"
                                                                value={rules.last_minute_booking_percentage || 0}
                                                                onChange={e => updateRules({ last_minute_booking_percentage: Number(e.target.value) })}
                                                                className="h-9 pl-8"
                                                            />
                                                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                                                                {rules.last_minute_booking_type === 'percentage' ? <Percent className="h-3 w-3" /> : <Banknote className="h-3 w-3" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 col-span-2 lg:col-span-1">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Threshold (Days)</Label>
                                                        <div className="relative">
                                                            <Input 
                                                                type="number"
                                                                value={rules.last_minute_days || 0}
                                                                onChange={e => updateRules({ last_minute_days: Number(e.target.value) })}
                                                                className="h-9 pl-8"
                                                            />
                                                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                                                                <CalendarDays className="h-3 w-3" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cancellation Policy */}
                    <Card className="shadow-sm border-orange-100 bg-orange-50/10">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-orange-600" /> Cancellation Policy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-bold capitalize">
                                    {policy?.strictness_level} ({policy?.time_frame_days}d)
                                </p>
                                <p className="text-xs text-muted-foreground italic">
                                    {policy?.refund_percentage}% refund if cancelled before {policy?.time_frame_days} days of the event.
                                    {policy?.strictness_level === 'custom' && policy.custom_text && ` Additional terms: ${policy.custom_text}`}
                                </p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full border-orange-200 hover:bg-orange-100/50 hover:text-orange-700" onClick={() => setIsPolicyModalOpen(true)}>
                                Configure Policy
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Service Areas */}
                <Card className="shadow-sm border-border/40">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Service Areas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {areas.length === 0 && <p className="text-xs text-muted-foreground">No specific areas defined. All locations accepted by default.</p>}
                            {areas.map((area) => (
                                <Badge key={area.id} variant="secondary" className="px-3 py-1.5 flex gap-2 items-center hover:bg-muted transition-colors border-border/40 text-xs font-medium">
                                    {area.name}
                                    <Trash2
                                        className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-destructive transition-colors"
                                        onClick={() => handleDeleteArea(area.id)}
                                    />
                                </Badge>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[11px] border border-dashed border-border/60 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all"
                                onClick={() => setIsAreaModalOpen(true)}
                            >
                                <Plus className="h-3 w-3 mr-1" /> Add Area
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Service Dialog */}
            <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Service Name</Label>
                            <Input
                                placeholder="e.g. Corporate Technical Workshop"
                                value={serviceForm.name}
                                onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Base Price (₹)</Label>
                                <Input
                                    type="number"
                                    value={serviceForm.base_price}
                                    onChange={e => setServiceForm({ ...serviceForm, base_price: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Unit</Label>
                                <Select
                                    value={isCustomUnit ? "Custom" : serviceForm.price_unit}
                                    onValueChange={v => {
                                        if (v === "Custom") {
                                            setIsCustomUnit(true);
                                        } else {
                                            setIsCustomUnit(false);
                                            setServiceForm({ ...serviceForm, price_unit: v });
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="/ Participant">/ Participant</SelectItem>
                                        <SelectItem value="/ Hour">/ Hour</SelectItem>
                                        <SelectItem value="/ Day">/ Day</SelectItem>
                                        <SelectItem value="/ Event">/ Event</SelectItem>
                                        <SelectItem value="Fixed">Fixed Price</SelectItem>
                                        <SelectItem value="Custom">Custom Unit...</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {isCustomUnit && (
                            <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
                                <Label>Custom Unit Name</Label>
                                <Input
                                    placeholder="e.g. License, Module, Seat"
                                    value={customUnit}
                                    onChange={e => setCustomUnit(e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground uppercase">Will be displayed as "/ {customUnit || '...'}"</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Details about this service..."
                                value={serviceForm.description}
                                onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={serviceForm.status} onValueChange={v => setServiceForm({ ...serviceForm, status: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveService} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Policy Dialog */}
            <Dialog open={isPolicyModalOpen} onOpenChange={setIsPolicyModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Cancellation Policy</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Strictness Level</Label>
                                <Select
                                    value={policy?.strictness_level}
                                    onValueChange={v => setPolicy(prev => prev ? { ...prev, strictness_level: v as any } : null)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="flexible">Flexible</SelectItem>
                                        <SelectItem value="moderate">Moderate</SelectItem>
                                        <SelectItem value="strict">Strict</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Time Frame (Days before)</Label>
                                <Input
                                    type="number"
                                    value={policy?.time_frame_days}
                                    onChange={e => setPolicy(prev => prev ? { ...prev, time_frame_days: Number(e.target.value) } : null)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Refund Percentage ({policy?.refund_percentage}%)</Label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={policy?.refund_percentage}
                                onChange={e => setPolicy(prev => prev ? { ...prev, refund_percentage: Number(e.target.value) } : null)}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
                                <span>No Refund</span>
                                <span>Partial</span>
                                <span>Full Refund</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Internal Policy Label</Label>
                            <Input
                                placeholder="e.g. Standard Corporate Policy"
                                value={policy?.policy_type}
                                onChange={e => setPolicy(prev => prev ? { ...prev, policy_type: e.target.value } : null)}
                            />
                        </div>

                        {policy?.strictness_level === 'custom' && (
                            <div className="space-y-2 animate-in fade-in duration-300">
                                <Label>Custom Policy Terms</Label>
                                <Textarea
                                    placeholder="Enter your detailed custom terms..."
                                    value={policy.custom_text}
                                    onChange={e => setPolicy(prev => prev ? { ...prev, custom_text: e.target.value } : null)}
                                    rows={4}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPolicyModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSavePolicy} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Policy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Area Dialog */}
            <Dialog open={isAreaModalOpen} onOpenChange={setIsAreaModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Service Area</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>City / Locality Name</Label>
                            <Input
                                placeholder="e.g. South Mumbai"
                                value={areaName}
                                onChange={e => setAreaName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddArea()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAreaModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddArea} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Area
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
