import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LayoutDashboard, Sun, Moon } from 'lucide-react';

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
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-zinc-200' 
        : 'bg-zinc-50 text-zinc-900 selection:bg-zinc-200 selection:text-zinc-800'
    }`}>
      
      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center transition-all duration-200 ${
        theme === 'dark' 
          ? 'bg-zinc-950/85 border-zinc-900' 
          : 'bg-white/85 border-zinc-200'
      }`}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex flex-col">
            <h1 className={`text-lg font-bold tracking-widest leading-none ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}>
              TRUSTLENS
            </h1>
            <span className={`text-[8px] font-medium tracking-widest uppercase mt-0.5 ${
              theme === 'light' ? 'text-zinc-400' : 'text-zinc-500'
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
                className={`text-xs font-semibold tracking-wide uppercase transition-colors duration-150 ${
                  isActive 
                    ? (theme === 'dark' ? 'text-white border-b border-white pb-0.5' : 'text-zinc-900 border-b border-zinc-900 pb-0.5') 
                    : (theme === 'dark' ? 'text-zinc-450 hover:text-white' : 'text-zinc-500 hover:text-zinc-900')
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CONTROLS */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-colors duration-150 ${
              theme === 'dark' 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200' 
                : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {token ? (
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-1.5 font-bold text-xs px-3.5 py-2 rounded-lg transition-colors duration-150 ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-zinc-100'
                  : 'bg-zinc-900 text-white hover:bg-zinc-850'
              }`}
            >
              Vào Dashboard <LayoutDashboard size={13} />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`flex items-center gap-1.5 border font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors duration-150 ${
                theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800' 
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              Đăng nhập <LogIn size={13} className="text-zinc-400" />
            </button>
          )}
        </div>
      </header>

      {/* DYNAMIC MAIN CONTENT */}
      <main className="flex-grow flex flex-col justify-center">
        <Outlet context={{ theme }} />
      </main>

      {/* FOOTER */}
      <footer className={`border-t py-12 px-6 transition-all duration-200 ${
        theme === 'dark' 
          ? 'bg-zinc-950 border-zinc-900' 
          : 'bg-white border-zinc-200'
      }`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <span className={`text-sm font-bold tracking-widest ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>TRUSTLENS</span>
            </Link>
            <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Hệ thống thẩm định độ tin cậy và sự phù hợp của danh mục tài liệu tham khảo trong báo cáo CNTT.
            </p>
          </div>

          <div>
            <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-zinc-405' : 'text-zinc-500'}`}>Điều hướng</h4>
            <div className={`flex flex-col gap-2 text-xs font-semibold ${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-400' : 'text-zinc-550'}`}>
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-zinc-900'}`}>{link.name}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-zinc-405' : 'text-zinc-500'}`}>Liên hệ hỗ trợ</h4>
            <div className={`space-y-2 text-xs font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
              <p>Email: support@trustlens.edu.vn</p>
              <p>Điện thoại: +84 (024) 3869-xxxx</p>
              <p>Báo lỗi hệ thống: github.com/trustlens</p>
            </div>
          </div>
        </div>

        <div className={`max-w-6xl mx-auto border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${
          theme === 'dark' ? 'border-zinc-900' : 'border-zinc-100'
        }`}>
          <p className="text-[10px] font-medium text-zinc-500">
            &copy; 2026 TrustLens Project. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-4 text-[10px] font-medium text-zinc-500">
            <a href="#privacy" className="hover:text-zinc-450 transition-colors">Điều khoản bảo mật</a>
            <span>&bull;</span>
            <a href="#terms" className="hover:text-zinc-450 transition-colors">Quy chế sử dụng</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
