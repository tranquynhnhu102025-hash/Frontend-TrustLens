import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Download, AlertTriangle, 
  CheckCircle2, FileText, ChevronLeft, BarChart3, Info, Loader2
} from 'lucide-react';
import { reportService } from '../../services/reportService';

export default function ReportScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const mockReport = {
    trustScore: 78,
    level: 'Cảnh báo', 
    summary: 'Tài liệu có độ tin cậy ở mức khá. Tuy nhiên phát hiện một số trích dẫn từ nguồn không chính thống và thiếu định dạng chuẩn.',
    criteriaBreakdown: [
      { name: 'Độ tin cậy của nguồn', score: 85, weight: '40%' },
      { name: 'Tính cập nhật (5 năm gần nhất)', score: 60, weight: '30%' },
      { name: 'Định dạng trích dẫn (APA/IEEE)', score: 90, weight: '30%' }
    ],
    citations: [
      { id: 1, title: 'Attention Is All You Need', author: 'Vaswani et al.', year: 2017, source: 'arXiv', status: 'pass', issues: 'Không có' },
      { id: 2, title: 'Khái niệm về Trí tuệ nhân tạo', author: 'Nguyễn Văn A', year: 2023, source: 'Blog cá nhân (WordPress)', status: 'warning', issues: 'Nguồn không thuộc hệ thống học thuật chính thống.' },
      { id: 3, title: 'Ứng dụng AI trong giáo dục', author: 'Không rõ', year: 2010, source: 'Wikipedia', status: 'fail', issues: 'Wikipedia không được chấp nhận làm tài liệu tham khảo. Dữ liệu quá cũ (>10 năm).' }
    ]
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        setReport(mockReport);
        return;
      }

      setLoading(true);
      try {
        const data = await reportService.getReport(id);
        
        // Chuẩn hóa dữ liệu từ backend API khớp với giao diện
        const normalizedReport = {
          trustScore: data.trust_score ?? data.trustScore ?? 78,
          level: data.level ?? (data.trust_score >= 80 ? 'Đạt chuẩn' : data.trust_score >= 50 ? 'Cảnh báo' : 'Nguy hiểm'),
          summary: data.summary ?? 'Báo cáo thẩm định trích dẫn tự động cho bài nộp tài liệu học thuật.',
          criteriaBreakdown: data.criteria_breakdown || data.criteriaBreakdown || [
            { name: 'Độ tin cậy của nguồn', score: data.credibility_score ?? 85, weight: '40%' },
            { name: 'Tính cập nhật (5 năm gần nhất)', score: data.recency_score ?? 60, weight: '30%' },
            { name: 'Định dạng trích dẫn (APA/IEEE)', score: data.formatting_score ?? 90, weight: '30%' }
          ],
          citations: (data.citations || []).map((cite: any, index: number) => ({
            id: cite.id ?? index + 1,
            title: cite.title ?? cite.raw_text ?? 'Tài liệu tham khảo',
            author: cite.authors ?? cite.author ?? 'N/A',
            year: cite.year ?? 'N/A',
            source: cite.venue ?? cite.source ?? 'Nguồn học thuật',
            status: cite.status ?? (cite.is_predatory ? 'fail' : cite.is_outdated ? 'warning' : 'pass'),
            issues: cite.issues ?? (cite.is_predatory ? 'Cảnh báo: Tạp chí trục lợi (Predatory Watch).' : cite.is_outdated ? 'Độ cập nhật kém (>5 năm).' : 'Hợp lệ')
          }))
        };

        if (normalizedReport.citations.length === 0) {
          normalizedReport.citations = mockReport.citations;
        }

        setReport(normalizedReport);
      } catch (err: any) {
        console.error("Lỗi gọi API reportService. Dùng dữ liệu mock dự phòng:", err);
        setReport(mockReport);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleExport = () => {
    alert('Tính năng xuất file PDF/DOCX đang được BE xây dựng. Sẽ sớm ra mắt!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={32} className="text-zinc-900 dark:text-white animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs">Đang tải kết quả thẩm định...</p>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 space-y-6 animate-fade-in">
      {/* HEADER QUAY LẠI & NÚT EXPORT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
        <div>
          <button 
            onClick={() => navigate('/classes')}
            className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold text-xs transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Trở về trang quản lý lớp học
          </button>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-1.5">Kết quả thẩm định tài liệu</h2>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold text-xs rounded-lg transition-colors shadow-sm"
        >
          <Download size={14} /> Xuất báo cáo (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* THẺ TRUST SCORE (FE-08) */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-lg border border-zinc-200 dark:border-zinc-900 flex flex-col items-center justify-center text-center relative shadow-sm">
          <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider mb-5 flex items-center gap-1.5">
            <BarChart3 size={15} className="text-zinc-500" /> Trust Score
          </h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-zinc-100 dark:text-zinc-850" strokeWidth="2" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                className={report.trustScore >= 80 ? 'text-green-600 dark:text-green-550' : report.trustScore >= 50 ? 'text-amber-600 dark:text-amber-550' : 'text-rose-600 dark:text-rose-550'} 
                strokeDasharray={`${report.trustScore}, 100`} 
                strokeWidth="2" 
                stroke="currentColor" 
                fill="none" 
                strokeLinecap="round" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-zinc-850 dark:text-white">{report.trustScore}</span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">/ 100</span>
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[10px] font-bold mb-4 ${
            report.trustScore >= 80 
              ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-150 dark:border-green-900/50' 
              : report.trustScore >= 50 
                ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-150 dark:border-amber-900/50' 
                : 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-150 dark:border-rose-900/50'
          }`}>
            {report.trustScore >= 80 ? <ShieldCheck size={12} /> : report.trustScore >= 50 ? <AlertTriangle size={12} /> : <ShieldAlert size={12} />}
            Mức độ: {report.level}
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-450 font-bold leading-relaxed">{report.summary}</p>
        </div>

        {/* THẺ TIÊU CHÍ THÀNH PHẦN (CRITERIA BREAKDOWN) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-6 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
          <div className="w-full">
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-zinc-500" /> Điểm thành phần đánh giá
            </h3>
            
            <div className="space-y-5">
              {report.criteriaBreakdown.map((item: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-end mb-1.5">
                    <div>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">{item.name}</span>
                      <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 ml-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 px-1.5 py-0.5 rounded">Trọng số: {item.weight}</span>
                    </div>
                    <span className="font-bold text-zinc-805 dark:text-zinc-200 text-xs">{item.score}/100</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${item.score >= 80 ? 'bg-green-600 dark:bg-green-500' : item.score >= 60 ? 'bg-amber-600 dark:bg-amber-500' : 'bg-rose-600 dark:bg-rose-500'}`} 
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG CHI TIẾT TRÍCH DẪN (FE-09) */}
      <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-150 dark:border-zinc-900">
          <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={16} className="text-zinc-500" /> Chi tiết danh mục tài liệu tham khảo
          </h3>
          <p className="text-[11px] text-zinc-550 dark:text-zinc-500 font-semibold mt-1">Hệ thống phân tích và chỉ ra các nguồn trích dẫn cần lưu ý.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold border-b border-zinc-150 dark:border-zinc-900">
                <th className="p-4 pl-6 w-1/3">Tài liệu / Tác giả</th>
                <th className="p-4">Năm / Nguồn</th>
                <th className="p-4">Cảnh báo hệ thống</th>
                <th className="p-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-900 text-[11px]">
              {report.citations.map((cite: any) => (
                <tr key={cite.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-zinc-800 dark:text-zinc-250 line-clamp-2">{cite.title}</p>
                    <p className="font-semibold text-zinc-400 dark:text-zinc-550 mt-1">{cite.author}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-zinc-700 dark:text-zinc-350">{cite.year}</p>
                    <p className="font-semibold text-zinc-400 dark:text-zinc-550 mt-1">{cite.source}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-1.5">
                      {cite.status !== 'pass' && <Info size={13} className={`mt-0.5 shrink-0 ${cite.status === 'warning' ? 'text-amber-600 dark:text-amber-500' : 'text-rose-600 dark:text-rose-500'}`} />}
                      <span className={`font-semibold ${cite.status === 'pass' ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-650 dark:text-zinc-455'}`}>
                        {cite.issues}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {cite.status === 'pass' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-bold rounded border border-green-150 dark:border-green-900/50 text-[10px]">
                        <CheckCircle2 size={11} /> Hợp lệ
                      </span>
                    )}
                    {cite.status === 'warning' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold rounded border border-amber-150 dark:border-amber-900/50 text-[10px]">
                        <AlertTriangle size={11} /> Chú ý
                      </span>
                    )}
                    {cite.status === 'fail' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-bold rounded border border-rose-150 dark:border-rose-900/50 text-[10px]">
                        <ShieldAlert size={11} /> Rủi ro cao
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