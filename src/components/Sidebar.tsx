import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Shield, Settings, LogOut, UploadCloud } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', name: 'Tổng quan', icon: LayoutDashboard },
    { path: '/classes', name: 'Quản lý Lớp học', icon: BookOpen },
    { path: '/upload', name: 'Tải lên', icon: UploadCloud },
    { path: '/admin', name: 'Quản trị hệ thống', icon: Shield },
    { path: '/settings', name: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col h-full">
      {/* Phần Logo */}
      <Link to='/' className="p-6 flex flex-col items-center justify-center border-b border-zinc-150 dark:border-zinc-900">
        <h1 className="text-sm font-bold tracking-widest text-zinc-900 dark:text-white">TRUSTLENS</h1>
        <span className="text-[7px] font-medium tracking-widest uppercase text-zinc-400 dark:text-zinc-550 mt-0.5">Academic Verification</span>
      </Link>

      {/* Menu chính */}
      <div className="flex-1 px-4 mt-6">
        <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-550 mb-3 px-2 uppercase tracking-wider">Danh mục</p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg transition-colors font-semibold text-xs border ${
                  isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold' 
                    : 'text-zinc-500 dark:text-zinc-400 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={15} className={isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Phần Tài khoản */}
      <div className="p-3 m-4 bg-zinc-550/5 dark:bg-zinc-900/10 rounded-xl border border-zinc-200 dark:border-zinc-900 mt-auto">
        <div 
          className="flex items-center gap-2.5 mb-2 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 p-1.5 rounded-lg transition-all" 
          onClick={() => navigate('/profile')}
        >
          <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
            Q
          </div>
          <div className="text-left overflow-hidden">
            <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate">Trần Quỳnh Như</p>
            <p className="text-[9px] font-medium text-zinc-450 dark:text-zinc-500 mt-0.5">Giảng viên phụ trách</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-[10px] font-bold"
        >
          <LogOut size={12} /> Đăng xuất
        </button>
      </div>
    </div>
  );
}