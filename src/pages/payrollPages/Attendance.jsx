import { useMemo, useState } from 'react';
import { Button, Card, DatePicker, Input, Space, Table, Tag, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const demoRows = [
  { id: 'att-001', employee: 'Ramu', date: '2026-04-01', status: 'Present', inTime: '09:45', outTime: '18:10', notes: '' },
  { id: 'att-002', employee: 'Chandra Bose', date: '2026-04-01', status: 'Present', inTime: '10:05', outTime: '18:22', notes: 'Late by 5 min' },
  { id: 'att-003', employee: 'Sathish', date: '2026-04-01', status: 'Absent', inTime: '-', outTime: '-', notes: '' },
];

export default function PayrollAttendance() {
  const [q, setQ] = useState('');
  const [date, setDate] = useState(null);

  const data = useMemo(() => {
    const query = q.trim().toLowerCase();
    return demoRows.filter(r => (query ? r.employee.toLowerCase().includes(query) : true));
  }, [q]);

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      render: v => <span style={{ fontWeight: 700 }}>{v}</span>,
    },
    { title: 'Date', dataIndex: 'date', width: 130 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      render: v => <Tag color={v === 'Present' ? 'success' : v === 'Half Day' ? 'gold' : 'default'}>{v}</Tag>,
    },
    { title: 'In', dataIndex: 'inTime', width: 90 },
    { title: 'Out', dataIndex: 'outTime', width: 90 },
    { title: 'Notes', dataIndex: 'notes', render: v => (v ? v : <Text type="secondary">—</Text>) },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance (Payroll)"
      
        actions={[
          <Button key="export" icon={<DownloadOutlined />} onClick={() => {}}>
            Export (stub)
          </Button>,
        ]}
      />

      <Card className="crm-card" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input placeholder="Search employee..." value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240 }} />
          <DatePicker value={date} onChange={setDate} />
        </Space>
      </Card>

      <Card className="crm-card" styles={{ body: { padding: 0 } }}>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 10, showSizeChanger: false }} />
      </Card>
    </div>
  );
}

