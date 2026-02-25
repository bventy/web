import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;
      // Don't redirect if we're already on an auth page
      if (!window.location.hostname.includes('auth.') && AUTH_URL) {
        window.location.href = `${AUTH_URL}/login`;
      }
    }
    return Promise.reject(error);
  }
);
