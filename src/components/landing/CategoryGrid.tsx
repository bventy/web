import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Music, Utensils, Warehouse, PartyPopper } from "lucide-react";
import Link from "next/link";

const categories = [
    {
        title: "DJs",
        icon: Music,
        href: "/vendors?category=dj",
        description: "Spin the perfect vibe.",
    },
    {
        title: "Decor",
        icon: PartyPopper,
        href: "/vendors?category=decor",
        description: "Transform your venue.",
    },
    {
        title: "Venues",
        icon: Warehouse,
        href: "/vendors?category=venue",
        description: "Find the perfect space.",
    },
    {
        title: "Catering",
        icon: Utensils,
        href: "/vendors?category=catering",
        description: "Delicious food & drinks.",
    },
    {
        title: "Photography",
        icon: Camera,
        href: "/vendors?category=photography",
        description: "Capture every moment.",
    },
];

export function CategoryGrid() {
    return (
        <section className="container mx-auto py-12 md:py-24">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
                Browse by Category
            </h2>
            <div className="grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {categories.map((category) => (
                    <Link key={category.title} href={category.href}>
                        <Card className="h-full transition-colors hover:bg-muted/50">
                            <CardHeader>
                                <category.icon className="h-8 w-8 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="mb-2">{category.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {category.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
