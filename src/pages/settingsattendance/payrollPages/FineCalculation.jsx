import { useState } from 'react';
import { Button, Card, Divider, Select, Switch, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text, Title } = Typography;

export default function FineCalculation() {
  const [enabled, setEnabled] = useState(true);
  const [applyInPayroll, setApplyInPayroll] = useState(true);
  const [method, setMethod] = useState('shift_based');

  return (
    <div>
      <PageHeader
        title="Fine Calculation Settings"
        subtitle="Configure how fines are calculated and applied in payroll based on attendance"
        backTo="/settings/payroll"
      />

      <Card className="crm-card">
        <Title level={5} style={{ marginTop: 0, fontSize: 18 }}>Fine Calculation Configuration</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 14 }}>
          Enable and configure automatic fine calculation for late arrivals and early exits
        </Text>

        <div style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Enable Fine Calculation</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Automatically calculate fines from attendance records</Text>
            </div>
            <Switch checked={enabled} onChange={setEnabled} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Apply Fines in Payroll</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Deduct calculated fines from employee payroll</Text>
            </div>
            <Switch checked={applyInPayroll} onChange={setApplyInPayroll} />
          </div>
        </div>

        <Divider style={{ margin: '18px 0' }} />

        <div>
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>Calculation Method</div>
          <Select
            value={method}
            onChange={setMethod}
            style={{ width: '100%', maxWidth: 520 }}
            options={[
              { value: 'shift_based', label: 'Shift-Based (Daily Salary ÷ Shift Hours × Late Hours)' },
              { value: 'fixed', label: 'Fixed (Flat amount per late/early event)' },
            ]}
          />
          <Text type="secondary" style={{ fontSize: 14, display: 'block', marginTop: 10 }}>
            Fine = (Daily Salary ÷ Shift Hours) × (Late Minutes ÷ 60). Example: if shift is 9 hours (10 AM – 7 PM),
            daily salary is ₹1000, hourly rate = ₹111.11/hour. For 60 minutes (1 hour) late: Fine = ₹111.11 × (60 ÷ 60) = ₹111.11
          </Text>
        </div>

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

