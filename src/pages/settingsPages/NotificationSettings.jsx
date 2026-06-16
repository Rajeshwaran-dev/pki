import { useState } from 'react';
import { Tabs, List, Button, Typography, Tag, Avatar } from 'antd';
import { CheckOutlined, CloseOutlined, BellOutlined, FileTextOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';
import { useAppSelector } from '@/store';

const { Text } = Typography;

export default function NotificationSettings() {
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';

  const primaryColor  = isDark ? '#5ab5e8'  : '#D69F6D';
  const cardBg        = isDark ? '#0d3554'  : '#ffffff';
  const sectionBorder = isDark ? '#1a4d72'  : '#e8f0fb';

  const [activeTab, setActiveTab] = useState('1');

  const [approvals, setApprovals] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('quoteEditApprovals') || '[]');
    if (stored.length === 0) {
      return [
        { id: 1, quoteId: 'PRO-711538', title: 'Edit Quotation Approval', description: 'Admin wants to edit Approved Quotation PRO-711538.', time: '10 mins ago', status: 'pending' },
        { id: 2, quoteId: 'PRJ-771', title: 'Project Deletion Request', description: 'Suresh wants to delete Project PRJ-771.', time: '1 hour ago', status: 'approved' },
      ];
    }
    return stored;
  });

  const notifications = [
    { id: 1, title: 'New Quotation Created', description: 'Quotation PRO-711538 was created for Project Mr. Suresh.', time: '20 mins ago', type: 'info' },
    { id: 2, title: 'System Update', description: 'Scheduled maintenance tonight at 2:00 AM.', time: '1 day ago', type: 'warning' },
    { id: 3, title: 'Lead Converted', description: 'Enquiry ENG-004 was successfully converted into a Project.', time: '2 days ago', type: 'success' }
  ];

  const handleApprove = (id) => {
    const updated = approvals.map(a => a.id === id ? { ...a, status: 'approved' } : a);
    setApprovals(updated);
    localStorage.setItem('quoteEditApprovals', JSON.stringify(updated));
  };

  const handleReject = (id) => {
    const updated = approvals.map(a => a.id === id ? { ...a, status: 'rejected' } : a);
    setApprovals(updated);
    localStorage.setItem('quoteEditApprovals', JSON.stringify(updated));
  };

  const items = [
    {
      key: '1',
      label: 'Approval',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={approvals}
          renderItem={item => (
            <List.Item
              actions={item.status === 'pending' ? [
                <Button key="approve" size="small" type="primary" onClick={() => handleApprove(item.id)} style={{ background: primaryColor, border: 'none' }} icon={<CheckOutlined />}>Approve</Button>,
                <Button key="reject" size="small" danger onClick={() => handleReject(item.id)} icon={<CloseOutlined />}>Reject</Button>
              ] : [
                <Tag key="status" color={item.status === 'approved' ? 'success' : 'error'}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Tag>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#f56a00' }} icon={<FileTextOutlined />} />}
                title={<span style={{ color: isDark ? '#fff' : '#000', fontWeight: 600 }}>{item.title}</span>}
                description={<span style={{ color: isDark ? '#a8b0ba' : '#666' }}>{item.description} <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{item.time}</Text></span>}
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: '2',
      label: 'All Notifications',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: primaryColor }} icon={<BellOutlined />} />}
                title={<span style={{ color: isDark ? '#fff' : '#000', fontWeight: 600 }}>{item.title}</span>}
                description={<span style={{ color: isDark ? '#a8b0ba' : '#666' }}>{item.description} <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{item.time}</Text></span>}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="animate-fade-in" style={{
        background: cardBg,
        borderRadius: 14,
        padding: '20px 24px',
        boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
        border: `1px solid ${sectionBorder}`,
      }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          tabBarStyle={{ marginBottom: 24, fontWeight: 500 }}
        />
      </div>
    </div>
  );
}
