import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Unauthorized / expired token
      if (status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }

      
      if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      }

      
      if (status >= 400 && status !== 401) {
        toast.error(data?.message || 'Something went wrong');
      }
    } else {
      toast.error('Network error. Check your connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
