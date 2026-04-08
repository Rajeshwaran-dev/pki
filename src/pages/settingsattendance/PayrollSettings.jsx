import { Card, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { useAppSelector } from '@/store';

const { Text } = Typography;

const items = [
  {
    to: '/settings/payroll/processing-rules',
    title: 'Payroll Processing Rules',
    desc: 'Configure payroll processing rules and settings',
  },
  {
    to: '/settings/payroll/attendance-calculation',
    title: 'Attendance-Based Calculation',
    desc: 'Configure how attendance affects payroll',
  },
  {
    to: '/settings/payroll/cycle',
    title: 'Payroll Cycle Configuration',
    desc: 'Set payroll processing dates and cycles',
  },
  {
    to: '/settings/payroll/deduction-rules',
    title: 'Deduction Rules',
    desc: 'Configure automatic deductions',
  },
  {
    to: '/settings/payroll/fine-calculation',
    title: 'Fine Calculation',
    desc: 'Configure attendance-based fine calculation and rules',
  },
  {
    to: '/settings/payroll/reimbursement-integration',
    title: 'Reimbursement Integration',
    desc: 'Configure expense claim processing in payroll',
  },
];

export default function PayrollSettings() {
  const navigate = useNavigate();
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';
  const borderColor = isDark ? '#1a4d72' : 'rgba(0,0,0,0.06)';
  const rowBg = isDark ? '#0d3554' : 'rgba(255,255,255,0.85)';
  const rowHoverBg = isDark ? '#0e2f49' : 'rgba(214, 159, 109, 0.06)';
  const chevronColor = isDark ? '#a8b0ba' : '#999';

  return (
    <div>
      <PageHeader title="Payroll Settings" backTo="/settings" />
      <Card className="crm-card" styles={{ body: { padding: 14 } }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it) => (
            <div
              key={it.to}
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
                gap: 12,
                padding: '14px 16px',
                borderRadius: 12,
                border: `1px solid ${borderColor}`,
                background: rowBg,
                cursor: 'pointer',
                transition: 'background 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = rowHoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = rowBg; }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{it.title}</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {it.desc}
                </Text>
              </div>
              <RightOutlined style={{ fontSize: 12, color: chevronColor }} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

