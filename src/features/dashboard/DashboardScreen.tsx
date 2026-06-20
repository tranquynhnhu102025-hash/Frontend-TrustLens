import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, ShieldCheck, AlertTriangle, ShieldAlert, 
  ArrowUpRight, Clock, Loader2
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';

export default function DashboardScreen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [summaryData, setSummaryData] = useState({
    totalSubmissions: 0,
    passed: 0,
    warnings: 0,
    critical: 0,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const summary = await dashboardService.getSummary();
        const activities = await dashboardService.getRecentActivities();
        
        setSummaryData({
          totalSubmissions: summary.totalSubmissions ?? summary.total_submissions ?? 0,
          passed: summary.passed ?? summary.verified ?? 0,
          warnings: summary.warnings ?? summary.partial ?? 0,
          critical: summary.critical ?? summary.not_found ?? summary.unknown ?? 0,
        });
        
        setRecentActivities(activities || []);
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", err);
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ để lấy số liệu tổng quan.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={32} className="text-zinc-900 dark:text-white animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs">Đang tải thông tin tổng quan...</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Tổng quan hệ thống</h2>
          <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold mt-0.5">Theo dõi số liệu và hoạt động kiểm duyệt tài liệu mới nhất.</p>
        </div>
        <button 
          onClick={() => navigate('/classes')}
          className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <FileText size={14} /> Đi tới Quản lý Lớp học
        </button>
      </div>

      {/* HIỂN THỊ LỖI NẾU CÓ */}
      {error && (
        <div className="flex items-center gap-1.5 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 font-semibold rounded-lg border border-red-200 dark:border-red-900/50 text-xs animate-fade-in">
          <AlertTriangle size={14} className="shrink-0" /> {error}
        </div>
      )}

      {/* 4 THẺ KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm">
          <div className="text-zinc-400 dark:text-zinc-500 mb-3">
            <FileText size={18} />
          </div>
          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Tổng số tài liệu</p>
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-1">{summaryData.totalSubmissions}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm">
          <div className="text-green-600 dark:text-green-500 mb-3">
            <ShieldCheck size={18} />
          </div>
          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Đạt chuẩn (Hợp lệ)</p>
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-1">{summaryData.passed}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm">
          <div className="text-amber-500 mb-3">
            <AlertTriangle size={18} />
          </div>
          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Cần xem xét</p>
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-1">{summaryData.warnings}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm">
          <div className="text-rose-600 dark:text-rose-550 mb-3">
            <ShieldAlert size={18} />
          </div>
          <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Rủi ro cao</p>
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-1">{summaryData.critical}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BIỂU ĐỒ MINI */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 mb-4">
            <ArrowUpRight size={15} className="text-zinc-500" /> Tỉ lệ theo tuần
          </h3>
          <div className="flex items-end gap-2.5 h-40 mt-2">
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-900 h-full rounded flex items-end justify-center relative group">
                <div 
                  className="w-full bg-zinc-800 dark:bg-zinc-200 rounded transition-all duration-300 group-hover:bg-zinc-900 dark:group-hover:bg-white" 
                  style={{ height: `${height}%` }}
                ></div>
                <span className="absolute -top-5 text-[8px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">{height}%</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-1">
            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
          </div>
        </div>

        {/* BẢNG TÀI LIỆU VỪA KIỂM DUYỆT */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-zinc-150 dark:border-zinc-900 flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={15} className="text-zinc-500" /> Tài liệu vừa kiểm duyệt
            </h3>
            <button className="text-xs font-bold text-zinc-650 dark:text-zinc-400 hover:underline">Xem tất cả</button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-150 dark:border-zinc-900 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3 pl-5">Sinh viên</th>
                  <th className="p-3">Mã lớp</th>
                  <th className="p-3">Thời gian</th>
                  <th className="p-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-xs">
                {recentActivities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-400 font-semibold text-xs">
                      Không có hoạt động kiểm duyệt nào gần đây.
                    </td>
                  </tr>
                ) : (
                  recentActivities.map((item, idx) => {
                    const statusVal = item.status?.toLowerCase() || 
                      (item.score >= 80 ? 'pass' : item.score >= 50 ? 'warning' : 'fail');
                    return (
                      <tr 
                        key={idx} 
                        className="hover:bg-zinc-550/5 transition-colors cursor-pointer" 
                        onClick={() => navigate(item.submission_id ? `/report/${item.submission_id}` : item.id ? `/report/${item.id}` : '/report')}
                      >
                        <td className="p-3 pl-5 font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-bold shrink-0">
                            {item.student?.charAt(0) || 'S'}
                          </div>
                          {item.student || 'Sinh viên'}
                        </td>
                        <td className="p-3 font-semibold text-zinc-650 dark:text-zinc-455">{item.class || item.class_code || 'N/A'}</td>
                        <td className="p-3 text-zinc-450 dark:text-zinc-500 font-medium">{item.time || new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                        <td className="p-3 text-center">
                          {statusVal === 'pass' && <span className="inline-flex px-2 py-0.5 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-bold text-[10px] rounded border border-green-150 dark:border-green-900/50">Đạt chuẩn</span>}
                          {statusVal === 'warning' && <span className="inline-flex px-2 py-0.5 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold text-[10px] rounded border border-amber-150 dark:border-amber-900/50">Cảnh báo</span>}
                          {statusVal === 'fail' && <span className="inline-flex px-2 py-0.5 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-bold text-[10px] rounded border border-rose-150 dark:border-rose-900/50">Rủi ro cao</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}