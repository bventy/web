import { api } from "@/lib/api";

export interface SignupRequest {
    email?: string;
    password?: string;
}

export interface LoginRequest {
    email?: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
}

export const authService = {
    signup: async (data: SignupRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/signup", data);
        return response.data;
    },
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", data);
        return response.data;
    },
};
