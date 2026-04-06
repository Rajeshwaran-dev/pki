import { Space, Typography } from 'antd';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';

const routeNames = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/clients': 'Clients',
  '/tasks': 'Tasks',
  '/settings': 'Settings',
};

const PageHeader = ({ title, subtitle, actions }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div
      className="flex items-center justify-between mb-6"
      style={{ flexWrap: 'wrap', gap: 12 }}
    >
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-1" style={{ fontSize: 12, color: '#999' }}>
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
        <Typography.Title
          level={4}
          style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.3px' }}
        >
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {subtitle}
          </Typography.Text>
        )}
      </div>
      {actions && (
        <Space wrap size={8}>
          {actions}
        </Space>
      )}
    </div>
  );
};

export default PageHeader;
