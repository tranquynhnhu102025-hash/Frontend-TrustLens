export const TRUST_SCORE_VERSION = 'trust-score-v1.1';

export type TrustScoreComponentKey = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7';
export type TrustScoreWeightMap = Record<TrustScoreComponentKey, number>;

export interface TrustScoreComponentDefinition {
  key: TrustScoreComponentKey;
  code: string;
  label: string;
  shortLabel: string;
  summaryKey: string;
  legacySummaryKeys: string[];
  weightKey: string;
  maxScore: number;
  purpose: string;
  evidence: string;
  high: string;
  low: string;
  recommendation: string;
}

export const TRUST_SCORE_WEIGHTS: TrustScoreWeightMap = {
  c1: 10,
  c2: 25,
  c3: 20,
  c4: 20,
  c5: 10,
  c6: 10,
  c7: 5,
};

export const TRUST_SCORE_THRESHOLDS = {
  reliable: 85,
  acceptable: 70,
  needsReview: 50,
};

export const TRUST_SCORE_COMPONENTS: TrustScoreComponentDefinition[] = [
  {
    key: 'c1',
    code: 'C1',
    label: 'Metadata completeness',
    shortLabel: 'Độ đầy đủ metadata',
    summaryKey: 'c1_metadata_completeness',
    legacySummaryKeys: ['c1MetadataCompleteness', 'c1'],
    weightKey: 'c1_completeness',
    maxScore: 10,
    purpose: 'Đo mức đầy đủ của tác giả, tiêu đề, năm, venue/publisher và DOI hoặc URL.',
    evidence: 'Citation fields, DOI/URL, venue, publisher, matched metadata.',
    high: 'Có đủ trường chính và dễ truy vết nguồn.',
    low: 'Thiếu tác giả, tiêu đề, năm hoặc định danh nguồn.',
    recommendation: 'Bổ sung trường citation còn thiếu, ưu tiên DOI hoặc URL ổn định.',
  },
  {
    key: 'c2',
    code: 'C2',
    label: 'Identity and metadata verification',
    shortLabel: 'Xác minh metadata',
    summaryKey: 'c2_metadata_verification',
    legacySummaryKeys: ['c2MetadataVerification', 'c2'],
    weightKey: 'c2_verification',
    maxScore: 25,
    purpose: 'Đánh giá mức khớp giữa citation và metadata từ Crossref/OpenAlex hoặc URL fallback.',
    evidence: 'Status, confidence, DOI match, title/author/year similarity, candidate margin.',
    high: 'DOI hoặc title-author-year khớp rõ ràng với margin đủ tốt.',
    low: 'Không tìm thấy, provider lỗi, định danh sai hoặc chỉ xác minh được URL.',
    recommendation: 'Kiểm tra DOI/title/year và xác minh thủ công các nguồn chưa khớp.',
  },
  {
    key: 'c3',
    code: 'C3',
    label: 'Source credibility evidence',
    shortLabel: 'Uy tín nguồn',
    summaryKey: 'c3_source_credibility',
    legacySummaryKeys: ['c3SourceCredibility', 'c3'],
    weightKey: 'c3_credibility',
    maxScore: 20,
    purpose: 'Tổng hợp bằng chứng về source type, publisher/institution, venue và trạng thái công bố.',
    evidence: 'Source type, publisher, venue, whitelist, publication-status evidence.',
    high: 'Nguồn học thuật hoặc tổ chức rõ ràng, publisher/venue được xác minh.',
    low: 'Blog cá nhân, website chung chung hoặc thiếu bằng chứng venue/publisher.',
    recommendation: 'Ưu tiên journal, conference, book, tài liệu chuẩn hoặc website tổ chức chính thức.',
  },
  {
    key: 'c4',
    code: 'C4',
    label: 'Relevance to report',
    shortLabel: 'Độ phù hợp',
    summaryKey: 'c4_relevance',
    legacySummaryKeys: ['c4Relevance', 'c4'],
    weightKey: 'c4_relevance',
    maxScore: 20,
    purpose: 'So mức liên quan giữa report context và title/abstract/keyword của reference.',
    evidence: 'Semantic similarity, lexical overlap, model/fallback used, abstract availability.',
    high: 'Nguồn bám sát chủ đề hoặc luận điểm chính của báo cáo.',
    low: 'Nguồn có thể hợp lệ nhưng lệch chủ đề hoặc liên quan gián tiếp.',
    recommendation: 'Thay hoặc bổ sung nguồn liên quan trực tiếp hơn đến nội dung báo cáo.',
  },
  {
    key: 'c5',
    code: 'C5',
    label: 'Recency',
    shortLabel: 'Tính cập nhật',
    summaryKey: 'c5_recency',
    legacySummaryKeys: ['c5Recency', 'c5'],
    weightKey: 'c5_recency',
    maxScore: 10,
    purpose: 'Đánh giá tuổi tài liệu theo field/source type, ưu tiên matched year trước parsed year.',
    evidence: 'Matched year, parsed year, age, recency thresholds.',
    high: 'Tài liệu mới hoặc có lý do nền tảng rõ ràng.',
    low: 'Tài liệu quá cũ trong lĩnh vực thay đổi nhanh.',
    recommendation: 'Dùng nguồn mới hơn nếu tài liệu không phải foundational/reference chuẩn.',
  },
  {
    key: 'c6',
    code: 'C6',
    label: 'Citation-style compliance',
    shortLabel: 'Chuẩn trích dẫn',
    summaryKey: 'c6_citation_style',
    legacySummaryKeys: ['c6CitationStyle', 'c6_citation_quality', 'c6CitationQuality', 'c6'],
    weightKey: 'c6_style',
    maxScore: 10,
    purpose: 'Kiểm tra style family như APA7, IEEE, MLA hoặc ACM so với yêu cầu assignment.',
    evidence: 'Detected style, expected style, parser confidence and normalized fields.',
    high: 'Đúng style và nhất quán.',
    low: 'Sai style, không nhận diện được style hoặc thiếu cấu trúc citation.',
    recommendation: 'Chuẩn hóa lại citation theo style bắt buộc của assignment.',
  },
  {
    key: 'c7',
    code: 'C7',
    label: 'Duplicate and concentration risk',
    shortLabel: 'Trùng lặp/tập trung',
    summaryKey: 'c7_duplicate_concentration',
    legacySummaryKeys: ['c7DuplicateConcentration', 'c7_source_diversity', 'c7SourceDiversity', 'c7'],
    weightKey: 'c7_duplicate_concentration',
    maxScore: 5,
    purpose: 'Theo dõi citation trùng và rủi ro tập trung quá nhiều vào một nhóm source type.',
    evidence: 'Duplicate key, source type distribution, concentration count.',
    high: 'Không trùng lặp và phân bổ nguồn cân bằng.',
    low: 'Có citation trùng hoặc tập trung quá nhiều vào một loại nguồn.',
    recommendation: 'Gộp citation trùng và đa dạng hóa nguồn tham khảo khi phù hợp.',
  },
];

