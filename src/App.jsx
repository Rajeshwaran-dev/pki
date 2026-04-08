import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme, App as AntApp } from 'antd';
import { store, useAppSelector } from './store';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ClientsPage from './pages/ClientsPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ReportsPage from './pages/ReportsPage';
import MessagesPage from './pages/MessagesPage';
import AttendancePage from './pages/AttendancePage';
import InventoryPage from './pages/InventoryPage';
import EnquiryPage from './pages/EnquiryPage';
import EnquiryDetailPage from './pages/EnquiryDetailPage';
import ClientDetailPage from './pages/ClientDetailPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import AttendanceSettings from './pages/attendancepages/AttendanceSettings';
import AdminAttendance from './pages/attendancepages/AdminAttendance';
import AttendanceTemplates from './pages/attendancepages/AttendanceTemplates';
import AttendanceTemplateStaff from './pages/attendancepages/AttendanceTemplateStaff';
import AttendanceGeofence from './pages/attendancepages/AttendanceGeofence';
import ShiftSettings from './pages/attendancepages/ShiftSettings';
import WeeklyHolidayTemplates from './pages/attendancepages/WeeklyHolidayTemplates';
import WeeklyHolidayTemplateStaff from './pages/attendancepages/WeeklyHolidayTemplateStaff';
import AutomationRules from './pages/attendancepages/AutomationRules';
import Payroll from './pages/payrollPages/Payroll';
import PayrollPreview from './pages/payrollPages/PayrollPreview';
import PayrollAttendance from './pages/payrollPages/Attendance';
import Reimbursements from './pages/payrollPages/Reimbursements';
import PayrollSettings from './pages/settingsattendance/PayrollSettings';
import PayrollCycle from './pages/settingsattendance/payrollPages/PayrollCycle';
import AttendanceCalculation from './pages/settingsattendance/payrollPages/AttendanceCalculation';
import DeductionRules from './pages/settingsattendance/payrollPages/DeductionRules';
import FineCalculation from './pages/settingsattendance/payrollPages/FineCalculation';
import PayrollProcessingRules from './pages/settingsattendance/payrollPages/PayrollProcessingRules';
import ReimbursementIntegration from './pages/settingsattendance/payrollPages/ReimbursementIntegration';

const ProtectedRoute = ({ children }) => {
  const isAuth = useAppSelector(s => s.auth.isAuthenticated);
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const ThemedApp = () => {
  const uiTheme = useAppSelector(s => s.ui.theme);
  const isDark = uiTheme === 'dark';

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: isDark ? '#5ab5e8' : '#D69F6D',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, sans-serif",
          colorBgContainer: isDark ? '#031726' : '#ffffff',
          colorBgElevated: isDark ? '#0b2338' : '#ffffff',
          colorBgLayout: isDark ? '#031726' : '#f7f7f7',
          colorText: isDark ? '#f2f5f8' : '#1f1f1f',
          colorTextSecondary: isDark ? '#a8b0ba' : '#666',
          colorBorder: isDark ? '#0a2d47' : '#e8e8e8',
          colorBgBase: isDark ? '#031726' : '#f7f7f7',
          fontSize: 14,
          lineHeight: 1.5,
        },
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/:id" element={<ClientDetailPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/attendance/:tab" element={<AttendancePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/inventory/:tab" element={<InventoryPage />} />
              <Route path="/enquiry" element={<EnquiryPage />} />
              <Route path="/enquiry/:id" element={<EnquiryDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Attendance */}
              <Route path="/attendance" element={<AdminAttendance />} />
              <Route path="/attendance/templates" element={<AttendanceTemplates />} />
              <Route path="/attendance/templates/:templateId/staff" element={<AttendanceTemplateStaff />} />
              <Route path="/attendance/geofence" element={<AttendanceGeofence />} />
              <Route path="/attendance/shift-settings" element={<ShiftSettings />} />
              <Route path="/attendance/weekly-holidays/templates" element={<WeeklyHolidayTemplates />} />
              <Route path="/attendance/weekly-holidays/templates/:templateId/staff" element={<WeeklyHolidayTemplateStaff />} />
              <Route path="/attendance/automation-rules" element={<AutomationRules />} />

              {/* Attendance Settings (under Settings menu) */}
              <Route path="/settings/attendance" element={<AttendanceSettings />} />

              {/* Payroll */}
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/payroll/preview" element={<PayrollPreview />} />
              <Route path="/payroll/attendance" element={<PayrollAttendance />} />
              <Route path="/payroll/reimbursements" element={<Reimbursements />} />

              {/* Payroll Settings */}
              <Route path="/settings/payroll" element={<PayrollSettings />} />
              <Route path="/settings/payroll/cycle" element={<PayrollCycle />} />
              <Route path="/settings/payroll/attendance-calculation" element={<AttendanceCalculation />} />
              <Route path="/settings/payroll/deduction-rules" element={<DeductionRules />} />
              <Route path="/settings/payroll/fine-calculation" element={<FineCalculation />} />
              <Route path="/settings/payroll/processing-rules" element={<PayrollProcessingRules />} />
              <Route path="/settings/payroll/reimbursement-integration" element={<ReimbursementIntegration />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <ThemedApp />
  </Provider>
);

export default App;
