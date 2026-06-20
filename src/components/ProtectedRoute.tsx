import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import {
  AuthUser,
  canAccess,
  clearAuthSession,
  getStoredAuthUser,
  storeAuthUser,
} from '../auth/permissions';
import authService from '../services/authService';

interface ProtectedRouteProps {
  requiredPermissions?: readonly string[];
  requiredRoles?: readonly string[];
}

export default function ProtectedRoute({
  requiredPermissions = [],
  requiredRoles = [],
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('access_token');
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [loading, setLoading] = useState(Boolean(token) && !user);

  useEffect(() => {
    let mounted = true;

    if (!token || user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    authService
      .getMe()
      .then((profile) => {
        if (!mounted) return;
        setUser(storeAuthUser(profile));
      })
      .catch(() => {
        if (!mounted) return;
        clearAuthSession();
        setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [token, user]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-xs font-bold text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!canAccess(user, requiredPermissions, requiredRoles)) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
