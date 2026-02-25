import { Metadata } from "next";
import Link from "next/link";
import { VendorSignupForm } from "@/components/auth/VendorSignupForm";

export const metadata: Metadata = {
    title: "Join as Vendor | Bventy",
    description: "Start your journey as a vendor on Bventy.",
};

export default function JoinVendorPage() {
    return (
        <div className="container relative flex min-h-screen flex-col items-center justify-center py-12 md:py-24 lg:px-0">
            {/* Background elements for visual interest */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] pointer-events-none"></div>

            <div className="absolute top-4 right-4 md:top-8 md:right-8">
                <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                    <span className="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </Link>
            </div>

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-4xl bg-background/60 backdrop-blur-xl p-8 rounded-xl border shadow-sm">
                <div className="flex flex-col space-y-2 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="flex items-center text-lg font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-6 w-6"
                            >
                                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                            </svg>
                            Bventy for Business
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create a Vendor Account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your details below to create your account and business profile.
                    </p>
                </div>

                <VendorSignupForm />

                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
