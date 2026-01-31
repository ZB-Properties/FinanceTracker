import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/token';

const ProtectedRoute = ({ children }) => {
  if (isTokenExpired()) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
