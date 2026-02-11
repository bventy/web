import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
