import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  BookOpen, HelpCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function LandingDocs() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const faqs = [
    {
      q: "Điểm số Trust Score được tính toán như thế nào?",
      a: "Trust Score (Điểm tin cậy học thuật) được tổng hợp từ ma trận 5 tiêu chí với các trọng số tiêu chuẩn: Độ xác thực (40%), Độ cập nhật (30%), và Định dạng trích dẫn (30%). Điểm số trên 80 được coi là Đạt chuẩn (Sạch), từ 50-79 là mức Cảnh báo cần rà soát, và dưới 50 là Rủi ro cao."
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
    <div className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-1/2 left-0 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-indigo-500/5' : 'bg-indigo-500/2'
      }`}></div>

      <div className="max-w-4xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center space-y-4">
          <h2 className={`text-3xl sm:text-5xl font-black tracking-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Tài liệu hướng dẫn & FAQ
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto font-medium transition-colors ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
          }`}>
            Hướng dẫn chuẩn bị tài liệu báo cáo và các câu hỏi thường gặp khi sử dụng TrustLens.
          </p>
        </div>

        {/* 1. QUICK START */}
        <div className={`rounded-3xl border p-8 space-y-6 transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-slate-900/40 border-slate-900' 
            : 'bg-white border-slate-200 shadow-sm shadow-slate-100'
        }`}>
          <h3 className={`text-lg font-black flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <BookOpen size={20} className="text-blue-500" /> Hướng dẫn nhanh cho Sinh viên
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
              <div key={idx} className="flex gap-4 items-start">
                <div className={`font-bold border px-2.5 py-1 rounded-xl text-xs transition-colors ${
                  theme === 'dark' 
                    ? 'bg-slate-950 text-blue-400 border-slate-850' 
                    : 'bg-slate-100 text-blue-600 border-slate-200 shadow-inner'
                }`}>{item.step}</div>
                <div>
                  <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. FAQ */}
        <div className="space-y-6">
          <h3 className={`text-lg font-black flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <HelpCircle size={20} className="text-indigo-500" /> Câu hỏi thường gặp
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-900/40 border-slate-900 hover:border-slate-850' 
                    : 'bg-white border-slate-200 hover:border-slate-350 shadow-sm shadow-slate-100'
                }`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="p-5 flex justify-between items-center select-none">
                  <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{faq.q}</h4>
                  {openFaq === idx ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </div>
                {openFaq === idx && (
                  <div className={`px-5 pb-5 border-t pt-4 text-xs leading-relaxed font-medium transition-colors ${
                    theme === 'dark' ? 'border-slate-950 text-slate-400' : 'border-slate-100 text-slate-600'
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
