import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/token';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  if (isTokenExpired()) {
    localStorage.removeItem('token');
    toast.warning('Please log in to continue');
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
