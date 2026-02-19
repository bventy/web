import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { mediaService } from "@/services/media";
import { toast } from "sonner";
import Image from "next/image";

interface GalleryUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export function GalleryUpload({ images = [], onChange, maxImages = 25 }: GalleryUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (images.length + files.length > maxImages) {
            toast.error(`You can only upload up to ${maxImages} images`);
            return;
        }

        setIsUploading(true);
        const newImages = [...images];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`File ${file.name} is too large (>5MB)`);
                    continue;
                }
                const url = await mediaService.uploadMedia(file);
                newImages.push(url);
            }
            onChange(newImages);
            toast.success("Gallery updated successfully");
        } catch (error) {
            console.error("Gallery upload failed", error);
            toast.error("Failed to upload some images");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border bg-muted">
                        <Image
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-red-500 hover:text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <label className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors aspect-square">
                        {isUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                <span className="text-xs text-muted-foreground font-medium">Add Image</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                    </label>
                )}
            </div>
            <p className="text-xs text-muted-foreground">
                {images.length} / {maxImages} images
            </p>
        </div>
    );
}
