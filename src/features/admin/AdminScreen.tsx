import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Users, Sliders, Database, 
  Activity, ArrowRight, Search, UserPlus,
  ChevronLeft, Loader2, Trash2, X, CheckCircle2
} from 'lucide-react';
import ScoringConfigHelper, {
  DEFAULT_SCORING_WEIGHTS,
  SCORING_CRITERIA,
  SCORING_PRESETS,
  WeightMap,
} from './ScoringConfigHelper';
import VisitorRoleHelper from './VisitorRoleHelper';
import adminService, { AiHealthInfo, AuditLog, MetadataProviderInfo, RelevanceDiagnoseResult, User } from '../../services/adminService';
import { TRUST_SCORE_THRESHOLDS, TRUST_SCORE_VERSION } from '../../config/trustScoreConfig';

export default function AdminScreen() {
  const navigate = useNavigate();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // States cho P1 Provider Status UI
  const [selectedSubSection, setSelectedSubSection] = useState<'dashboard' | 'providers' | 'scoring' | 'users' | 'ai'>('dashboard');
  const [providers, setProviders] = useState<MetadataProviderInfo[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [aiHealth, setAiHealth] = useState<AiHealthInfo | null>(null);
  const [loadingAiHealth, setLoadingAiHealth] = useState(false);
  const [diagnoseInput, setDiagnoseInput] = useState({
    report_text: 'Bao cao xay dung he thong phat hien gian lan trong giao dich truc tuyen.',
    reference_title: 'Fraud detection in online transactions',
    reference_abstract: 'This study evaluates anomaly detection models for suspicious payment behavior.'
  });
  const [diagnoseResult, setDiagnoseResult] = useState<RelevanceDiagnoseResult | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);

  // States cho Quản lý người dùng
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isUsersMocked, setIsUsersMocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'LECTURER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    role: 'LECTURER' as 'ADMIN' | 'LECTURER',
    department: 'Khoa CNTT'
  });
  const [submittingUser, setSubmittingUser] = useState(false);

  // States cho UI-10 Admin scoring config
  const [weights, setWeights] = useState<WeightMap>(DEFAULT_SCORING_WEIGHTS);
  const [thresholds, setThresholds] = useState({
    pass: TRUST_SCORE_THRESHOLDS.reliable,
    warning: TRUST_SCORE_THRESHOLDS.needsReview
  });
  const [presetName, setPresetName] = useState('DEFAULT');
  const [isSaving, setIsSaving] = useState(false);

  const criteriaList = SCORING_CRITERIA;

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleWeightChange = (key: string, value: number) => {
    setWeights(prev => {
      const currentVal = prev[key as keyof typeof weights];
      const sumOther = Object.entries(prev)
        .filter(([k]) => k !== key)
        .reduce((sum, [, v]) => sum + v, 0);
      
      const maxVal = 100 - sumOther;
      const cappedValue = Math.min(value, maxVal);
      
      return {
        ...prev,
        [key]: cappedValue
      };
    });
    setPresetName('CUSTOM');
  };

  const handleThresholdChange = (key: 'pass' | 'warning', value: number) => {
    setThresholds(prev => {
      if (key === 'pass') {
        const cappedValue = Math.max(value, prev.warning + 5);
        return { ...prev, pass: cappedValue };
      } else {
        const cappedValue = Math.min(value, prev.pass - 5);
        return { ...prev, warning: cappedValue };
      }
    });
  };

  const handleApplyPreset = (id: string) => {
    setPresetName(id);
    const preset = SCORING_PRESETS.find((item) => item.id === id);
    if (preset) {
      setWeights({ ...preset.weights });
    }
  };

  const handleSaveScoringConfig = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    alert("Lưu cấu hình trọng số chấm điểm thành công!");
    setSelectedSubSection('dashboard');
  };

  const handleResetScoringConfig = () => {
    handleApplyPreset('DEFAULT');
    setThresholds({ pass: TRUST_SCORE_THRESHOLDS.reliable, warning: TRUST_SCORE_THRESHOLDS.needsReview });
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data.users);
      setIsUsersMocked(data.isMocked);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const result = await adminService.updateUser(userId, { status: nextStatus });
      setUsers(prev => prev.map(u => u.id === userId ? result.user : u));
    } catch (err: any) {
      alert("Không thể cập nhật trạng thái người dùng: " + err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) return;
    try {
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      alert("Không thể xóa người dùng: " + err.message);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.full_name || !newUser.email) {
      alert("Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }
    setSubmittingUser(true);
    try {
      const result = await adminService.createUser({
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: 'active'
      });
      setUsers(prev => [result.user, ...prev]);
      setShowAddModal(false);
      setNewUser({ full_name: '', email: '', role: 'LECTURER', department: 'Khoa CNTT' });
      alert("Đã thêm giảng viên mới thành công!");
    } catch (err: any) {
      alert("Lỗi khi thêm người dùng: " + err.message);
    } finally {
      setSubmittingUser(false);
    }
  };

  useEffect(() => {
    if (selectedSubSection === 'users') {
      fetchUsers();
    }
  }, [selectedSubSection]);

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

  const fetchAiHealth = async () => {
    setLoadingAiHealth(true);
    try {
      const data = await adminService.getAiHealth();
      setAiHealth(data);
    } catch (err) {
      console.error("Lỗi khi kiểm tra AI health:", err);
    } finally {
      setLoadingAiHealth(false);
    }
  };

  const handleToggleAiSection = () => {
    setSelectedSubSection('ai');
    fetchAiHealth();
  };

  const handleDiagnoseRelevance = async () => {
    setDiagnosing(true);
    try {
      const result = await adminService.diagnoseRelevance(diagnoseInput);
      setDiagnoseResult(result);
    } catch (err: any) {
      alert("Khong the diagnose relevance: " + (err.response?.data?.message || err.message));
    } finally {
      setDiagnosing(false);
    }
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
  if (selectedSubSection === 'ai') {
    const healthTone = (status?: string) => status === 'available'
      ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 border-green-150'
      : 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 border-amber-150';

    return (
      <div className="w-full animate-fade-in max-w-5xl mx-auto mt-4 space-y-6 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
          <div className="space-y-1">
            <button
              onClick={() => setSelectedSubSection('dashboard')}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft size={14} /> Tro ve Dashboard quan tri
            </button>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 mt-2">
              <Activity className="text-zinc-500" size={20} /> AI relevance v1.2
            </h2>
            <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold">
              Kiem tra embedding provider va diagnose C4 bang sample da sanitize. Request khong luu noi dung bai nop.
            </p>
          </div>
          <button
            onClick={fetchAiHealth}
            disabled={loadingAiHealth}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-750 dark:text-zinc-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            {loadingAiHealth ? <Loader2 size={13} className="animate-spin" /> : <Activity size={13} />}
            Refresh health
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: 'Primary provider',
              provider: aiHealth?.primary_provider || 'N/A',
              status: aiHealth?.primary_status || 'unknown',
              error: aiHealth?.primary_error_code,
            },
            {
              label: 'Fallback provider',
              provider: aiHealth?.fallback_provider || 'N/A',
              status: aiHealth?.fallback_status || 'unknown',
              error: aiHealth?.fallback_error_code,
            },
          ].map((item) => (
            <div key={item.label} className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">{item.label}</p>
                  <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mt-1">{item.provider}</h3>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${healthTone(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 text-[10px] font-semibold text-zinc-500">
                <div>Model: <span className="font-mono text-zinc-800 dark:text-zinc-200">{aiHealth?.model_id || 'N/A'}</span></div>
                <div>Prompt: <span className="font-mono text-zinc-800 dark:text-zinc-200">{aiHealth?.prompt_version || 'N/A'}</span></div>
                <div>Error: <span className="font-mono text-zinc-800 dark:text-zinc-200">{item.error || 'None'}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider">Diagnose relevance</h3>
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Report text</label>
              <textarea
                value={diagnoseInput.report_text}
                onChange={(e) => setDiagnoseInput(prev => ({ ...prev, report_text: e.target.value }))}
                className="w-full h-28 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              />
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Reference title</label>
              <input
                value={diagnoseInput.reference_title}
                onChange={(e) => setDiagnoseInput(prev => ({ ...prev, reference_title: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              />
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Reference abstract</label>
              <textarea
                value={diagnoseInput.reference_abstract}
                onChange={(e) => setDiagnoseInput(prev => ({ ...prev, reference_abstract: e.target.value }))}
                className="w-full h-24 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              />
              <button
                onClick={handleDiagnoseRelevance}
                disabled={diagnosing || !diagnoseInput.report_text || !diagnoseInput.reference_title}
                className="w-full bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {diagnosing ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                Run diagnose
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider">Result</h3>
            {diagnoseResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-150 dark:border-zinc-850 p-3">
                    <p className="text-[9px] font-bold text-zinc-450 uppercase">Score</p>
                    <p className="text-lg font-black text-zinc-850 dark:text-white">{diagnoseResult.score}/{diagnoseResult.max_score}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-150 dark:border-zinc-850 p-3">
                    <p className="text-[9px] font-bold text-zinc-450 uppercase">Confidence</p>
                    <p className="text-lg font-black text-zinc-850 dark:text-white">{Math.round(diagnoseResult.confidence * 100)}%</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-150 dark:border-zinc-850 p-3">
                    <p className="text-[9px] font-bold text-zinc-450 uppercase">Fallback</p>
                    <p className="text-lg font-black text-zinc-850 dark:text-white">{diagnoseResult.evidence?.fallback_used ? 'YES' : 'NO'}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">{diagnoseResult.reason}</p>
                <pre className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-lg p-3 text-[10px] overflow-x-auto font-mono text-zinc-650 dark:text-zinc-350">
                  {JSON.stringify(diagnoseResult.evidence, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="h-full min-h-64 flex items-center justify-center text-center text-xs font-semibold text-zinc-450 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-xl">
                Run diagnose to inspect raw C4 v1.2 evidence.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
          <div className="grid grid-cols-1 gap-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2.5 flex-1 w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-5 w-20 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                  </div>
                  <div className="h-3 w-64 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                  <div className="flex gap-4 pt-1">
                    <div className="h-3 w-28 bg-zinc-150 dark:bg-zinc-805 rounded"></div>
                    <div className="h-3 w-28 bg-zinc-150 dark:bg-zinc-805 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-12 bg-zinc-205 dark:bg-zinc-800 rounded shrink-0"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {providers.map((p, index) => (
              <div 
                key={p.id} 
                style={{ animationDelay: `${index * 80}ms` }}
                className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-350 dark:hover:border-zinc-800 transition-all duration-305 hover:-translate-y-0.5 animate-fade-in-down"
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

  const renderDonutChart = () => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius; // ~219.9
    let accumulatedPercent = 0;
    
    // Màu sắc đại diện cho các cấu phần Trust Score v1.1
    const colors = [
      'stroke-blue-500',   // C1
      'stroke-indigo-500', // C2
      'stroke-purple-500', // C3
      'stroke-pink-500',   // C4
      'stroke-rose-500',   // C5
      'stroke-amber-500',  // C6
      'stroke-teal-500',   // C7
    ];
    
    const slices = criteriaList.map((crit, idx) => {
      const val = weights[crit.key as keyof typeof weights];
      if (val === 0) return null;
      
      const strokeDashoffset = circumference - (val / 100) * circumference;
      const strokeDasharray = `${circumference} ${circumference}`;
      const rotation = (accumulatedPercent / 100) * 360 - 90; // Xoay để bắt đầu từ đỉnh
      accumulatedPercent += val;
      
      return (
        <circle
          key={crit.key}
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          className={`${colors[idx]} transition-all duration-300 ease-out`}
          strokeWidth="10"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(${rotation} 50 50)`}
        />
      );
    }).filter(Boolean);
    
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full py-2">
        {/* SVG Donut Circle */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {totalWeight === 0 ? (
              <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#e4e4e7" className="dark:stroke-zinc-800" strokeWidth="10" />
            ) : (
              slices
            )}
          </svg>
          {/* Lớp phủ giữa để tạo biểu đồ donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black text-zinc-800 dark:text-white">{totalWeight}%</span>
            <span className="text-[7px] font-bold text-zinc-450 uppercase tracking-widest mt-0.5">Trọng số</span>
          </div>
        </div>
        
        {/* Chú thích màu sắc */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-[9px] font-bold text-zinc-550 dark:text-zinc-455 flex-1">
          {criteriaList.map((crit, idx) => {
            const val = weights[crit.key as keyof typeof weights];
            const bgColors = [
              'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
              'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-emerald-500'
            ];
            return (
              <div key={crit.key} className="flex items-center gap-1.5 truncate border border-zinc-100 dark:border-zinc-900/60 p-1.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className={`w-2.5 h-2.5 rounded-full ${bgColors[idx]} shrink-0`}></span>
                <span className="truncate">{crit.key.toUpperCase()}: {val}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // NẾU ĐANG XEM DANH SÁCH NGƯỜI DÙNG
  if (selectedSubSection === 'users') {
    const filteredUsers = users.filter(u => {
      const matchSearch = u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'ACTIVE' && u.status === 'active') || 
                          (statusFilter === 'INACTIVE' && u.status === 'inactive');
      return matchSearch && matchRole && matchStatus;
    });

    return (
      <div className="w-full animate-fade-in max-w-5xl mx-auto mt-4 space-y-6 px-2 sm:px-4">
        {/* Header với nút quay lại */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedSubSection('dashboard')}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} /> Trở về Dashboard quản trị
            </button>
            
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 mt-2">
              <Users className="text-zinc-500" size={20} /> Quản lý tài khoản người dùng
            </h2>
            <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold mt-0.5 font-sans">Thêm, phân quyền và kiểm soát trạng thái hoạt động của tài khoản Giảng viên & Quản trị viên.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus size={14} /> Thêm Giảng viên
          </button>
        </div>

        {/* THÔNG BÁO CẬP NHẬT ENDPOINT (API FALLBACK BANNER) */}
        {isUsersMocked && (
          <div className="p-4 bg-amber-50/30 dark:bg-amber-955/10 border border-amber-250 dark:border-amber-900/50 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-start gap-2.5 animate-fade-in shadow-xs">
            <ShieldAlert size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold text-amber-800 dark:text-amber-300">Chế độ giả lập cục bộ (Local Mock Mode)</p>
              <p className="mt-1 font-normal opacity-90 text-[11px] leading-relaxed">
                API kết nối endpoint backend thực tế (`GET /admin/users`) chưa sẵn sàng hoặc bị lỗi kết nối. Hệ thống tự động chuyển đổi sang dữ liệu mô phỏng trong bộ nhớ. Mọi thay đổi (thêm mới, cập nhật trạng thái, xóa) sẽ được lưu cục bộ trong phiên làm việc hiện tại.
              </p>
            </div>
          </div>
        )}

        {/* Thanh công cụ tìm kiếm và bộ lọc */}
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Tìm kiếm */}
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, email, khoa..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 transition-colors"
            />
          </div>

          {/* Các bộ lọc */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Lọc vai trò */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-550 dark:text-zinc-400 w-full sm:w-auto">
              <span>Vai trò:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg px-2.5 py-1.5 cursor-pointer font-bold text-xs focus:outline-none text-zinc-800 dark:text-zinc-200"
              >
                <option value="ALL">Tất cả</option>
                <option value="ADMIN">Quản trị viên (Admin)</option>
                <option value="LECTURER">Giảng viên (Lecturer)</option>
              </select>
            </div>

            {/* Lọc trạng thái */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-550 dark:text-zinc-400 w-full sm:w-auto">
              <span>Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg px-2.5 py-1.5 cursor-pointer font-bold text-xs focus:outline-none text-zinc-800 dark:text-zinc-200"
              >
                <option value="ALL">Tất cả</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngưng hoạt động</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bảng danh sách người dùng */}
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold border-b border-zinc-150 dark:border-zinc-900">
                  <th className="p-4 pl-6">Họ và tên / Email</th>
                  <th className="p-4">Khoa / Phòng ban</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Ngày tham gia</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-900 text-xs">
                {loadingUsers ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full shrink-0"></div>
                        <div className="space-y-1.5">
                          <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                          <div className="h-2.5 w-40 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="h-3 w-24 bg-zinc-150 dark:bg-zinc-800 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-5 w-16 bg-zinc-150 dark:bg-zinc-805 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="h-5 w-12 bg-zinc-150 dark:bg-zinc-805 rounded mx-auto"></div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="h-6 w-12 bg-zinc-150 dark:bg-zinc-805 rounded mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
                      <div className="max-w-md mx-auto flex flex-col items-center">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                          <Users size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-1">Không tìm thấy người dùng</h4>
                        <p className="text-xs text-zinc-550 dark:text-zinc-500 font-semibold leading-relaxed">
                          Không tìm thấy bất kỳ tài khoản nào trùng khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const initials = u.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <tr 
                        key={u.id}
                        style={{ animationDelay: `${idx * 40}ms` }}
                        className="hover:bg-zinc-550/5 transition-colors animate-fade-in-down"
                      >
                        {/* Avatar & Họ tên */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-205 dark:border-zinc-805 flex items-center justify-center text-xs font-black text-zinc-650 dark:text-zinc-350 shadow-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-800 dark:text-zinc-205">{u.full_name}</p>
                              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Khoa */}
                        <td className="p-4 font-semibold text-zinc-650 dark:text-zinc-300">
                          {u.department}
                        </td>

                        {/* Vai trò */}
                        <td className="p-4">
                          {u.role === 'ADMIN' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50/50 dark:bg-rose-955/20 text-rose-700 dark:text-rose-455 font-bold rounded border border-rose-150 dark:border-rose-900/50 text-[10px]">
                              Quản trị viên
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 font-bold rounded border border-zinc-200 dark:border-zinc-850 text-[10px]">
                              Giảng viên
                            </span>
                          )}
                        </td>

                        {/* Ngày tham gia */}
                        <td className="p-4 text-zinc-455 dark:text-zinc-500 font-semibold">
                          {u.createdAt}
                        </td>

                        {/* Switcher Bật/Tắt hoạt động */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              u.status === 'active' ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-250 dark:bg-zinc-800'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-900 shadow-sm ring-0 transition duration-200 ease-in-out ${
                                u.status === 'active' ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Xóa người dùng */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-455 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                            title="Xóa người dùng"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL THÊM GIẢNG VIÊN MỚI */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs animate-fade-in-backdrop"
              onClick={() => setShowAddModal(false)}
            ></div>

            {/* Content modal */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl max-w-md w-full p-6 shadow-xl relative z-10 animate-scale-up space-y-5">
              <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <UserPlus size={16} /> Thêm Giảng viên mới
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Họ và tên giảng viên</label>
                  <input 
                    type="text" 
                    required
                    placeholder="TS. Nguyễn Văn X" 
                    value={newUser.full_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Email liên hệ</label>
                  <input 
                    type="email" 
                    required
                    placeholder="nguyenvanx@trustlens.edu.vn" 
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-805 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Khoa / Phòng ban</label>
                    <select 
                      value={newUser.department}
                      onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-2.5 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-bold focus:outline-none text-zinc-805 dark:text-zinc-200"
                    >
                      <option>Khoa CNTT</option>
                      <option>Khoa Xây dựng</option>
                      <option>Khoa Điện tử</option>
                      <option>Khoa Cơ khí</option>
                      <option>Phòng Đào tạo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Vai trò hệ thống</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                      className="w-full px-2.5 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-bold focus:outline-none text-zinc-805 dark:text-zinc-200"
                    >
                      <option value="LECTURER">Giảng viên</option>
                      <option value="ADMIN">Quản trị viên</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1.5">
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed font-semibold">
                    * Mật khẩu mặc định khởi tạo ban đầu cho tài khoản mới sẽ là <span className="font-extrabold text-zinc-700 dark:text-zinc-300">`TrustLens@2026`</span>. Giảng viên có thể tự thay đổi mật khẩu trong phần Cài đặt hệ thống sau khi đăng nhập.
                  </p>
                </div>

                <div className="flex gap-3 pt-3 border-t border-zinc-150 dark:border-zinc-900">
                  <button
                    type="submit"
                    disabled={submittingUser}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs py-2.5 rounded-lg transition-all active:scale-98 disabled:opacity-50 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {submittingUser ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Xác nhận thêm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-750 dark:text-zinc-305 font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // NẾU ĐANG XEM CẤU HÌNH TRỌNG SỐ ĐIỂM (SCORING CONFIG - UI-10)
  if (selectedSubSection === 'scoring') {
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
              <Sliders className="text-zinc-500" size={20} /> Cấu hình trọng số điểm tin cậy (Scoring Configuration)
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500">
                {TRUST_SCORE_VERSION}
              </span>
            </h2>
            <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold">Thiết lập trọng số phần trăm (%) cho bộ tiêu chí đánh giá C1-C7 và cấu hình các ngưỡng phân loại nhãn cảnh báo.</p>
          </div>
        </div>

        <ScoringConfigHelper
          weights={weights}
          thresholds={thresholds}
          totalWeight={totalWeight}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI: ĐIỀU CHỈNH TRỌNG SỐ C1-C7 */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-900 pb-3">
              <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider">Trọng số các tiêu chí (C1-C7)</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                totalWeight === 100 ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 border border-green-200' : 'bg-rose-50/50 dark:bg-rose-955/20 text-rose-700 border border-rose-200'
              }`}>
                Tổng: {totalWeight}%
              </span>
            </div>

            {/* Biểu đồ phân bổ trọng số (UI-10 Donut Chart) */}
            <div className="pb-5 border-b border-zinc-150 dark:border-zinc-900">
              {renderDonutChart()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-3">
              {criteriaList.map((crit) => {
                const currentVal = weights[crit.key as keyof typeof weights];
                const sumOther = totalWeight - currentVal;
                const maxVal = 100 - sumOther;
                return (
                  <div key={crit.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <span>{crit.label} ({crit.key.toUpperCase()})</span>
                      <span className="font-bold">{currentVal}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={maxVal} 
                      step="5"
                      value={currentVal} 
                      onChange={(e) => handleWeightChange(crit.key, parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                    />
                  </div>
                );
              })}
            </div>

            {totalWeight < 100 && (
              <div className="p-3 bg-amber-50/20 dark:bg-amber-955/5 border border-amber-150/40 dark:border-amber-900/30 rounded-lg text-[10px] text-amber-700 dark:text-amber-455 font-semibold">
                ⚠️ Thiết lập trọng số chưa hoàn tất. Tổng trọng số hiện tại là <span className="font-bold">{totalWeight}%</span> (còn thiếu <span className="font-bold">{100 - totalWeight}%</span>). Hãy điều chỉnh lại các thanh trượt sao cho tổng trọng số đạt chính xác <span className="font-bold">100%</span> trước khi lưu.
              </div>
            )}
            
            {totalWeight === 100 && (
              <div className="p-3 bg-green-50/30 dark:bg-green-955/10 border border-green-155 dark:border-green-900/30 rounded-lg text-[10px] text-green-700 dark:text-green-455 font-semibold">
                ✓ Tổng trọng số đã đạt đúng tiêu chuẩn <span className="font-bold">100%</span>. Cấu hình hợp lệ để áp dụng.
              </div>
            )}
          </div>

          {/* CỘT PHẢI: CHỌN PRESET, THRESHOLDS & HÀNH ĐỘNG */}
          <div className="space-y-6">
            {/* Thẻ Chọn Mẫu (Presets) */}
            <div className="bg-white dark:bg-zinc-955 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-900 pb-2.5">
                Cấu hình mẫu (Presets)
              </h3>
              
              <div className="space-y-2">
                {SCORING_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      presetName === preset.id
                        ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-xs'
                        : 'border-zinc-150 dark:border-zinc-900/45 hover:border-zinc-300 dark:hover:border-zinc-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-zinc-800 dark:text-white">{preset.name}</p>
                    <p className="text-[10px] text-zinc-550 mt-0.5">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Thẻ Ngưỡng cảnh báo (Thresholds) */}
            <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-855 dark:text-zinc-200 uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-900 pb-2.5">
                Ngưỡng phân loại nhãn
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>Ngưỡng Đạt chuẩn (Pass)</span>
                    <span className="font-bold">≥ {thresholds.pass}đ</span>
                  </div>
                  <input 
                    type="range" 
                    min={thresholds.warning + 5} 
                    max="100" 
                    step="5"
                    value={thresholds.pass} 
                    onChange={(e) => handleThresholdChange('pass', parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>Ngưỡng Cảnh báo (Warning)</span>
                    <span className="font-bold">≥ {thresholds.warning}đ</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={thresholds.pass - 5} 
                    step="5"
                    value={thresholds.warning} 
                    onChange={(e) => handleThresholdChange('warning', parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                  />
                </div>

                {/* Thanh dải màu biểu diễn phân cấp */}
                <div className="pt-2">
                  <span className="text-[10px] text-zinc-450 block mb-2">Phân loại dải điểm tin cậy:</span>
                  <div className="flex w-full h-3 rounded-full overflow-hidden text-[8px] font-bold text-white text-center">
                    <div 
                      className="bg-rose-500 flex items-center justify-center transition-all duration-300"
                      style={{ width: `${thresholds.warning}%` }}
                    >
                      Rủi ro
                    </div>
                    <div 
                      className="bg-amber-500 flex items-center justify-center transition-all duration-300"
                      style={{ width: `${thresholds.pass - thresholds.warning}%` }}
                    >
                      Chú ý
                    </div>
                    <div 
                      className="bg-green-500 flex items-center justify-center transition-all duration-300"
                      style={{ width: `${100 - thresholds.pass}%` }}
                    >
                      Hợp lệ
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Các hành động lưu cấu hình */}
            <div className="flex gap-2">
              <button
                onClick={handleSaveScoringConfig}
                disabled={totalWeight !== 100 || isSaving}
                className="flex-1 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-105 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-1.5"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
              </button>
              <button
                onClick={handleResetScoringConfig}
                className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-750 dark:text-zinc-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>
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
        <div 
          onClick={() => setSelectedSubSection('users')}
          style={{ animationDelay: '0ms' }}
          className="bg-white dark:bg-zinc-955 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between shadow-sm animate-fade-in-down"
        >
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
        <div 
          onClick={() => setSelectedSubSection('scoring')}
          style={{ animationDelay: '100ms' }}
          className="bg-white dark:bg-zinc-955 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between shadow-sm animate-fade-in-down"
        >
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
          style={{ animationDelay: '200ms' }}
          className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between shadow-sm animate-fade-in-down"
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
        <div
          onClick={handleToggleAiSection}
          style={{ animationDelay: '300ms' }}
          className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between shadow-sm animate-fade-in-down"
        >
          <div>
            <div className="text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 w-11 h-11 rounded-lg flex items-center justify-center mb-4 group-hover:scale-102 transition-transform">
              <Activity size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-1.5">AI relevance</h3>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">Kiem tra Gemini/local fallback va diagnose pipeline C4 v1.2.</p>
          </div>
          <button className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Truy cáº­p <ArrowRight size={13} />
          </button>
        </div>

        <div 
          style={{ animationDelay: '400ms' }}
          className="bg-white dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between shadow-sm animate-fade-in-down"
        >
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

      <VisitorRoleHelper />

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
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="p-4 pl-6">
                      <div className="h-3.5 w-40 bg-zinc-205 dark:bg-zinc-800 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 w-32 bg-zinc-150 dark:bg-zinc-800 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 w-24 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-5 w-20 bg-zinc-150 dark:bg-zinc-805 rounded mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-rose-500 font-semibold text-xs bg-rose-50/10 dark:bg-rose-955/5 border border-rose-150/20 dark:border-rose-950/20">
                    {error}
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                        <Database size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-200 mb-1">Chưa ghi nhận nhật ký nào</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-550 font-semibold leading-relaxed">
                        Hệ thống hiện tại chưa phát sinh hay ghi nhận bất kỳ sự kiện hoạt động nào.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                auditLogs.map((log, index) => (
                  <tr 
                    key={log.id} 
                    style={{ animationDelay: `${index * 40}ms` }}
                    className="hover:bg-zinc-550/5 transition-colors animate-fade-in-down"
                  >
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
