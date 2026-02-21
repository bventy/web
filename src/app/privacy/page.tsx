import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy | Bventy",
    description: "Bventy's transparent and open-source privacy policy.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-black text-white px-6 py-20 flex justify-center selection:bg-white selection:text-black">
            <div className="max-w-3xl w-full">
                <div className="mb-16">
                    <Link
                        href="/"
                        className="text-white/50 hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide flex items-center gap-2"
                    >
                        &larr; Back to Home
                    </Link>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                    Privacy Policy
                </h1>

                <p className="text-white/70 text-lg leading-relaxed mb-12">
                    Effective Date: February 22, 2026<br />
                    At Bventy, we believe in radical transparency. In the spirit of open-source development, we want you to know exactly what data we collect, how we collect it, and why. We do not sell your data. We use telemetry strictly to improve the platform and provide a world-class experience.
                </p>

                <div className="space-y-12">

                    <section>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4">
                            1. Information We Collect
                        </h2>
                        <div className="space-y-4 text-white/70 leading-relaxed">
                            <p>
                                <strong>When you visit anonymously:</strong> We collect basic telemetry data such as your referring URL, device type, general location (country/city), and the pages you visit.
                            </p>
                            <p>
                                <strong>When you create an account:</strong> We collect the information you explicitly provide: your name, email address, password (securely hashed), and any profile information you choose to upload (portfolios, event details, etc.).
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4">
                            2. How We Track Usage (Analytics)
                        </h2>
                        <div className="space-y-4 text-white/70 leading-relaxed">
                            <p>
                                We use two primary analytics tools to understand how Bventy is used. To ensure we have complete and accurate data to improve our platform, <strong>we actively route this analytics traffic through our own first-party servers (Reverse Proxies)</strong>. This means our tracking scripts are deliberately constructed to bypass browser ad-blockers and privacy shields.
                            </p>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mt-4">
                                <h3 className="text-lg font-medium text-white mb-2">Umami Analytics</h3>
                                <p className="text-sm">
                                    We use Umami for lightweight, privacy-focused dashboarding. Umami is entirely cookieless and does not track you across the broader internet. It simply tells us how many people are visiting our site and which pages are most popular.
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-lg font-medium text-white mb-2">PostHog Analytics</h3>
                                <p className="text-sm mb-3">
                                    We use PostHog for deep, technical product analytics. This tool is highly aggressive in capturing data so we can squash bugs and understand user flows. PostHog captures:
                                </p>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    <li><strong>Autocapture:</strong> Every click, scroll, and form interaction.</li>
                                    <li><strong>Session Recordings:</strong> Video-like playbacks of your screen interactions while using the platform.</li>
                                    <li><strong>Identity Mapping:</strong> When you log into Bventy, we explicitly link your anonymous session data (including recordings) to your actual User Profile (Name, Email, ID). This allows our engineering team to provide highly targeted support if you encounter an error.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4">
                            3. Why We Collect This Data
                        </h2>
                        <div className="space-y-4 text-white/70 leading-relaxed">
                            <p>
                                Building a complex marketplace requires deep insights. If a vendor struggles to upload a portfolio, or if an event planner encounters a broken button, we use session recordings and telemetry to see exactly what went wrong without needing you to write a lengthy bug report. We collect data to make Bventy faster, less buggy, and more intuitive.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4">
                            4. Data Sharing & Third Parties
                        </h2>
                        <div className="space-y-4 text-white/70 leading-relaxed">
                            <p>
                                We do not sell your personal data to data brokers, advertisers, or third-party marketers. Your data is housed securely within our database infrastructure (Render/PostgreSQL), our media storage (Cloudflare R2), and our analytics providers (Umami Cloud and PostHog US).
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4">
                            5. Your Rights & Contact
                        </h2>
                        <div className="space-y-4 text-white/70 leading-relaxed">
                            <p>
                                Because we are an open platform, we believe you have a right to your data. If you wish to have your account, your data, or your analytics sessions permanently deleted from our servers, please contact us.
                            </p>
                            <p>
                                If you have privacy-specific concerns or questions about this policy, reach out directly at: <strong>privacy@bventy.in</strong>
                            </p>
                        </div>
                    </section>

                </div>

                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
                    <p>© {new Date().getFullYear()} Bventy. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
