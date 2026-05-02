import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap = {
      admin: '/admin/dashboard',
      user: '/stores',
      store_owner: '/owner/dashboard',
    };
    return <Navigate to={redirectMap[user?.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
