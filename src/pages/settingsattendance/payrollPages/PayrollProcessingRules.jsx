import { useState } from 'react';
import { Button, Card, Divider, InputNumber, Switch, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text, Title } = Typography;

export default function PayrollProcessingRules() {
  const [autoProcess, setAutoProcess] = useState(true);
  const [processingDate, setProcessingDate] = useState(7);
  const [allowManualAdjustments, setAllowManualAdjustments] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(true);

  return (
    <div>
      <PageHeader
        title="Payroll Processing Rules"
        subtitle="Configure how payroll is processed and automated"
        backTo="/settings/payroll"
      />

      <Card className="crm-card">
        <Title level={5} style={{ marginTop: 0, fontSize: 18 }}>Processing Configuration</Title>

        <div style={{ display: 'grid', gap: 14, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Auto-Process Payroll</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Automatically process payroll on the scheduled date</Text>
            </div>
            <Switch checked={autoProcess} onChange={setAutoProcess} />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Payroll Processing Date</div>
            <Text type="secondary" style={{ fontSize: 14 }}>Day of the month when payroll should be processed (1–28)</Text>
            <div style={{ marginTop: 8, maxWidth: 520 }}>
              <InputNumber min={1} max={28} value={processingDate} onChange={(v) => setProcessingDate(Number(v || 1))} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Allow Manual Adjustments</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Allow HR to manually adjust payroll before processing</Text>
            </div>
            <Switch checked={allowManualAdjustments} onChange={setAllowManualAdjustments} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Require Approval</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Require manager approval before finalizing payroll</Text>
            </div>
            <Switch checked={requireApproval} onChange={setRequireApproval} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Notify on Completion</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Send notifications when payroll processing is complete</Text>
            </div>
            <Switch checked={notifyOnCompletion} onChange={setNotifyOnCompletion} />
          </div>
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

