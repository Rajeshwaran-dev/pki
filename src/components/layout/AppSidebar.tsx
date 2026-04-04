import React from 'react';
import { Layout, Drawer, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSidebarCollapsed, setMobileSidebarOpen } from '@/store/slices/uiSlice';
import useIsMobile from '@/hooks/useIsMobile';

const { Sider } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/projects', icon: <ProjectOutlined />, label: 'Projects' },
  { key: '/clients', icon: <TeamOutlined />, label: 'Clients' },
  { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Tasks' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
];

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const mobileOpen = useAppSelector(s => s.ui.mobileSidebarOpen);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();

  const siderBg = theme === 'dark' ? '#1f1f1f' : '#ffffff';
  const textColor = theme === 'dark' ? '#f5f5f5' : '#1f1f1f';

  const logo = (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
        padding: collapsed && !isMobile ? '0' : '0 20px',
        borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#f0f0f0'}`,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #B19625, #D4B96E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        P
      </div>
      {(!collapsed || isMobile) && (
        <Typography.Text
          strong
          style={{ marginLeft: 12, fontSize: 16, color: textColor, whiteSpace: 'nowrap' }}
        >
          Perspective
        </Typography.Text>
      )}
    </div>
  );

  const handleClick = (key: string) => {
    navigate(key);
    if (isMobile) dispatch(setMobileSidebarOpen(false));
  };

  const menuContent = (
    <div style={{ marginTop: 8, padding: '0 8px' }}>
      {menuItems.map(item => {
        const isActive = location.pathname === item.key;
        return (
          <div
            key={item.key}
            onClick={() => handleClick(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed && !isMobile ? '10px 0' : '10px 16px',
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              marginBottom: 4,
              borderRadius: 8,
              cursor: 'pointer',
              background: isActive ? '#B19625' : 'transparent',
              color: isActive ? '#ffffff' : (theme === 'dark' ? '#a0a0a0' : '#666'),
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                (e.currentTarget as HTMLDivElement).style.background = theme === 'dark' ? '#2a2a2a' : '#f5f5f5';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </div>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => dispatch(setMobileSidebarOpen(false))}
        width={260}
        styles={{ body: { padding: 0, background: siderBg }, header: { display: 'none' } }}
      >
        {logo}
        {menuContent}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={val => dispatch(setSidebarCollapsed(val))}
      trigger={null}
      width={240}
      collapsedWidth={72}
      style={{
        background: siderBg,
        borderRight: `1px solid ${theme === 'dark' ? '#333' : '#f0f0f0'}`,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        overflow: 'auto',
      }}
    >
      {logo}
      {menuContent}
      <div style={{ position: 'absolute', bottom: 16, width: '100%', textAlign: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => dispatch(setSidebarCollapsed(!collapsed))}
        />
      </div>
    </Sider>
  );
};

export default AppSidebar;
