import React from 'react';
import { UploadCloud, FileType } from 'lucide-react';

export default function Upload() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Tải lên Báo cáo Đồ án</h2>
        <p className="text-slate-500 mt-2">Hệ thống sẽ tự động bóc tách siêu dữ liệu và kiểm định danh mục tài liệu tham khảo.</p>
      </div>

      <div className="bg-white border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center hover:bg-blue-50 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-sm">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="text-blue-600" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">Kéo thả tệp vào đây</h3>
        <p className="text-sm text-slate-500 mb-6">hoặc click để chọn tệp từ máy tính (Hỗ trợ .PDF, .DOCX)</p>
        
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center mx-auto gap-2">
          <FileType size={18} />
          Chọn Báo Cáo
        </button>
      </div>
    </div>
  );
}