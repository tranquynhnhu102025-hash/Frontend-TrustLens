import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, LogIn, LayoutDashboard, Sun, Moon } from 'lucide-react';

export default function LandingLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  // Khởi tạo theme từ localStorage, mặc định là 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const navLinks = [
    { path: '/', name: 'Trang chủ' },
    { path: '/features', name: 'Tính năng' },
    { path: '/pricing', name: 'Gói dịch vụ' },
    { path: '/docs', name: 'Tài liệu' },
    { path: '/contact', name: 'Liên hệ' },
  ];

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100 selection:bg-blue-600/30 selection:text-blue-400' 
        : 'bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-800'
    }`}>
      
      {/* HEADER NAVBAR (GLASSMORPHISM) */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-950/80 border-slate-900' 
          : 'bg-white/80 border-slate-200'
      }`}>
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <FileText size={22} />
          </div>
          <div>
            <h1 className={`text-xl font-black tracking-tight leading-none ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              TRUST<span className="bg-gradient-to-r from-blue-550 to-indigo-550 bg-clip-text text-transparent">LENS</span>
            </h1>
            <span className={`text-[9px] font-bold tracking-wider uppercase ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>Academic Verification</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-500 border-b-2 border-blue-500 pb-1' 
                    : (theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CONTROLS (SWITCH THEME & LOGIN/DASHBOARD) */}
        <div className="flex items-center gap-4">
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
              theme === 'dark' 
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {token ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 active:scale-95 group"
            >
              Vào Dashboard <LayoutDashboard size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`flex items-center gap-1.5 border font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 active:scale-95 group ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-slate-850 text-white hover:bg-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              Đăng nhập <LogIn size={14} className="group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-slate-600" />
            </button>
          )}
        </div>
      </header>

      {/* DYNAMIC MAIN CONTENT */}
      <main className="flex-grow flex flex-col justify-center">
        <Outlet context={{ theme }} />
      </main>

      {/* FOOTER */}
      <footer className={`border-t py-12 px-6 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-950 border-slate-900' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <FileText size={16} />
              </div>
              <span className={`text-base font-black tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>TRUSTLENS</span>
            </Link>
            <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Hệ thống thẩm định độ tin cậy và sự phù hợp của danh mục tài liệu tham khảo trong báo cáo CNTT.
            </p>
          </div>

          <div>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Điều hướng</h4>
            <div className={`flex flex-col gap-2.5 text-xs font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-800'}`}>{link.name}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Hợp tác khoa học</h4>
            <div className={`space-y-3 text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              <p>Trường Đại học Nguyễn Tất Thành (NTTU)</p>
              <p>Trường Đại học Xây dựng Hà Nội (HUCE)</p>
              <p>MTEC Lab - 2026</p>
            </div>
          </div>

          <div>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Liên hệ hỗ trợ</h4>
            <div className={`space-y-3 text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              <p>Email: support@trustlens.edu.vn</p>
              <p>Điện thoại: +84 (024) 3869-xxxx</p>
              <p>Báo lỗi hệ thống: github.com/trustlens</p>
            </div>
          </div>
        </div>

        <div className={`max-w-6xl mx-auto border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${
          theme === 'dark' ? 'border-slate-900/60' : 'border-slate-100'
        }`}>
          <p className="text-[11px] font-bold text-slate-500">
            &copy; 2026 TrustLens Project. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-4 text-[11px] font-bold text-slate-500">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Điều khoản bảo mật</a>
            <span>&bull;</span>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Quy chế sử dụng</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
