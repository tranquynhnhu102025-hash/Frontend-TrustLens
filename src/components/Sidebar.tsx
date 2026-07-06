import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Shield, Settings, LogOut, UploadCloud, BarChart3,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import {
  AuthUser,
  PERMISSIONS,
  ROLE_GROUPS,
  canAccess,
  clearAuthSession,
  getStoredAuthUser,
} from '../auth/permissions';
import authService from '../services/authService';
import { APP_VERSION, API_VERSION } from '../config/appVersion';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getMe();
        setUser(data);
      } catch (e) {
        const saved = localStorage.getItem('user');
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch (err) {}
        }
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Tổng quan',
      icon: LayoutDashboard,
      roles: ROLE_GROUPS.ACADEMIC_STAFF,
      permissions: [PERMISSIONS.REPORT_VIEW_OWN_SCOPE],
    },
    {
      path: '/classes',
      name: 'Quản lý Lớp học',
      icon: BookOpen,
      roles: ROLE_GROUPS.ACADEMIC_STAFF,
      permissions: [PERMISSIONS.COURSE_MANAGE],
    },
    {
      path: '/upload',
      name: 'Tải lên',
      icon: UploadCloud,
      roles: ROLE_GROUPS.ACADEMIC_STAFF,
      permissions: [PERMISSIONS.SUBMISSION_UPLOAD],
    },
    {
      path: '/trust-score',
      name: 'Trust Score',
      icon: BarChart3,
      roles: ROLE_GROUPS.ACADEMIC_STAFF,
      permissions: [PERMISSIONS.REPORT_VIEW_OWN_SCOPE],
    },
    {
      path: '/admin',
      name: 'Quản trị hệ thống',
      icon: Shield,
      roles: ROLE_GROUPS.ADMIN_ONLY,
      permissions: [
        PERMISSIONS.ADMIN_USER_MANAGE,
        PERMISSIONS.ADMIN_SCORING_CONFIG,
        PERMISSIONS.ADMIN_AUDIT_LOG,
        PERMISSIONS.ADMIN_METADATA_PROVIDER,
      ],
    },
    {
      path: '/settings',
      name: 'Cài đặt',
      icon: Settings,
      roles: ROLE_GROUPS.AUTHENTICATED,
      permissions: [],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => canAccess(user, item.permissions, item.roles));

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col h-full relative">
      {/* Nút Thu gọn Sidebar */}
      {onToggle && (
        <button 
          onClick={onToggle}
          title={isCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
          className="absolute -right-3.5 top-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-full p-1 shadow-sm text-zinc-450 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors z-20 cursor-pointer hidden sm:block"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      )}

      {/* Phần Logo */}
      <Link to='/' className={`p-6 flex flex-col items-center justify-center border-b border-zinc-150 dark:border-zinc-900 ${isCollapsed ? 'px-2' : ''}`}>
        <img src="/public/Symbol/TrustLens_Symbol_Gray.svg" alt="" className="h-10 w-auto"/>
        {!isCollapsed && (
          <>
            <h1 className="text-sm font-bold tracking-widest text-zinc-900 dark:text-white mt-2">TRUSTLENS</h1>
            <span className="text-[7px] font-medium tracking-widest uppercase text-zinc-400 dark:text-zinc-550 mt-0.5">Academic Verification</span>
          </>
        )}
      </Link>

      {/* Menu chính */}
      <div className="flex-1 px-4 mt-6 overflow-y-auto">
        {!isCollapsed && (
          <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-550 mb-3 px-2 uppercase tracking-wider">Danh mục</p>
        )}
        <nav className="space-y-1.5">
          {visibleMenuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.name : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'px-3.5'} py-2 rounded-lg transition-colors font-semibold text-xs border ${
                  isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold shadow-sm' 
                    : 'text-zinc-500 dark:text-zinc-400 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={15} className={`${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'} shrink-0`} />
                {!isCollapsed && <span className="ml-2.5">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Phần Tài khoản */}
      <div className={`p-3 m-4 bg-zinc-550/5 dark:bg-zinc-900/10 rounded-xl border border-zinc-200 dark:border-zinc-900 mt-auto ${isCollapsed ? 'm-2 p-1.5' : ''}`}>
        <div 
          className={`flex items-center ${isCollapsed ? 'justify-center p-1' : 'gap-2.5 p-1.5'} mb-2 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 rounded-lg transition-all`} 
          onClick={() => navigate('/profile')}
          title={isCollapsed ? (user ? user.full_name : 'Giảng viên') : undefined}
        >
          <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 text-zinc-700 dark:text-zinc-300 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {user ? user.full_name.split(' ').pop()?.charAt(0) : 'G'}
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden">
              <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate">{user ? user.full_name : 'Giảng viên'}</p>
              <p className="text-[9px] font-medium text-zinc-450 dark:text-zinc-500 mt-0.5">
                {user ? (String(user.role).toUpperCase() === 'ADMIN' ? 'Quản trị viên' : String(user.role).toUpperCase() === 'STUDENT' ? 'Sinh viên' : 'Giảng viên') : 'Giảng viên phụ trách'}
              </p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => {
            clearAuthSession();
            navigate('/login');
          }}
          title={isCollapsed ? "Đăng xuất" : undefined}
          className={`w-full flex items-center justify-center gap-1 py-1.5 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-[10px] font-bold`}
        >
          <LogOut size={12} className="shrink-0" /> 
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>

      <div
        className={`px-4 pb-4 text-[9px] font-semibold text-zinc-400 dark:text-zinc-600 ${
          isCollapsed ? 'text-center' : 'flex items-center justify-between gap-2'
        }`}
        title={`TrustLens ${APP_VERSION} / API ${API_VERSION}`}
      >
        {!isCollapsed ? (
          <>
            <span>TrustLens</span>
            <span className="font-mono">v{APP_VERSION}</span>
          </>
        ) : (
          <span className="font-mono">v{APP_VERSION}</span>
        )}
      </div>
    </div>
  );
}
