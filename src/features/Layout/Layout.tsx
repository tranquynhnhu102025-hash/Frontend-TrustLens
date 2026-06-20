import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      
      {/* Sidebar - Khóa chết chiều cao h-full */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 h-full`}>
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      </div>
      
      {/* Nội dung chính - Chỉ phần này được phép cuộn chuột khi quá dài */}
      <main className="flex-1 p-8 overflow-y-auto h-full">
        <Outlet />
      </main>
    </div>
  );
}