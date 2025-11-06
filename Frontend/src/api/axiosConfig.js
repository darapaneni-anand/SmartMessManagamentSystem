import axios from 'axios';

// Get API base URL from environment variable or fallback to localhost
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_BASE_URL = BASE.endsWith('/api') ? BASE : `${BASE}/api`;


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and normalize response format
api.interceptors.response.use(
  (response) => {
    // Handle new response format { success: true, data: ... }
    // and old format (direct data)
    if (response.data && typeof response.data === 'object') {
      if (response.data.success !== undefined && response.data.data !== undefined) {
        // New format - extract data
        return { ...response, data: response.data.data };
      }
      // Old format - return as is
      return response;
    }
    return response;
  },
  async (error) => {
    // Handle error response format
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.success === false && errorData.message) {
        error.response.data = errorData.message;
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;