import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, ShieldCheck, AlertTriangle, ShieldAlert, 
  ArrowUpRight, Clock, CheckCircle2, ChevronRight 
} from 'lucide-react';
// 1. GỌI SERVICE VÀO (Nhớ kiểm tra lại đường dẫn file này cho chuẩn nhé)
import dashboardService from '../../services/dashboardService';

export default function DashboardScreen() {
  const navigate = useNavigate();

  // 2. DÙNG STATE ĐỂ CHỨA DỮ LIỆU
  // Tạm thời để số cũ làm mặc định để giao diện vẫn hiện đẹp trong lúc chờ API
  const [summaryData, setSummaryData] = useState({
    totalSubmissions: 156,
    passed: 112,
    warnings: 34,
    critical: 10,
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 'SUB-101', student: 'Nguyễn Văn A', class: 'INT4050', time: '10 phút trước', score: 85, status: 'pass' },
    { id: 'SUB-102', student: 'Trần Thị B', class: 'INT3307', time: '1 giờ trước', score: 55, status: 'warning' },
    { id: 'SUB-103', student: 'Lê Hoàng C', class: 'INT4050', time: '3 giờ trước', score: 32, status: 'fail' },
    { id: 'SUB-104', student: 'Phạm Văn D', class: 'INT3110', time: 'Hôm qua', score: 92, status: 'pass' },
  ]);

  // 3. DÙNG EFFECT ĐỂ KÉO DỮ LIỆU TỪ HỆ THỐNG KHI VỪA MỞ TRANG
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summary = await dashboardService.getSummary();
        const activities = await dashboardService.getRecentActivities();
        setSummaryData(summary);
        setRecentActivities(activities);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []); // Ngoặc vuông rỗng đảm bảo nó chỉ tự động tải 1 lần lúc mở trang

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Tổng quan hệ thống</h2>
          <p className="text-slate-500 font-medium">Theo dõi số liệu và hoạt động kiểm duyệt tài liệu mới nhất.</p>
        </div>
        <button 
          onClick={() => navigate('/classes')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-2"
        >
          <FileText size={18} /> Đi tới Quản lý Lớp học
        </button>
      </div>

      {/* 4 THẺ KPI (KPI CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col shadow-minimal-sm group">
          <div className="text-slate-500 bg-slate-50 border border-slate-100 w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100">
            <FileText size={20} />
          </div>
          <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Tổng số tài liệu</p>
          <h3 className="text-2xl font-black text-slate-800">{summaryData.totalSubmissions}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col shadow-minimal-sm group">
          <div className="text-slate-500 bg-slate-50 border border-slate-100 w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-green-50 group-hover:text-green-600 group-hover:border-green-100">
            <ShieldCheck size={20} />
          </div>
          <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Đạt chuẩn (Hợp lệ)</p>
          <h3 className="text-2xl font-black text-slate-800">{summaryData.passed}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col shadow-minimal-sm group">
          <div className="text-slate-500 bg-slate-50 border border-slate-100 w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-100">
            <AlertTriangle size={20} />
          </div>
          <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Cần xem xét</p>
          <h3 className="text-2xl font-black text-slate-800">{summaryData.warnings}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col shadow-minimal-sm group">
          <div className="text-slate-500 bg-slate-50 border border-slate-100 w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600 group-hover:border-rose-100">
            <ShieldAlert size={20} />
          </div>
          <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Rủi ro cao</p>
          <h3 className="text-2xl font-black text-slate-800">{summaryData.critical}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BIỂU ĐỒ MINI (MOCK) */}
        <div className="bg-white p-6 rounded-2xl shadow-minimal-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <ArrowUpRight size={20} className="text-blue-600" /> Tỉ lệ theo tuần
          </h3>
          <div className="flex items-end gap-2 h-48 mt-4">
            {/* Thanh biểu đồ giả lập */}
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group flex items-end justify-center">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600" 
                  style={{ height: `${height}%` }}
                ></div>
                <span className="absolute -top-6 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{height}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs font-bold text-slate-400 uppercase">
            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
          </div>
        </div>

        {/* BẢNG TÀI LIỆU VỪA KIỂM DUYỆT */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-minimal-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" /> Tài liệu vừa kiểm duyệt
            </h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4 pl-6">Sinh viên</th>
                  <th className="p-4">Lớp học phần</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentActivities.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/report')}>
                    <td className="p-4 pl-6 font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                        {item.student.charAt(0)}
                      </div>
                      {item.student}
                    </td>
                    <td className="p-4 font-bold text-slate-600">{item.class}</td>
                    <td className="p-4 text-slate-500 font-medium">{item.time}</td>
                    <td className="p-4 text-center">
                      {item.status === 'pass' && <span className="inline-flex px-2.5 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-lg border border-green-200">Đạt chuẩn</span>}
                      {item.status === 'warning' && <span className="inline-flex px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-lg border border-amber-200">Cảnh báo</span>}
                      {item.status === 'fail' && <span className="inline-flex px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-200">Rủi ro cao</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}