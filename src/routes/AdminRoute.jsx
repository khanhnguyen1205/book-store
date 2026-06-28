import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

/**
 * Bảo vệ các trang admin: yêu cầu đăng nhập VÀ role === 'admin'.
 *  - Chưa đăng nhập  -> về /login.
 *  - Đã đăng nhập nhưng không phải admin -> về trang chủ.
 *
 * Lưu ý: đây là guard CLIENT-SIDE. JSON Server không kiểm tra quyền ở phía
 * server, nên với backend thật cần xác thực lại quyền trên mỗi endpoint.
 */
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default AdminRoute;
