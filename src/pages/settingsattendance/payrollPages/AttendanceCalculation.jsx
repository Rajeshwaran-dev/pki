import { useState } from 'react';
import { Button, Card, Divider, Radio, Switch, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text, Title } = Typography;

export default function AttendanceCalculation() {
  const [enabled, setEnabled] = useState(true);
  const [method, setMethod] = useState('prorated');
  const [includeHalfDays, setIncludeHalfDays] = useState(true);
  const [includeLeaves, setIncludeLeaves] = useState(false);

  return (
    <div>
      <PageHeader
        title="Attendance-Based Calculation"
        subtitle="Configure how attendance affects payroll calculations"
        backTo="/settings/payroll"
      />

      <Card className="crm-card">
        <Title level={5} style={{ marginTop: 0, fontSize: 18 }}>Calculation Settings</Title>

        <div style={{ display: 'grid', gap: 14, marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Enable Attendance-Based Calculation</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Calculate salary based on present days</Text>
            </div>
            <Switch checked={enabled} onChange={setEnabled} />
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>Calculation Method</div>
            <Radio.Group value={method} onChange={(e) => setMethod(e.target.value)}>
              <div style={{ display: 'grid', gap: 6 }}>
                <Radio value="prorated">Prorated (Salary × Present Days / Working Days)</Radio>
                <Radio value="full">Full Month</Radio>
                <Radio value="custom">Custom Formula</Radio>
              </div>
            </Radio.Group>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Include Half Days</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Count half days in attendance calculation</Text>
            </div>
            <Switch checked={includeHalfDays} onChange={setIncludeHalfDays} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Include Approved Leaves</div>
              <Text type="secondary" style={{ fontSize: 14 }}>Count approved leave days as present days</Text>
            </div>
            <Switch checked={includeLeaves} onChange={setIncludeLeaves} />
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

