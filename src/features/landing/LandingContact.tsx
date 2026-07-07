import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Users,
} from 'lucide-react';

export default function LandingContact() {
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  const teamMembers = [
    { name: 'Phan Tấn Sang', role: 'Backend / Release', school: 'Đại học Nguyễn Tất Thành' },
    { name: 'Nguyễn Minh Trúc', role: 'BA / NLP / QA evidence', school: 'Đại học Nguyễn Tất Thành' },
    { name: 'Trần Quỳnh Như', role: 'Frontend', school: 'Đại học Nguyễn Tất Thành' },
  ];

  return (
    <div
      className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2
            className={`text-2xl sm:text-4xl font-bold tracking-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}
          >
            Liên hệ nhóm TrustLens
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-xl mx-auto font-medium transition-colors ${
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Gửi phản hồi về pilot, lỗi kỹ thuật hoặc đề xuất cải thiện nội dung review. Form hiện tại là mô phỏng phía frontend.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className={`text-sm font-bold flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            <Users size={16} className="text-zinc-500" /> Nhóm phát triển
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className={`p-5 rounded-lg border flex flex-col justify-between transition-colors duration-150 ${
                  theme === 'dark'
                    ? 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-800'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <h4 className={`font-bold text-sm leading-none ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    {member.name}
                  </h4>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">{member.role}</span>
                </div>
                <div
                  className={`border-t mt-4 pt-3 flex items-center gap-1.5 text-xs ${
                    theme === 'dark' ? 'border-zinc-800 text-zinc-500' : 'border-zinc-100 text-zinc-500 font-medium'
                  }`}
                >
                  <GraduationCap size={13} className="text-zinc-400 shrink-0" />
                  <span className="truncate">{member.school}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div
            className={`lg:col-span-2 space-y-5 p-6 rounded-lg border transition-colors duration-150 ${
              theme === 'dark' ? 'bg-zinc-900/30 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'
            }`}
          >
            <h3 className={`text-sm font-bold flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              <Building2 size={16} className="text-zinc-500" /> Thông tin dự án
            </h3>

            <div className={`space-y-4 text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <div className="flex gap-2.5 items-start">
                <MapPin size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
                    Trường Đại học Nguyễn Tất Thành
                  </h4>
                  <p className="mt-0.5">Khoa Công nghệ Thông tin</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Mail size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>Kênh phản hồi</h4>
                  <p className="mt-0.5">Dùng form bên cạnh hoặc issue tracker nội bộ của dự án.</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`lg:col-span-3 p-6 rounded-lg border relative transition-colors duration-150 ${
              theme === 'dark' ? 'bg-zinc-900/30 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'
            }`}
          >
            {submitted && (
              <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in rounded-lg">
                <CheckCircle2 size={40} className="text-zinc-200 mb-3" />
                <h4 className="text-sm font-bold text-white mb-1.5">Đã ghi nhận phản hồi</h4>
                <p className="text-zinc-400 text-xs max-w-xs leading-relaxed font-medium">
                  Đây là xác nhận phía giao diện. Khi tích hợp backend contact, phản hồi sẽ được lưu và định tuyến theo quy trình vận hành.
                </p>
              </div>
            )}

            <h3 className={`text-sm font-bold flex items-center gap-1.5 mb-5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              <MessageSquare size={16} className="text-zinc-500" /> Gửi góp ý pilot
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className={`w-full px-3.5 py-2.5 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                      theme === 'dark'
                        ? 'bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="VD: name@example.edu.vn"
                    className={`w-full px-3.5 py-2.5 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                      theme === 'dark'
                        ? 'bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nội dung</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Nhập phản hồi về luồng pilot, nội dung báo cáo hoặc lỗi giao diện..."
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300'
                  }`}
                ></textarea>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 font-bold text-xs px-5 py-2.5 rounded-lg transition-colors ${
                    theme === 'dark' ? 'bg-white hover:bg-zinc-100 text-black' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  }`}
                >
                  Gửi phản hồi <Send size={12} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
