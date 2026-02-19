import { api } from "@/lib/api";

export interface MediaUploadResponse {
    url: string;
}

export const mediaService = {
    uploadMedia: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post<MediaUploadResponse>("/media/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.url;
    },
};
