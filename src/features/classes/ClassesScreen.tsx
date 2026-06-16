import { useState } from 'react';
import { Users, Calendar, ChevronRight, BookOpen, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ClassesScreen({ setSelectedClass }: any) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  // 1. KHO CHỨA DỮ LIỆU
  const [classes, setClasses] = useState([
    { id: 'INT4050', name: 'Đồ án Tốt nghiệp - Khóa 2022', students: 45, date: '15/06/2026' },
    { id: 'INT3307', name: 'Phát triển Hệ thống Thông tin Enterprise', students: 38, date: '20/06/2026' },
    { id: 'INT3110', name: 'Kỹ thuật phần mềm nâng cao', students: 42, date: '18/06/2026' }
  ]);

  // 2. BỘ NHỚ TẠM
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');

  // 3. HÀNH ĐỘNG
  const handleAddClass = () => {
    if (!newCode || !newName) return; 
    
    const newClass = {
      id: newCode.toUpperCase(), 
      name: newName,
      students: 0, 
      date: '31/12/2026' 
    };

    setClasses([...classes, newClass]); 
    setShowModal(false); 
    setNewCode(''); 
    setNewName('');
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Danh sách lớp phụ trách</h2>
          <p className="text-slate-500 font-medium">Chọn học phần để tiến hành nộp và duyệt tập tin báo cáo đồ án.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all"
        >
          + Thêm lớp học phần
        </button>
      </div>

      {/* DANH SÁCH THẺ (CARD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((cls, index) => (
          <div 
            key={index}
            onClick={() => {
              setSelectedClass(cls);
              navigate('/upload');
            }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="text-sm font-bold text-blue-600 mb-2">{cls.id}</div>
            <h3 className="text-lg font-black text-slate-800 mb-6 group-hover:text-blue-700 transition-colors line-clamp-2">{cls.name}</h3>
            
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Users size={14} /> {cls.students} Sinh viên</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Hạn: {cls.date}</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* BẢNG POPUP KÍNH MỜ (GLASSMORPHISM) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          
          <div className="absolute w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 translate-x-20 -translate-y-20 pointer-events-none"></div>
          <div className="absolute w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 -translate-x-20 translate-y-20 pointer-events-none"></div>

          <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-white/50">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-200/50 pb-5">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Thêm lớp học phần</h3>
              </div>
            </div>
            
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Mã học phần</label>
                <input 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)} 
                  type="text" 
                  placeholder="VD: INT4050" 
                  className="w-full px-5 py-3.5 border border-slate-200/80 bg-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 uppercase placeholder:font-medium placeholder:text-slate-400 placeholder:normal-case shadow-inner transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Tên đồ án / môn học</label>
                <input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)} 
                  type="text" 
                  placeholder="VD: Đồ án Tốt nghiệp" 
                  className="w-full px-5 py-3.5 border border-slate-200/80 bg-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 shadow-inner transition-all" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-6 py-3 font-bold text-slate-600 hover:bg-white/80 rounded-2xl transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleAddClass}
                disabled={!newCode || !newName}
                className="flex items-center gap-2 px-6 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-2xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                Tạo lớp học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}