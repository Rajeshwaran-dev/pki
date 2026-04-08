import { useMemo, useState } from 'react';
import { Button, Card, Input, Space, Table, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const allStaff = [
  { id: 'st-001', name: 'Ramu', role: 'Site Manager', status: 'Active' },
  { id: 'st-002', name: 'Chandra Bose', role: 'Designer', status: 'Active' },
  { id: 'st-003', name: 'Sathish', role: 'Technician', status: 'Active' },
  { id: 'st-004', name: 'Sharmila', role: 'HR', status: 'Active' },
  { id: 'st-005', name: 'Thara', role: 'Admin', status: 'Active' },
];

export default function AttendanceTemplateStaff() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [query, setQuery] = useState('');
  const [assignedIds, setAssignedIds] = useState(['st-001', 'st-003']);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allStaff;
    return allStaff.filter(s => `${s.name} ${s.role}`.toLowerCase().includes(q));
  }, [query]);

  const data = filtered.map(s => ({
    ...s,
    assigned: assignedIds.includes(s.id),
  }));

  const columns = [
    {
      title: 'Staff',
      dataIndex: 'name',
      render: (_v, r) => (
        <div>
          <div style={{ fontWeight: 700 }}>{r.name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.role}</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: v => <Tag color={v === 'Active' ? 'success' : 'default'}>{v}</Tag>,
    },
    {
      title: 'Assigned',
      dataIndex: 'assigned',
      width: 140,
      render: v => (v ? <Tag color="blue">Assigned</Tag> : <Tag>Not assigned</Tag>),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Template Staff Assignment"
        subtitle={`Template: ${templateId}`}
        actions={[
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/attendance/templates')}>
            Back
          </Button>,
        ]}
      />

      <Card className="crm-card">
        <Space style={{ width: '100%', marginBottom: 12 }} wrap>
          <Input
            placeholder="Search staff..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <Button
            onClick={() => setAssignedIds(data.filter(d => !d.assigned).slice(0, 2).map(d => d.id).concat(assignedIds))}
          >
            Quick assign 2
          </Button>
          <Button onClick={() => setAssignedIds([])} danger>
            Clear all
          </Button>
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

