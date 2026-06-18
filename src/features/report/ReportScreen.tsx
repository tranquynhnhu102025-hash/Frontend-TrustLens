import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Download, AlertTriangle, 
  CheckCircle2, FileText, ChevronLeft, BarChart3, Info, Loader2
} from 'lucide-react';
import { reportService } from '../../services/reportService';

export default function ReportScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const getSummaryText = (summary: any): string => {
    if (typeof summary === 'string') return summary;
    if (!summary) return 'Báo cáo thẩm định trích dẫn tự động cho bài nộp tài liệu học thuật.';
    
    return `Phân tích tổng cộng ${summary.total_citations || 0} tài liệu tham khảo: ` +
      `${summary.verified || 0} nguồn đã xác minh, ` +
      `${summary.partial || 0} xác minh một phần, ` +
      `${summary.not_found || 0} không tìm thấy, ` +
      `${summary.unknown || 0} chưa rõ. ` +
      `Phát hiện ${summary.critical_warnings || 0} cảnh báo nghiêm trọng, ` +
      `${summary.high_warnings || 0} cảnh báo mức cao.`;
  };

  const getLabelText = (label: string, score: number): string => {
    switch (label?.toLowerCase()) {
      case 'passed':
      case 'pass':
      case 'verified':
        return 'Đạt chuẩn';
      case 'needs_review':
      case 'warning':
        return 'Cảnh báo';
      case 'failed':
      case 'fail':
      case 'danger':
      case 'critical':
        return 'Nguy hiểm';
      default:
        return score >= 80 ? 'Đạt chuẩn' : score >= 50 ? 'Cảnh báo' : 'Nguy hiểm';
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      setError('');
      
      const reportId = id || 'mock-report-uuid-1';

      setLoading(true);
      try {
        let data;

        // Thử lấy báo cáo bằng reportId trước
        try {
          data = await reportService.getReport(reportId);
        } catch (err) {
          console.warn("Lấy báo cáo bằng reportId thất bại, thử lấy bằng submissionId...", err);
          // Fallback lấy báo cáo bằng submissionId
          data = await reportService.getReportBySubmission(reportId);
        }
        
        // Chuẩn hóa dữ liệu từ backend API khớp với giao diện C1-C8 mới
        const rawScore = data.report_trust_score ?? data.trust_score ?? data.trustScore;
        const trustScore = typeof rawScore === 'number' ? rawScore : 0;
        
        const componentSummary = data.component_summary || data.componentSummary || {};
        
        const criteriaBreakdown = [
          { name: 'Mức độ hoàn thiện Metadata (C1)', score: componentSummary.c1_metadata_completeness ?? componentSummary.c1MetadataCompleteness ?? componentSummary.c1 ?? 0, max: 10 },
          { name: 'Mức độ xác minh Metadata (C2)', score: componentSummary.c2_metadata_verification ?? componentSummary.c2MetadataVerification ?? componentSummary.c2 ?? 0, max: 20 },
          { name: 'Độ tin cậy của nguồn (C3)', score: componentSummary.c3_source_credibility ?? componentSummary.c3SourceCredibility ?? componentSummary.c3 ?? 0, max: 20 },
          { name: 'Độ phù hợp chủ đề (C4)', score: componentSummary.c4_relevance ?? componentSummary.c4Relevance ?? componentSummary.c4 ?? 0, max: 20 },
          { name: 'Tính cập nhật (C5)', score: componentSummary.c5_recency ?? componentSummary.c5Recency ?? componentSummary.c5 ?? 0, max: 10 },
          { name: 'Chất lượng trích dẫn (C6)', score: componentSummary.c6_citation_quality ?? componentSummary.c6CitationQuality ?? componentSummary.c6 ?? 0, max: 10 },
          { name: 'Đóng góp đa dạng nguồn (C7)', score: componentSummary.c7_source_diversity ?? componentSummary.c7SourceDiversity ?? componentSummary.c7 ?? 0, max: 5 },
          { name: 'Tính liêm chính học thuật (C8)', score: componentSummary.c8_academic_risk_integrity ?? componentSummary.c8AcademicRiskIntegrity ?? componentSummary.c8 ?? 0, max: 5 }
        ];

        const normalizedReport = {
          trustScore,
          confidenceScore: data.confidence_score ?? data.confidenceScore ?? 0,
          level: getLabelText(data.overall_label, trustScore),
          summary: getSummaryText(data.summary),
          criteriaBreakdown,
          citations: (data.citations || []).map((cite: any, index: number) => {
            // Xác định trạng thái của từng trích dẫn
            let status = 'pass';
            if (cite.metadata?.match_status === 'not_found' || cite.warnings?.some((w: any) => w.severity === 'critical' || w.severity === 'high')) {
              status = 'fail';
            } else if (cite.metadata?.match_status !== 'verified' || (cite.warnings && cite.warnings.length > 0)) {
              status = 'warning';
            }

            // Gộp danh sách cảnh báo thành văn bản mô tả
            let issues = 'Hợp lệ';
            if (cite.warnings && cite.warnings.length > 0) {
              issues = cite.warnings.map((w: any) => `${w.message}${w.recommendation ? ` (Đề xuất: ${w.recommendation})` : ''}`).join('; ');
            } else if (cite.metadata?.match_status === 'not_found') {
              issues = 'Không tìm thấy thông tin đối sánh tài liệu.';
            } else if (cite.metadata?.match_status === 'unknown') {
              issues = 'Không thể xác minh tài liệu do lỗi hệ thống đối sánh.';
            } else if (cite.metadata?.match_status === 'ambiguous') {
              issues = 'Thông tin đối sánh không rõ ràng (nhiều kết quả trùng khớp).';
            }

            return {
              id: cite.citation_id ?? cite.id ?? index + 1,
              title: cite.normalized_fields?.title || cite.raw_text || 'Tài liệu tham khảo',
              author: Array.isArray(cite.normalized_fields?.authors) 
                ? cite.normalized_fields.authors.join(', ') 
                : cite.normalized_fields?.authors || 'N/A',
              year: cite.normalized_fields?.year || 'N/A',
              source: cite.normalized_fields?.venue || 'N/A',
              status,
              issues
            };
          })
        };

        setReport(normalizedReport);
      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu báo cáo:", err);
        setError(err.response?.data?.message || 'Không thể tải báo cáo thẩm định. Vui lòng kiểm tra quyền truy cập hoặc kết nối mạng.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleExport = async () => {
    const reportId = id || 'mock-report-uuid-1';
    if (exporting) return;
    
    setExporting(true);
    try {
      // 1. Gửi yêu cầu khởi tạo xuất file
      const exportRes = await reportService.exportReport(reportId);
      const exportId = exportRes.export_id;

      if (!exportId) {
        throw new Error("Không nhận được mã xuất file (Export ID) từ server.");
      }

      // 2. Tải file blob về client qua Authorization token
      const fileBlob = await reportService.downloadExportFile(exportId);
      
      // 3. Kích hoạt tải xuống file trong trình duyệt
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TrustLens_Report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Dọn dẹp tài nguyên
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Lỗi xuất PDF:", err);
      alert("Không thể xuất tệp báo cáo PDF: " + (err.response?.data?.message || err.message));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={32} className="text-zinc-900 dark:text-white animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs">Đang tải kết quả thẩm định...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto mt-16 p-8 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-lg text-center shadow-sm">
        <AlertTriangle size={36} className="text-rose-500 mx-auto mb-4" />
        <h3 className="text-sm font-bold mb-1 text-zinc-900 dark:text-white">Không thể tải báo cáo</h3>
        <p className="text-xs mb-5 leading-relaxed text-zinc-500 font-medium">{error}</p>
        <button 
          onClick={() => navigate('/classes')}
          className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold px-4 py-2 rounded-lg transition-colors text-xs"
        >
          <ChevronLeft size={13} /> Trở về trang quản lý lớp học
        </button>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 space-y-6 animate-fade-in px-2 sm:px-4">
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
          disabled={exporting}
          className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-60"
        >
          {exporting ? (
            <><Loader2 size={14} className="animate-spin" /> Đang xuất...</>
          ) : (
            <><Download size={14} /> Xuất báo cáo (PDF)</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* THẺ TRUST SCORE */}
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
              <span className="text-4xl font-bold text-zinc-850 dark:text-white">{report.trustScore.toFixed(0)}</span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">/ 100</span>
            </div>
          </div>
          
          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[10px] font-bold mb-3 ${
            report.trustScore >= 80 
              ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-150 dark:border-green-900/50' 
              : report.trustScore >= 50 
                ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-150 dark:border-amber-900/50' 
                : 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-150 dark:border-rose-900/50'
          }`}>
            {report.trustScore >= 80 ? <ShieldCheck size={12} /> : report.trustScore >= 50 ? <AlertTriangle size={12} /> : <ShieldAlert size={12} />}
            Mức độ: {report.level}
          </div>

          <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-4 bg-zinc-550/5 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-150 dark:border-zinc-850">
            Độ tự tin (Confidence): <span className="text-zinc-800 dark:text-zinc-250">{(report.confidenceScore * 100).toFixed(0)}%</span>
          </div>

          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed">{report.summary}</p>
        </div>

        {/* THẺ TIÊU CHÍ THÀNH PHẦN C1-C8 */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-6 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
          <div className="w-full">
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-zinc-500" /> Điểm thành phần đánh giá C1–C8
            </h3>
            
            <div className="space-y-4">
              {report.criteriaBreakdown.map((item: any, idx: number) => {
                const percentage = (item.score / item.max) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-1">
                      <div>
                        <span className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">{item.name}</span>
                        <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 ml-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 px-1.5 py-0.5 rounded">Tối đa: {item.max}đ</span>
                      </div>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">{item.score}/{item.max}</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          percentage >= 80 
                            ? 'bg-green-600 dark:bg-green-500' 
                            : percentage >= 50 
                              ? 'bg-amber-600 dark:bg-amber-500' 
                              : 'bg-rose-600 dark:bg-rose-500'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG CHI TIẾT TRÍCH DẪN */}
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
                <tr key={cite.id} className="hover:bg-zinc-550/5 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2">{cite.title}</p>
                    <p className="font-semibold text-zinc-400 dark:text-zinc-500 mt-1">{cite.author}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-zinc-700 dark:text-zinc-300">{cite.year}</p>
                    <p className="font-semibold text-zinc-400 dark:text-zinc-550 mt-1">{cite.source}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-1.5">
                      {cite.status !== 'pass' && <Info size={13} className={`mt-0.5 shrink-0 ${cite.status === 'warning' ? 'text-amber-600 dark:text-amber-550' : 'text-rose-600 dark:text-rose-550'}`} />}
                      <span className={`font-semibold ${cite.status === 'pass' ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {cite.issues}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
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