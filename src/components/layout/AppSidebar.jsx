import { Layout, Drawer, Avatar, Tooltip, Menu } from 'antd';
import {
  DashboardOutlined, ProjectOutlined, TeamOutlined,
  CheckSquareOutlined, SettingOutlined, LogoutOutlined, BarChartOutlined, MessageOutlined,
  ContactsOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSidebarCollapsed, setMobileSidebarOpen } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import useIsMobile from '@/hooks/useIsMobile';

const { Sider } = Layout;

const settingsMenuKey = '__settings__';
const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/enquiry', icon: <ContactsOutlined />, label: 'Enquiry' },
  { key: '/clients', icon: <TeamOutlined />, label: 'Clients' },
  { key: '/projects', icon: <ProjectOutlined />, label: 'Projects' },
  { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Tasks' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
  { key: '/messages', icon: <MessageOutlined />, label: 'Chat' },
  { key: '/attendance', icon: <TeamOutlined />, label: 'Attendance' },
  { key: '/payroll', icon: <DollarOutlined />, label: 'Payroll' },
  { key: '/inventory', icon: <BarChartOutlined />, label: 'Inventory' },
  {
    key: settingsMenuKey,
    icon: <SettingOutlined />,
    label: 'Settings',
    children: [
      { key: '/settings', label: 'General' },
      { key: '/settings/attendance', label: 'Attendance Settings' },
      { key: '/settings/payroll', label: 'Payroll Settings' },
    ],
  },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const mobileOpen = useAppSelector(s => s.ui.mobileSidebarOpen);
  const theme = useAppSelector(s => s.ui.theme);
  const user = useAppSelector(s => s.auth.user);
  const isMobile = useIsMobile();

  const isDark = theme === 'dark';
  const caputMortuum = '#4F312A';
  const buffColor = isDark ? '#0B2B44' : '#D69F6D';
  const activeGradient = `linear-gradient(135deg, ${caputMortuum} 0%, ${buffColor} 100%)`;
  const siderBg = isDark ? '#031726' : '#ffffff';
  const borderColor = isDark ? '#0D3554' : '#f0f0f0';
  const logoContainerBg = 'transparent';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleClick = (key) => {
    navigate(key);
    if (isMobile) dispatch(setMobileSidebarOpen(false));
  };

  const selectedKey = useMemo(() => {
    const p = location.pathname;
    const direct = menuItems
      .flatMap((i) => (i.children ? i.children : [i]))
      .find((i) => i.key === p);
    return direct?.key || '/';
  }, [location.pathname]);

  const defaultOpenKeys = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/settings')) return [settingsMenuKey];
    return [];
  }, [location.pathname]);

  const siderContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
          borderBottom: `1px solid ${borderColor}`,
          gap: 12,
          overflow: 'visible',
          background: isDark ? 'transparent' : logoContainerBg,
        }}
      >
        {isDark ? (
          <img
            src="/logo.png"
            alt="Perspective logo"
            style={{
              height: collapsed && !isMobile ? 30 : 34,
              maxWidth: collapsed && !isMobile ? 30 : 150,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 1,
            }}
          />
        ) : (
          <img
            src="/PK_I_Logo.png"
            alt="PK_I logo"
            style={{
              height: collapsed && !isMobile ? 32 : 64,
              maxWidth: collapsed && !isMobile ? 40 : 220,
              width: '100%',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0,
              transform: collapsed && !isMobile ? 'none' : 'scale(3.2)',
              transformOrigin: 'center'
            }}
          />
        )}
      </div>

      {/* Nav Menu */}
      <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <Menu
          mode="inline"
          items={menuItems}
          inlineCollapsed={collapsed && !isMobile}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={defaultOpenKeys}
          className={isDark ? '' : 'light-sidebar-menu'}
          onClick={({ key }) => {
            if (key === settingsMenuKey) return;
            handleClick(key);
          }}
          style={{
            background: 'transparent',
            borderInlineEnd: 'none',
            color: isDark ? '#b2bdc8' : '#4f312a',
          }}
          theme={isDark ? 'dark' : 'light'}
        />
      </div>

      {/* User Section */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${borderColor}` }}>
        {(!collapsed || isMobile) && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10,
              background: isDark ? '#0D3554' : 'rgba(0,0,0,0.04)',
              marginBottom: 8,
            }}
          >
            <Avatar
              size={34}
              style={{ background: buffColor, fontWeight: 700, fontSize: 13, flexShrink: 0 }}
            >
              {user?.avatar || 'SA'}
            </Avatar>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#f0f0f0' : '#1f1f1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Super Admin'}
              </div>
              <div style={{ fontSize: 11, color: isDark ? '#5ab5e8' : buffColor, fontWeight: 500 }}>
                {user?.role || 'Super Admin'}
              </div>
            </div>
          </div>
        )}

        <Tooltip title={collapsed && !isMobile ? 'Logout' : ''} placement="right">
          <div
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed && !isMobile ? '12px 0' : '10px 14px',
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              borderRadius: 10, cursor: 'pointer',
              color: '#FF4D4F', fontSize: 13.5, fontWeight: 500,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,79,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: 16, display: 'flex', alignItems: 'center' }}><LogoutOutlined /></span>
            {(!collapsed || isMobile) && <span>Sign Out</span>}
          </div>
        </Tooltip>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => dispatch(setMobileSidebarOpen(false))}
        size="large"
        styles={{
          body: { padding: 0, background: siderBg, display: 'flex', flexDirection: 'column', height: '100%' },
          header: { display: 'none' },
        }}
      >
        {siderContent}
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
        borderRight: `1px solid ${borderColor}`,
        height: '100vh',
        position: 'fixed',
        left: 0, top: 0,
        zIndex: 100,
        overflowX: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.2,0,0,1)',
      }}
    >
      {siderContent}
    </Sider>
  );
};

export default AppSidebar;
