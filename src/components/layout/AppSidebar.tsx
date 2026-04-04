import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  BarChartOutlined,
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
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
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
          background: 'linear-gradient(135deg, #C8A75D, #D4B96E)',
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

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => {
        navigate(key);
        if (isMobile) dispatch(setMobileSidebarOpen(false));
      }}
      items={menuItems}
      style={{
        border: 'none',
        background: 'transparent',
        marginTop: 8,
      }}
    />
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
