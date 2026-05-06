import { useState } from 'react';
import { Button, Card, Col, Divider, InputNumber, Row, Select, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text, Title } = Typography;

export default function PayrollCycle() {
  const [cycleType, setCycleType] = useState('monthly');
  const [startDate, setStartDate] = useState(1);
  const [endDate, setEndDate] = useState(30);
  const [paymentDate, setPaymentDate] = useState(5);
  const [cutoffDate, setCutoffDate] = useState(25);

  return (
    <div>
      <PageHeader
        title="Payroll Cycle Configuration"
        subtitle="Configure payroll processing dates and cycles"
        backTo="/settings/payroll"
      />

      <Card className="crm-card">
        <Title level={5} style={{ marginTop: 0, fontSize: 18 }}>Cycle Settings</Title>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>Payroll Cycle Type</div>
          <Select
            value={cycleType}
            onChange={setCycleType}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'biweekly', label: 'Bi-weekly' },
              { value: 'weekly', label: 'Weekly' },
            ]}
            style={{ width: '100%', maxWidth: 520 }}
          />
        </div>

        <Row gutter={[16, 16]} style={{ marginTop: 14 }}>
          <Col xs={24} md={12}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Cycle Start Date</div>
            <Text type="secondary" style={{ fontSize: 14 }}>Day of month</Text>
            <InputNumber
              min={1}
              max={31}
              value={startDate}
              onChange={(v) => setStartDate(Number(v || 1))}
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Cycle End Date</div>
            <Text type="secondary" style={{ fontSize: 14 }}>Day of month</Text>
            <InputNumber
              min={1}
              max={31}
              value={endDate}
              onChange={(v) => setEndDate(Number(v || 30))}
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Payment Date</div>
            <Text type="secondary" style={{ fontSize: 14 }}>Day of month when salary is paid</Text>
            <InputNumber
              min={1}
              max={31}
              value={paymentDate}
              onChange={(v) => setPaymentDate(Number(v || 5))}
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Cutoff Date</div>
            <Text type="secondary" style={{ fontSize: 14 }}>Last day for attendance/data inclusion</Text>
            <InputNumber
              min={1}
              max={31}
              value={cutoffDate}
              onChange={(v) => setCutoffDate(Number(v || 25))}
              style={{ width: '100%', marginTop: 8 }}
            />
          </Col>
        </Row>

        <Divider style={{ margin: '18px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('Saved changes (frontend-only)')}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}

