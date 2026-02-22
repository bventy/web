import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon, FileText } from "lucide-react";
import { mediaService } from "@/services/media";
import { toast } from "sonner";
import Image from "next/image";

interface FileUploadProps {
    onUploaded?: (url: string) => void;
    onFileSelect?: (file: File | null) => void;
    defaultUrl?: string;
    label?: string;
    accept?: string;
    maxSize?: number; // in bytes
}

export function FileUpload({
    onUploaded,
    onFileSelect,
    defaultUrl,
    label = "Upload Image",
    accept = "image/*",
    maxSize = 5 * 1024 * 1024 // Default 5MB
}: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPdf, setIsPdf] = useState(defaultUrl?.toLowerCase().endsWith('.pdf') || false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new (window as any).Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                        } else {
                            resolve(file);
                        }
                    }, 'image/jpeg', 0.8);
                };
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.[0];
        if (!file) return;

        if (file.size > maxSize) {
            toast.error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const isPdfFile = file.type === "application/pdf";
        setIsPdf(isPdfFile);

        // Preview
        if (isPdfFile) {
            setPreview("PDF_ICON"); // Marker for PDF icon
        } else {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }

        if (onFileSelect) {
            onFileSelect(file);
            return;
        }

        setIsLoading(true);

        try {
            // Compress if it's an image
            if (file.type.startsWith("image/")) {
                file = await compressImage(file);
            }

            const url = await mediaService.uploadMedia(file);
            if (onUploaded) onUploaded(url);
            toast.success("File uploaded successfully");

            if (isPdfFile) {
                setPreview(url); // Store the actual URL but keep marker for render if needed
                setIsPdf(true);
            } else {
                setPreview(url);
                setIsPdf(false);
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload file");
            setPreview(defaultUrl || null);
            setIsPdf(defaultUrl?.toLowerCase().endsWith('.pdf') || false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreview(null);
        setIsPdf(false);
        if (onUploaded) onUploaded("");
        if (onFileSelect) onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
            />

            {!preview ? (
                <div
                    onClick={handleClick}
                    className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-muted/50 hover:bg-muted"
                >
                    <div className="p-3 bg-background rounded-full shadow-sm">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground mt-1">Images or PDF (max 5MB)</p>
                    </div>
                </div>
            ) : (
                <div className="relative group w-full h-48 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                    {isPdf || preview === "PDF_ICON" ? (
                        <div className="flex flex-col items-center gap-2">
                            <FileText className="h-12 w-12 text-red-500" />
                            <span className="text-xs font-medium text-muted-foreground">PDF Document</span>
                        </div>
                    ) : (
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                        />
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {!isLoading && (
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
