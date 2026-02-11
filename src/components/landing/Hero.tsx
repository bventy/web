"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
            >
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Find Event Vendors <br className="hidden sm:inline" />
                    in Your City
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                    DJs, Decorators, Venues, Caterers - all in one place. <br className="hidden sm:inline" />
                    Book trusted professionals for your next event.
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-4 sm:flex-row"
            >
                <Button size="lg" asChild>
                    <Link href="/vendors">Explore Vendors</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/signup">Join as Vendor</Link>
                </Button>
            </motion.div>
        </section>
    );
}
