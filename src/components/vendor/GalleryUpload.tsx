import { useState } from "react";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { mediaService } from "@/services/media";
import { toast } from "sonner";
import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
        } catch (error: any) {
            console.error("Gallery upload failed", error);
            const msg = error.response?.data?.error || "Failed to upload some images";
            toast.error(msg);
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
            <div className="relative">
                <Reorder.Group
                    axis="x"
                    values={images}
                    onReorder={onChange}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
                >
                    {images.map((url, index) => (
                        <GalleryItem
                            key={url}
                            url={url}
                            index={index}
                            onRemove={() => removeImage(index)}
                        />
                    ))}

                    {images.length < maxImages && (
                        <label className="flex-shrink-0 aspect-square w-32 md:w-36 border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all group snap-start">
                            {isUploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            ) : (
                                <>
                                    <Upload className="h-5 w-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider text-center">Add More</span>
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
                </Reorder.Group>
            </div>

            <div className="flex items-center justify-between px-1">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold uppercase tracking-tight">
                    <GripVertical className="h-3 w-3 opacity-50" />
                    Drag handle horizontally to reorder. First image is the cover.
                </p>
                <div className="text-[10px] font-black text-muted-foreground/40 bg-muted px-2 py-0.5 rounded-full">
                    {images.length} / {maxImages}
                </div>
            </div>
        </div>
    );
}

function GalleryItem({ url, index, onRemove }: { url: string; index: number; onRemove: () => void }) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={url}
            dragListener={false}
            dragControls={controls}
            className={`relative flex-shrink-0 aspect-square w-32 md:w-36 group rounded-xl overflow-hidden border bg-card transition-shadow hover:shadow-md snap-start ${index === 0 ? 'ring-2 ring-primary ring-offset-2' : 'border-muted'}`}
        >
            <Image
                src={url}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover pointer-events-none"
            />

            {/* Status Layers */}
            {index === 0 && (
                <div className="absolute top-2 left-2 z-10 pointer-events-none transition-opacity group-hover:opacity-0">
                    <Badge className="bg-primary/90 backdrop-blur-sm text-[10px] px-1.5 py-0 h-5 border-none shadow-sm font-bold" variant="default">
                        COVER
                    </Badge>
                </div>
            )}

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between items-start">
                    {index === 0 ? (
                        <Badge className="bg-primary text-[10px] px-1.5 py-0 h-5 border-none font-bold" variant="default">
                            COVER
                        </Badge>
                    ) : <div />}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="p-1.5 bg-white/20 hover:bg-red-500 rounded-full transition-colors text-white"
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div
                    className="flex justify-center pb-2 cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => controls.start(e)}
                >
                    <div className="bg-white p-2 rounded-lg text-primary shadow-lg transform active:scale-110 transition-transform">
                        <GripVertical className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </Reorder.Item>
    );
}
