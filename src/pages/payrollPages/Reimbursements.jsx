import { useMemo, useState } from 'react';
import { Button, Card, Input, Space, Table, Tag, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const demo = [
  { id: 'rb-001', employee: 'Ramu', type: 'Travel', amount: 850, status: 'Pending' },
  { id: 'rb-002', employee: 'Chandra Bose', type: 'Food', amount: 320, status: 'Approved' },
];

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Reimbursements() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(demo);

  const data = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(r => `${r.employee} ${r.type}`.toLowerCase().includes(query));
  }, [q, rows]);

  const columns = [
    { title: 'Employee', dataIndex: 'employee', render: v => <span style={{ fontWeight: 700 }}>{v}</span> },
    { title: 'Type', dataIndex: 'type', width: 140 },
    { title: 'Amount', dataIndex: 'amount', width: 120, align: 'right', render: v => formatINR(v) },
    { title: 'Status', dataIndex: 'status', width: 120, render: v => <Tag color={v === 'Approved' ? 'success' : 'default'}>{v}</Tag> },
  ];

  return (
    <div>
      <PageHeader
        title="Reimbursements"
      
        actions={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setRows(prev => [{ id: `rb-${Date.now()}`, employee: 'New Employee', type: 'Other', amount: 0, status: 'Pending' }, ...prev]);
              message.success('Added a demo reimbursement');
            }}
          >
            Add
          </Button>,
        ]}
      />

      <Card className="crm-card" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240 }} />
          <Text type="secondary">Hook backend later if required.</Text>
        </Space>
      </Card>

      <Card className="crm-card" styles={{ body: { padding: 0 } }}>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 10, showSizeChanger: false }} />
      </Card>
    </div>
  );
}

