import axios from 'axios';

// Define the base URL for your API
// In development, it will use http://localhost:5000/api
// In production, it will use the URL provided by Render (e.g., https://your-backend-name.onrender.com/api)
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Debug: log the API base URL
console.log('🔧 API_BASE_URL:', API_BASE_URL);
console.log('🔧 VITE_BACKEND_URL env:', import.meta.env.VITE_BACKEND_URL);
console.log('🔧 Full API endpoint:', `${API_BASE_URL}/api`);

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
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('❌ Request timeout - server might be down', error);
            return Promise.reject(new Error('Server is not responding. Please try again later.'));
        }

        if (!error.response) {
            console.error('❌ Network error:', error.message);
            console.error('Trying to reach:', `${API_BASE_URL}/api`);
            return Promise.reject(new Error('Cannot connect to server. Please check your internet connection.'));
        }

        // Handle specific error status codes
        console.error('❌ API Error Status:', error.response.status);
        switch (error.response.status) {
            case 404:
                return Promise.reject(new Error('Resource not found'));
            case 500:
                return Promise.reject(new Error('Internal server error. Please try again later.'));
            default:
                return Promise.reject(error);
        }
    }
);

export default api;
