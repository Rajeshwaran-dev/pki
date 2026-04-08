import { useMemo, useState } from 'react';
import { Button, Card, Input, Modal, Space, Tag, Typography, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { useAppSelector } from '@/store';

const { Text } = Typography;

const demo = [
  { id: 'wh-001', name: 'TUESDAY CHECK', active: true, createdBy: 'Boomi', assignedStaffCount: 1, pattern: 'Standard', daysOff: '1 Day(s) Off' },
  { id: 'wh-002', name: 'SINGLE LEAVE TEMPLATE', active: true, createdBy: 'Boomi', assignedStaffCount: 1, pattern: 'Standard', daysOff: '1 Day(s) Off' },
  { id: 'wh-003', name: 'ODD EVEN PATTERN', active: true, createdBy: 'Boomi', assignedStaffCount: 13, pattern: 'Odd/Even Saturday', daysOff: '' },
];

export default function WeeklyHolidayTemplates() {
  const navigate = useNavigate();
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';
  const borderColor = isDark ? '#1a4d72' : 'rgba(0,0,0,0.06)';
  const tileBg = isDark ? '#0d3554' : 'rgba(255,255,255,0.6)';
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(demo);

  const data = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(r => r.name.toLowerCase().includes(query));
  }, [q, rows]);

  return (
    <div>
      <PageHeader
        title="Weekly Holiday Templates"
        backTo="/settings/attendance"
        subtitle="Configure weekly off patterns and assign to staff members"
        actions={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setRows(prev => [
                { id: `wh-${Date.now()}`, name: 'NEW TEMPLATE', active: true, createdBy: 'Boomi', assignedStaffCount: 0, pattern: 'Standard', daysOff: '1 Day(s) Off' },
                ...prev,
              ]);
              message.success('Template created');
            }}
          >
            New Template
          </Button>,
        ]}
      />

      {/* <Card className="crm-card" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input placeholder="Search templates..." value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 260 }} />
          <Text type="secondary">Assign staff from each template row.</Text>
        </Space>
      </Card> */}

      <Card className="crm-card">
        <div style={{ display: 'grid', gap: 12 }}>
          {data.map((t) => (
            <div
              key={t.id}
              style={{
                border: `1px solid ${borderColor}`,
                borderRadius: 12,
                padding: 14,
                background: tileBg,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 800 }}>{t.name}</div>
                  {t.active ? (
                    <Tag color="success" style={{ borderRadius: 999 }}>Active</Tag>
                  ) : (
                    <Tag style={{ borderRadius: 999 }}>Inactive</Tag>
                  )}
                </div>

                <div style={{ marginTop: 6, fontSize: 12 }}>
                  <Text type="secondary">
                    Created By: {t.createdBy || '—'} |{' '}
                    <a onClick={() => navigate(`/attendance/weekly-holidays/templates/${t.id}/staff`)}>
                      Assigned Staff: {t.assignedStaffCount || 0} Staffs
                    </a>
                  </Text>
                </div>

                <div style={{ marginTop: 10, display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12 }}>
                  <div>
                    <Text type="secondary"><b>Pattern:</b> {t.pattern || '—'}</Text>
                  </div>
                  {t.daysOff ? (
                    <div>
                      <Text type="secondary"><b>{t.daysOff}</b></Text>
                    </div>
                  ) : null}
                </div>
              </div>

              <Space>
                <Button icon={<EditOutlined />} onClick={() => message.info('Edit is not configured yet')}>
                  Edit
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: 'Delete template?',
                      okText: 'Delete',
                      okButtonProps: { danger: true },
                      onOk: () => {
                        setRows(prev => prev.filter(x => x.id !== t.id));
                        message.success('Deleted');
                      },
                    });
                  }}
                />
              </Space>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

