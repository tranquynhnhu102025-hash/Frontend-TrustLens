import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { TRUST_SCORE_VERSION } from '../../config/trustScoreConfig';

export default function LandingDocs() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const quickStart = [
    {
      step: '1',
      title: 'Đăng nhập bằng tài khoản pilot',
      desc: 'Ở trạng thái hiện tại, tài khoản giảng viên/admin nên được cấp bởi quản trị viên thay vì tự đăng ký công khai.',
    },
    {
      step: '2',
      title: 'Chuẩn bị course, class và assignment',
      desc: 'Giảng viên thao tác trong phạm vi được phân quyền; admin có phạm vi rộng hơn để hỗ trợ kiểm thử và vận hành.',
    },
    {
      step: '3',
      title: 'Upload PDF/DOCX có text đọc được',
      desc: 'Hệ thống kiểm tra định dạng, chữ ký file, dung lượng và scan policy cục bộ trước khi tạo submission/job.',
    },
    {
      step: '4',
      title: 'Analyze, mở report và export',
      desc: 'Theo dõi job, xem Trust Score v1.2 cùng evidence/confidence, sau đó export PDF/DOCX/XLSX khi báo cáo có sẵn.',
    },
  ];

  const faqs = [
    {
      q: 'Trust Score được tính như thế nào?',
      a: `${TRUST_SCORE_VERSION} tổng hợp bảy cấu phần C1-C7: độ đầy đủ metadata, xác minh metadata, uy tín nguồn, độ phù hợp, tính cập nhật, chuẩn trích dẫn và rủi ro trùng lặp/tập trung nguồn. Điểm số phải được đọc cùng evidence, confidence và khuyến nghị.`,
    },
    {
      q: 'NOT_FOUND có nghĩa là nguồn giả không?',
      a: 'Không. NOT_FOUND chỉ nghĩa là các provider đã cấu hình chưa trả về metadata match phù hợp. Nguyên nhân có thể là coverage gap, metadata thiếu, định danh sai, source type chưa hỗ trợ hoặc lỗi provider tạm thời.',
    },
    {
      q: 'TrustLens có thay thế đánh giá của giảng viên không?',
      a: 'Không. TrustLens hỗ trợ sàng lọc danh mục tham khảo và trình bày bằng chứng. Quyết định học thuật cuối cùng vẫn cần người review xem ngữ cảnh, mục tiêu đề tài và yêu cầu assignment.',
    },
    {
      q: 'PDF scan không có text layer thì xử lý thế nào?',
      a: 'Baseline hiện tại chưa có OCR. File scan hoặc file không trích xuất được text cần trả lỗi rõ ràng để người dùng nộp lại bản có text layer hoặc chuyển sang định dạng DOCX/PDF xuất trực tiếp từ trình soạn thảo.',
    },
    {
      q: 'Vì sao chưa mở đăng ký công khai?',
      a: 'Public registration role safety vẫn là release blocker. Trong controlled pilot, tài khoản nên được cấp trước bởi admin cho đúng phạm vi kiểm thử và giảm rủi ro mở quyền lecturer ngoài ý muốn.',
    },
  ];

  return (
    <div
      className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2
            className={`text-2xl sm:text-4xl font-bold tracking-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}
          >
            Hướng dẫn pilot và FAQ
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-xl mx-auto font-medium transition-colors ${
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Nội dung này mô tả luồng đang có trong TrustLens v1.2, không mô tả các năng lực còn nằm trong roadmap.
          </p>
        </div>

        <div
          className={`rounded-xl border p-6 space-y-6 transition-colors duration-150 ${
            theme === 'dark' ? 'bg-zinc-900/10 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'
          }`}
        >
          <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            <BookOpen size={16} className="text-zinc-500" /> Luồng nhanh cho giảng viên pilot
          </h3>

          <div className="space-y-4">
            {quickStart.map((item) => (
              <div key={item.step} className="flex gap-3 items-start text-xs">
                <div
                  className={`font-bold border w-6 h-6 rounded flex items-center justify-center text-[10px] transition-colors shrink-0 ${
                    theme === 'dark' ? 'bg-zinc-950 text-zinc-300 border-zinc-800' : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                  }`}
                >
                  {item.step}
                </div>
                <div className="space-y-1">
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.title}</h4>
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            <HelpCircle size={16} className="text-zinc-500" /> Câu hỏi thường gặp
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className={`border rounded-lg overflow-hidden transition-colors duration-150 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900/10 border-zinc-900 hover:border-zinc-800'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="p-4 flex justify-between items-center select-none text-xs gap-4">
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>{faq.q}</h4>
                  {openFaq === idx ? <ChevronUp size={14} className="text-zinc-500 shrink-0" /> : <ChevronDown size={14} className="text-zinc-500 shrink-0" />}
                </div>
                {openFaq === idx && (
                  <div
                    className={`px-4 pb-4 border-t pt-3 text-xs leading-relaxed font-medium transition-colors ${
                      theme === 'dark' ? 'border-zinc-900 text-zinc-400' : 'border-zinc-100 text-zinc-600'
                    }`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
