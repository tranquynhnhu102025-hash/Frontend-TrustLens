import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, ShieldCheck, AlertTriangle, 
  ShieldAlert, Search, Users, Calendar, ChevronRight, Loader2, UploadCloud
} from 'lucide-react';
import { classService, Course, Submission } from '../../services/classService';

export default function ClassDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [course, setCourse] = useState<Course | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  if (loading && !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={32} className="text-zinc-900 dark:text-white animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs">Đang tải thông tin lớp học...</p>
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
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 font-semibold rounded-lg border border-red-200 dark:border-red-900/50 text-xs text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in space-y-6">
      {/* HEADER PHÂN HỆ CHI TIẾT */}
      <div className="border-b border-zinc-150 dark:border-zinc-900 pb-5 space-y-4">
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
                <span className="text-[10px] font-bold bg-zinc-105 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  {course.id}
                </span>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{course.name}</h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-zinc-450 dark:text-zinc-500 mt-2">
                <span className="flex items-center gap-1"><Users size={12} /> {course.students || submissions.length} Học viên đã nộp</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Hạn nộp: {course.date}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/upload', { state: { selectedClass: course } })}
              className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <UploadCloud size={14} /> Nộp file báo cáo mới
            </button>
          </div>
        )}
      </div>

      {/* THẺ KPI THỐNG KÊ CHI TIẾT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm">
          <p className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Tổng số bài nộp</p>
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-1">{totalSubmissions}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Đạt chuẩn (Hợp lệ)</p>
            <ShieldCheck size={14} className="text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-1">{passedCount}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Cần xem xét</p>
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-1">{warningCount}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Rủi ro cao</p>
            <ShieldAlert size={14} className="text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-1">{criticalCount}</h3>
        </div>
      </div>

      {/* DANH SÁCH BẢNG BÀI NỘP CỦA LỚP */}
      <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 overflow-hidden shadow-sm">
        {/* Bộ lọc đầu bảng */}
        <div className="p-5 border-b border-zinc-150 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={16} className="text-zinc-500" /> Danh sách báo cáo đã tải lên
          </h3>
          <div className="relative w-full sm:w-60">
            <Search size={13} className="absolute left-3 top-2.5 text-zinc-400" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text" 
              placeholder="Tìm theo sinh viên, tên tệp..." 
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-805 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-955 focus:border-zinc-400 dark:focus:border-zinc-700 text-zinc-855 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400 transition-colors"
            />
          </div>
        </div>

        {/* Bảng kết quả */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold border-b border-zinc-150 dark:border-zinc-900">
                <th className="p-4 pl-6">Sinh viên / Nhóm</th>
                <th className="p-4">Tên tệp tin</th>
                <th className="p-4">Ngày nộp</th>
                <th className="p-4 text-center">Trust Score</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-right pr-6">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-900 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-400 font-semibold">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-zinc-500" />
                    Đang tải danh sách bài nộp...
                  </td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-450 dark:text-zinc-500 font-semibold">
                    Không tìm thấy bài nộp nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="p-4 pl-6 font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-[10px] text-zinc-500 font-bold shrink-0">
                        {sub.studentName.charAt(0)}
                      </div>
                      {sub.studentName}
                    </td>
                    <td className="p-4 font-semibold text-zinc-650 dark:text-zinc-305 max-w-xs truncate">
                      {sub.fileName}
                    </td>
                    <td className="p-4 text-zinc-455 dark:text-zinc-500 font-semibold">
                      {sub.date}
                    </td>
                    <td className="p-4 text-center font-bold text-zinc-800 dark:text-zinc-200">
                      {sub.trustScore}/100
                    </td>
                    <td className="p-4 text-center">
                      {sub.status === 'pass' && (
                        <span className="inline-flex px-2 py-0.5 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-bold text-[10px] rounded border border-green-150 dark:border-green-900/50">
                          Đạt chuẩn
                        </span>
                      )}
                      {sub.status === 'warning' && (
                        <span className="inline-flex px-2 py-0.5 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold text-[10px] rounded border border-amber-150 dark:border-amber-900/50">
                          Cảnh báo
                        </span>
                      )}
                      {sub.status === 'fail' && (
                        <span className="inline-flex px-2 py-0.5 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-bold text-[10px] rounded border border-rose-150 dark:border-rose-900/50">
                          Rủi ro cao
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => navigate(`/report/${sub.id}`)}
                        className="text-zinc-800 hover:text-black dark:text-zinc-200 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1 shadow-xs"
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
    </div>
  );
}
