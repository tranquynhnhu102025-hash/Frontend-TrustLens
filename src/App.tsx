import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './features/auth/LoginScreen';
import RegisterScreen from './features/auth/RegisterScreen';
import UploadScreen from './features/upload/UploadScreen';
import ClassesScreen from './features/classes/ClassesScreen';
import DashboardPage from './features/dashboard/DashboardScreen';
import Layout from './features/Layout/Layout';
import ProfileScreen from './features/auth/ProfileScreen';
import SettingsScreen from './features/settings/SettingsScreen';
import AdminScreen from './features/admin/AdminScreen';
import ReportScreen from './features/report/ReportScreen';
  
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. KHI VÀO TRANG GỐC -> TỰ ĐỘNG ĐÁ SANG DASHBOARD */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 2. CÁC TRANG KHÔNG CẦN MENU MÀN HÌNH */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* 3. CÁC TRANG V.I.P (Bắt buộc có Menu bên trái) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />  {/* Đã đưa Dashboard vào lại trong nhà */}
            <Route path="/classes" element={<ClassesScreen />} />
            <Route path="/upload" element={<UploadScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/report" element={<ReportScreen />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}