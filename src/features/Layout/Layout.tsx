import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function Layout() {
  return (
    // Đổi min-h-screen thành h-screen và thêm overflow-hidden để cố định khung hình
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar - Khóa chết chiều cao h-full */}
      <div className="w-64 flex-shrink-0 h-full">
        <Sidebar />
      </div>
      
      {/* Nội dung chính - Chỉ phần này được phép cuộn chuột khi quá dài */}
      <main className="flex-1 p-8 overflow-y-auto h-full">
        <Outlet />
      </main>
    </div>
  );
}