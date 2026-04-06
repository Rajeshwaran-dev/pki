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
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';

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
          colorPrimary: '#B19625',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, sans-serif",
          colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
          colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
          colorBgLayout: isDark ? '#141414' : '#f7f7f7',
          colorText: isDark ? '#f0f0f0' : '#1f1f1f',
          colorTextSecondary: isDark ? '#a0a0a0' : '#666',
          colorBorder: isDark ? '#333' : '#e8e8e8',
          colorBgBase: isDark ? '#141414' : '#f7f7f7',
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
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
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
