import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, ShieldCheck, AlertTriangle, 
  ShieldAlert, Search, Users, Calendar, ChevronRight, Loader2, UploadCloud,
  CheckCircle2, Play, RefreshCw, X, AlertCircle
} from 'lucide-react';
import { classService, Course, Submission } from '../../services/classService';
import { batchService } from '../../services/batchService';
import NumberTicker from '../../components/NumberTicker';

export default function ClassDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [course, setCourse] = useState<Course | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // States cho tính năng Phân tích hàng loạt (P1 Batch UI)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);
  const [batchData, setBatchData] = useState<any>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchPolling, setBatchPolling] = useState(false);

  // State kiểm soát hoạt cảnh
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchClassData = async () => {
      setLoading(true);
      setError('');
      try {
        // Lấy tất cả lớp học phần để lọc lớp hiện tại
        const classes = await classService.getClasses();
        const foundCourse = classes.find(c => c.id === id);
        
        if (!foundCourse) {
          setError('Không tìm thấy thông tin lớp học.');
          return;
        }
        setCourse(foundCourse);

        // Tải danh sách bài nộp của lớp học
        const subs = await classService.getSubmissionsByClass(id);
        setSubmissions(subs);
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu chi tiết lớp học:", err);
        setError(err.response?.data?.message || 'Không thể kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  // Kích hoạt hoạt cảnh khi dữ liệu tải xong
  useEffect(() => {
    if (course && submissions.length >= 0) {
      setMounted(true);
    } else {
      setMounted(false);
    }
  }, [course, submissions]);

  // Hook Polling tiến trình của Batch (P1 Batch Polling)
  useEffect(() => {
    if (!currentBatchId || !batchPolling) return;

    let intervalId: NodeJS.Timeout;

    const pollBatchStatus = async () => {
      try {
        const data = await batchService.getBatchStatus(currentBatchId);
        setBatchData(data);

        // Nếu batch đạt trạng thái kết thúc (completed/partial_success/failed/cancelled), ngắt polling
        if (['completed', 'partial_success', 'failed', 'cancelled'].includes(data.status)) {
          setBatchPolling(false);
          // Tải lại danh sách bài nộp để hiển thị điểm số vừa cập nhật
          if (id) {
            const subs = await classService.getSubmissionsByClass(id);
            setSubmissions(subs);
          }
        }
      } catch (err) {
        console.error("Lỗi khi poll trạng thái lô phân tích:", err);
      }
    };

    pollBatchStatus();
    intervalId = setInterval(pollBatchStatus, 2000);

    return () => clearInterval(intervalId);
  }, [currentBatchId, batchPolling, id]);

  const handleStartBatch = async () => {
    if (selectedIds.length === 0 || !course) return;

    setLoading(true);
    try {
      // 1. Tạo batch
      const res = await batchService.createBatch(course.assignment_id || course.id, selectedIds);
      const batchId = res.batch_id;

      // 2. Kích hoạt chạy batch
      await batchService.startBatch(batchId);

      // 3. Mở modal và bật polling
      setCurrentBatchId(batchId);
      setBatchData(null);
      setIsBatchModalOpen(true);
      setBatchPolling(true);
      setSelectedIds([]); // Xóa hàng đợi đã chọn
    } catch (err: any) {
      console.error("Lỗi khởi chạy batch:", err);
      alert("Không thể khởi chạy phân tích hàng loạt: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRetryFailedItems = async () => {
    if (!currentBatchId) return;

    try {
      await batchService.retryFailed(currentBatchId);
      setBatchPolling(true); // Bật polling trở lại
    } catch (err: any) {
      console.error("Lỗi retry batch:", err);
      alert("Không thể chạy lại các mục lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  // Lọc danh sách bài nộp theo nội dung tìm kiếm
  const filteredSubmissions = submissions.filter(sub => 
    sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tính toán các số liệu tổng quan
  const totalSubmissions = submissions.length;
  const passedCount = submissions.filter(s => s.status === 'pass').length;
  const warningCount = submissions.filter(s => s.status === 'warning').length;
  const criticalCount = submissions.filter(s => s.status === 'fail').length;

  if (loading && !course && !isBatchModalOpen) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="border-b border-zinc-200 dark:border-zinc-900 pb-5 space-y-4">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-7 w-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="flex gap-4">
                <div className="h-3.5 w-32 bg-zinc-100 dark:bg-zinc-900/60 rounded"></div>
                <div className="h-3.5 w-32 bg-zinc-100 dark:bg-zinc-900/60 rounded"></div>
              </div>
            </div>
            <div className="h-9 w-40 bg-zinc-200 dark:bg-zinc-800 rounded shrink-0"></div>
          </div>
        </div>

        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              </div>
              <div className="h-7 w-12 bg-zinc-200 dark:bg-zinc-800 rounded mt-1"></div>
            </div>
          ))}
        </div>

        {/* Table/List Skeleton */}
        <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-7 w-48 bg-zinc-105 dark:bg-zinc-900 rounded"></div>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-900 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                  <div className="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </div>
                <div className="h-3.5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-3.5 w-24 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                <div className="h-3.5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-5 w-8 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
        <button 
          onClick={() => navigate('/classes')}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Quay lại danh sách lớp
        </button>
        <div className="p-4 bg-red-50 dark:bg-red-955/20 text-red-650 dark:text-red-400 font-semibold rounded-lg border border-red-200 dark:border-red-900/50 text-xs text-center">
          {error}
        </div>
      </div>
    );
  }

  // Tính phần trăm tiến trình của lô phân tích hàng loạt
  const getBatchPercentage = () => {
    if (!batchData || !batchData.summary) return 0;
    const { total, completed, failed } = batchData.summary;
    if (total === 0) return 0;
    return Math.round(((completed + failed) / total) * 100);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER PHÂN HỆ CHI TIẾT */}
      <div className={`border-b border-zinc-200 dark:border-zinc-900 pb-5 space-y-4 transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <button 
          onClick={() => navigate('/classes')}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Quay lại danh sách lớp
        </button>
        
        {course && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  {course.id}
                </span>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{course.name}</h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-2">
                <span className="flex items-center gap-1"><Users size={12} /> {course.students || submissions.length} Học viên đã nộp</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Hạn nộp: {course.date}</span>
              </div>
            </div>
            
            <div className="flex gap-2 shadow-sm shrink-0 w-full md:w-auto">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleStartBatch}
                  className="flex-1 md:flex-initial bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-semibold text-xs px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Play size={13} className="text-zinc-500" /> Phân tích hàng loạt ({selectedIds.length})
                </button>
              )}
              <button 
                onClick={() => navigate('/upload', { state: { selectedClass: course } })}
                className="flex-1 md:flex-initial bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-98 flex items-center justify-center gap-1.5"
              >
                <UploadCloud size={14} /> Nộp file báo cáo mới
              </button>
            </div>
          </div>
        )}
      </div>

      {/* THẺ KPI THỐNG KÊ CHI TIẾT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className={`bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm transition-all duration-500 delay-75 hover:-translate-y-0.5 hover:shadow-md ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tổng số bài nộp</p>
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white mt-1">
            {mounted ? <NumberTicker value={totalSubmissions} /> : 0}
          </h3>
        </div>

        {/* Card 2 */}
        <div className={`bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm transition-all duration-500 delay-150 hover:-translate-y-0.5 hover:shadow-md ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Đạt chuẩn (Hợp lệ)</p>
            <ShieldCheck size={14} className="text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white mt-1">
            {mounted ? <NumberTicker value={passedCount} /> : 0}
          </h3>
        </div>

        {/* Card 3 */}
        <div className={`bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm transition-all duration-500 delay-225 hover:-translate-y-0.5 hover:shadow-md ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cần xem xét</p>
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white mt-1">
            {mounted ? <NumberTicker value={warningCount} /> : 0}
          </h3>
        </div>

        {/* Card 4 */}
        <div className={`bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm transition-all duration-500 delay-300 hover:-translate-y-0.5 hover:shadow-md ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Rủi ro cao</p>
            <ShieldAlert size={14} className="text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-800 dark:text-white mt-1">
            {mounted ? <NumberTicker value={criticalCount} /> : 0}
          </h3>
        </div>
      </div>

      {/* DANH SÁCH BẢNG BÀI NỘP CỦA LỚP */}
      <div className={`bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 overflow-hidden shadow-sm transition-all duration-700 delay-450 hover:border-zinc-300 dark:hover:border-zinc-800 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        {/* Bộ lọc đầu bảng */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={16} className="text-zinc-500" /> Danh sách báo cáo đã tải lên
          </h3>
          <div className="relative w-full sm:w-60">
            <Search size={13} className="absolute left-3 top-2.5 text-zinc-400" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text" 
              placeholder="Tìm theo sinh viên, tên tệp..." 
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 transition-colors"
            />
          </div>
        </div>

        {/* Bảng kết quả */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold border-b border-zinc-200 dark:border-zinc-900">
                <th className="p-4 pl-6 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={submissions.length > 0 && selectedIds.length === submissions.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(submissions.map(s => s.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    className="cursor-pointer"
                  />
                </th>
                <th className="p-4 pl-2">Sinh viên / Nhóm</th>
                <th className="p-4">Tên tệp tin</th>
                <th className="p-4">Ngày nộp</th>
                <th className="p-4 text-center">Trust Score</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-right pr-6">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-900 text-xs">
              {loading && submissions.length === 0 ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="p-4 pl-6 text-center w-12">
                      <div className="w-4 h-4 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
                    </td>
                    <td className="p-4 pl-2">
                      <div className="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 w-48 bg-zinc-150 dark:bg-zinc-800 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 w-24 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-3.5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-5 w-20 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto"></div>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="h-7 w-24 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                        <FileText size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">Chưa có bài nộp nào</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed mb-5">
                        Lớp học phần này chưa được tải tài liệu hay bài báo cáo nào lên để đối chiếu thẩm định.
                      </p>
                      <button 
                        onClick={() => navigate('/upload', { state: { selectedClass: course } })}
                        className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <UploadCloud size={13} /> Nộp file báo cáo đầu tiên
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                        <Search size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">Không tìm thấy bài nộp phù hợp</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                        Thử kiểm tra lại chính tả hoặc tìm kiếm bằng từ khóa ngắn gọn, chính xác hơn.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all duration-200">
                    <td className="p-4 pl-6 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(sub.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, sub.id]);
                          } else {
                            setSelectedIds(prev => prev.filter(x => x !== sub.id));
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="p-4 pl-2 font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-bold shrink-0">
                        {sub.studentName.charAt(0)}
                      </div>
                      {sub.studentName}
                    </td>
                    <td className="p-4 font-semibold text-zinc-600 dark:text-zinc-300 max-w-xs truncate">
                      {sub.fileName}
                    </td>
                    <td className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold">
                      {sub.date}
                    </td>
                    <td className="p-4 text-center font-bold text-zinc-800 dark:text-zinc-200">
                      {sub.trustScore}/100
                    </td>
                    <td className="p-4 text-center">
                      {sub.status === 'pass' && (
                        <span className="inline-flex px-2 py-0.5 bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold text-[10px] rounded border border-green-200 dark:border-green-900/50">
                          Đạt chuẩn
                        </span>
                      )}
                      {sub.status === 'warning' && (
                        <span className="inline-flex px-2 py-0.5 bg-amber-50/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold text-[10px] rounded border border-amber-200 dark:border-amber-900/50">
                          Cảnh báo
                        </span>
                      )}
                      {sub.status === 'fail' && (
                        <span className="inline-flex px-2 py-0.5 bg-rose-50/50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 font-bold text-[10px] rounded border border-rose-200 dark:border-rose-900/50">
                          Rủi ro cao
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => navigate(`/report/${sub.id}`)}
                        className="text-zinc-800 hover:text-black dark:text-zinc-200 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1 shadow-xs active:scale-98"
                      >
                        Xem báo cáo <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TIẾN TRÌNH PHÂN TÍCH HÀNG LOẠT (P1 BATCH UI) VỚI HOẠT CẢNH MƯỢT MÀ */}
      {isBatchModalOpen && batchData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs animate-fade-in-backdrop"
            onClick={() => {
              setIsBatchModalOpen(false);
              setBatchPolling(false);
            }}
          ></div>

          <div className="relative z-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-900 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/20">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Tiến trình phân tích hàng loạt</h3>
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-550 mt-0.5">Mã lô: <span className="font-mono">{batchData.batch_id}</span></p>
              </div>
              <button 
                onClick={() => {
                  setIsBatchModalOpen(false);
                  setBatchPolling(false);
                }}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Chỉ số tiến độ tổng quan */}
              <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  <span>Trạng thái: 
                    <span className={`ml-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      batchData.status === 'completed' ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 border-green-200' :
                      batchData.status === 'partial_success' ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 border-amber-200' :
                      batchData.status === 'failed' ? 'bg-red-50/50 dark:bg-red-950/20 text-red-650 border-red-200' :
                      'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 border-zinc-200'
                    }`}>
                      {batchData.status === 'completed' ? 'Thành công' : 
                       batchData.status === 'partial_success' ? 'Thành công một phần' :
                       batchData.status === 'failed' ? 'Thất bại' :
                       batchData.status === 'running' ? 'Đang chạy' : 'Đang xếp hàng'}
                    </span>
                  </span>
                  <span>{getBatchPercentage()}%</span>
                </div>

                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="bg-zinc-900 dark:bg-white h-2 transition-all duration-500 ease-out"
                    style={{ width: `${getBatchPercentage()}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-5 text-center text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mt-2">
                  <div>TỔNG<p className="text-xs text-zinc-800 dark:text-white font-extrabold mt-0.5">{batchData.summary.total}</p></div>
                  <div>QUEUED<p className="text-xs text-zinc-500 font-extrabold mt-0.5">{batchData.summary.queued}</p></div>
                  <div>RUNNING<p className="text-xs text-zinc-800 dark:text-white font-extrabold mt-0.5">{batchData.summary.running}</p></div>
                  <div>SUCCESS<p className="text-xs text-green-600 font-extrabold mt-0.5">{batchData.summary.completed}</p></div>
                  <div>ERROR<p className="text-xs text-rose-600 font-extrabold mt-0.5">{batchData.summary.failed}</p></div>
                </div>
              </div>

              {/* Danh sách bài nộp trong batch */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-1">Danh sách tệp xử lý</h4>
                
                <div className="space-y-2.5 max-h-[35vh] overflow-y-auto pr-1">
                  {batchData.items.map((item: any, idx: number) => {
                    const isItemFailed = item.status === 'failed';
                    return (
                      <div 
                        key={idx} 
                        className="p-3 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-xl flex flex-col gap-2 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="truncate flex-1 min-w-[200px]">
                            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{item.fileName || `Bài nộp ${item.submission_id}`}</p>
                            <p className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5">Sinh viên: {item.studentName || 'Chưa rõ'}</p>
                          </div>
                          
                          <div className="shrink-0 flex items-center gap-2">
                            {item.status === 'running' && <Loader2 size={12} className="animate-spin text-zinc-900 dark:text-white" />}
                            {item.status === 'completed' && <CheckCircle2 size={14} className="text-green-600" />}
                            {item.status === 'failed' && <AlertCircle size={14} className="text-rose-600" />}
                            
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                              item.status === 'completed' ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 border-green-200' :
                              item.status === 'failed' ? 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 border-rose-200' :
                              item.status === 'running' ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200' :
                              'bg-zinc-50 dark:bg-zinc-900/40 text-zinc-400 border-zinc-200'
                            }`}>
                              {item.status === 'completed' ? 'Xong' : 
                               item.status === 'failed' ? 'Lỗi' :
                               item.status === 'running' ? 'Đang chạy' : 'Đang xếp'}
                            </span>
                          </div>
                        </div>

                        {/* Thanh progress của từng item */}
                        {!isItemFailed && item.status !== 'completed' && item.status !== 'created' && (
                          <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-1">
                            <div 
                              className="bg-zinc-900 dark:bg-white h-1.5 transition-all duration-300 ease-out"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        )}

                        {/* Chi tiết lỗi */}
                        {isItemFailed && item.error && (
                          <div className="mt-1 bg-rose-50/40 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 p-2 rounded-lg text-[10px] font-semibold text-rose-700 dark:text-rose-400 flex justify-between items-center">
                            <span>Lỗi: <span className="font-bold">{item.error.error_code}</span> - {item.error.message}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/20 flex justify-between items-center">
              <div>
                {batchData.status === 'running' && (
                  <span className="text-[10px] font-bold text-zinc-500 animate-pulse flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" /> Đang xử lý song song các tệp...
                  </span>
                )}
                {batchData.status === 'partial_success' && (
                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1.5">
                    <AlertTriangle size={13} /> Hoàn tất với lỗi ({batchData.summary.failed} tệp lỗi)
                  </span>
                )}
                {batchData.status === 'completed' && (
                  <span className="text-[10px] font-bold text-green-600 flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Đã phân tích hoàn tất toàn bộ các tệp!
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                {batchData.status === 'partial_success' && (
                  <button 
                    onClick={handleRetryFailedItems}
                    className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs px-4 py-2 rounded-xl transition-all active:scale-98 flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} /> Chạy lại các tệp lỗi
                  </button>
                )}
                <button 
                  onClick={() => {
                    setIsBatchModalOpen(false);
                    setBatchPolling(false);
                  }}
                  className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-xs px-4 py-2 rounded-xl transition-colors active:scale-98"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

