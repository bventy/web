"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="container relative mx-auto flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-[100px]" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-4"
            >
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Find Event Vendors <br className="hidden sm:inline" />
                    in Your City
                </h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl"
                >
                    DJs, Decorators, Venues, Caterers - all in one place. <br className="hidden sm:inline" />
                    Book trusted professionals for your next event.
                </motion.p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col gap-4 sm:flex-row"
            >
                <Button size="lg" className="h-12 px-8 text-base transition-transform hover:scale-105 active:scale-95" asChild>
                    <Link href="/vendors">Explore Vendors</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base transition-transform hover:scale-105 active:scale-95" asChild>
                    <Link href="/auth/signup">Join as Vendor</Link>
                </Button>
            </motion.div>
        </section>
    );
}
