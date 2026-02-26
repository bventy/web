import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Removed Authorization header interceptor to strictly prefer HttpOnly cookies
// for cross-subdomain security and Safari ITP compatibility.


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We handle redirects in the AuthContext or individual apps instead
    // of a global interceptor to avoid loops on public pages.
    return Promise.reject(error);
  }
);
