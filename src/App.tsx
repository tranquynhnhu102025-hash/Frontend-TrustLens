import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PERMISSIONS, ROLE_GROUPS } from './auth/permissions';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './features/auth/LoginScreen';
import RegisterScreen from './features/auth/RegisterScreen';
import UploadScreen from './features/upload/UploadScreen';
import ClassesScreen from './features/classes/ClassesScreen';
import ClassDetailScreen from './features/classes/ClassDetailScreen';
import DashboardPage from './features/dashboard/DashboardScreen';
import Layout from './features/Layout/Layout';
import ProfileScreen from './features/auth/ProfileScreen';
import SettingsScreen from './features/settings/SettingsScreen';
import AdminScreen from './features/admin/AdminScreen';
import ReportScreen from './features/report/ReportScreen';
import AnalyzingScreen from './features/analyzing/AnalyzingScreen';
import TrustScoreGuideScreen from './features/trust-score/TrustScoreGuideScreen';

// Import Landing Pages
import LandingLayout from './features/landing/LandingLayout';
import LandingScreen from './features/landing/LandingScreen';
import LandingFeatures from './features/landing/LandingFeatures';
import LandingPricing from './features/landing/LandingPricing';
import LandingDocs from './features/landing/LandingDocs';
import LandingContact from './features/landing/LandingContact';
  
export default function App() {
  useEffect(() => {
    const theme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'dark';
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. KHU VỰC TRANG CHỦ PUBLIC (LANDING PAGES) */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/features" element={<LandingFeatures />} />
          <Route path="/pricing" element={<LandingPricing />} />
          <Route path="/docs" element={<LandingDocs />} />
          <Route path="/contact" element={<LandingContact />} />
        </Route>

        {/* 2. CÁC TRANG KHÔNG CẦN MENU MÀN HÌNH CHUNG */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* 3. CÁC TRANG V.I.P (Bắt buộc có Menu bên trái sau khi Đăng nhập) */}
        <Route element={<ProtectedRoute requiredRoles={ROLE_GROUPS.AUTHENTICATED} />}>
          <Route element={<Layout />}>
            <Route
              element={
                <ProtectedRoute
                  requiredRoles={ROLE_GROUPS.ACADEMIC_STAFF}
                  requiredPermissions={[PERMISSIONS.REPORT_VIEW_OWN_SCOPE]}
                />
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/report" element={<ReportScreen />} />
              <Route path="/report/:id" element={<ReportScreen />} />
              <Route path="/trust-score" element={<TrustScoreGuideScreen />} />
              <Route path="/analyzing/:jobId" element={<AnalyzingScreen />} />
            </Route>
            <Route
              element={
                <ProtectedRoute
                  requiredRoles={ROLE_GROUPS.ACADEMIC_STAFF}
                  requiredPermissions={[PERMISSIONS.COURSE_MANAGE]}
                />
              }
            >
              <Route path="/classes" element={<ClassesScreen />} />
              <Route path="/class/:id" element={<ClassDetailScreen />} />
            </Route>
            <Route
              element={
                <ProtectedRoute
                  requiredRoles={ROLE_GROUPS.ACADEMIC_STAFF}
                  requiredPermissions={[PERMISSIONS.SUBMISSION_UPLOAD]}
                />
              }
            >
              <Route path="/upload" element={<UploadScreen />} />
            </Route>
            <Route
              element={
                <ProtectedRoute
                  requiredRoles={ROLE_GROUPS.ADMIN_ONLY}
                  requiredPermissions={[
                    PERMISSIONS.ADMIN_USER_MANAGE,
                    PERMISSIONS.ADMIN_SCORING_CONFIG,
                    PERMISSIONS.ADMIN_AUDIT_LOG,
                    PERMISSIONS.ADMIN_METADATA_PROVIDER,
                  ]}
                />
              }
            >
              <Route path="/admin" element={<AdminScreen />} />
            </Route>
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}
