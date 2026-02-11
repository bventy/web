"use client";

import { useEffect, useState } from "react";
import { VendorProfile, vendorService } from "@/services/vendor";
import { VendorCard } from "@/components/vendor/VendorCard";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "DJ", "Decor", "Venue", "Catering", "Photography"];

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
                setVendors(data);
            } catch (error) {
                console.error("Failed to fetch vendors", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    // Compute unique cities for filter dropdown
    const cities = ["All", ...Array.from(new Set(vendors.map((v) => v.city))).sort()];

    const filteredVendors = vendors.filter((vendor) => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                <div className="mb-8 space-y-4">
                    <h1 className="text-3xl font-bold">Explore Verified Vendors</h1>
                    <p className="text-muted-foreground">Find the perfect vendors for your next event.</p>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search vendors..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[180px]">
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
                            <SelectTrigger className="w-full md:w-[180px]">
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
                            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear Filters">
                                <FilterX className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-[300px] rounded-lg bg-muted/50 animate-pulse" />
                        ))}
                    </div>
                ) : filteredVendors.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredVendors.map((vendor) => (
                            <VendorCard key={vendor.id} vendor={vendor} />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
                        <p className="text-lg font-medium text-muted-foreground">No vendors found matching your criteria.</p>
                        <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
