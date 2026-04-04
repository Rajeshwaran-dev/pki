import React from 'react';
import { Space, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/clients': 'Clients',
  '/tasks': 'Tasks',
  '/settings': 'Settings',
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex items-center justify-between mb-5">
      <Breadcrumb
        items={[
          {
            title: (
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <HomeOutlined /> Home
              </Link>
            ),
          },
          ...(pathSegments.length > 0
            ? [{
                title: routeNames[`/${pathSegments[0]}`] || pathSegments[0],
              }]
            : []),
        ]}
      />
      {actions && <Space wrap>{actions}</Space>}
    </div>
  );
};

export default PageHeader;
