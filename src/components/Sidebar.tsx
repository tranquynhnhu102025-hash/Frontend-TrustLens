import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Shield, Settings, LogOut, FileText, UploadCloud } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách menu đã được dọn dẹp gọn gàng
  const menuItems = [
    { path: '/dashboard', name: 'Tổng quan', icon: LayoutDashboard },
    { path: '/classes', name: 'Quản lý Lớp học', icon: BookOpen },
    { path: '/upload', name: 'Tải lên', icon: UploadCloud },
    { path: '/admin', name: 'Quản trị hệ thống', icon: Shield },
    { path: '/settings', name: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="w-full bg-white border-r border-slate-200/60 text-slate-800 flex flex-col h-full shadow-minimal-sm">
      {/* Phần Logo */}
      <Link to='/' className="p-6 flex items-center justify-center border-b border-slate-100/60">
        <img src="/Horizontal/TrustLens_Horizontal_Dark.svg" alt="TrustLens Logo" className="h-7 w-auto" />
      </Link>

      {/* Menu chính */}
      <div className="flex-1 px-4 mt-6">
        <p className="text-[10px] font-bold text-slate-400 mb-4 px-2 uppercase tracking-widest">Danh mục</p>
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-sm border ${
                  isActive 
                    ? 'bg-slate-50 border-slate-200/60 text-blue-600 shadow-minimal-sm font-bold' 
                    : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Phần Tài khoản nằm im ở đáy màn hình */}
      <div className="p-3 m-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 mt-auto">
        <div 
          className="flex items-center gap-3 mb-2.5 cursor-pointer hover:bg-slate-100/50 p-2 rounded-xl transition-all" 
          onClick={() => navigate('/profile')}
        >
          <div className="w-9 h-9 bg-blue-50 border border-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
            Q
          </div>
          <div className="text-left overflow-hidden">
            <p className="font-semibold text-xs text-slate-800 truncate">Trần Quỳnh Như</p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5">Giảng viên phụ trách</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold"
        >
          <LogOut size={14} /> Đăng xuất
        </button>
      </div>
    </div>
  );
}