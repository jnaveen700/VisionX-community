import axios from 'axios';

// Define the base URL for your API
// In development, it will use http://localhost:5000/api
// In production, it will use the URL provided by Render (e.g., https://your-backend-name.onrender.com/api)
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Debug: log the API base URL
console.log('%c🔧 API Configuration', 'color: cyan; font-weight: bold; font-size: 12px;');
console.log('📍 API_BASE_URL:', API_BASE_URL);
console.log('📍 VITE_BACKEND_URL env:', import.meta.env.VITE_BACKEND_URL);
console.log('📍 Full API endpoint:', `${API_BASE_URL}/api`);
console.log('📍 Environment:', import.meta.env.MODE);

const api = axios.create({
    // Use the dynamically set API_BASE_URL here
    baseURL: `${API_BASE_URL}/api`, // Append '/api' if all your routes are under /api
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000, // 15 second timeout (increased from 5s for Render free tier)
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
    (config) => {
        console.log('%c📤 API Request', 'color: blue; font-weight: bold;', {
            method: config.method.toUpperCase(),
            url: config.url,
            fullUrl: config.baseURL + config.url,
        });
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
            console.log('🔑 Token (x-auth-token) attached, length:', token.length);
        } else {
            console.log('⚠️ No token found in localStorage');
        }
        return config;
    },
    (error) => {
        console.error('%c❌ Request Interceptor Error', 'color: red; font-weight: bold;', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('%c✅ API Response', 'color: green; font-weight: bold;', {
            status: response.status,
            url: response.config.url,
            dataSize: JSON.stringify(response.data).length + ' bytes'
        });
        return response;
    },
    (error) => {
        console.group('%c❌ API Error', 'color: red; font-weight: bold; font-size: 14px;');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('Error Config:', error.config);
        
        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout - server might be down');
            console.groupEnd();
            return Promise.reject(new Error('Server is not responding. Please try again later.'));
        }

        if (!error.response) {
            console.error('🌐 Network error - No response received');
            console.error('Trying to reach:', `${API_BASE_URL}/api`);
            console.error('Request was:', error.config?.method?.toUpperCase(), error.config?.url);
            console.groupEnd();
            return Promise.reject(new Error('Cannot connect to server. Check CORS or backend availability.'));
        }

        // Handle specific error status codes
        console.error('HTTP Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.groupEnd();
        
        switch (error.response.status) {
            case 404:
                return Promise.reject(new Error('Resource not found (404)'));
            case 500:
                return Promise.reject(new Error('Internal server error (500). Please try again later.'));
            case 403:
                return Promise.reject(new Error('Access forbidden (403)'));
            case 401:
                return Promise.reject(new Error('Unauthorized (401). Please log in.'));
            default:
                return Promise.reject(error);
        }
    }
);

export default api;
