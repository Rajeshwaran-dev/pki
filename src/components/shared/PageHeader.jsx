import { Space, Typography } from 'antd';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';

const routeNames = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/clients': 'Clients',
  '/tasks': 'Tasks',
  '/reports': 'Reports',
  '/messages': 'Chat',
  '/settings': 'Settings',
};

const PageHeader = ({ title, subtitle, actions }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      {/* Left: breadcrumb + divider + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#999' }}>
          <HomeOutlined style={{ fontSize: 11 }} />
          <Link to="/" style={{ color: '#999', marginLeft: 4 }}>Home</Link>
          {pathSegments.length > 0 && (
            <>
              <RightOutlined style={{ fontSize: 9, margin: '0 2px' }} />
              <span style={{ color: '#B19625', fontWeight: 500 }}>
                {routeNames[`/${pathSegments[0]}`] || pathSegments[0]}
              </span>
            </>
          )}
        </div>
        <div style={{ width: 1, height: 14, background: '#e0e0e0' }} />
        <Typography.Title level={5} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.3px' }}>
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {subtitle}
          </Typography.Text>
        )}
      </div>

      {/* Right: actions */}
      {actions && (
        <Space wrap size={8}>
          {actions}
        </Space>
      )}
    </div>
  );
};

export default PageHeader;
