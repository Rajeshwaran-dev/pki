import React from 'react';
import { Layout, Badge, Avatar, Dropdown, Button, Space, Drawer, Typography, Divider } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { setMobileSidebarOpen, setSidebarCollapsed } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import ThemeToggle from '@/components/shared/ThemeToggle';
import useIsMobile from '@/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.ui.theme);
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const user = useAppSelector(s => s.auth.user);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const bg = theme === 'dark' ? '#1f1f1f' : '#ffffff';
  const marginLeft = isMobile ? 0 : collapsed ? 72 : 240;

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <>
      <Header
        style={{
          background: bg,
          padding: '0 24px',
          height: 64,
          lineHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#f0f0f0'}`,
          position: 'fixed',
          top: 0,
          right: 0,
          left: marginLeft,
          zIndex: 99,
          transition: 'left 0.3s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        <Space>
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => dispatch(setMobileSidebarOpen(true))}
            />
          ) : (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => dispatch(setSidebarCollapsed(!collapsed))}
              style={{ fontSize: 18 }}
            />
          )}
        </Space>

        <Space size="middle">
          <ThemeToggle />
          <Badge count={3} size="small">
            <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
          </Badge>
          <Avatar
            style={{ background: '#B19625', cursor: 'pointer' }}
            icon={<UserOutlined />}
            onClick={() => setProfileOpen(true)}
          />
        </Space>
      </Header>

      {/* Profile Drawer */}
      <Drawer
        title="Profile"
        placement="right"
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        width={360}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar
            size={80}
            style={{
              background: 'linear-gradient(135deg, #B19625, #D4B96E)',
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            {user?.avatar || 'SA'}
          </Avatar>
          <Typography.Title level={4} style={{ margin: 0 }}>{user?.name || 'Super Admin'}</Typography.Title>
          <Typography.Text
            style={{
              display: 'inline-block',
              marginTop: 6,
              padding: '2px 12px',
              borderRadius: 12,
              background: '#B1962515',
              color: '#B19625',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {user?.role || 'Super Admin'}
          </Typography.Text>
        </div>

        <Divider />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#B1962510', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B19625' }}>
              <MailOutlined />
            </div>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Email</Typography.Text>
              <Typography.Text style={{ fontSize: 13 }}>{user?.email || 'superadmin@gmail.com'}</Typography.Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#B1962510', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B19625' }}>
              <PhoneOutlined />
            </div>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Phone</Typography.Text>
              <Typography.Text style={{ fontSize: 13 }}>{user?.phone || '+91 98765 43210'}</Typography.Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#B1962510', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B19625' }}>
              <BankOutlined />
            </div>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Company</Typography.Text>
              <Typography.Text style={{ fontSize: 13 }}>{user?.company || 'Perspective Kitchens & Interiors'}</Typography.Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#B1962510', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B19625' }}>
              <SafetyCertificateOutlined />
            </div>
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Status</Typography.Text>
              <Typography.Text style={{ fontSize: 13, color: '#52C41A' }}>● Active</Typography.Text>
            </div>
          </div>
        </div>

        <Divider />

        <Button
          danger
          block
          size="large"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ borderRadius: 10, fontWeight: 600 }}
        >
          Sign Out
        </Button>
      </Drawer>
    </>
  );
};

export default AppHeader;
