import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, FileText, Download, Trash2 } from "lucide-react";
import { mediaService } from "@/services/media";
import { toast } from "sonner";

interface PortfolioFile {
    name: string;
    url: string;
    size?: string; // Optional nice-to-have
}

interface PortfolioUploadProps {
    files: PortfolioFile[];
    onChange: (files: PortfolioFile[]) => void;
    maxFiles?: number;
}

export function PortfolioUpload({ files = [], onChange, maxFiles = 20 }: PortfolioUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadFiles = e.target.files;
        if (!uploadFiles || uploadFiles.length === 0) return;

        if (files.length + uploadFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files`);
            return;
        }

        setIsUploading(true);
        const newFiles = [...files];

        try {
            for (let i = 0; i < uploadFiles.length; i++) {
                const file = uploadFiles[i];
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`File ${file.name} is too large (>5MB)`);
                    continue;
                }

                // For PDF checking
                if (file.type !== "application/pdf") {
                    toast.error(`File ${file.name} is not a PDF`);
                    continue;
                }

                const url = await mediaService.uploadMedia(file);
                newFiles.push({
                    name: file.name,
                    url: url,
                    size: (file.size / 1024 / 1024).toFixed(2) + " MB"
                });
            }
            onChange(newFiles);
            toast.success("Portfolio updated successfully");
        } catch (error) {
            console.error("Portfolio upload failed", error);
            toast.error("Failed to upload some files");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        onChange(newFiles);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-3">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-600 dark:text-red-400">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm truncate hover:underline block">
                                    {file.name}
                                </a>
                                {file.size && <span className="text-xs text-muted-foreground">{file.size}</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                                title="Download/View"
                            >
                                <Download className="h-4 w-4" />
                            </a>
                            <button
                                onClick={() => removeFile(index)}
                                className="p-2 text-muted-foreground hover:text-red-600 rounded-full hover:bg-muted"
                                type="button"
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {files.length < maxFiles && (
                <div className="mt-2">
                    <label className="inline-flex">
                        <Button
                            variant="outline"
                            disabled={isUploading}
                            onClick={() => document.getElementById('portfolio-upload')?.click()}
                            type="button"
                            className="gap-2"
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Upload PDF
                        </Button>
                        <input
                            id="portfolio-upload"
                            type="file"
                            accept=".pdf"
                            multiple
                            className="hidden"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                        Max {maxFiles} files, 5MB each.
                    </p>
                </div>
            )}
        </div>
    );
}
