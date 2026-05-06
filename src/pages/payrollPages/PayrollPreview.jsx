import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function PayrollPreview() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const payrollId = params.get('payrollId') || 'pr-001';

  const demo = {
    id: payrollId,
    employee: 'Ramu',
    designation: 'Site Manager',
    month: 4,
    year: 2026,
    status: 'Pending',
    earnings: [
      { label: 'Basic', amount: 30000 },
      { label: 'HRA', amount: 12000 },
      { label: 'Other', amount: 10000 },
    ],
    deductions: [
      { label: 'PF', amount: 2000 },
      { label: 'ESI', amount: 1200 },
      { label: 'Fine', amount: 1000 },
    ],
  };

  const gross = demo.earnings.reduce((s, e) => s + e.amount, 0);
  const ded = demo.deductions.reduce((s, d) => s + d.amount, 0);
  const net = gross - ded;

  return (
    <div>
      <PageHeader
        title="Payroll Preview"
      
        actions={[
          <div key="back" style={{ position: 'relative', zIndex: 1000 }}>
            <Link to="/payroll" onClick={(e) => e.stopPropagation()}>
              <Button icon={<ArrowLeftOutlined />}>
                Back
              </Button>
            </Link>
          </div>,
          <Button key="download" icon={<DownloadOutlined />} onClick={() => {}}>
            Download (stub)
          </Button>,
        ]}
      />

      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card className="crm-card">
          <Space wrap>
            <Tag color="blue">{demo.month}/{demo.year}</Tag>
            <Tag color={demo.status === 'Paid' ? 'success' : demo.status === 'Processed' ? 'blue' : 'default'}>
              {demo.status}
            </Tag>
            <Text type="secondary">Payroll ID: {demo.id}</Text>
          </Space>
          <Descriptions column={2} style={{ marginTop: 12 }}>
            <Descriptions.Item label="Employee">{demo.employee}</Descriptions.Item>
            <Descriptions.Item label="Designation">{demo.designation}</Descriptions.Item>
            <Descriptions.Item label="Gross">{formatINR(gross)}</Descriptions.Item>
            <Descriptions.Item label="Deductions">{formatINR(ded)}</Descriptions.Item>
            <Descriptions.Item label="Net Pay">{formatINR(net)}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="crm-card" title="Earnings">
          <Descriptions column={2}>
            {demo.earnings.map((e) => (
              <Descriptions.Item key={e.label} label={e.label}>{formatINR(e.amount)}</Descriptions.Item>
            ))}
          </Descriptions>
        </Card>

        <Card className="crm-card" title="Deductions">
          <Descriptions column={2}>
            {demo.deductions.map((d) => (
              <Descriptions.Item key={d.label} label={d.label}>{formatINR(d.amount)}</Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
}

