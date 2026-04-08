import { Card, Col, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const items = [
  { to: '/settings/payroll/cycle', title: 'Payroll Cycle', desc: 'Configure cycle type, start/end date, cutoff and payment date.' },
  { to: '/settings/payroll/attendance-calculation', title: 'Attendance Calculation', desc: 'How attendance impacts salary calculations.' },
  { to: '/settings/payroll/deduction-rules', title: 'Deduction Rules', desc: 'PF/ESI/tax and custom deductions.' },
  { to: '/settings/payroll/fine-calculation', title: 'Fine Calculation', desc: 'Late/early fine rules.' },
  { to: '/settings/payroll/processing-rules', title: 'Processing Rules', desc: 'Policies used during payroll processing.' },
  { to: '/settings/payroll/reimbursement-integration', title: 'Reimbursement Integration', desc: 'Connect reimbursement sources (stub).' },
];

export default function PayrollSettings() {
  return (
    <div>
      <PageHeader title="Payroll Settings" backTo="/settings" />
      <Row gutter={[16, 16]}>
        {items.map((it) => (
          <Col key={it.to} xs={24} md={12}>
            <Link to={it.to} style={{ textDecoration: 'none' }}>
              <Card className="crm-card" hoverable>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{it.title}</div>
                <Text type="secondary">{it.desc}</Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

