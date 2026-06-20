import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Download, AlertTriangle, 
  CheckCircle2, FileText, ChevronLeft, BarChart3, Info, Loader2,
  Calendar, Layers, Sliders, ChevronDown, Check, Play, RefreshCw, X, ExternalLink
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { jobService } from '../../services/jobService';
import NumberTicker from '../../components/NumberTicker';
import {
  TRUST_SCORE_COMPONENTS,
  TRUST_SCORE_VERSION,
  getApiWeight,
  getComponentFromSummary,
  labelText,
} from '../../config/trustScoreConfig';

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

  // State cho hiệu ứng SVG Radial gauge
  const [gaugeScore, setGaugeScore] = useState(0);

  // States cho P1 Export Options (Bộ xuất báo cáo)
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeNotes, setIncludeNotes] = useState(false);

  // State cho UI-08 Citation Detail Drawer
  const [selectedCitation, setSelectedCitation] = useState<any>(null);

  // States cho P1 Revision (Lịch sử bản sửa đổi)
  const [revisions, setRevisions] = useState<any[]>([]);
  const [currentRevisionId, setCurrentRevisionId] = useState<string>('');
  
  // State cho Explanation Accordion (Trust Score v1.1 C1-C7)
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

  const buildExportFileName = (studentName: string | undefined, format: string) => {
    const safeName = (studentName || 'Sinh_vien')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 80);

    return `TrustLens_Report_${safeName || 'Sinh_vien'}.${format}`;
  };

  // Hàm tải dữ liệu báo cáo (chấp nhận nạp theo ID bản sửa đổi khác)
  const loadReportData = async (targetId: string) => {
    setGaugeScore(0);
    setLoading(true);
    setError('');
    try {
      let data = await reportService.getReport(targetId);
      
      // Chuẩn hóa dữ liệu từ backend API theo Trust Score v1.1.
      const rawScore = data.report_trust_score ?? data.trust_score ?? data.trustScore;
      const trustScore = typeof rawScore === 'number' ? rawScore : 0;
      const trustScoreDefinition = data.trust_score || {};
      const trustScoreVersion = trustScoreDefinition.version || data.scoring_config_version || TRUST_SCORE_VERSION;
      
      const componentSummary = data.component_summary || data.componentSummary || {};
      
      // Hỗ trợ cả hai kiểu dữ liệu: P0 (number) hoặc P1 (object chứa explanation/evidence)
      const parseComponent = (comp: any, criterion: any) => {
        const configuredMax = getApiWeight(trustScoreDefinition, criterion);
        if (comp && typeof comp === 'object') {
          return {
            score: comp.score ?? 0,
            max: comp.max_score ?? configuredMax,
            reason_code: comp.reason_code || criterion.code,
            explanation: comp.reason || comp.explanation || criterion.purpose,
            evidence: comp.evidence ? JSON.stringify(comp.evidence, null, 2) : criterion.evidence,
            recommendation: comp.recommendation || criterion.recommendation
          };
        }
        return {
          score: typeof comp === 'number' ? comp : 0,
          max: configuredMax,
          reason_code: criterion.code,
          explanation: `Điểm trung bình cấu phần ${criterion.code} theo ${trustScoreVersion}. ${criterion.purpose}`,
          evidence: `Giá trị thô: ${comp}`,
          recommendation: criterion.recommendation
        };
      };

      const criteriaBreakdown = TRUST_SCORE_COMPONENTS.map((criterion) => ({
        key: criterion.key,
        code: criterion.code,
        name: `${criterion.code}. ${criterion.shortLabel}`,
        ...parseComponent(getComponentFromSummary(componentSummary, criterion), criterion)
      }));

      const normalizedReport = {
        report_id: data.report_id || targetId,
        submission_id: data.submission_id || '',
        studentName: data.owner_label || data.student_name || data.submission?.owner_label || '',
        job_id: data.job_id || '',
        scoring_preset_name: data.scoring_preset_name || 'Mặc định',
        scoring_preset_code: data.scoring_preset_code || 'IT_GENERAL',
        scoring_preset_version: data.scoring_preset_version || 1,
        scoring_config_version: data.scoring_config_version || trustScoreVersion,
        trustScoreVersion,
        trustScoreDefinition,
        revision_number: data.revision_number ?? 1,
        created_at: data.created_at || new Date().toISOString(),
        trustScore,
        confidenceScore: data.confidence_score ?? data.confidenceScore ?? 0,
        level: labelText(data.overall_label, trustScore),
        summary: getSummaryText(data.summary),
        criteriaBreakdown,
        citations: (data.citations || []).map((cite: any, index: number) => {
          const metadataStatus = String(cite.metadata?.status || cite.metadata?.match_status || 'UNKNOWN').toUpperCase();
          let status = 'pass';
          if (['NOT_FOUND', 'INVALID_IDENTIFIER'].includes(metadataStatus) || cite.warnings?.some((w: any) => w.severity === 'critical' || w.severity === 'high')) {
            status = 'fail';
          } else if (!['VERIFIED', 'PARTIAL_MATCH'].includes(metadataStatus) || (cite.warnings && cite.warnings.length > 0)) {
            status = 'warning';
          }

          let issues = 'Hợp lệ';
          if (cite.warnings && cite.warnings.length > 0) {
            issues = cite.warnings.map((w: any) => `${w.message}${w.recommendation ? ` (Đề xuất: ${w.recommendation})` : ''}`).join('; ');
          } else if (metadataStatus === 'NOT_FOUND') {
            issues = 'Không tìm thấy thông tin đối sánh tài liệu.';
          } else if (metadataStatus === 'PROVIDER_UNAVAILABLE') {
            issues = 'Không thể xác minh tài liệu do lỗi hệ thống đối sánh.';
          } else if (metadataStatus === 'AMBIGUOUS') {
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
            issues,
            raw: cite // Lưu đối tượng gốc phục vụ ngăn kéo chi tiết (UI-08)
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

  useEffect(() => {
    if (report) {
      const timer = setTimeout(() => {
        setGaugeScore(report.trustScore);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [report]);

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
      link.setAttribute('download', buildExportFileName(report?.studentName, exportFormat));
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
      <div className="w-full max-w-5xl mx-auto mt-4 space-y-6 animate-pulse px-2 sm:px-4">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-150 dark:border-zinc-900 pb-5">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-6 w-64 bg-zinc-200 dark:bg-zinc-805 rounded mt-1"></div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="h-9 w-28 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
            <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </div>

        {/* Score & Key Details Panel Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 flex flex-col items-center justify-center text-center shadow-sm h-64">
            <div className="h-3 w-28 bg-zinc-150 dark:bg-zinc-850 rounded mb-4"></div>
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
            <div className="h-5 w-24 bg-zinc-205 dark:bg-zinc-800 rounded mt-4"></div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-zinc-955 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col justify-between h-64">
            <div className="space-y-3">
              <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                  <div className="h-3.5 w-32 bg-zinc-150 dark:bg-zinc-800 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                  <div className="h-3.5 w-32 bg-zinc-150 dark:bg-zinc-800 rounded"></div>
                </div>
              </div>
            </div>
            <div className="h-9 w-full bg-zinc-100 dark:bg-zinc-900 rounded"></div>
          </div>
        </div>

        {/* Detailed checks Checklist Skeleton */}
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-zinc-105 dark:border-zinc-900/60 rounded-lg flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-zinc-205 dark:bg-zinc-800 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-3 w-1/3 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
              </div>
            </div>
          ))}
        </div>
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

  const selectedMetadata = selectedCitation?.raw?.metadata || {};
  const selectedMetadataStatus = String(selectedMetadata.status || selectedMetadata.match_status || 'UNKNOWN').toUpperCase();
  const selectedMetadataConfidence = selectedMetadata.confidence ?? selectedMetadata.match_confidence ?? 0;
  const selectedMetadataStatusLabel: Record<string, string> = {
    VERIFIED: 'Xác minh đầy đủ',
    PARTIAL_MATCH: 'Khớp một phần',
    AMBIGUOUS: 'Mơ hồ',
    NOT_FOUND: 'Không tìm thấy metadata',
    PROVIDER_UNAVAILABLE: 'Provider không sẵn sàng',
    URL_ONLY: 'Chỉ xác minh URL',
    INVALID_IDENTIFIER: 'Định danh không hợp lệ',
    UNKNOWN: 'Không rõ',
  };

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
              <div className="absolute right-0 mt-2 z-30 w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl shadow-lg p-4 space-y-4 animate-scale-up text-xs origin-top-right">
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
                className={`transition-[stroke-dasharray] duration-1000 ease-out ${
                  report.trustScore >= 80 ? 'text-green-600 dark:text-green-550' : report.trustScore >= 50 ? 'text-amber-600 dark:text-amber-550' : 'text-rose-600 dark:text-rose-550'
                }`} 
                strokeDasharray={`${gaugeScore}, 100`} 
                strokeWidth="2" 
                stroke="currentColor" 
                fill="none" 
                strokeLinecap="round" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-zinc-850 dark:text-white">
                <NumberTicker value={report.trustScore} />
              </span>
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
            Độ tự tin (Confidence): <span className="text-zinc-800 dark:text-zinc-250"><NumberTicker value={report.confidenceScore * 100} suffix="%" /></span>
          </div>

          <div className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-1">
            <Sliders size={10} /> {report.trustScoreVersion || report.scoring_config_version}
          </div>

          <p className="text-[10px] text-zinc-500 dark:text-zinc-450 font-bold leading-relaxed">{report.summary}</p>
        </div>

        {/* THẺ TIÊU CHÍ THÀNH PHẦN C1-C7 */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-6 rounded-lg border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col justify-between">
          <div className="w-full">
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-zinc-500" /> Điểm tiêu chí đánh giá C1-C7
            </h3>
            
            <div className="space-y-3">
              {report.criteriaBreakdown.map((item: any, idx: number) => {
                const percentage = (item.score / item.max) * 100;
                const isExpanded = expandedCriterionIndex === idx;

                return (
                  <div 
                    key={idx} 
                    style={{
                      animationDelay: `${idx * 80}ms`,
                    }}
                    className="border border-zinc-150 dark:border-zinc-900 rounded-xl overflow-hidden transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-800 animate-fade-in-down"
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
              {report.citations.map((cite: any, index: number) => (
                <tr 
                  key={cite.id} 
                  onClick={() => setSelectedCitation(cite)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors animate-fade-in-down cursor-pointer"
                >
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in-backdrop">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 w-full max-w-lg rounded-2xl shadow-xl flex flex-col overflow-hidden animate-scale-up text-xs">
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
                  * Mỗi Preset có cơ chế phân bổ trọng số tiêu chí C1-C7; penalty và label cap được tính riêng theo Trust Score v1.1.
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

      {/* DRAWER CHI TIẾT TRÍCH DẪN (UI-08) */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in-backdrop" 
            onClick={() => setSelectedCitation(null)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative z-10 w-full sm:w-[480px] bg-white dark:bg-zinc-950 shadow-2xl border-l border-zinc-200 dark:border-zinc-900 flex flex-col h-full overflow-y-auto animate-slide-in-right p-6 text-xs text-zinc-900 dark:text-zinc-100">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-150 dark:border-zinc-900 mb-5">
              <div>
                <span className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-500 uppercase">
                  Citation #{selectedCitation.id}
                </span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-1">Chi tiết tài liệu trích dẫn</h3>
              </div>
              <button 
                onClick={() => setSelectedCitation(null)}
                className="p-1.5 hover:bg-zinc-105 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 space-y-6">
              {/* Raw Text */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Văn bản trích dẫn gốc (Raw citation)</h4>
                <div className="bg-zinc-550/5 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-900 p-3.5 rounded-xl text-zinc-700 dark:text-zinc-300 font-semibold italic leading-relaxed">
                  "{selectedCitation.raw?.raw_text || selectedCitation.title}"
                </div>
              </div>

              {/* Normalized Fields */}
              <div className="space-y-3 bg-zinc-550/5 dark:bg-zinc-900/10 border border-zinc-150 dark:border-zinc-900/50 p-4 rounded-xl">
                <h4 className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-2">Trường thông tin chuẩn hóa</h4>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-zinc-450 block">Tiêu đề (Title)</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedCitation.title}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-zinc-450 block">Năm (Year)</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedCitation.year}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-450 block">Loại nguồn</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[10px]">
                        {selectedCitation.raw?.metadata?.source_type || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-450 block">Tác giả (Authors)</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedCitation.author}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-450 block">Nơi xuất bản (Venue)</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedCitation.source}</span>
                  </div>

                  {selectedCitation.raw?.normalized_fields?.doi && (
                    <div>
                      <span className="text-[10px] text-zinc-450 block">DOI</span>
                      <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold">{selectedCitation.raw.normalized_fields.doi}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Metadata */}
              <div className="space-y-3 bg-zinc-550/5 dark:bg-zinc-900/10 border border-zinc-150 dark:border-zinc-900/50 p-4 rounded-xl">
                <h4 className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider mb-2">Kết quả đối sánh học thuật</h4>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Trạng thái đối khớp:</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                      selectedCitation.status === 'pass' ? 'bg-green-50/50 dark:bg-green-950/20 text-green-700 border-green-150' :
                      selectedCitation.status === 'warning' ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 border-amber-150' :
                      'bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 border-rose-150'
                    }`}>
                      {selectedMetadataStatusLabel[selectedMetadataStatus] || selectedMetadataStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Cơ sở dữ liệu (Provider):</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 capitalize">{selectedCitation.raw?.metadata?.provider || 'N/A'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Độ tin cậy khớp (Confidence):</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {`${Math.round(selectedMetadataConfidence * 100)}%`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-150 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="bg-zinc-800 dark:bg-white h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${selectedMetadataConfidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings and Recommendations */}
              {selectedCitation.raw?.warnings && selectedCitation.raw.warnings.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-[9px] font-bold text-rose-650 dark:text-rose-550 uppercase tracking-wider">Cảnh báo hệ thống ({selectedCitation.raw.warnings.length})</h4>
                  
                  {selectedCitation.raw.warnings.map((w: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-rose-50/30 dark:bg-rose-955/5 border border-rose-150 dark:border-rose-900/30 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-rose-800 dark:text-rose-400 capitalize text-[10px]">Cảnh báo #{(idx + 1)}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                          w.severity === 'critical' || w.severity === 'high' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 border-red-200' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 border-amber-200'
                        }`}>
                          {w.severity}
                        </span>
                      </div>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-250 leading-relaxed">{w.message}</p>
                      {w.recommendation && (
                        <div className="pt-2 border-t border-rose-100/50 dark:border-rose-900/20 text-[10px] text-zinc-550 dark:text-zinc-400">
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">Đề xuất:</span> {w.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-zinc-150 dark:border-zinc-900 mt-6 flex gap-2">
              {selectedCitation.raw?.normalized_fields?.url && (
                <a 
                  href={selectedCitation.raw.normalized_fields.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ExternalLink size={13} /> Đi tới nguồn trích dẫn
                </a>
              )}
              <button 
                onClick={() => setSelectedCitation(null)}
                className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-750 dark:text-zinc-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
