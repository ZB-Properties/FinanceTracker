
import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
      const isAuthRequest =
        configUrlIsAuth(error.config?.url);

      if (status === 401 && !isAuthRequest) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 401) {
        toast.error(data?.message || 'Invalid email or password.');
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else {
        toast.error(data?.message || 'Something went wrong.');
      }
    } else {
      toast.error('Unable to connect to the server. Please try again.');
    }

    return Promise.reject(error);
  }
);

function configUrlIsAuth(url = '') {
  return url.includes('/auth/login') ||
         url.includes('/auth/register');
}

export default axiosInstance;
