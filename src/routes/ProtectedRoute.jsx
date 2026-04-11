import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

/**
 * Wraps any route that requires authentication.
 * Redirects unauthenticated users to /login, preserving the intended destination.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
