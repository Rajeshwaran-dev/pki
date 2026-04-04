import React from 'react';
import { Typography, Space } from 'antd';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
        {title}
      </Typography.Title>
      {subtitle && (
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>
          {subtitle}
        </Typography.Text>
      )}
    </div>
    {actions && <Space wrap>{actions}</Space>}
  </div>
);

export default PageHeader;
