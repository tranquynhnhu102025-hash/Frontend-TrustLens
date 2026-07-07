import { useOutletContext } from 'react-router-dom';
import {
  AlertTriangle,
  Binary,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Fingerprint,
  Link2,
  ShieldCheck,
} from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import { TRUST_SCORE_VERSION } from '../../config/trustScoreConfig';

export default function LandingFeatures() {
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const criteriaList = [
    {
      icon: <ClipboardList size={20} className="text-zinc-600 dark:text-zinc-400" />,
      code: 'C1',
      name: 'Độ đầy đủ metadata',
      desc: 'Đo mức đầy đủ của tác giả, tiêu đề, năm, venue/publisher và DOI hoặc URL để người review biết citation có đủ dữ liệu truy vết hay không.',
      evidence: 'Citation fields, DOI/URL, venue, publisher và metadata đã match nếu có.',
    },
    {
      icon: <Fingerprint size={20} className="text-zinc-600 dark:text-zinc-400" />,
      code: 'C2',
      name: 'Xác minh metadata',
      desc: 'So khớp citation với dữ liệu từ Crossref, OpenAlex hoặc URL fallback. Trạng thái NOT_FOUND chỉ nghĩa là chưa tìm được match phù hợp.',
      evidence: 'Provider status, confidence, DOI match, độ tương đồng title/author/year và candidate margin.',
    },
    {
      icon: <ShieldCheck size={20} className="text-zinc-600 dark:text-zinc-400" />,
      code: 'C3',
      name: 'Uy tín nguồn',
      desc: 'Tổng hợp bằng chứng về source type, publisher/institution, venue và trạng thái công bố để hỗ trợ đánh giá nguồn.',
      evidence: 'Source type, publisher, venue, whitelist và publication-status evidence.',
    },
    {
      icon: <Binary size={20} className="text-zinc-600 dark:text-zinc-400" />,
      code: 'C4',
      name: 'Độ phù hợp với báo cáo',
      desc: 'So mức liên quan giữa nội dung chính của báo cáo và thông tin title/abstract/keyword của tài liệu tham khảo.',
      evidence: 'Provider, model, prompt version, similarity, top chunks và fallback status.',
    },
    {
      icon: <CalendarClock size={20} className="text-zinc-600 dark:text-zinc-400" />,
      code: 'C5',
      name: 'Tính cập nhật',
      desc: 'Đánh giá tuổi tài liệu theo field/source type, ưu tiên matched year trước parsed year và cho phép người review cân nhắc nguồn nền tảng.',
      evidence: 'Matched year, parsed year, age và ngưỡng recency đang áp dụng.',
    },
    {
      icon: <FileSearch size={20} className="text-zinc-600 dark:text-zinc-400" />,
      code: 'C6',
      name: 'Chuẩn trích dẫn',
      desc: 'Kiểm tra style family như APA7, IEEE, MLA hoặc ACM so với yêu cầu assignment khi hệ thống có đủ dữ liệu nhận diện.',
      evidence: 'Detected style, expected style, parser confidence và normalized fields.',
    },
    {
      icon: <Link2 size={20} className="text-zinc-600 dark:text-zinc-400" />,
      code: 'C7',
      name: 'Trùng lặp và tập trung nguồn',
      desc: 'Theo dõi citation trùng và rủi ro tập trung quá nhiều vào một nhóm source type để hỗ trợ đa dạng hóa nguồn tham khảo.',
      evidence: 'Duplicate key, source type distribution và concentration count.',
    },
  ];

  const limitations = [
    'Chưa có academic calibration package để dùng như benchmark học thuật chính thức.',
    'PDF scan không có text layer cần OCR trong giai đoạn sau.',
    'Chưa xác minh citation-in-context hay mức độ sử dụng nguồn trong thân bài.',
    'Không đưa ra phán quyết tự động về liêm chính học thuật hoặc điểm số cuối cùng.',
  ];

  return (
    <div
      className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-500 ${
        theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <ScrollReveal direction="up" duration={700}>
          <div className="text-center space-y-3">
            <h2
              className={`text-2xl sm:text-4xl font-bold tracking-tight transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-zinc-900'
              }`}
            >
              Trust Score v1.2 dựa trên C1-C7
            </h2>
            <p
              className={`text-xs sm:text-sm max-w-2xl mx-auto font-medium transition-colors ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              {TRUST_SCORE_VERSION} là bộ điểm sàng lọc có trọng số, confidence và bằng chứng đi kèm.
              Điểm cao không chứng minh bài viết đúng; điểm thấp không chứng minh nguồn sai.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {criteriaList.map((crit, index) => (
            <ScrollReveal key={crit.code} delay={index * 90} direction="up" duration={600}>
              <div
                className={`p-6 rounded-xl border flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md ${
                  theme === 'dark'
                    ? 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/55'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`p-2.5 rounded-lg w-fit border ${
                        theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                      }`}
                    >
                      {crit.icon}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{crit.code}</span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {crit.name}
                    </h3>
                    <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {crit.desc}
                    </p>
                  </div>
                </div>
                <div
                  className={`border-t mt-5 pt-3 text-[11px] leading-relaxed ${
                    theme === 'dark' ? 'border-zinc-800 text-zinc-500' : 'border-zinc-100 text-zinc-500 font-medium'
                  }`}
                >
                  Bằng chứng: {crit.evidence}
                </div>
              </div>
            </ScrollReveal>
          ))}

          <ScrollReveal delay={criteriaList.length * 90} direction="up" duration={600} className="md:col-span-2">
            <div
              className={`p-6 rounded-xl border h-full transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-zinc-900/10 border-zinc-900'
                  : 'bg-zinc-100/30 border-zinc-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-lg border shrink-0 ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
                  }`}
                >
                  <AlertTriangle size={20} className="text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="space-y-3">
                  <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    Giới hạn cần nói rõ trong pilot
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {limitations.map((item) => (
                      <div key={item} className={`flex gap-2 text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        <CheckCircle2 size={13} className="text-zinc-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
