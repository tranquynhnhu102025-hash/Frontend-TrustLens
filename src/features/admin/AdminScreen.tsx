import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Users, Sliders, Database, 
  Activity, ArrowRight, Search, UserPlus
} from 'lucide-react';

export default function AdminScreen() {
  const navigate = useNavigate();

  // Dữ liệu giả lập cho Nhật ký hệ thống (Audit Logs)
  const auditLogs = [
    { id: 1, action: 'Cập nhật trọng số Trust Score', user: 'Admin_Truc', time: '10 phút trước', type: 'config' },
    { id: 2, action: 'Thêm tài khoản Giảng viên', user: 'Admin_Nhu', time: '1 giờ trước', type: 'user' },
    { id: 3, action: 'Kết nối API IEEE Xplore', user: 'System', time: '3 giờ trước', type: 'metadata' },
    { id: 4, action: 'Xóa bài nộp SUB-099', user: 'Admin_Truc', time: 'Hôm qua', type: 'system' },
  ];

  return (
    <div className="w-full animate-fade-in max-w-5xl mx-auto mt-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="text-zinc-500" size={20} /> Quản trị hệ thống
          </h2>
          <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold mt-0.5">Khu vực dành riêng cho Quản trị viên (Admin). Quản lý cấu hình, người dùng và nguồn dữ liệu.</p>
        </div>
        <button className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
          <UserPlus size={14} /> Cấp quyền Admin
        </button>
      </div>

      {/* 4 PHÂN HỆ QUẢN TRỊ DỰA THEO SƠ ĐỒ CỦA TRÚC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Quản lý Người dùng (/users) */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
              <Users size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Người dùng</h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">Quản lý tài khoản Giảng viên, Sinh viên và phân quyền hệ thống.</p>
          </div>
          <button className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Truy cập <ArrowRight size={13} />
          </button>
        </div>

        {/* 2. Cấu hình chấm điểm (/scoring-configs) */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
              <Sliders size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Cấu hình điểm</h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">Điều chỉnh trọng số Trust Score, cài đặt ngưỡng cảnh báo đạo văn.</p>
          </div>
          <button className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Truy cập <ArrowRight size={13} />
          </button>
        </div>

        {/* 3. Nguồn dữ liệu (/metadata-providers) */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
              <Database size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Nguồn dữ liệu</h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">Quản lý các nguồn đối chiếu tài liệu tham khảo (IEEE, ACM, arXiv...).</p>
          </div>
          <button className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Truy cập <ArrowRight size={13} />
          </button>
        </div>

        {/* 4. Nhật ký hệ thống (/audit-logs) */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
              <Activity size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Nhật ký hệ thống</h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">Theo dõi lịch sử truy cập, thao tác và lỗi hệ thống (Audit Logs).</p>
          </div>
          <button className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Truy cập <ArrowRight size={13} />
          </button>
        </div>

      </div>

      {/* KHU VỰC NHẬT KÝ HOẠT ĐỘNG GẦN ĐÂY */}
      <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-150 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={16} className="text-zinc-500" /> Hoạt động hệ thống gần đây
          </h3>
          <div className="relative w-full sm:w-60">
            <Search size={13} className="absolute left-3 top-2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhật ký..." 
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-805 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-805 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold border-b border-zinc-150 dark:border-zinc-900">
                <th className="p-4 pl-6">Thao tác (Action)</th>
                <th className="p-4">Người thực hiện</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4 text-center">Phân loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-900 text-xs">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                  <td className="p-4 pl-6 font-bold text-zinc-800 dark:text-zinc-200">{log.action}</td>
                  <td className="p-4 font-bold text-zinc-650 dark:text-zinc-300">{log.user}</td>
                  <td className="p-4 text-zinc-455 dark:text-zinc-500 font-semibold">{log.time}</td>
                  <td className="p-4 text-center">
                    {log.type === 'config' && (
                      <span className="inline-flex px-2 py-0.5 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold rounded border border-amber-150 dark:border-amber-900/50 text-[10px]">
                        Cấu hình
                      </span>
                    )}
                    {log.type === 'user' && (
                      <span className="inline-flex px-2 py-0.5 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 font-bold rounded border border-blue-150 dark:border-blue-900/50 text-[10px]">
                        Tài khoản
                      </span>
                    )}
                    {log.type === 'metadata' && (
                      <span className="inline-flex px-2 py-0.5 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-bold rounded border border-green-150 dark:border-green-900/50 text-[10px]">
                        Nguồn DL
                      </span>
                    )}
                    {log.type === 'system' && (
                      <span className="inline-flex px-2 py-0.5 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-400 font-bold rounded border border-zinc-200 dark:border-zinc-800 text-[10px]">
                        Hệ thống
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}