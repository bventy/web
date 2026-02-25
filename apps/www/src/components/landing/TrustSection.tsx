import { CheckCircle2 } from "lucide-react";

export function TrustSection() {
    return (
        <section className="border-t bg-muted/50 py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
                    <div className="rounded-full bg-primary/10 p-3">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Verified Professionals</h2>
                    <p className="text-lg text-muted-foreground">
                        Peace of mind included. Every vendor on Bventy is thoroughly reviewed and verified before being listed in our marketplace.
                    </p>
                </div>
            </div>
        </section>
    );
}
