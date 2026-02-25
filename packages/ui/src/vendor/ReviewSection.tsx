"use client";
"use client";

import { useState, useEffect } from "react";
import { Review, vendorService  } from "@bventy/services";
import { Star, MessageSquare, User, Loader2, Plus, Calendar } from "lucide-react";
import { Button  } from "@bventy/ui";
import { Textarea  } from "@bventy/ui";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
 } from "@bventy/ui";
import { Label  } from "@bventy/ui";
import { useAuth  } from "@bventy/services";

interface ReviewSectionProps {
    vendorId: string;
    vendorName: string;
}

export function ReviewSection({ vendorId, vendorName }: ReviewSectionProps) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isEligible, setIsEligible] = useState(false);
    const [checkingEligibility, setCheckingEligibility] = useState(false);

    const fetchReviews = async () => {
        try {
            const data = await vendorService.getVendorReviews(vendorId);
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEligibility = async () => {
        if (!user) return;
        setCheckingEligibility(true);
        try {
            const { eligible } = await vendorService.checkReviewEligibility(vendorId);
            setIsEligible(eligible);
        } catch (error) {
            console.error("Failed to check eligibility", error);
        } finally {
            setCheckingEligibility(false);
        }
    };

    useEffect(() => {
        if (vendorId) {
            fetchReviews();
            fetchEligibility();
        }
    }, [vendorId, user]);

    const handleSubmitReview = async () => {
        if (rating < 1) {
            toast.error("Please select a rating");
            return;
        }
        setSubmitting(true);
        try {
            await vendorService.submitReview(vendorId, rating, comment);
            toast.success("Review submitted! Thank you for your feedback.");
            setReviewDialogOpen(false);
            setComment("");
            setRating(5);
            fetchReviews();
            fetchEligibility(); // Refresh eligibility (though likely they only review once)
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (count: number, interactive = false) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={interactive ? 24 : 16}
                        className={`${star <= count ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"} 
                            ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
                        onClick={() => interactive && setRating(star)}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <section className="mt-16 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Reviews ({reviews.length})</h2>
                    <p className="text-sm text-muted-foreground">What other organizers are saying about {vendorName}.</p>
                </div>

                {user && (
                    <div className="flex items-center gap-4">
                        {!isEligible && !checkingEligibility && (
                            <p className="text-xs text-muted-foreground italic max-w-[200px] text-right">
                                You can leave a review after your event with this vendor is completed.
                            </p>
                        )}
                        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    disabled={!isEligible || checkingEligibility}
                                >
                                    {checkingEligibility ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                    Write a Review
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Leave a Review</DialogTitle>
                                    <DialogDescription>
                                        Share your experience with <strong>{vendorName}</strong>.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-6">
                                    <div className="space-y-2 text-center">
                                        <Label>Rating</Label>
                                        <div className="flex justify-center pt-2">
                                            {renderStars(rating, true)}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Your Feedback</Label>
                                        <Textarea
                                            placeholder="What was it like working with them?"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSubmitReview} disabled={submitting}>
                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Review
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            {reviews.length > 0 ? (
                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 border rounded-xl bg-card shadow-sm space-y-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border ring-2 ring-background">
                                            {review.profile_image ? (
                                                <img src={review.profile_image} alt={review.organizer_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm tracking-tight">{review.organizer_name}</p>
                                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(review.created_at))} ago
                                            </div>
                                        </div>
                                    </div>
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    "{review.comment}"
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-12 text-center border rounded-2xl bg-muted/20 border-dashed">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No reviews yet.</p>
                    <p className="text-sm text-muted-foreground/60">Be the first to share your experience!</p>
                </div>
            )}
        </section>
    );
}
