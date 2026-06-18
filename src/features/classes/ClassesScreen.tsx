import { useState, useEffect } from 'react';
import { Users, Calendar, ChevronRight, BookOpen, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { classService, Course } from '../../services/classService';

export default function ClassesScreen() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  // 1. KHO CHỨA DỮ LIỆU
  const [classes, setClasses] = useState<Course[]>([]);

  // 2. BỘ NHỚ TẠM
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');

  // 3. TẢI DỮ LIỆU LỚP HỌC
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách lớp học:", error);
      }
    };
    fetchClasses();
  }, []);

  // 4. HÀNH ĐỘNG THÊM LỚP
  const handleAddClass = async () => {
    if (!newCode || !newName) return; 
    
    try {
      const newClass = await classService.createClass(newCode, newName);
      setClasses([...classes, newClass]); 
      setShowModal(false); 
      setNewCode(''); 
      setNewName('');
    } catch (error) {
      console.error("Lỗi khi tạo lớp học:", error);
    }
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
              navigate('/upload', { state: { selectedClass: cls } });
            }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-minimal-sm hover:shadow-minimal-md hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">{cls.id}</div>
            <h3 className="text-lg font-black text-slate-800 mb-6 group-hover:text-blue-600 transition-colors line-clamp-2">{cls.name}</h3>
            
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

      {/* BẢNG POPUP TỐI GIẢN */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="relative z-10 bg-white border border-slate-150 rounded-2xl p-6 w-full max-w-md shadow-minimal-md">
            <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100 pb-4">
              <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl border border-blue-100">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Thêm lớp học phần</h3>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Mã học phần</label>
                <input 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)} 
                  type="text" 
                  placeholder="VD: INT4050" 
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-bold text-slate-900 uppercase placeholder:font-medium placeholder:text-slate-400 placeholder:normal-case transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Tên đồ án / môn học</label>
                <input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)} 
                  type="text" 
                  placeholder="VD: Đồ án Tốt nghiệp" 
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 transition-all text-sm" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-5 py-2.5 font-bold text-xs text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleAddClass}
                disabled={!newCode || !newName}
                className="flex items-center gap-1.5 px-5 py-2.5 font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-minimal-sm disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Save size={14} className="group-hover:scale-105 transition-transform" />
                Tạo lớp học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}