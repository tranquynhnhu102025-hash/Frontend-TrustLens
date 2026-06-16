import './index.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, LogOut, LayoutDashboard, BookOpen, 
  ShieldAlert, Settings, ChevronRight 
} from 'lucide-react';
import AdminScreen from './features/admin/AdminScreen';
import DashboardScreen from './features/dashboard/DashboardScreen';
import LoginScreen from './features/auth/LoginScreen';
import RegisterScreen from './features/auth/RegisterScreen';
import ProfileScreen from './features/auth/ProfileScreen';
import ClassesScreen from './features/classes/ClassesScreen';
import SettingsScreen from './features/settings/SettingsScreen';
import UploadScreen from './features/upload/UploadScreen';
import AnalyzingScreen from './features/analyzing/AnalyzingScreen';
import ReportScreen from './features/report/ReportScreen';

// GIAO DIỆN THANH MENU BÊN TRÁI (SIDEBAR) DỰA THEO SƠ ĐỒ CỦA TRÚC
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ẩn Sidebar ở trang Đăng nhập và Đăng ký
  if (location.pathname === '/' || location.pathname === '/register') return null;

  // Khai báo các nhánh menu chính dựa theo hình Navigation Map
  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
    { path: '/classes', icon: <BookOpen size={20} />, label: 'Quản lý Lớp học' },
    { path: '/admin', icon: <ShieldAlert size={20} />, label: 'Quản trị hệ thống' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Cài đặt' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen sticky top-0 left-0 z-40 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-800">
        <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-900/50">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white leading-none">TRUST<span className="text-blue-500">LENS</span></h1>
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Admin Panel</span>
        </div>
      </div>

      {/* Các nút Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-2 text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Menu chính</p>
        {menuItems.map((item) => {
          // Kiểm tra xem trang hiện tại có khớp với menu không để bôi xanh
          const isActive = location.pathname.includes(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon} {item.label}
              </div>
              {isActive && <ChevronRight size={16} />}
            </button>
          );
        })}
      </nav>

      {/* Thông tin tài khoản ở dưới cùng */}
      <div className="p-4 border-t border-slate-800">
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors mb-3"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-black">
            N
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Trần Quỳnh Như</p>
            <p className="text-xs font-medium text-slate-500 truncate">Sinh viên</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-rose-400 hover:text-white hover:bg-rose-500 px-4 py-2.5 rounded-xl transition-all"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default function App() {
  const [selectedClass, setSelectedClass] = useState<any>(null);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {/* Nhúng thanh Sidebar vào đây */}
        <Sidebar />
        
        {/* Khu vực nội dung bên phải */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
            <Routes>
              {/* Nhánh Đăng nhập */}
              <Route path="/" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              
              {/* Nhánh Lớp học (Đã làm xong) */}
              <Route path="/classes" element={<ClassesScreen setSelectedClass={setSelectedClass} />} />
              <Route path="/upload" element={<UploadScreen selectedClass={selectedClass} />} />
              <Route path="/analyzing" element={<AnalyzingScreen />} />
              <Route path="/report" element={<ReportScreen />} />

              {/* Nhánh Tổng quan, Admin, Settings (Làm khung chờ sẵn) */}
             <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/admin" element={<AdminScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}