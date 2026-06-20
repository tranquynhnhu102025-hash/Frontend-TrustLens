import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Users, Sliders, Database, 
  Activity, ArrowRight, Search, UserPlus,
  ChevronLeft, Loader2
} from 'lucide-react';
import adminService, { AuditLog, MetadataProviderInfo } from '../../services/adminService';

export default function AdminScreen() {
  const navigate = useNavigate();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // States cho P1 Provider Status UI
  const [selectedSubSection, setSelectedSubSection] = useState<'dashboard' | 'providers'>('dashboard');
  const [providers, setProviders] = useState<MetadataProviderInfo[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await adminService.getAuditLogs();
        setAuditLogs(data);
      } catch (err: any) {
        console.error("Lỗi khi tải nhật ký hoạt động:", err);
        setError(err.response?.data?.message || 'Không thể tải nhật ký hoạt động hệ thống.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const fetchProviders = async () => {
    setLoadingProviders(true);
    try {
      const data = await adminService.getProviders();
      // Sắp xếp các provider theo thứ tự ưu tiên tăng dần (1 trước)
      setProviders(data.sort((a, b) => a.priority - b.priority));
    } catch (err) {
      console.error("Lỗi khi tải danh sách metadata providers:", err);
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleToggleProvidersSection = () => {
    setSelectedSubSection('providers');
    fetchProviders();
  };

  const handleToggleProviderEnabled = async (provId: string, currentEnabled: boolean) => {
    try {
      const updated = await adminService.updateProvider(provId, { enabled: !currentEnabled });
      setProviders(prev => prev.map(p => p.id === provId ? updated : p));
    } catch (err: any) {
      alert("Không thể cập nhật trạng thái provider: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdatePriority = async (provId: string, newPriority: number) => {
    try {
      const updated = await adminService.updateProvider(provId, { priority: newPriority });
      setProviders(prev => 
        prev.map(p => p.id === provId ? updated : p).sort((a, b) => a.priority - b.priority)
      );
    } catch (err: any) {
      alert("Không thể cập nhật độ ưu tiên: " + (err.response?.data?.message || err.message));
    }
  };

  // NẾU ĐANG XEM DANH SÁCH BỘ DỮ LIỆU ĐỐI CHIẾU (METADATA PROVIDERS)
  if (selectedSubSection === 'providers') {
    return (
      <div className="w-full animate-fade-in max-w-5xl mx-auto mt-4 space-y-6 px-2 sm:px-4">
        {/* Header với nút quay lại */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedSubSection('dashboard')}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft size={14} /> Trở về Dashboard quản trị
            </button>
            
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 mt-2">
              <Database className="text-zinc-500" size={20} /> Quản lý nguồn dữ liệu (Metadata Providers)
            </h2>
            <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold">Cấu hình thứ tự ưu tiên đối chiếu, bật tắt nguồn API và theo dõi hiệu năng đối chiếu của các đầu mối học thuật.</p>
          </div>
        </div>

        {/* Danh sách các providers */}
        {loadingProviders ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3">
            <Loader2 size={32} className="text-zinc-900 dark:text-white animate-spin" />
            <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs">Đang tải danh sách nhà cung cấp...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {providers.map((p) => (
              <div 
                key={p.id} 
                className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-350 dark:hover:border-zinc-800 transition-colors"
              >
                {/* Thông tin nhà cung cấp */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-200">{p.name}</h3>
                    
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                      p.status === 'healthy' ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 border-green-150' :
                      p.status === 'degraded' ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 border-amber-150' :
                      p.status === 'disabled' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-450 border-zinc-200' :
                      'bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 border-rose-150'
                    }`}>
                      {p.status === 'healthy' ? 'Hoạt động tốt' :
                       p.status === 'degraded' ? 'Hiệu suất giảm' :
                       p.status === 'disabled' ? 'Đã tắt' : 'Ngoại tuyến'}
                    </span>
                  </div>
                  
                  <p className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 font-mono truncate max-w-md">Base URL: {p.base_url}</p>
                  
                  {/* Số liệu thống kê của provider */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                    <div>Độ trễ TB: <span className="text-zinc-800 dark:text-zinc-300 font-extrabold">{p.latency > 0 ? `${p.latency} ms` : 'N/A'}</span></div>
                    <div>Số lần Fallback: <span className="text-zinc-800 dark:text-zinc-300 font-extrabold">{p.fallback_count} lần</span></div>
                    <div className="truncate max-w-[200px]" title={p.last_failure}>Lỗi cuối: <span className="text-zinc-800 dark:text-zinc-300 font-extrabold">{p.last_failure}</span></div>
                  </div>
                </div>

                {/* Các bộ điều khiển */}
                <div className="flex items-center gap-4 self-end md:self-center shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Select box độ ưu tiên */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Độ ưu tiên:
                    <select 
                      value={p.priority}
                      onChange={(e) => handleUpdatePriority(p.id, parseInt(e.target.value))}
                      className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 cursor-pointer font-extrabold text-xs"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  {/* Toggle bật tắt */}
                  <button
                    onClick={() => handleToggleProviderEnabled(p.id, p.enabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      p.enabled ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-900 shadow-sm ring-0 transition duration-200 ease-in-out ${
                        p.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in max-w-5xl mx-auto mt-4 space-y-6 px-2 sm:px-4">
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

      {/* 4 PHÂN HỆ QUẢN TRỊ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Quản lý Người dùng */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
              <Users size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Người dùng</h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">Quản lý tài khoản Giảng viên, Sinh viên và phân quyền hệ thống.</p>
          </div>
          <button className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Truy cập <ArrowRight size={13} />
          </button>
        </div>

        {/* 2. Cấu hình chấm điểm */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
              <Sliders size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Cấu hình điểm</h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">Điều chỉnh trọng số Trust Score, cài đặt ngưỡng cảnh báo đạo văn.</p>
          </div>
          <button className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Truy cập <ArrowRight size={13} />
          </button>
        </div>

        {/* 3. Nguồn dữ liệu (Clickable) */}
        <div 
          onClick={handleToggleProvidersSection}
          className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
              <Database size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-1.5">Nguồn dữ liệu</h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">Quản lý các nguồn đối chiếu tài liệu tham khảo (Crossref, OpenAlex...).</p>
          </div>
          <button className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Truy cập <ArrowRight size={13} />
          </button>
        </div>

        {/* 4. Nhật ký hệ thống */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-400 font-semibold text-xs">
                    Đang tải nhật ký hoạt động...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-red-500 font-semibold text-xs">
                    {error}
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-400 font-semibold text-xs">
                    Không có hoạt động nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-550/5 transition-colors">
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
                        <span className="inline-flex px-2 py-0.5 bg-blue-550/10 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 font-bold rounded border border-blue-150 dark:border-blue-900/50 text-[10px]">
                          Tài khoản
                        </span>
                      )}
                      {log.type === 'metadata' && (
                        <span className="inline-flex px-2 py-0.5 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-bold rounded border border-green-150 dark:border-green-900/50 text-[10px]">
                          Nguồn DL
                        </span>
                      )}
                      {log.type === 'system' && (
                        <span className="inline-flex px-2 py-0.5 bg-zinc-550/10 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-450 font-bold rounded border border-zinc-200 dark:border-zinc-805 text-[10px]">
                          Hệ thống
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}