import { useState } from 'react';
import { Button, Card, Divider, Switch, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

export default function AutomationRules() {
  const [autoMarkAbsent, setAutoMarkAbsent] = useState(false);
  const [autoMarkHalfDay, setAutoMarkHalfDay] = useState(false);
  const [allowWeeklyOffAttendance, setAllowWeeklyOffAttendance] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  return (
    <div>
      <PageHeader
        title="Automation Rules"
        backTo="/settings/attendance"
        subtitle="Set rules for late entry, early exit, breaks & overtime based on punch-in and punch-out time."
      />

      <Card className="crm-card" styles={{ body: { padding: 0 } }}>
        <div style={{ padding: 18 }}>
          {[
            {
              label: 'Auto Mark Absent',
              help: "Automatically mark employees as absent if they don't punch in by a certain time",
              value: autoMarkAbsent,
              onChange: setAutoMarkAbsent,
            },
            {
              label: 'Auto Mark Half Day',
              help: 'Automatically mark employees as half day if they work less than required hours',
              value: autoMarkHalfDay,
              onChange: setAutoMarkHalfDay,
            },
            {
              label: 'Allow Attendance on Weekly Off',
              help: 'Allow employees to mark attendance even on weekly off days',
              value: allowWeeklyOffAttendance,
              onChange: setAllowWeeklyOffAttendance,
            },
          ].map((r, idx) => (
            <div key={r.label}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>{r.label}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{r.help}</Text>
                </div>
                <Switch checked={r.value} onChange={r.onChange} />
              </div>
              {idx !== 2 && <Divider style={{ margin: '16px 0' }} />}
            </div>
          ))}
        </div>

        <Divider style={{ margin: 0 }} />
        <div style={{ padding: 14, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button
            onClick={() => {
              setAutoMarkAbsent(false);
              setAutoMarkHalfDay(false);
              setAllowWeeklyOffAttendance(false);
              message.info('Changes cleared');
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => {
              setLastSaved(new Date());
              message.success('Saved');
            }}
          >
            Save Rules
          </Button>
        </div>
      </Card>

      {lastSaved && (
        <div style={{ marginTop: 10 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Last saved: {lastSaved.toLocaleString()}
          </Text>
        </div>
      )}
    </div>
  );
}

