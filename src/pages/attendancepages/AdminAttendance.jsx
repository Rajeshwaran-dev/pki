import { useMemo, useState } from 'react';
import { Badge, Button, Card, Col, DatePicker, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const demoAttendance = [
  { id: 'ad-001', employee: 'Ramu', employeeId: 'EMP-001', designation: 'Site Manager', date: '2026-04-08', status: 'Pending', punchIn: '09:52', punchOut: '18:11', mode: 'Manual' },
  { id: 'ad-002', employee: 'Chandra Bose', employeeId: 'EMP-002', designation: 'Designer', date: '2026-04-08', status: 'Approved', punchIn: '10:03', punchOut: '18:25', mode: 'GPS' },
  { id: 'ad-003', employee: 'Sathish', employeeId: 'EMP-003', designation: 'Technician', date: '2026-04-08', status: 'Rejected', punchIn: '—', punchOut: '—', mode: '—' },
];

export default function AdminAttendance() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(demoAttendance);
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [date, setDate] = useState(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows
      .filter(r => (status === 'all' ? true : r.status === status))
      .filter(r => (query ? `${r.employee} ${r.employeeId} ${r.designation}`.toLowerCase().includes(query) : true));
  }, [rows, status, q]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter(r => r.status === 'Pending').length;
    const approved = rows.filter(r => r.status === 'Approved').length;
    const rejected = rows.filter(r => r.status === 'Rejected').length;
    return { total, pending, approved, rejected };
  }, [rows]);

  const approve = (id) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status: 'Approved' } : r)));
    message.success('Approved (frontend-only)');
  };

  const reject = (id) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status: 'Rejected' } : r)));
    message.success('Rejected (frontend-only)');
  };

  const view = (record) => {
    Modal.info({
      title: 'Attendance Details (demo)',
      content: (
        <div>
          <div style={{ fontWeight: 800 }}>{record.employee} ({record.employeeId})</div>
          <div style={{ marginTop: 8 }}><b>Date:</b> {record.date}</div>
          <div><b>Status:</b> {record.status}</div>
          <div><b>Punch:</b> {record.punchIn} → {record.punchOut}</div>
          <div><b>Mode:</b> {record.mode}</div>
          <div style={{ marginTop: 10, color: '#666' }}>This is frontend-only; connect API later.</div>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      render: (_v, r) => (
        <div>
          <div style={{ fontWeight: 800 }}>{r.employee}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.employeeId} · {r.designation}</Text>
        </div>
      ),
    },
    { title: 'Date', dataIndex: 'date', width: 120 },
    { title: 'In', dataIndex: 'punchIn', width: 90 },
    { title: 'Out', dataIndex: 'punchOut', width: 90 },
    { title: 'Mode', dataIndex: 'mode', width: 110, render: v => (v === 'GPS' ? <Tag color="blue">GPS</Tag> : <Tag>{v}</Tag>) },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: v => (
        <Tag color={v === 'Approved' ? 'success' : v === 'Rejected' ? 'error' : 'default'}>{v}</Tag>
      ),
    },
    {
      title: 'Actions',
      width: 220,
      render: (_v, r) => (
        <Space size={6}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => view(r)} />
          <Button
            size="small"
            icon={<CheckOutlined />}
            disabled={r.status === 'Approved'}
            onClick={() => approve(r.id)}
          >
            Approve
          </Button>
          <Button
            size="small"
            danger
            icon={<CloseOutlined />}
            disabled={r.status === 'Rejected'}
            onClick={() => reject(r.id)}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Attendance"
      
        actions={[
          <Button key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings/attendance')}>
            Attendance Settings
          </Button>,
        ]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card className="crm-card">
            <Text type="secondary">Total</Text>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.total}</div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="crm-card">
            <Text type="secondary">Pending</Text>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>
              <Badge count={stats.pending} style={{ backgroundColor: '#faad14' }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="crm-card">
            <Text type="secondary">Approved</Text>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.approved}</div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="crm-card">
            <Text type="secondary">Rejected</Text>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{stats.rejected}</div>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="crm-card" style={{ marginBottom: 16 }}>
            <Space wrap>
              <Input
                placeholder="Search employee / id..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ width: 260 }}
              />
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: 170 }}
                options={[
                  { value: 'all', label: 'All status' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Rejected', label: 'Rejected' },
                ]}
              />
              <DatePicker value={date} onChange={setDate} />
              <Text type="secondary">Date filter is UI-only right now.</Text>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="crm-card" styles={{ body: { padding: 0 } }}>
            <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10, showSizeChanger: false }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

