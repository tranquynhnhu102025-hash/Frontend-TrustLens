import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  BookOpen, HelpCircle, ChevronDown, ChevronUp 
} from 'lucide-react';
import { TRUST_SCORE_VERSION } from '../../config/trustScoreConfig';

export default function LandingDocs() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const faqs = [
    {
      q: "Điểm số Trust Score được tính toán như thế nào?",
      a: `Trust Score ${TRUST_SCORE_VERSION} được tổng hợp từ 7 cấu phần C1-C7: độ đầy đủ metadata, xác minh metadata, uy tín nguồn, độ phù hợp, tính cập nhật, chuẩn trích dẫn và rủi ro trùng lặp/tập trung. Penalty được tính riêng để tránh phạt hai lần.`
    },
    {
      q: "Tại sao tài liệu tham khảo của tôi bị cảnh báo độ cập nhật (Outdated)?",
      a: "Do đặc thù ngành Công nghệ Thông tin có tốc độ phát triển công nghệ cực kỳ nhanh. Hệ thống áp dụng bộ lọc cảnh báo đối với các tài liệu tham khảo có tuổi đời xuất bản vượt quá 5 năm kể từ năm nộp báo cáo đồ án. Bạn nên ưu tiên cập nhật các nguồn trích dẫn mới hơn."
    },
    {
      q: "Tôi nên làm gì nếu hệ thống phát hiện 'Tạp chí lừa đảo' (Predatory)?",
      a: "Đây là lỗi cảnh báo nghiêm trọng nhất (màu đỏ). Bạn cần kiểm tra lại nguồn gốc bài viết, tìm kiếm nguồn thay thế đáng tin cậy hơn từ các tạp chí uy tín thuộc danh mục ISI/Scopus hoặc cơ sở dữ liệu IEEE Xplore, ACM Digital Library."
    },
    {
      q: "Hệ thống bóc tách danh mục tài liệu tham khảo có độ chính xác bao nhiêu?",
      a: "TrustLens sử dụng công cụ GROBID chạy mô hình máy học sâu chuyên biệt để phân tách cấu trúc văn bản. Độ chính xác nhận diện tiêu đề, tác giả, năm và DOI đạt trên 95% đối với các file PDF được xuất trực tiếp từ Microsoft Word hoặc LaTeX."
    }
  ];

  return (
    <div className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-200 ${
      theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
    }`}>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}>
            Tài liệu hướng dẫn & FAQ
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto font-medium transition-colors ${
            theme === 'dark' ? 'text-zinc-450' : 'text-zinc-500'
          }`}>
            Hướng dẫn chuẩn bị tài liệu báo cáo và các câu hỏi thường gặp khi sử dụng TrustLens.
          </p>
        </div>

        {/* 1. QUICK START */}
        <div className={`rounded-xl border p-6 space-y-6 transition-colors duration-150 ${
          theme === 'dark' 
            ? 'bg-zinc-900/10 border-zinc-900' 
            : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}>
            <BookOpen size={16} className="text-zinc-500" /> Hướng dẫn nhanh cho Sinh viên
          </h3>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Định dạng file nộp",
                desc: "Đảm bảo tập tin đồ án tốt nghiệp được lưu dưới định dạng **.PDF** (ưu tiên xuất trực tiếp từ Word/LaTeX) hoặc **.DOCX**, dung lượng dưới **20MB**."
              },
              {
                step: "2",
                title: "Chuẩn hóa danh mục tài liệu tham khảo",
                desc: "Viết danh mục tài liệu tham khảo ở cuối file báo cáo rõ ràng. Định dạng thống nhất theo chuẩn **APA 7th** hoặc **IEEE**. Có đầy đủ liên kết DOI nếu có."
              },
              {
                step: "3",
                title: "Đọc hiểu báo cáo Trust Score",
                desc: "Sau khi quét, xem danh sách tài liệu tham khảo. Kiểm tra các mục được tô màu vàng (Cảnh báo cập nhật/Sai định dạng) hoặc màu đỏ (Trích dẫn ảo/Nguồn lừa đảo) để tiến hành sửa đổi."
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start text-xs">
                <div className={`font-bold border w-6 h-6 rounded flex items-center justify-center text-[10px] transition-colors ${
                  theme === 'dark' 
                    ? 'bg-zinc-950 text-zinc-300 border-zinc-850' 
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                }`}>{item.step}</div>
                <div className="space-y-1">
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.title}</h4>
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-650'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. FAQ */}
        <div className="space-y-6">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}>
            <HelpCircle size={16} className="text-zinc-500" /> Câu hỏi thường gặp
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`border rounded-lg overflow-hidden transition-colors duration-150 cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-zinc-900/10 border-zinc-900 hover:border-zinc-800' 
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="p-4 flex justify-between items-center select-none text-xs">
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-850'}`}>{faq.q}</h4>
                  {openFaq === idx ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
                </div>
                {openFaq === idx && (
                  <div className={`px-4 pb-4 border-t pt-3 text-xs leading-relaxed font-medium transition-colors ${
                    theme === 'dark' ? 'border-zinc-900 text-zinc-400' : 'border-zinc-100 text-zinc-600'
                  }`}>
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

