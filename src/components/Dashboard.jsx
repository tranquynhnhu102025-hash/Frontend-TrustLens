import React from 'react';
import { ShieldAlert, ShieldCheck, Clock, AlignLeft, FileSearch } from 'lucide-react';

export default function Dashboard() {
  const criteria = [
    { icon: <ShieldCheck className="text-green-500" />, name: "Tính xác thực", desc: "100% DOI tồn tại hợp lệ", status: "Good", color: "bg-green-100 text-green-700" },
    { icon: <ShieldAlert className="text-red-500" />, name: "Độ tin cậy", desc: "Phát hiện 1 nguồn từ tạp chí săn mồi", status: "Risk", color: "bg-red-100 text-red-700" },
    { icon: <Clock className="text-orange-500" />, name: "Độ cập nhật", desc: "2 tài liệu quá cũ (>5 năm)", status: "Review", color: "bg-orange-100 text-orange-700" },
    { icon: <FileSearch className="text-green-500" />, name: "Độ phù hợp", desc: "Ngữ nghĩa khớp với đồ án", status: "Good", color: "bg-green-100 text-green-700" },
    { icon: <AlignLeft className="text-orange-500" />, name: "Chuẩn định dạng", desc: "Sai cú pháp APA ở 3 chỗ", status: "Review", color: "bg-orange-100 text-orange-700" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 mt-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Báo cáo Thẩm định TrustLens</h2>
          <p className="text-slate-500 mt-1">Tệp: <span className="font-semibold text-slate-700">Do_an_Tot_Nghiep_CNTT.pdf</span></p>
        </div>
        <div className="text-center bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[150px]">
          <div className="text-5xl font-black text-blue-600">78</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Trust Score</div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 pt-4">Ma trận Tiêu chí Đánh giá</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criteria.map((item, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md flex items-start gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">{item.icon}</div>
            <div>
              <h4 className="font-bold text-slate-700">{item.name}</h4>
              <p className="text-sm text-slate-500 mt-1 mb-3">{item.desc}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.color}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}