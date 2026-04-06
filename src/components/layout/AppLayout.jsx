import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { useAppSelector } from '@/store';
import useIsMobile from '@/hooks/useIsMobile';

const { Content } = Layout;

const AppLayout = () => {
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const isMobile = useIsMobile();
  const marginLeft = isMobile ? 0 : collapsed ? 72 : 240;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout
        style={{
          marginLeft,
          transition: 'margin-left 0.3s cubic-bezier(0.2,0,0,1)',
        }}
      >
        <AppHeader />
        <Content
          style={{
            marginTop: 64,
            padding: isMobile ? '16px 12px' : '24px 28px',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
