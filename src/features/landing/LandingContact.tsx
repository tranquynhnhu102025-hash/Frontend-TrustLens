import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Mail, Building2, MapPin, Send, CheckCircle2, 
  Users, MessageSquare, GraduationCap 
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
    { name: "Phan Tấn Sang", role: "Backend Engineer", school: "Đại học Nguyễn Tất Thành (NTTU)" },
    { name: "Nguyễn Minh Trúc", role: "BA / NLP / Academic Evaluation", school: "Đại học Nguyễn Tất Thành (NTTU)" },
    { name: "Trần Quỳnh Như", role: "Frontend Engineer", school: "Đại học Nguyễn Tất Thành (NTTU)" }
  ];

  return (
    <div className={`w-full py-16 px-6 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      {/* Glow decorations */}
      <div className={`absolute top-10 left-10 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-blue-500/5' : 'bg-blue-500/2'
      }`}></div>
      <div className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-all duration-300 ${
        theme === 'dark' ? 'bg-indigo-500/5' : 'bg-indigo-500/2'
      }`}></div>

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center space-y-4">
          <h2 className={`text-3xl sm:text-5xl font-black tracking-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Liên hệ ban nghiên cứu
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto font-medium transition-colors ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-655'
          }`}>
            Gửi thắc mắc, đề xuất hợp tác nghiên cứu hoặc báo lỗi kỹ thuật trực tiếp cho chúng tôi.
          </p>
        </div>

        {/* 1. TEAM MEMBERS */}
        <div className="space-y-6">
          <h3 className={`text-lg font-black flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <Users size={20} className="text-blue-500" /> Nhóm phát triển dự án
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' 
                    : 'bg-white border-slate-200 hover:border-slate-350 shadow-sm shadow-slate-100'
                }`}
              >
                <div className="space-y-2">
                  <h4 className={`font-black text-base leading-none transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>{member.name}</h4>
                  <span className="text-[11px] font-bold text-blue-550 block">{member.role}</span>
                </div>
                <div className={`border-t mt-4 pt-3 flex items-center gap-1.5 text-xs font-bold transition-colors ${
                  theme === 'dark' ? 'border-slate-850/60 text-slate-500' : 'border-slate-100 text-slate-500'
                }`}>
                  <GraduationCap size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{member.school}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. FORM & INFO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info Card */}
          <div className={`space-y-6 p-8 rounded-3xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-slate-900/40 border-slate-900' 
              : 'bg-white border-slate-200 shadow-sm shadow-slate-100'
          }`}>
            <h3 className={`text-lg font-black flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <Building2 size={20} className="text-indigo-500" /> Thông tin đơn vị liên kết
            </h3>

            <div className={`space-y-5 text-xs leading-relaxed font-medium transition-colors ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <div className="flex gap-3 items-start">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Trường Đại học Nguyễn Tất Thành</h4>
                  <p className="mt-1">Khoa Công nghệ Thông tin &bull; Kỹ thuật Phần mềm</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">300A Nguyễn Tất Thành, Phường 13, Quận 4, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Trường Đại học Xây dựng Hà Nội</h4>
                  <p className="mt-1">Khoa Công nghệ Thông tin &bull; Phòng nghiên cứu Khoa học</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">55 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Địa chỉ Email nhận đề xuất</h4>
                  <p className="mt-1">contact@trustlens.edu.vn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`p-8 rounded-3xl border relative transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-slate-900/40 border-slate-900' 
              : 'bg-white border-slate-200 shadow-sm shadow-slate-100'
          }`}>
            {submitted && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in rounded-3xl">
                <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                <h4 className="text-lg font-black text-white mb-2">Gửi phản hồi thành công!</h4>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed font-medium">
                  Cảm ơn bạn đã liên hệ với chúng tôi. Ban nghiên cứu TrustLens sẽ phản hồi lại bạn qua Email trong vòng 48 giờ làm việc.
                </p>
              </div>
            )}

            <h3 className={`text-lg font-black flex items-center gap-2 mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <MessageSquare size={20} className="text-purple-550" /> Biểu mẫu gửi thư góp ý
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Họ và tên</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A" 
                    className={`w-full px-4 py-3 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-950/80 border-slate-850 text-white placeholder:text-slate-650' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                    }`} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Địa chỉ Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="VD: email@huce.edu.vn" 
                    className={`w-full px-4 py-3 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-950/80 border-slate-850 text-white placeholder:text-slate-650' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                    }`} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-widest mb-1.5">Nội dung chi tiết</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.message} 
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Nhập nội dung đề xuất hoặc lỗi hệ thống bạn gặp phải..." 
                  className={`w-full px-4 py-3 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none transition-colors ${
                    theme === 'dark' 
                      ? 'bg-slate-950/80 border-slate-850 text-white placeholder:text-slate-650' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                  }`} 
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className={`flex items-center gap-2 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 group ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10 shadow-md' 
                      : 'bg-slate-900 hover:bg-slate-850 text-white shadow-slate-950/10 shadow-md'
                  }`}
                >
                  Gửi liên hệ <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
