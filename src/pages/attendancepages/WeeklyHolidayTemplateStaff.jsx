import { useMemo, useState } from 'react';
import { Button, Card, Input, Space, Table, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const demoStaff = [
  { id: 'st-001', name: 'Ramu', role: 'Site Manager', status: 'Active' },
  { id: 'st-002', name: 'Chandra Bose', role: 'Designer', status: 'Active' },
  { id: 'st-006', name: 'Madhu Loganathan', role: 'Executive', status: 'Active' },
];

export default function WeeklyHolidayTemplateStaff() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [q, setQ] = useState('');
  const [assignedIds, setAssignedIds] = useState(['st-001']);

  const data = useMemo(() => {
    const query = q.trim().toLowerCase();
    return demoStaff
      .filter(s => (query ? `${s.name} ${s.role}`.toLowerCase().includes(query) : true))
      .map(s => ({ ...s, assigned: assignedIds.includes(s.id) }));
  }, [q, assignedIds]);

  const columns = [
    {
      title: 'Staff',
      dataIndex: 'name',
      render: (_v, r) => (
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{r.name}</div>
          <Text type="secondary" style={{ fontSize: 14 }}>{r.role}</Text>
        </div>
      ),
    },
    { title: 'Status', dataIndex: 'status', width: 120, render: v => <Tag color="success">{v}</Tag> },
    { title: 'Assigned', dataIndex: 'assigned', width: 120, render: v => (v ? <Tag color="blue">Yes</Tag> : <Tag>No</Tag>) },
  ];

  return (
    <div>
      <PageHeader
        title="Weekly Holiday Template Staff"
        subtitle={`Template: ${templateId}`}
        actions={[
          <div key="back" style={{ position: 'relative', zIndex: 1000 }}>
            <Link to="/attendance/weekly-holidays/templates" onClick={(e) => e.stopPropagation()}>
              <Button icon={<ArrowLeftOutlined />}>
                Back
              </Button>
            </Link>
          </div>,
        ]}
      />

      <Card className="crm-card">
        <Space wrap style={{ width: '100%', marginBottom: 12 }}>
          <Input placeholder="Search staff..." value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 260 }} />
          <Text type="secondary">Select staff below (frontend-only).</Text>
        </Space>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowSelection={{
            selectedRowKeys: assignedIds,
            onChange: (keys) => setAssignedIds(keys),
          }}
        />
      </Card>
    </div>
  );
}