export const TRUST_SCORE_PRESETS = [
  {
    id: 'DEFAULT',
    name: 'Trust Score v1.1 mặc định',
    desc: 'Cấu hình MVP chuẩn gồm C1-C7, tổng trọng số 100.',
    weights: TRUST_SCORE_WEIGHTS,
  },
  {
    id: 'SOURCE_FOCUS',
    name: 'Ưu tiên xác minh và uy tín nguồn',
    desc: 'Tăng vai trò C2/C3 cho bài cần kiểm soát nguồn học thuật chặt.',
    weights: { c1: 8, c2: 30, c3: 25, c4: 15, c5: 8, c6: 9, c7: 5 },
  },
  {
    id: 'RELEVANCE_FOCUS',
    name: 'Ưu tiên độ phù hợp',
    desc: 'Tăng C4 cho bài cần bám sát chủ đề và luận điểm báo cáo.',
    weights: { c1: 8, c2: 22, c3: 18, c4: 27, c5: 10, c6: 10, c7: 5 },
  },
];

export const TRUST_SCORE_LIMITATIONS = [
  'Trust Score là điểm sàng lọc và hỗ trợ thẩm định tài liệu tham khảo, không thay thế đánh giá chuyên môn.',
  'NOT_FOUND nghĩa là chưa tìm được metadata ở provider đã cấu hình, không chứng minh nguồn là giả.',
  'Điểm relevance phụ thuộc vào chất lượng text trích xuất và metadata title/abstract có sẵn.',
];

export const labelFromScore = (score: number): 'reliable' | 'acceptable' | 'needs_review' | 'high_risk' => {
  if (score >= TRUST_SCORE_THRESHOLDS.reliable) return 'reliable';
  if (score >= TRUST_SCORE_THRESHOLDS.acceptable) return 'acceptable';
  if (score >= TRUST_SCORE_THRESHOLDS.needsReview) return 'needs_review';
  return 'high_risk';
};

export const labelText = (label: string | undefined, score: number) => {
  const normalized = (label || labelFromScore(score)).toLowerCase();
  if (['reliable', 'passed', 'pass', 'verified'].includes(normalized)) return 'Đáng tin cậy';
  if (normalized === 'acceptable') return 'Chấp nhận được';
  if (['needs_review', 'warning'].includes(normalized)) return 'Cần rà soát';
  return 'Rủi ro cao';
};

export const labelTone = (label: string | undefined, score: number) => {
  const normalized = (label || labelFromScore(score)).toLowerCase();
  if (['reliable', 'passed', 'pass', 'verified'].includes(normalized)) return 'green';
  if (normalized === 'acceptable') return 'blue';
  if (['needs_review', 'warning'].includes(normalized)) return 'amber';
  return 'rose';
};

export const getComponentFromSummary = (summary: any, component: TrustScoreComponentDefinition) => {
  if (!summary) return undefined;
  const keys = [component.summaryKey, ...component.legacySummaryKeys];
  for (const key of keys) {
    if (summary[key] !== undefined && summary[key] !== null) return summary[key];
  }
  return undefined;
};

export const getApiWeight = (definition: any, component: TrustScoreComponentDefinition) => {
  const weights = definition?.weights || {};
  return weights[component.weightKey] ?? weights[component.key] ?? component.maxScore;
};
