import { useState } from 'react';
import { Button, Card, Divider, Switch, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text, Title } = Typography;

export default function DeductionRules() {
  const [autoPf, setAutoPf] = useState(true);
  const [autoEsi, setAutoEsi] = useState(true);
  const [autoTax, setAutoTax] = useState(false);
  const [applyLateFines, setApplyLateFines] = useState(true);
  const [applyAbsentDeductions, setApplyAbsentDeductions] = useState(true);

  return (
    <div>
      <PageHeader
        title="Deduction Rules"
        subtitle="Configure automatic deduction calculations"
        backTo="/settings/payroll"
      />

      <Card className="crm-card">
        <Title level={5} style={{ marginTop: 0 }}>Deduction Configuration</Title>

        <div style={{ display: 'grid', gap: 14 }}>
          {[
            { label: 'Auto-Calculate PF', help: 'Automatically calculate Provident Fund deductions', value: autoPf, onChange: setAutoPf },
            { label: 'Auto-Calculate ESI', help: 'Automatically calculate Employee State Insurance', value: autoEsi, onChange: setAutoEsi },
            { label: 'Auto-Calculate Tax', help: 'Automatically calculate income tax (TDS)', value: autoTax, onChange: setAutoTax },
            { label: 'Apply Late Fines', help: 'Deduct fines for late attendance', value: applyLateFines, onChange: setApplyLateFines },
            { label: 'Apply Absent Deductions', help: 'Deduct salary for absent days', value: applyAbsentDeductions, onChange: setApplyAbsentDeductions },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>{row.label}</div>
                <Text type="secondary" style={{ fontSize: 12 }}>{row.help}</Text>
              </div>
              <Switch checked={row.value} onChange={row.onChange} />
            </div>
          ))}
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

