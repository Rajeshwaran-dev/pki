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

const InfoRow = ({ icon, label, value, isDark, buffColor, caputMortuum }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: isDark ? '#0b2f4f' : 'rgba(214,159,109,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isDark ? '#5ab5e8' : caputMortuum, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, color: '#999', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500 }}>{value}</div>
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
  const caputMortuum = '#4F312A';
  const buffColor = isDark ? '#0B2B44' : '#D69F6D';
  const bg = isDark ? '#031726' : '#ffffff';
  const marginLeft = isMobile ? 0 : collapsed ? 72 : 260;

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
              icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 19 }} /> : <MenuFoldOutlined style={{ fontSize: 19 }} />}
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
            style={{ background: isDark ? '#1e6fa8' : buffColor }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined style={{ fontSize: 19 }} />}
            />
          </Badge>

          <Dropdown
            menu={{
              items: [
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
                  <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1 }}>{user?.name}</div>
                  <div style={{ fontSize: 13, color: isDark ? '#5ab5e8' : buffColor, lineHeight: 1.1, fontWeight: 500 }}>{user?.role}</div>
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
                background: buffColor,
                fontSize: 30, fontWeight: 700,
                boxShadow: isDark ? '0 8px 24px rgba(11,43,68,0.35)' : '0 8px 24px rgba(214,159,109,0.35)',
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
            background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)',
            color: isDark ? '#5ab5e8' : caputMortuum,
            fontSize: 16,
            fontWeight: 600,
          }}>
            {user?.role || 'Super Admin'}
          </span>
        </div>

        <Divider style={{ margin: '0 0 20px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InfoRow icon={<MailOutlined />} label="Email" value={user?.email || 'superadmin@gmail.com'} isDark={isDark} buffColor={buffColor} caputMortuum={caputMortuum} />
          <InfoRow icon={<PhoneOutlined />} label="Phone" value={user?.phone || '+91 98765 43210'} isDark={isDark} buffColor={buffColor} caputMortuum={caputMortuum} />
          <InfoRow icon={<BankOutlined />} label="Company" value={user?.company || 'Perspective Kitchens & Interiors'} isDark={isDark} buffColor={buffColor} caputMortuum={caputMortuum} />
          <InfoRow icon={<SafetyCertificateOutlined />} label="Status" value={<span style={{ color: '#52C41A' }}>● Active</span>} isDark={isDark} buffColor={buffColor} caputMortuum={caputMortuum} />
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
