import { Layout, Badge, Avatar, Dropdown, Button, Space, Drawer, Typography, Divider } from 'antd';
import {
  BellOutlined, UserOutlined, MenuOutlined, LogoutOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined,
  MailOutlined, PhoneOutlined, BankOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { setMobileSidebarOpen, setSidebarCollapsed } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import ThemeToggle from '@/components/shared/ThemeToggle';
import useIsMobile from '@/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { Header } = Layout;

const InfoRow = ({ icon, label, value, isDark }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: isDark ? '#0b2f4f' : '#e8f2fa',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isDark ? '#5ab5e8' : '#0B2B44', flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 11, color: '#999', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
    </div>
  </div>
);

const AppHeader = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.ui.theme);
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const user = useAppSelector(s => s.auth.user);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const isDark = theme === 'dark';
  const bg = isDark ? '#031726' : '#ffffff';
  const buffColor = '#0B2B44';
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
          padding: '0 20px',
          height: 64,
          lineHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? '#0b2f4f' : '#f0f0f0'}`,
          position: 'fixed',
          top: 0, right: 0,
          left: marginLeft,
          zIndex: 99,
          transition: 'left 0.3s cubic-bezier(0.2,0,0,1)',
          boxShadow: isDark ? 'none' : '0 1px 0 rgba(0,0,0,0.04)',
        }}
      >
        {/* Left: Toggle */}
        <Space>
          {isMobile ? (
            <Button
              type="text"
              shape="circle"
              icon={<MenuOutlined />}
              onClick={() => dispatch(setMobileSidebarOpen(true))}
            />
          ) : (
            <Button
              type="text"
              shape="circle"
              icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 17 }} /> : <MenuFoldOutlined style={{ fontSize: 17 }} />}
              onClick={() => dispatch(setSidebarCollapsed(!collapsed))}
            />
          )}
        </Space>

        {/* Right: Actions */}
        <Space size={4}>
          <ThemeToggle />

          <Badge
            count={3}
            size="small"
            style={{ background: isDark ? '#1e6fa8' : '#0B2B44' }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined style={{ fontSize: 17 }} />}
            />
          </Badge>

          <Dropdown
            menu={{
              items: [
                {
                  key: 'user-info',
                  label: (
                    <div style={{ padding: '4px 0', minWidth: 160 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name || 'Super Admin'}</div>
                      <div style={{ fontSize: 12, color: isDark ? '#5ab5e8' : '#0B2B44' }}>{user?.role}</div>
                    </div>
                  ),
                  disabled: true,
                },
                { type: 'divider' },
                { key: 'profile', icon: <UserOutlined />, label: 'View Profile' },
                { type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true },
              ],
              onClick: ({ key }) => {
                if (key === 'profile') setProfileOpen(true);
                if (key === 'logout') handleLogout();
              },
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                size={34}
                style={{ background: buffColor, cursor: 'pointer', fontWeight: 700 }}
              >
                {user?.avatar || 'SA'}
              </Avatar>
              {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: isDark ? '#5ab5e8' : '#0B2B44', lineHeight: 1.1 }}>{user?.role}</div>
                </div>
              )}
            </div>
          </Dropdown>
        </Space>
      </Header>

      {/* Profile Drawer */}
      <Drawer
        title={null}
        placement="right"
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        width={320}
        styles={{ body: { padding: 24 } }}
      >
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: 24, padding: '20px 0' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              size={80}
              style={{
                background: isDark ? '#0B2B44' : '#0B2B44',
                fontSize: 30, fontWeight: 700,
                boxShadow: '0 8px 24px rgba(11,43,68,0.35)',
              }}
            >
              {user?.avatar || 'SA'}
            </Avatar>
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 14, height: 14, borderRadius: '50%',
              background: '#52C41A', border: `2px solid ${isDark ? '#031726' : 'white'}`,
            }} />
          </div>
          <Typography.Title level={4} style={{ margin: '12px 0 4px' }}>
            {user?.name || 'Super Admin'}
          </Typography.Title>
          <span style={{
            display: 'inline-block',
            padding: '3px 14px',
            borderRadius: 20,
            background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(11,43,68,0.1)',
            color: isDark ? '#5ab5e8' : '#0B2B44',
            fontSize: 12,
            fontWeight: 600,
          }}>
            {user?.role || 'Super Admin'}
          </span>
        </div>

        <Divider style={{ margin: '0 0 20px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InfoRow icon={<MailOutlined />} label="Email" value={user?.email || 'superadmin@gmail.com'} isDark={isDark} />
          <InfoRow icon={<PhoneOutlined />} label="Phone" value={user?.phone || '+91 98765 43210'} isDark={isDark} />
          <InfoRow icon={<BankOutlined />} label="Company" value={user?.company || 'Perspective Kitchens & Interiors'} isDark={isDark} />
          <InfoRow icon={<SafetyCertificateOutlined />} label="Status" value={<span style={{ color: '#52C41A' }}>● Active</span>} isDark={isDark} />
        </div>

        <Divider />

        <Button
          danger
          block
          size="large"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ borderRadius: 10, fontWeight: 600, height: 46 }}
        >
          Sign Out
        </Button>
      </Drawer>
    </>
  );
};

export default AppHeader;
