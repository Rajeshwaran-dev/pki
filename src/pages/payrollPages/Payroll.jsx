import { useMemo, useState } from 'react';
import { Button, Card, Col, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  SendOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i).toLocaleString('default', { month: 'long' }),
}));

const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { value: y, label: String(y) };
});

const demoPayrolls = [
  { id: 'pr-001', employee: 'Ramu', designation: 'Site Manager', gross: 52000, deductions: 4200, net: 47800, status: 'Pending', month: 4, year: 2026 },
  { id: 'pr-002', employee: 'Chandra Bose', designation: 'Designer', gross: 48000, deductions: 3600, net: 44400, status: 'Processed', month: 4, year: 2026 },
  { id: 'pr-003', employee: 'Sathish', designation: 'Technician', gross: 36000, deductions: 2200, net: 33800, status: 'Paid', month: 4, year: 2026 },
];

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function makeSamplePayrollRows(targetMonth, targetYear) {
  const base = [
    { id: 'pr-s1', employee: 'Ramu', designation: 'Site Manager', gross: 52000, deductions: 4200, net: 47800, status: 'Pending' },
    { id: 'pr-s2', employee: 'Chandra Bose', designation: 'Designer', gross: 48000, deductions: 3600, net: 44400, status: 'Processed' },
  ];
  return base.map((r) => ({ ...r, month: targetMonth, year: targetYear }));
}

