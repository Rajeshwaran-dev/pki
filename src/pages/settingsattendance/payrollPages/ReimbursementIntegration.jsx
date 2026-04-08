import { useState } from 'react';
import { Button, Card, Divider, Form, Input, Space, Switch, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text, Title } = Typography;

export default function ReimbursementIntegration() {
  const [enabled, setEnabled] = useState(true);
  const [autoIncludeApproved, setAutoIncludeApproved] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [includeInGross, setIncludeInGross] = useState(true);
  const [taxDeductible, setTaxDeductible] = useState(false);

  return (
    <div>
      <PageHeader
        title="Reimbursement Integration"
        subtitle="Configure how expense claims are processed in payroll"
        backTo="/settings/payroll"
      />

      <Card className="crm-card">
        <Title level={5} style={{ marginTop: 0 }}>Integration Settings</Title>
        <div style={{ display: 'grid', gap: 14 }}>
          {[
            {
              label: 'Enable Reimbursement Integration',
              help: 'Include approved expense claims in payroll',
              value: enabled,
              onChange: setEnabled,
            },
            {
              label: 'Auto-Include Approved Claims',
              help: 'Automatically add approved claims to payroll',
              value: autoIncludeApproved,
              onChange: setAutoIncludeApproved,
            },
            {
              label: 'Require Approval',
              help: 'Only include claims that have been approved',
              value: requireApproval,
              onChange: setRequireApproval,
            },
            {
              label: 'Include in Gross Salary',
              help: 'Add reimbursements to gross salary calculation',
              value: includeInGross,
              onChange: setIncludeInGross,
            },
            {
              label: 'Tax Deductible',
              help: 'Reimbursements are subject to tax deduction',
              value: taxDeductible,
              onChange: setTaxDeductible,
            },
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

