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
    <div className="w-full bg-[#0B1B3D] text-white flex flex-col h-full">
      {/* Phần Logo */}
      <Link to='/' className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-wider">TRUSTLENS</h1>
          <p className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Admin Panel</p>
        </div>
      </Link>

      {/* Menu chính */}
      <div className="flex-1 px-4 mt-6">
        <p className="text-xs font-bold text-slate-400 mb-4 px-2 uppercase tracking-wider">Menu chính</p>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                  isActive 
                    ? 'bg-blue-600/30 border border-blue-500/50 text-blue-400' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Phần Tài khoản nằm im ở đáy màn hình */}
      <div className="p-3 m-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 mt-auto">
        <div 
          className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-slate-700/50 p-2 rounded-xl transition-all" 
          onClick={() => navigate('/profile')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0">
            N
          </div>
          <div className="text-left overflow-hidden">
            <p className="font-bold text-sm text-white truncate">Trần Quỳnh Như</p>
            <p className="text-xs text-slate-400">Sinh viên</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem('token'); 
            navigate('/');
          }}
          className="w-full flex items-center justify-center gap-2 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-lg transition-colors text-sm font-bold"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    </div>
  );
}