import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Download, AlertTriangle, 
  CheckCircle2, FileText, ChevronLeft, BarChart3, Info, Loader2,
  Calendar, Layers, Sliders, ChevronDown, Check, Play, RefreshCw, X
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { jobService } from '../../services/jobService';

export default function ReportScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // States cho P1 Re-score (Chấm điểm lại)
  const [isRescoreModalOpen, setIsRescoreModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('IT_GENERAL');
  const [retryMode, setRetryMode] = useState('full');
  const [retryReason, setRetryReason] = useState('');
  const [submittingRescore, setSubmittingRescore] = useState(false);

  // States cho P1 Export Options (Bộ xuất báo cáo)
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeNotes, setIncludeNotes] = useState(false);

  // States cho P1 Revision (Lịch sử bản sửa đổi)
  const [revisions, setRevisions] = useState<any[]>([]);
  const [currentRevisionId, setCurrentRevisionId] = useState<string>('');
  
  // State cho P1 Explanation Accordion (Mở rộng C1-C8)
  const [expandedCriterionIndex, setExpandedCriterionIndex] = useState<number | null>(null);

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

  // Hàm tải dữ liệu báo cáo (chấp nhận nạp theo ID bản sửa đổi khác)
  const loadReportData = async (targetId: string) => {
    setLoading(true);
    setError('');
    try {
      let data = await reportService.getReport(targetId);
      
      // Chuẩn hóa dữ liệu từ backend API khớp với giao diện C1-C8 mới
      const rawScore = data.report_trust_score ?? data.trust_score ?? data.trustScore;
      const trustScore = typeof rawScore === 'number' ? rawScore : 0;
      
      const componentSummary = data.component_summary || data.componentSummary || {};
      
      // Hỗ trợ cả hai kiểu dữ liệu: P0 (number) hoặc P1 (object chứa explanation/evidence)
      const parseComponent = (comp: any, defaultMax: number) => {
        if (comp && typeof comp === 'object') {
          return {
            score: comp.score ?? 0,
            max: comp.max_score ?? defaultMax,
            reason_code: comp.reason_code || 'N/A',
            explanation: comp.explanation || 'Không có giải thích chi tiết.',
            evidence: comp.evidence ? JSON.stringify(comp.evidence) : 'Không có bằng chứng cụ thể.',
            recommendation: comp.recommendation || 'Kiểm tra lại tài liệu trích dẫn.'
          };
        }
        return {
          score: typeof comp === 'number' ? comp : 0,
          max: defaultMax,
          reason_code: 'COMP_SCORE',
          explanation: 'Điểm số tiêu chí thành phần dựa trên đặc tả công thức Trust Score v1.0.',
          evidence: `Giá trị thô: ${comp}`,
          recommendation: 'Rà soát lại tài liệu tham khảo để tối ưu hóa tiêu chí này.'
        };
      };

      const criteriaBreakdown = [
        { name: 'Mức độ hoàn thiện Metadata (C1)', ...parseComponent(componentSummary.c1_metadata_completeness || componentSummary.c1MetadataCompleteness || componentSummary.c1, 10) },
        { name: 'Mức độ xác minh Metadata (C2)', ...parseComponent(componentSummary.c2_metadata_verification || componentSummary.c2MetadataVerification || componentSummary.c2, 20) },
        { name: 'Độ tin cậy của nguồn (C3)', ...parseComponent(componentSummary.c3_source_credibility || componentSummary.c3SourceCredibility || componentSummary.c3, 20) },
        { name: 'Độ phù hợp chủ đề (C4)', ...parseComponent(componentSummary.c4_relevance || componentSummary.c4Relevance || componentSummary.c4, 20) },
        { name: 'Tính cập nhật (C5)', ...parseComponent(componentSummary.c5_recency || componentSummary.c5Recency || componentSummary.c5, 10) },
        { name: 'Chất lượng trích dẫn (C6)', ...parseComponent(componentSummary.c6_citation_quality || componentSummary.c6CitationQuality || componentSummary.c6, 10) },
        { name: 'Đóng góp đa dạng nguồn (C7)', ...parseComponent(componentSummary.c7_source_diversity || componentSummary.c7SourceDiversity || componentSummary.c7, 5) },
        { name: 'Tính liêm chính học thuật (C8)', ...parseComponent(componentSummary.c8_academic_risk_integrity || componentSummary.c8AcademicRiskIntegrity || componentSummary.c8, 5) }
      ];

      const normalizedReport = {
        report_id: data.report_id || targetId,
        submission_id: data.submission_id || '',
        job_id: data.job_id || '',
        scoring_preset_name: data.scoring_preset_name || 'Mặc định',
        scoring_preset_code: data.scoring_preset_code || 'IT_GENERAL',
        scoring_preset_version: data.scoring_preset_version || 1,
        revision_number: data.revision_number ?? 1,
        created_at: data.created_at || new Date().toISOString(),
        trustScore,
        confidenceScore: data.confidence_score ?? data.confidenceScore ?? 0,
        level: getLabelText(data.overall_label, trustScore),
        summary: getSummaryText(data.summary),
        criteriaBreakdown,
        citations: (data.citations || []).map((cite: any, index: number) => {
          let status = 'pass';
          if (cite.metadata?.match_status === 'not_found' || cite.warnings?.some((w: any) => w.severity === 'critical' || w.severity === 'high')) {
            status = 'fail';
          } else if (cite.metadata?.match_status !== 'verified' || (cite.warnings && cite.warnings.length > 0)) {
            status = 'warning';
          }

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
      setCurrentRevisionId(targetId);

      // Tải lịch sử sửa đổi (P1 Revision History)
      try {
        const history = await reportService.getReportHistory(normalizedReport.report_id);
        setRevisions(history || []);
      } catch (e) {
        console.warn("Không thể lấy lịch sử sửa đổi:", e);
      }

    } catch (err: any) {
      console.error("Lỗi khi tải dữ liệu báo cáo:", err);
      setError(err.response?.data?.message || 'Không thể tải báo cáo thẩm định. Vui lòng kiểm tra quyền truy cập hoặc kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const reportId = id || 'mock-report-uuid-1';
    loadReportData(reportId);
  }, [id]);

  const handleExport = async () => {
    const reportId = currentRevisionId || id || 'mock-report-uuid-1';
    setIsExportDropdownOpen(false);
    setExporting(true);

    try {
      // 1. Khởi chạy tiến trình xuất file với format và ghi chú đã chọn
      const exportRes = await reportService.exportReport(reportId, exportFormat, includeNotes);
      const exportId = exportRes.export_id;

      if (!exportId) {
        throw new Error("Không nhận được mã xuất file (Export ID) từ server.");
      }

      // 2. Tải file blob về client
      const fileBlob = await reportService.downloadExportFile(exportId);
      
      // 3. Kích hoạt tải xuống file
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TrustLens_Report_${reportId}.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Lỗi xuất tệp:", err);
      alert(`Không thể xuất tệp báo cáo ${exportFormat.toUpperCase()}: ` + (err.response?.data?.message || err.message));
    } finally {
      setExporting(false);
    }
  };

  const handleStartRescore = async () => {
    if (!report || submittingRescore) return;

    setSubmittingRescore(true);
    setError('');
    try {
      const res = await jobService.retryJob(report.job_id, retryMode, retryReason || `Chạy lại cấu hình chấm điểm preset ${selectedPreset}`);
      setIsRescoreModalOpen(false);
      setSubmittingRescore(false);
      // Điều hướng sang AnalyzingScreen để theo dõi tiến trình của Job mới
      navigate(`/analyzing/${res.job_id}`);
    } catch (err: any) {
      console.error("Lỗi khi chấm điểm lại:", err);
      setSubmittingRescore(false);
      alert("Không thể khởi chạy chấm điểm lại: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading && !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={32} className="text-zinc-900 dark:text-white animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs">Đang tải kết quả thẩm định...</p>
      </div>
    );
  }

  if (error && !report) {
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

  if (!report) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 space-y-6 animate-fade-in px-2 sm:px-4">
      {/* HEADER QUAY LẠI & BỘ ĐIỀU HƯỚNG BẢN SỬA ĐỔI / NÚT EXPORT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
        <div>
          <button 
            onClick={() => navigate('/classes')}
            className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold text-xs transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Trở về trang quản lý lớp học
          </button>
          
          <div className="flex flex-wrap items-center gap-2.5 mt-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Kết quả thẩm định tài liệu</h2>
            
            {/* P1 Revision Selector */}
            {revisions.length > 1 && (
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-800 dark:text-zinc-200">
                <Layers size={12} className="text-zinc-500" />
                Bản sửa đổi:
                <select 
                  value={currentRevisionId} 
                  onChange={(e) => loadReportData(e.target.value)}
                  className="bg-transparent font-extrabold focus:outline-none cursor-pointer"
                >
                  {revisions.map((rev) => (
                    <option key={rev.id} value={rev.id} className="bg-white dark:bg-zinc-950">
                      #{rev.revision_number} - {rev.report_trust_score}đ ({new Date(rev.created_at).toLocaleDateString('vi-VN')})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Cụm chức năng re-score và export */}
        <div className="flex gap-2 w-full md:w-auto relative">
          <button
            onClick={() => setIsRescoreModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold text-xs rounded-lg text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <Sliders size={13} /> Chấm điểm lại
          </button>

          {/* P1 Export Dropdown UI */}
          <div className="relative flex-1 md:flex-initial">
            <button 
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-105 text-white dark:text-black font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-60"
            >
              {exporting ? (
                <><Loader2 size={14} className="animate-spin" /> Đang xuất...</>
              ) : (
                <><Download size={14} /> Xuất báo cáo <ChevronDown size={12} /></>
              )}
            </button>

            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-2 z-30 w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl shadow-lg p-4 space-y-4 animate-fade-in text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">Định dạng tệp tin</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['pdf', 'docx', 'xlsx'].map((fmt) => (
                      <button 
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`py-1.5 border rounded-lg font-bold uppercase ${
                          exportFormat === fmt 
                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white' 
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-zinc-650 dark:text-zinc-400">
                  <input 
                    type="checkbox" 
                    checked={includeNotes}
                    onChange={(e) => setIncludeNotes(e.target.checked)}
                    className="rounded text-zinc-900 border-zinc-300 focus:ring-zinc-400 cursor-pointer w-4 h-4"
                  />
                  Đính kèm ghi chú của giảng viên
                </label>

                <button 
                  onClick={handleExport}
                  className="w-full bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold py-2 rounded-lg text-center transition-colors block"
                >
                  Tải xuống tệp báo cáo
                </button>
              </div>
            )}
          </div>
        </div>
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
          
          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[10px] font-bold mb-2.5 ${
            report.trustScore >= 80 
              ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-150 dark:border-green-900/50' 
              : report.trustScore >= 50 
                ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-150 dark:border-amber-900/50' 
                : 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-150 dark:border-rose-900/50'
          }`}>
            {report.trustScore >= 80 ? <ShieldCheck size={12} /> : report.trustScore >= 50 ? <AlertTriangle size={12} /> : <ShieldAlert size={12} />}
            Mức độ: {report.level}
          </div>

          <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-3 bg-zinc-550/5 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-150 dark:border-zinc-850">
            Độ tự tin (Confidence): <span className="text-zinc-800 dark:text-zinc-250">{(report.confidenceScore * 100).toFixed(0)}%</span>
          </div>

          <div className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-1">
            <Sliders size={10} /> Cấu hình: {report.scoring_preset_name} (v{report.scoring_preset_version})
          </div>

          <p className="text-[10px] text-zinc-500 dark:text-zinc-450 font-bold leading-relaxed">{report.summary}</p>
        </div>

        {/* THẺ TIÊU CHÍ THÀNH PHẦN C1-C8 (P1 ACCORDION EXPLANATIONS UI) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-6 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
          <div className="w-full">
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-zinc-500" /> Điểm tiêu chí đánh giá C1–C8
            </h3>
            
            <div className="space-y-3">
              {report.criteriaBreakdown.map((item: any, idx: number) => {
                const percentage = (item.score / item.max) * 100;
                const isExpanded = expandedCriterionIndex === idx;

                return (
                  <div 
                    key={idx} 
                    className="border border-zinc-150 dark:border-zinc-900 rounded-xl overflow-hidden transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-800"
                  >
                    {/* Thanh tiêu đề tiêu chí */}
                    <div 
                      onClick={() => setExpandedCriterionIndex(isExpanded ? null : idx)}
                      className="p-3 bg-zinc-50/50 dark:bg-zinc-900/10 flex justify-between items-center cursor-pointer select-none"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-1 pr-3">
                          <div>
                            <span className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">{item.name}</span>
                            <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 ml-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 px-1.5 py-0.5 rounded">Tối đa: {item.max}đ</span>
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
                      
                      <ChevronDown size={14} className={`text-zinc-450 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Nội dung chi tiết giải thích (P1 Explanation Section) */}
                    {isExpanded && (
                      <div className="p-4 border-t border-zinc-150 dark:border-zinc-900 bg-white dark:bg-zinc-950 space-y-3 animate-fade-in text-[10px]">
                        <div className="space-y-1">
                          <p className="font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider text-[8px]">Giải thích lý do</p>
                          <p className="font-semibold text-zinc-750 dark:text-zinc-300 text-[11px] leading-relaxed">{item.explanation}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider text-[8px]">Bằng chứng trích xuất (Evidence)</p>
                            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-lg text-zinc-650 dark:text-zinc-400 font-mono text-[9px] overflow-x-auto">
                              {item.evidence}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider text-[8px]">Khuyến nghị đề xuất (Recommendation)</p>
                            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-lg text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed">
                              {item.recommendation}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-900 text-[8px] font-bold text-zinc-400">
                          <span>Mã lý do: <span className="font-mono bg-zinc-50 dark:bg-zinc-900 px-1 py-0.5 rounded border border-zinc-150 dark:border-zinc-850">{item.reason_code}</span></span>
                          <span className="flex items-center gap-1"><Info size={10} /> Dữ liệu cập nhật: {new Date(report.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    )}
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
                    <p className="font-semibold text-zinc-400 dark:text-zinc-550 mt-1">{cite.author}</p>
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

      {/* MODAL CẤU HÌNH CHẤM ĐIỂM LẠI (P1 RE-SCORE MODAL) */}
      {isRescoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 w-full max-w-lg rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in text-xs">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-150 dark:border-zinc-900 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/20">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <RefreshCw size={15} /> Khởi tạo chấm điểm lại đồ án
              </h3>
              <button 
                onClick={() => setIsRescoreModalOpen(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Preset Selector */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-800 dark:text-zinc-200 block">Cấu hình đánh giá (Scoring Preset)</label>
                <select 
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors"
                >
                  <option value="IT_GENERAL">CNTT tổng quát (IT_GENERAL v1)</option>
                  <option value="MATH_CS">Toán tin ứng dụng (MATH_CS v2)</option>
                  <option value="SE_CORE">Kỹ thuật phần mềm (SE_CORE v1)</option>
                </select>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-550 leading-relaxed font-semibold">
                  * Mỗi Preset có cơ chế phân bổ trọng số tiêu chí C1-C8 và các mức phạt (penalty) khác nhau thích hợp cho từng lĩnh vực chuyên ngành.
                </p>
              </div>

              {/* Staged Retry Mode Selector */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-800 dark:text-zinc-200 block">Chế độ phân tích lại (Retry Mode)</label>
                <div className="grid grid-cols-2 gap-2.5 font-semibold">
                  {[
                    { id: 'full', title: 'Toàn bộ', desc: 'Chạy lại toàn quy trình' },
                    { id: 'metadata_only', title: 'Metadata Only', desc: 'Sử dụng lại citation cũ, đối chiếu lại metadata' },
                    { id: 'scoring_only', title: 'Scoring Only', desc: 'Chạy lại chấm điểm theo preset mới' },
                    { id: 'report_only', title: 'Report Only', desc: 'Tái sinh tệp báo cáo export' }
                  ].map((mode) => (
                    <label 
                      key={mode.id}
                      className={`p-3 border rounded-xl flex flex-col gap-0.5 cursor-pointer transition-colors ${
                        retryMode === mode.id 
                          ? 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-900 dark:border-white text-zinc-900 dark:text-white' 
                          : 'border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 text-zinc-500'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-[11px] font-bold">
                        <input 
                          type="radio" 
                          name="retryMode" 
                          value={mode.id}
                          checked={retryMode === mode.id}
                          onChange={() => setRetryMode(mode.id)}
                          className="text-zinc-900 border-zinc-300 focus:ring-zinc-400"
                        />
                        {mode.title}
                      </span>
                      <span className="text-[8px] font-medium text-zinc-400 leading-normal">{mode.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reason input */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-800 dark:text-zinc-200 block">Lý do chấm điểm lại (Audit Reason)</label>
                <textarea 
                  value={retryReason}
                  onChange={(e) => setRetryReason(e.target.value)}
                  placeholder="Nhập lý do thực hiện chấm điểm lại đồ án (ví dụ: đổi cấu hình CNTT, nhà cung cấp Crossref timeout tệp trước...)"
                  className="w-full h-20 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors text-zinc-800 dark:text-zinc-200 placeholder:font-normal placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-zinc-150 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/20 flex justify-end gap-2">
              <button 
                onClick={() => setIsRescoreModalOpen(false)}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleStartRescore}
                disabled={submittingRescore}
                className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                {submittingRescore ? (
                  <><Loader2 size={12} className="animate-spin" /> Đang gửi...</>
                ) : (
                  <><Play size={12} /> Bắt đầu chấm lại</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}