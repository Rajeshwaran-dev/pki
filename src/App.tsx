import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider, theme as antTheme, App as AntApp } from 'antd';
import { store, useAppSelector } from './store';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ClientsPage from './pages/ClientsPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

const ThemedApp = () => {
  const uiTheme = useAppSelector(s => s.ui.theme);
  const isDark = uiTheme === 'dark';

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#C8A75D',
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
          colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
          colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
          colorBgLayout: isDark ? '#141414' : '#ffffff',
          colorText: isDark ? '#f5f5f5' : '#0a0a0a',
          colorTextSecondary: isDark ? '#a0a0a0' : '#444',
          colorBorder: isDark ? '#333' : '#e8e8e8',
          colorBgBase: isDark ? '#141414' : '#ffffff',
        },
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
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
