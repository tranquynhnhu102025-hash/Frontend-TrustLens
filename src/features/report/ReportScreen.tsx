import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Download, AlertTriangle, 
  CheckCircle2, FileText, ChevronLeft, BarChart3, Info
} from 'lucide-react';

export default function ReportScreen() {
  const navigate = useNavigate();

  const mockReport = {
    trustScore: 78,
    level: 'Cảnh báo', 
    summary: 'Tài liệu có độ tin cậy ở mức khá. Tuy nhiên phát hiện một số trích dẫn từ nguồn không chính thống và thiếu định dạng chuẩn.',
    criteriaBreakdown: [
      { name: 'Độ tin cậy của nguồn', score: 85, weight: '40%' },
      { name: 'Tính cập nhật (5 năm gần nhất)', score: 60, weight: '30%' },
      { name: 'Định dạng trích dẫn (APA/IEEE)', score: 90, weight: '30%' }
    ],
    citations: [
      { id: 1, title: 'Attention Is All You Need', author: 'Vaswani et al.', year: 2017, source: 'arXiv', status: 'pass', issues: 'Không có' },
      { id: 2, title: 'Khái niệm về Trí tuệ nhân tạo', author: 'Nguyễn Văn A', year: 2023, source: 'Blog cá nhân (WordPress)', status: 'warning', issues: 'Nguồn không thuộc hệ thống học thuật chính thống.' },
      { id: 3, title: 'Ứng dụng AI trong giáo dục', author: 'Không rõ', year: 2010, source: 'Wikipedia', status: 'fail', issues: 'Wikipedia không được chấp nhận làm tài liệu tham khảo. Dữ liệu quá cũ (>10 năm).' }
    ]
  };

  const handleExport = () => {
    alert('Tính năng xuất file PDF/DOCX đang được BE xây dựng. Sẽ sớm ra mắt!');
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 animate-fade-in">
      {/* HEADER QUAY LẠI & NÚT EXPORT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <button 
          onClick={() => navigate('/classes')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Trở về trang quản lý
        </button>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 font-bold rounded-xl transition-all shadow-sm"
        >
          <Download size={18} /> Xuất báo cáo (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* THẺ TRUST SCORE (FE-08) */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-amber-500" /> Trust Score
          </h3>
          
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500" strokeDasharray={`${mockReport.trustScore}, 100`} strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-slate-800">{mockReport.trustScore}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 font-bold text-sm border border-amber-200 mb-4">
            <AlertTriangle size={16} /> Mức độ: {mockReport.level}
          </div>
          <p className="text-sm text-slate-500 font-medium">{mockReport.summary}</p>
        </div>

        {/* THẺ TIÊU CHÍ THÀNH PHẦN (CRITERIA BREAKDOWN) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <ShieldCheck size={24} className="text-blue-600" /> Điểm thành phần đánh giá
          </h3>
          
          <div className="space-y-6">
            {mockReport.criteriaBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="font-bold text-slate-700">{item.name}</span>
                    <span className="text-xs font-bold text-slate-400 ml-2 bg-slate-100 px-2 py-0.5 rounded-md">Trọng số: {item.weight}</span>
                  </div>
                  <span className="font-black text-slate-800">{item.score}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BẢNG CHI TIẾT TRÍCH DẪN (FE-09) */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileText size={24} className="text-blue-600" /> Chi tiết danh mục tài liệu tham khảo
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Hệ thống bôi đỏ các trích dẫn có vấn đề để giảng viên rà soát.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-black w-1/3">Tài liệu / Tác giả</th>
                <th className="p-4 font-black">Năm / Nguồn</th>
                <th className="p-4 font-black">Cảnh báo hệ thống</th>
                <th className="p-4 font-black text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {mockReport.citations.map((cite) => (
                <tr key={cite.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800 line-clamp-2">{cite.title}</p>
                    <p className="font-medium text-slate-500 mt-1">{cite.author}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-700">{cite.year}</p>
                    <p className="font-medium text-slate-500 mt-1">{cite.source}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                      {cite.status !== 'pass' && <Info size={16} className={`mt-0.5 shrink-0 ${cite.status === 'warning' ? 'text-amber-500' : 'text-rose-500'}`} />}
                      <span className={`font-medium ${cite.status === 'pass' ? 'text-slate-400' : 'text-slate-700'}`}>
                        {cite.issues}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {cite.status === 'pass' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200"><CheckCircle2 size={14} /> Hợp lệ</span>}
                    {cite.status === 'warning' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-200"><AlertTriangle size={14} /> Chú ý</span>}
                    {cite.status === 'fail' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200"><ShieldAlert size={14} /> Rủi ro cao</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}