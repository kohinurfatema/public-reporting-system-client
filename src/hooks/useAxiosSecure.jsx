// src/hooks/useAxiosSecure.jsx 

import axios from "axios";
// NOTE: Use your environment variable for the base URL
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// 💡 You will add the Firebase token interceptor logic here later.

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;