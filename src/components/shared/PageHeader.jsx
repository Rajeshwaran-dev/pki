import { Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, RightOutlined } from '@ant-design/icons';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const routeNames = {
  '/': 'Dashboard',
  '/enquiry': 'Enquiry',
  '/projects': 'Projects',
  '/clients': 'Clients',
  '/tasks': 'Tasks',
  '/reports': 'Reports',
  '/messages': 'Chat',
  '/attendance': 'Attendance',
  '/payroll': 'Payroll',
  '/settings': 'Settings',
  '/settings/organisation': 'Organisation Settings',
  '/settings/users': 'User Management',
  '/settings/permissions': 'Permissions',
  '/settings/attendance': 'Attendance Settings',
  '/settings/payroll': 'Payroll Settings',
};

const PageHeader = ({ title, subtitle, actions, backTo, backLabel = 'Back' }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
      {/* Left: back + breadcrumb + divider + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {backTo && (
          <div style={{ position: 'relative', zIndex: 1000 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              aria-label={backLabel} 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(backTo); 
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: '#999' }}>
          <HomeOutlined style={{ fontSize: 13 }} />
          <Link to="/" style={{ color: '#999', marginLeft: 4 }}>Home</Link>
          {pathSegments.length > 0 && (
            <>
              <RightOutlined style={{ fontSize: 11, margin: '0 2px' }} />
              <span style={{ color: 'var(--gold)', fontWeight: 500 }}>
                {routeNames[`/${pathSegments[0]}`] || pathSegments[0]}
              </span>
            </>
          )}
        </div>
        <div style={{ width: 1, height: 14, background: '#e0e0e0' }} />
        <Typography.Title level={5} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.3px', fontSize: 18 }}>
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
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
