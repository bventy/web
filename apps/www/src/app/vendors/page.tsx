"use client";

import { useEffect, useState } from "react";
import { VendorProfile, vendorService  } from "@bventy/services";
import { VendorCard } from "@bventy/ui";
import { Input  } from "@bventy/ui";
import { Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
 } from "@bventy/ui";
import { Navbar } from "@bventy/ui";
import { Footer } from "@bventy/ui";
import { Loader2, Search, FilterX } from "lucide-react";
import { Button  } from "@bventy/ui";

const CATEGORIES = ["All", "DJ", "Decor", "Venue", "Catering", "Photography"];

import { Skeleton  } from "@bventy/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function VendorMarketplacePage() {
    const [vendors, setVendors] = useState<VendorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedCity, setSelectedCity] = useState("All");

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await vendorService.getVendors();
                setVendors(data || []);
            } catch (error) {
                console.error("Failed to fetch vendors", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    // Compute unique cities for filter dropdown
    const cities = ["All", ...Array.from(new Set((vendors || []).map((v) => v.city))).sort()];

    const filteredVendors = (vendors || []).filter((vendor) => {
        const matchesSearch = vendor.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.bio.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || vendor.category === selectedCategory;
        const matchesCity = selectedCity === "All" || vendor.city === selectedCity;

        return matchesSearch && matchesCategory && matchesCity;
    });

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSelectedCity("All");
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto p-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 space-y-4"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight">Explore Verified Vendors</h1>
                    <p className="text-lg text-muted-foreground">Find the perfect vendors for your next event.</p>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-70" />
                            <Input
                                placeholder="Search by name, bio, or service..."
                                className="h-11 pl-10 shadow-sm transition-shadow focus:shadow-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-11 w-full md:w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="h-11 w-full md:w-[180px]">
                                <SelectValue placeholder="City" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((city) => (
                                    <SelectItem key={city} value={city}>
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(searchQuery || selectedCategory !== "All" || selectedCity !== "All") && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearFilters}
                                title="Clear Filters"
                                className="h-11 w-11 text-muted-foreground hover:text-destructive"
                            >
                                <FilterX className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Grid */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex flex-col space-y-3">
                                    <Skeleton className="h-[200px] w-full rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredVendors.length > 0 ? (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                >
                                    {filteredVendors.map((vendor) => (
                                        <motion.div
                                            key={vendor.id || vendor.slug}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <VendorCard vendor={vendor} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex h-64 flex-col items-center justify-center space-y-6 text-center"
                                >
                                    <div className="rounded-full bg-muted p-6">
                                        <Search className="h-12 w-12 text-muted-foreground opacity-20" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-semibold">No vendors found</p>
                                        <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
                                    </div>
                                    <Button variant="outline" size="lg" onClick={clearFilters} className="px-8">
                                        Clear All Filters
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
