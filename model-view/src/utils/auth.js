
import { toast } from 'react-toastify';

export const logout = (navigate) => {
  localStorage.removeItem('token');
  toast.info('Logged out successfully');
  navigate('/login');
};
