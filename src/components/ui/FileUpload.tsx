import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { mediaService } from "@/services/media";
import { toast } from "sonner";
import Image from "next/image";

interface FileUploadProps {
    onUploaded?: (url: string) => void;
    onFileSelect?: (file: File | null) => void;
    defaultUrl?: string;
    label?: string;
}

export function FileUpload({ onUploaded, onFileSelect, defaultUrl, label = "Upload Image" }: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // If manual selection handling is requested (e.g., for auth forms), skip immediate upload
        if (onFileSelect) {
            onFileSelect(file);
            return;
        }

        // Otherwise, upload immediately (for authenticated sessions)
        setIsLoading(true);

        try {
            const url = await mediaService.uploadMedia(file);
            console.log("Uploaded URL:", url);
            if (onUploaded) onUploaded(url);
            toast.success("Image uploaded successfully");
            setPreview(url);
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image");
            setPreview(defaultUrl || null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreview(null);
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
                accept="image/*"
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
                        <p className="text-xs text-muted-foreground mt-1">Click to select</p>
                    </div>
                </div>
            ) : (
                <div className="relative group w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                    />

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {!isLoading && (
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
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