export default function Payroll() {
  const navigate = useNavigate();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(() => makeSamplePayrollRows(now.getMonth() + 1, now.getFullYear()));

  const [generateOpen, setGenerateOpen] = useState(false);
  const [bulkGenerateOpen, setBulkGenerateOpen] = useState(false);

  const filtered = useMemo(() => {
    return rows
      .filter(r => r.month === month && r.year === year)
      .filter(r => (status === 'all' ? true : r.status === status))
      .filter(r => (q.trim() ? `${r.employee} ${r.designation}`.toLowerCase().includes(q.trim().toLowerCase()) : true));
  }, [rows, month, year, status, q]);

  const totals = useMemo(() => {
    const scope = rows.filter(r => r.month === month && r.year === year);
    const grossSalary = scope.reduce((s, r) => s + (Number(r.gross) || 0), 0);
    const deductions = scope.reduce((s, r) => s + (Number(r.deductions) || 0), 0);
    const netPayable = scope.reduce((s, r) => s + (Number(r.net) || 0), 0);
    const processed = scope.filter(r => r.status === 'Processed').length;
    const pending = scope.filter(r => r.status === 'Pending').length;
    const paid = scope.filter(r => r.status === 'Paid').length;
    return { grossSalary, deductions, netPayable, processed, pending, paid, totalEmployees: scope.length };
  }, [rows, month, year]);

  const markAsPaid = (id) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status: 'Paid' } : r)));
    message.success('Marked as paid (frontend-only)');
  };

  const processPayroll = () => {
    setRows(prev => prev.map(r => (r.month === month && r.year === year && r.status === 'Pending' ? { ...r, status: 'Processed' } : r)));
    message.success('Processed payroll (frontend-only)');
  };

  const exportPayroll = () => {
    message.info('Export is stubbed (frontend-only)');
  };

  const generateSingle = () => {
    setGenerateOpen(false);
    setRows(prev => [...makeSamplePayrollRows(month, year), ...prev].slice(0, 50));
    message.success('Generated payroll (demo)');
  };

  const generateBulk = () => {
    setBulkGenerateOpen(false);
    setRows(prev => [...demoPayrolls.map(r => ({ ...r, month, year })), ...prev].slice(0, 50));
    message.success('Bulk generated payroll (demo)');
  };

  const editPayroll = (record) => {
    Modal.info({
      title: 'Edit payroll (demo)',
      content: (
        <div>
          <div><b>{record.employee}</b> · {record.designation}</div>
          <div style={{ marginTop: 8 }}>This screen is frontend-only. Hook up backend later if needed.</div>
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
          <div style={{ fontWeight: 700 }}>{r.employee}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.designation || '—'}</Text>
        </div>
      ),
    },
    { title: 'Gross', dataIndex: 'gross', width: 130, align: 'right', render: v => formatINR(v) },
    { title: 'Deductions', dataIndex: 'deductions', width: 130, align: 'right', render: v => formatINR(v) },
    { title: 'Net Pay', dataIndex: 'net', width: 130, align: 'right', render: v => <span style={{ fontWeight: 800 }}>{formatINR(v)}</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: v => (
        <Tag color={v === 'Paid' ? 'success' : v === 'Processed' ? 'blue' : 'default'}>{v}</Tag>
      ),
    },
    {
      title: 'Actions',
      width: 180,
      render: (_v, r) => (
        <Space size={6}>
          <Button size="small" icon={<FileTextOutlined />} onClick={() => navigate(`/payroll/preview?payrollId=${r.id}`)}>
            Preview
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => editPayroll(r)} />
          {r.status !== 'Paid' && (
            <Button size="small" onClick={() => markAsPaid(r.id)}>
              Mark paid
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payroll Management"
        actions={[
          <Button key="export" icon={<DownloadOutlined />} onClick={exportPayroll}>
            Export
          </Button>,
          <Button key="bulk" icon={<TeamOutlined />} onClick={() => setBulkGenerateOpen(true)}>
            Bulk Generate
          </Button>,
          <Button key="gen" icon={<PlusOutlined />} onClick={() => setGenerateOpen(true)}>
            Generate
          </Button>,
          <Button key="process" type="primary" icon={<SendOutlined />} onClick={processPayroll}>
            Process
          </Button>,
        ]}
      />

      <Row gutter={[16, 16]}>
        {/* Filters */}
        <Col span={24}>
          <Card className="crm-card">
            <Row gutter={[16, 12]}>
              <Col xs={24} sm={12} md={6}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Month</div>
                <Select value={month} onChange={setMonth} options={monthOptions} style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Year</div>
                <Select value={year} onChange={setYear} options={yearOptions} style={{ width: '100%' }} />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Status</div>
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Processed', label: 'Processed' },
                    { value: 'Paid', label: 'Paid' },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Search</div>
                <Input
                  placeholder="Search by employee name or ID..."
                  prefix={<SearchOutlined />}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Metrics */}
        <Col xs={24} sm={12} md={6}>
          <Card className="crm-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="secondary">Gross Salary</Text>
              <Text type="secondary">₹</Text>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8 }}>{formatINR(totals.grossSalary)}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>This month</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="crm-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="secondary">Deductions</Text>
              <Text type="secondary">₹</Text>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8 }}>{formatINR(totals.deductions)}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>PF, ESI, Tax</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="crm-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="secondary">Net Payable</Text>
              <CheckCircleOutlined style={{ color: '#999' }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8 }}>{formatINR(totals.netPayable)}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>Ready to disburse</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="crm-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="secondary">Processed</Text>
              <ClockCircleOutlined style={{ color: '#999' }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8 }}>{totals.processed}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>Out of {totals.totalEmployees}</Text>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="crm-card" title="Employee Payroll Details" styles={{ body: { padding: 0 } }}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filtered}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              locale={{
                emptyText: (
                  <div style={{ padding: '34px 0', color: '#999' }}>
                    No payroll records found
                  </div>
                ),
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Generate dialogs (frontend-only) */}
      <Modal
        title="Generate Payroll"
        open={generateOpen}
        onCancel={() => setGenerateOpen(false)}
        onOk={generateSingle}
        okText="Generate"
      >
        <Text type="secondary">This is a demo dialog. Clicking Generate will add sample rows.</Text>
      </Modal>

      <Modal
        title="Bulk Generate Payroll"
        open={bulkGenerateOpen}
        onCancel={() => setBulkGenerateOpen(false)}
        onOk={generateBulk}
        okText="Generate"
      >
        <Text type="secondary">This is a demo dialog. Clicking Generate will add sample rows.</Text>
      </Modal>
    </div>
  );
}

