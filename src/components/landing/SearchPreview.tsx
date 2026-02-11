"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export function SearchPreview() {
    return (
        <section className="container mx-auto px-4 py-12">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:p-8">
                <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
                    <Input placeholder="City (e.g. Mumbai)" className="h-12" />
                    <Input placeholder="Category (e.g. DJ)" className="h-12" />
                </div>
                <Button size="lg" className="h-12 w-full md:w-auto" asChild>
                    <Link href="/vendors">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Link>
                </Button>
            </div>
        </section>
    );
}
