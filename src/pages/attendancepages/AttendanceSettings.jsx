import { Card, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

const items = [
  {
    key: 'templates',
    title: 'Attendance Templates',
    subtitle: '2 templates configured',
    to: '/attendance/templates',
  },
  {
    key: 'weekly',
    title: 'Weekly Holiday Templates',
    subtitle: '3 templates configured',
    to: '/attendance/weekly-holidays/templates',
  },
  {
    key: 'geo',
    title: 'Attendance Geofence Settings',
    subtitle: 'Location-based attendance',
    to: '/attendance/geofence',
  },
  {
    key: 'shift',
    title: 'Shift Settings',
    subtitle: '9 shifts configured',
    to: '/attendance/shift-settings',
  },
  {
    key: 'auto',
    title: 'Automation Rules',
    subtitle: 'Automation rules configured',
    to: '/attendance/automation-rules',
  },
];

export default function AttendanceSettings() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Attendance Settings" backTo="/settings" />

      <Card className="crm-card" styles={{ body: { padding: 14 } }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it) => (
            <div
              key={it.key}
              role="button"
              tabIndex={0}
              onClick={() => navigate(it.to)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate(it.to);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.6)',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{it.title}</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {it.subtitle}
                </Text>
              </div>
              <RightOutlined style={{ fontSize: 12, color: '#999' }} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

