import { Navbar } from "@bventy/ui";
import { Footer } from "@bventy/ui";
import { Hero } from "@/components/landing/Hero";
import { SearchPreview } from "@/components/landing/SearchPreview";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { TrustSection } from "@/components/landing/TrustSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SearchPreview />
        <CategoryGrid />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}
