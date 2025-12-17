// src/hooks/useAxiosSecure.jsx

import axios from "axios";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// Track if interceptors are already set up (singleton pattern)
let interceptorsSetup = false;
let userRef = { current: null };

const setupInterceptors = () => {
    if (interceptorsSetup) return;
    interceptorsSetup = true;

    // Request interceptor to add Firebase ID token
    axiosSecure.interceptors.request.use(
        async (config) => {
            const user = userRef.current;
            console.log('[axios] Making request to:', config.url);
            console.log('[axios] User available:', !!user);

            if (user) {
                try {
                    const token = await user.getIdToken(true);
                    console.log('[axios] Token obtained, length:', token?.length);
                    config.headers.Authorization = `Bearer ${token}`;
                } catch (error) {
                    console.error('[axios] Error getting Firebase token:', error.code, error.message);
                }
            } else {
                console.warn('[axios] No user available for token - request will fail auth');
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor for handling auth errors
    axiosSecure.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.error('[axios] Auth error:', error.response?.data?.message);
            }
            return Promise.reject(error);
        }
    );
};

// Setup interceptors immediately
setupInterceptors();

const useAxiosSecure = () => {
    const { user } = useAuth();

    // Update user reference SYNCHRONOUSLY (not in useEffect)
    userRef.current = user;

    console.log('[useAxiosSecure] Hook called, user:', user?.email);

    return axiosSecure;
};

export default useAxiosSecure;
