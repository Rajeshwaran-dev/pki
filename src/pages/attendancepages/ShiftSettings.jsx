import { useState } from 'react';
import { Button, Card, Modal, Space, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

export default function ShiftSettings() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([
    {
      id: 'sh-001',
      name: 'General Shift',
      type: 'Standard',
      start: '10:00',
      end: '19:00',
      grace: '10 minutes',
      otBuffer: '60 min',
      extra: ['Half-Day On', 'Mid:14:00', 'Logout grace: 113min', 'Login grace: 30min'],
      assignedStaff: 29,
    },
    { id: 'sh-002', name: 'test', type: 'Standard', start: '09:01', end: '19:59', grace: '10 minutes', otBuffer: '0 min', extra: [], assignedStaff: 0 },
    { id: 'sh-003', name: 'test1', type: 'Standard', start: '08:00', end: '19:00', grace: '10 minutes', otBuffer: '0 min', extra: [], assignedStaff: 0 },
    { id: 'sh-004', name: 'test3', type: 'Rotational · 3 day cycle', pattern: 'D1:test · D2:test1 · D3:General Shift', assignedStaff: 0, extra: [] },
    { id: 'sh-005', name: 'OPEN', type: 'Open · 9h', otBuffer: '60 min', assignedStaff: 2, extra: [] },
  ]);

  const addShift = () => {
    setShifts(prev => [
      { id: `sh-${Date.now()}`, name: 'New Template', type: 'Standard', start: '10:00', end: '19:00', grace: '10 minutes', otBuffer: '0 min', extra: [], assignedStaff: 0 },
      ...prev,
    ]);
    message.success('New template added');
  };

  const editShift = (s) => {
    Modal.info({
      title: `Edit — ${s.name}`,
      content: <Text type="secondary">Edit screen can be wired later. This is a UI placeholder.</Text>,
    });
  };

  const deleteShift = (s) => {
    Modal.confirm({
      title: `Delete "${s.name}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        setShifts(prev => prev.filter(x => x.id !== s.id));
        message.success('Deleted');
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Shift Templates"
        subtitle="Manage employee shift timings and assigned staff."
        backTo="/settings/attendance"
        actions={[
          <Button key="new" type="primary" icon={<PlusOutlined />} onClick={addShift}>
            New Template
          </Button>,
        ]}
      />

      <div style={{ display: 'grid', gap: 14 }}>
        {shifts.map((s) => (
          <Card
            key={s.id}
            className="crm-card"
            styles={{ body: { padding: 16 } }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(214,159,109,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ClockCircleOutlined />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: 800 }}>{s.name}</div>
                  </div>

                  <div style={{ marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap', color: '#666', fontSize: 12 }}>
                    <span>{s.type}</span>
                    {s.start && s.end ? <span>{s.start} – {s.end}</span> : null}
                    {s.grace ? <span>Grace: {s.grace}</span> : null}
                    {s.otBuffer ? <span>OT buffer: {s.otBuffer}</span> : null}
                  </div>

                  {s.extra?.length ? (
                    <div style={{ marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12 }}>
                      {s.extra.map((e) => (
                        <Tag key={e} style={{ borderRadius: 999 }}>{e}</Tag>
                      ))}
                    </div>
                  ) : null}

                  {s.pattern ? (
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      <b>Pattern:</b> <Text type="secondary">{s.pattern}</Text>
                    </div>
                  ) : null}

                  {typeof s.assignedStaff === 'number' ? (
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      <Text style={{ color: '#D69F6D', fontWeight: 700 }}>Assigned staff: {s.assignedStaff}</Text>
                    </div>
                  ) : null}
                </div>
              </div>

              <Space>
                <Button size="small" onClick={() => editShift(s)} icon={<EditOutlined />}>
                  Edit
                </Button>
                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => deleteShift(s)} />
              </Space>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

