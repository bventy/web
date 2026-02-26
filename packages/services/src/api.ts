import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Note: We use withCredentials: true to send cookies automatically.
// The Authorization header is no longer needed as we rely on secure cookies.


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We handle redirects in the AuthContext or individual apps instead
    // of a global interceptor to avoid loops on public pages.
    return Promise.reject(error);
  }
);
