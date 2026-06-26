import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-dark-muted font-medium">Loading RateHub...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard
    const redirectMap = {
      ADMIN: '/admin',
      STORE_OWNER: '/owner',
      USER: '/dashboard',
    };
    return <Navigate to={redirectMap[user?.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
