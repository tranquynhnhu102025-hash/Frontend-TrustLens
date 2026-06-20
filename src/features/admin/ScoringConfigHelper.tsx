import { Info, ListChecks, Scale, Target } from 'lucide-react';
import {
  TRUST_SCORE_COMPONENTS,
  TRUST_SCORE_PRESETS,
  TRUST_SCORE_VERSION,
  TRUST_SCORE_WEIGHTS,
  TrustScoreComponentKey,
  TrustScoreWeightMap,
} from '../../config/trustScoreConfig';

export type CriteriaKey = TrustScoreComponentKey;
export type WeightMap = TrustScoreWeightMap;

export const DEFAULT_SCORING_WEIGHTS: WeightMap = TRUST_SCORE_WEIGHTS;
export const SCORING_CRITERIA = TRUST_SCORE_COMPONENTS;
export const SCORING_PRESETS = TRUST_SCORE_PRESETS;

interface ScoringConfigHelperProps {
  weights: WeightMap;
  thresholds: {
    pass: number;
    warning: number;
  };
  totalWeight: number;
}

export default function ScoringConfigHelper({
  weights,
  thresholds,
  totalWeight,
}: ScoringConfigHelperProps) {
  return (
    <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm space-y-5">
      <div className="flex items-start gap-3 border-b border-zinc-150 dark:border-zinc-900 pb-4">
        <div className="w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
          <Info size={17} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 uppercase tracking-wider">
            Helper đọc cấu hình điểm
          </h3>
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-450 mt-1 leading-relaxed">
            Phiên bản {TRUST_SCORE_VERSION}. Tổng trọng số phải bằng 100%. Trust Score v1.2 dùng C1-C7;
            penalty, warning và label cap dùng raw ratio/evidence nên không bị thay đổi sai khi weight thay đổi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3 bg-zinc-50/60 dark:bg-zinc-900/25">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-450 mb-1">
            <Scale size={12} /> Tổng trọng số
          </div>
          <p className={`text-lg font-black ${totalWeight === 100 ? 'text-green-650 dark:text-green-400' : 'text-amber-650 dark:text-amber-400'}`}>
            {totalWeight}%
          </p>
          <p className="text-[10px] font-semibold text-zinc-500">Mục tiêu: đúng 100% trước khi lưu.</p>
        </div>
        <div className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3 bg-zinc-50/60 dark:bg-zinc-900/25">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-450 mb-1">
            <Target size={12} /> Nhãn đáng tin cậy
          </div>
          <p className="text-lg font-black text-green-650 dark:text-green-400">≥ {thresholds.pass}đ</p>
          <p className="text-[10px] font-semibold text-zinc-500">Nguồn nhìn chung đáng tin cậy.</p>
        </div>
        <div className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3 bg-zinc-50/60 dark:bg-zinc-900/25">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-450 mb-1">
            <ListChecks size={12} /> Nhãn cần rà soát
          </div>
          <p className="text-lg font-black text-amber-650 dark:text-amber-400">≥ {thresholds.warning}đ</p>
          <p className="text-[10px] font-semibold text-zinc-500">Dưới mức này được xem là rủi ro cao.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SCORING_CRITERIA.map((criterion) => (
          <div
            key={criterion.key}
            className="rounded-lg border border-zinc-150 dark:border-zinc-900 p-3 bg-white dark:bg-zinc-955"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-zinc-850 dark:text-zinc-100">
                  {criterion.code}. {criterion.shortLabel}
                </p>
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-455 mt-1 leading-relaxed">
                  {criterion.purpose}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-zinc-100 dark:bg-zinc-900 px-2 py-1 text-[10px] font-black text-zinc-800 dark:text-zinc-200">
                {weights[criterion.key]}%
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-1.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-450">
              <p><span className="font-bold text-zinc-700 dark:text-zinc-250">Bằng chứng:</span> {criterion.evidence}</p>
              <p><span className="font-bold text-green-700 dark:text-green-400">Điểm cao:</span> {criterion.high}</p>
              <p><span className="font-bold text-rose-700 dark:text-rose-400">Điểm thấp:</span> {criterion.low}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
