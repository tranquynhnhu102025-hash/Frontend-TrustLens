import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('access_token');

  // Nếu không có vé -> Đá thẳng về trang Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có vé -> Cho vào
  return <Outlet />;
}