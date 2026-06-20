import { AlertTriangle, BarChart3, CheckCircle2, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import {
  TRUST_SCORE_COMPONENTS,
  TRUST_SCORE_LIMITATIONS,
  TRUST_SCORE_THRESHOLDS,
  TRUST_SCORE_VERSION,
  TRUST_SCORE_WEIGHTS,
} from '../../config/trustScoreConfig';

export default function TrustScoreGuideScreen() {
  const totalWeight = Object.values(TRUST_SCORE_WEIGHTS).reduce((sum, value) => sum + value, 0);

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 space-y-6 animate-fade-in px-2 sm:px-4">
      <div className="border-b border-zinc-150 dark:border-zinc-900 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="text-zinc-500" size={20} /> Trust Score
          </h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500">
            {TRUST_SCORE_VERSION}
          </span>
        </div>
        <p className="text-zinc-550 dark:text-zinc-500 text-xs font-semibold mt-1 max-w-2xl leading-relaxed">
          Trust Score là điểm sàng lọc và hỗ trợ thẩm định tài liệu tham khảo. Điểm này giúp chỉ ra nguồn cần kiểm tra,
          không thay thế đánh giá chuyên môn của giảng viên.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-450 mb-2">
            <ShieldCheck size={14} /> Đáng tin cậy
          </div>
          <p className="text-2xl font-black text-green-650 dark:text-green-400">≥ {TRUST_SCORE_THRESHOLDS.reliable}</p>
          <p className="text-[11px] font-semibold text-zinc-500 mt-1">Bằng chứng tương đối tốt, vẫn nên đọc cảnh báo chi tiết.</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-450 mb-2">
            <AlertTriangle size={14} /> Cần rà soát
          </div>
          <p className="text-2xl font-black text-amber-650 dark:text-amber-400">≥ {TRUST_SCORE_THRESHOLDS.needsReview}</p>
          <p className="text-[11px] font-semibold text-zinc-500 mt-1">Có thiếu sót về metadata, relevance, style hoặc độ cập nhật.</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-450 mb-2">
            <ShieldAlert size={14} /> Rủi ro cao
          </div>
          <p className="text-2xl font-black text-rose-650 dark:text-rose-400">&lt; {TRUST_SCORE_THRESHOLDS.needsReview}</p>
          <p className="text-[11px] font-semibold text-zinc-500 mt-1">Cần kiểm tra thủ công trước khi dùng để kết luận.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-150 dark:border-zinc-900 pb-4 mb-4">
          <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider">
            Cấu phần C1-C7
          </h3>
          <span className="text-[10px] font-bold text-zinc-500">Tổng trọng số: {totalWeight}/100</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TRUST_SCORE_COMPONENTS.map((component) => {
            const weight = TRUST_SCORE_WEIGHTS[component.key];
            return (
              <div key={component.key} className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-4 bg-zinc-50/50 dark:bg-zinc-900/10">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-zinc-850 dark:text-zinc-100">
                      {component.code}. {component.shortLabel}
                    </p>
                    <p className="text-[10px] font-semibold text-zinc-500 mt-1 leading-relaxed">{component.label}</p>
                  </div>
                  <span className="h-fit shrink-0 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 px-2 py-1 text-[10px] font-black text-zinc-800 dark:text-zinc-200">
                    {weight}đ
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-[10px] font-semibold text-zinc-550 dark:text-zinc-450 leading-relaxed">
                  <p><span className="font-bold text-zinc-800 dark:text-zinc-250">Mục đích:</span> {component.purpose}</p>
                  <p><span className="font-bold text-zinc-800 dark:text-zinc-250">Bằng chứng:</span> {component.evidence}</p>
                  <p><span className="font-bold text-green-700 dark:text-green-400">Điểm cao:</span> {component.high}</p>
                  <p><span className="font-bold text-rose-700 dark:text-rose-400">Điểm thấp:</span> {component.low}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5 shadow-sm">
        <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 mb-4">
          <Info size={15} className="text-zinc-500" /> Cách đọc kết quả
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-semibold text-zinc-550 dark:text-zinc-450 leading-relaxed">
          <div className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3">
            <p className="font-bold text-zinc-850 dark:text-zinc-200 mb-1">Base score</p>
            <p>Tổng C1-C7 trước khi áp dụng penalty. Mỗi cấu phần có score, max score, reason, evidence và confidence.</p>
          </div>
          <div className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3">
            <p className="font-bold text-zinc-850 dark:text-zinc-200 mb-1">Penalty và label cap</p>
            <p>Rủi ro như DOI conflict, duplicate, low relevance hoặc retracted source được trừ điểm riêng để tránh phạt hai lần qua C8.</p>
          </div>
          <div className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3">
            <p className="font-bold text-zinc-850 dark:text-zinc-200 mb-1">Confidence</p>
            <p>Cho biết hệ thống có đủ bằng chứng đến đâu. Confidence thấp nghĩa là cần kiểm tra thủ công nhiều hơn.</p>
          </div>
          <div className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3">
            <p className="font-bold text-zinc-850 dark:text-zinc-200 mb-1">Metadata status</p>
            <p>VERIFIED, PARTIAL_MATCH, AMBIGUOUS, URL_ONLY, NOT_FOUND, PROVIDER_UNAVAILABLE và INVALID_IDENTIFIER được phân biệt rõ.</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 rounded-lg p-5">
        <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider mb-3">Giới hạn cần nhớ</h3>
        <div className="space-y-2">
          {TRUST_SCORE_LIMITATIONS.map((item) => (
            <div key={item} className="flex items-start gap-2 text-[11px] font-semibold text-zinc-550 dark:text-zinc-450">
              <CheckCircle2 size={13} className="text-zinc-400 mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
