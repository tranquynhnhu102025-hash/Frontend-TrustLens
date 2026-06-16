import { Navigate } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('jwt_token');
  if (!token) return <Navigate to="/login" />;
  return children;
};