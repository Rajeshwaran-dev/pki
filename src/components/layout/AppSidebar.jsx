import { Layout, Drawer, Avatar, Tooltip, Menu } from 'antd';
import {
  DashboardOutlined, ProjectOutlined, TeamOutlined,
  CheckSquareOutlined, SettingOutlined, LogoutOutlined, BarChartOutlined, MessageOutlined,
  ContactsOutlined, DollarOutlined,
  BankOutlined, UserOutlined, LockOutlined,
  SafetyCertificateOutlined, CreditCardOutlined,
  CloseOutlined,
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
      { key: '/settings/organisation', icon: <BankOutlined />, label: 'Organisation Settings' },
      { key: '/settings/users', icon: <UserOutlined />, label: 'User Management' },
      { key: '/settings/permissions', icon: <LockOutlined />, label: 'Permissions' },
      { key: '/settings/attendance', icon: <SafetyCertificateOutlined />, label: 'Attendance Settings' },
      { key: '/settings/payroll', icon: <CreditCardOutlined />, label: 'Payroll Settings' },
      { key: '/settings/notifications', icon: <MessageOutlined />, label: 'Notifications' },
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
  const buffColor = isDark ? '#0B2B44' : '#D69F6D';
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
    // Special case for dashboard
    if (p === '/') return '/';
    
    // Find the menu item that best matches the current path
    // We check for exact match first, then for partial match (starts with)
    const direct = menuItems
      .flatMap((i) => (i.children ? i.children : [i]))
      .find((i) => i.key === p);
    
    if (direct) return direct.key;

    // If no exact match, find the first menu item that the path starts with
    // (excluding root '/' and settingsKey)
    const partial = menuItems
      .flatMap((i) => (i.children ? i.children : [i]))
      .find((i) => i.key !== '/' && i.key !== settingsMenuKey && p.startsWith(i.key));

    return partial?.key || '/';
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
          position: 'relative',
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
              pointerEvents: 'none'
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
              transformOrigin: 'center',
              pointerEvents: 'none'
            }}
          />
        )}

        {isMobile && (
          <div
            onClick={() => dispatch(setMobileSidebarOpen(false))}
            style={{
              position: 'absolute',
              right: 12,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              cursor: 'pointer',
              color: isDark ? '#fff' : '#000',
              zIndex: 10,
              pointerEvents: 'auto'
            }}
          >
            <CloseOutlined style={{ fontSize: 16 }} />
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <div style={{ flex: 1, padding: '12px 4px', overflowY: 'auto', overflowX: 'hidden' }}>
        <Menu
          mode="inline"
          items={menuItems}
          inlineCollapsed={collapsed && !isMobile}
          inlineIndent={16}
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
            fontSize: 17,
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
              style={{ background: buffColor, fontWeight: 700, fontSize: 15, flexShrink: 0 }}
            >
              {user?.avatar || 'SA'}
            </Avatar>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: isDark ? '#f0f0f0' : '#1f1f1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Super Admin'}
              </div>
              <div style={{ fontSize: 15, color: isDark ? '#5ab5e8' : buffColor, fontWeight: 500 }}>
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
              color: '#FF4D4F', fontSize: 15.5, fontWeight: 500,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,79,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}><LogoutOutlined /></span>
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
        width={260}
        styles={{
          body: { padding: 0, background: siderBg, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'visible' },
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
      width={260}
      collapsedWidth={72}
      style={{
        background: siderBg,
        borderRight: `1px solid ${borderColor}`,
        height: '100vh',
        position: 'fixed',
        left: 0, top: 0,
        zIndex: 100,
        overflow: 'visible',
        transition: 'width 0.3s cubic-bezier(0.2,0,0,1)',
      }}
    >
      {siderContent}
    </Sider>
  );
};

export default AppSidebar;
