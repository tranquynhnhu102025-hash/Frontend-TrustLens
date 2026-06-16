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
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
            <ShieldAlert className="text-rose-600" size={32} /> Quản trị hệ thống
          </h2>
          <p className="text-slate-500 font-medium">Khu vực dành riêng cho Quản trị viên (Admin). Quản lý cấu hình, người dùng và nguồn dữ liệu.</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2">
          <UserPlus size={18} /> Cấp quyền Admin
        </button>
      </div>

      {/* 4 PHÂN HỆ QUẢN TRỊ DỰA THEO SƠ ĐỒ CỦA TRÚC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* 1. Quản lý Người dùng (/users) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group">
          <div className="text-blue-600 bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Users size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">Người dùng</h3>
          <p className="text-sm font-medium text-slate-500 mb-4 line-clamp-2">Quản lý tài khoản Giảng viên, Sinh viên và phân quyền hệ thống.</p>
          <button className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Truy cập <ArrowRight size={16} />
          </button>
        </div>

        {/* 2. Cấu hình chấm điểm (/scoring-configs) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer group">
          <div className="text-amber-600 bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Sliders size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">Cấu hình điểm</h3>
          <p className="text-sm font-medium text-slate-500 mb-4 line-clamp-2">Điều chỉnh trọng số Trust Score, cài đặt ngưỡng cảnh báo đạo văn.</p>
          <button className="text-sm font-bold text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Truy cập <ArrowRight size={16} />
          </button>
        </div>

        {/* 3. Nguồn dữ liệu (/metadata-providers) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer group">
          <div className="text-emerald-600 bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Database size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">Nguồn dữ liệu</h3>
          <p className="text-sm font-medium text-slate-500 mb-4 line-clamp-2">Quản lý các nguồn đối chiếu tài liệu tham khảo (IEEE, ACM, arXiv...).</p>
          <button className="text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Truy cập <ArrowRight size={16} />
          </button>
        </div>

        {/* 4. Nhật ký hệ thống (/audit-logs) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
          <div className="text-purple-600 bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Activity size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">Nhật ký hệ thống</h3>
          <p className="text-sm font-medium text-slate-500 mb-4 line-clamp-2">Theo dõi lịch sử truy cập, thao tác và lỗi hệ thống (Audit Logs).</p>
          <button className="text-sm font-bold text-purple-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Truy cập <ArrowRight size={16} />
          </button>
        </div>

      </div>

      {/* KHU VỰC NHẬT KÝ HOẠT ĐỘNG GẦN ĐÂY */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Activity size={20} className="text-slate-500" /> Hoạt động hệ thống gần đây
          </h3>
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhật ký..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4 pl-6">Thao tác (Action)</th>
                <th className="p-4">Người thực hiện</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4 text-center">Phân loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-800">{log.action}</td>
                  <td className="p-4 font-bold text-blue-600">{log.user}</td>
                  <td className="p-4 text-slate-500 font-medium">{log.time}</td>
                  <td className="p-4 text-center">
                    {log.type === 'config' && <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-lg border border-amber-200">Cấu hình</span>}
                    {log.type === 'user' && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200">Tài khoản</span>}
                    {log.type === 'metadata' && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200">Nguồn DL</span>}
                    {log.type === 'system' && <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200">Hệ thống</span>}
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