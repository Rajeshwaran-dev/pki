import { Layout, Drawer, Avatar, Tooltip } from 'antd';
import {
  DashboardOutlined, ProjectOutlined, TeamOutlined,
  CheckSquareOutlined, SettingOutlined, LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSidebarCollapsed, setMobileSidebarOpen } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import useIsMobile from '@/hooks/useIsMobile';

const { Sider } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/projects', icon: <ProjectOutlined />, label: 'Projects' },
  { key: '/clients', icon: <TeamOutlined />, label: 'Clients' },
  { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Tasks' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
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
  const siderBg = isDark ? '#141414' : '#ffffff';
  const borderColor = isDark ? '#2a2a2a' : '#f0f0f0';
  const logoContainerBg = 'linear-gradient(135deg, #B19625 0%, #D4B96E 100%)';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleClick = (key) => {
    navigate(key);
    if (isMobile) dispatch(setMobileSidebarOpen(false));
  };

  const siderContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : (isDark ? 'center' : 'flex-start'),
          padding: '0 20px',
          borderBottom: `1px solid ${borderColor}`,
          gap: 12,
          overflow: 'hidden',
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
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: logoContainerBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 17,
              flexShrink: 0,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(177,150,37,0.28)',
            }}
          >
            P
          </div>
        )}
        {(!collapsed || isMobile) && !isDark && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2, color: isDark ? '#f5f5f5' : '#1f1f1f' }}>
              Perspective
            </div>
            <div style={{ fontSize: 10, color: '#B19625', fontWeight: 500, letterSpacing: '0.5px' }}>
              Interiour CRM
            </div>
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {menuItems.map(item => {
          const isActive = location.pathname === item.key;
          return (
            <Tooltip
              key={item.key}
              title={collapsed && !isMobile ? item.label : ''}
              placement="right"
            >
              <div
                onClick={() => handleClick(item.key)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed && !isMobile ? '12px 0' : '11px 14px',
                  justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                  marginBottom: 3,
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(135deg, #B19625 0%, #C4A840 100%)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : (isDark ? '#9a9a9a' : '#666'),
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13.5,
                  transition: 'background 0.2s ease, color 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(177,150,37,0.3)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f8f5eb';
                    e.currentTarget.style.color = '#B19625';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isDark ? '#9a9a9a' : '#666';
                  }
                }}
              >
                <span style={{ fontSize: 17, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {item.icon}
                </span>
                {(!collapsed || isMobile) && (
                  <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>

      {/* User Section */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid ${borderColor}` }}>
        {(!collapsed || isMobile) && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10,
              background: isDark ? '#1f1f1f' : '#faf8f3',
              marginBottom: 8,
            }}
          >
            <Avatar
              size={34}
              style={{ background: 'linear-gradient(135deg, #B19625, #D4B96E)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}
            >
              {user?.avatar || 'SA'}
            </Avatar>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#f0f0f0' : '#1f1f1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Super Admin'}
              </div>
              <div style={{ fontSize: 11, color: '#B19625', fontWeight: 500 }}>
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
        styles={{
          wrapper: { width: 260 },
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
