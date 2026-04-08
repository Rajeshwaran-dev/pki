import { useMemo, useState } from 'react';
import { Badge, Button, Card, Checkbox, Col, DatePicker, Divider, Input, Modal, Row, Segmented, Space, Tag, Typography, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, LeftOutlined, RightOutlined, UploadOutlined, FileTextOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';
import dayjs from 'dayjs';

const { Text } = Typography;

const demoEmployees = [
  { id: 'e-001', name: 'Boomi', employeeId: 'EXA0005', avatar: 'B' },
  { id: 'e-002', name: 'Dhanasekar', employeeId: 'EXA0006', avatar: 'D' },
];

export default function AdminAttendance() {
  const [selectedDate, setSelectedDate] = useState(() => dayjs('2026-04-08'));
  const [activeTab, setActiveTab] = useState('All');
  const [q, setQ] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [employeeStatus, setEmployeeStatus] = useState(() => ({
    'e-001': 'Pending',
    'e-002': 'Not Marked',
  }));

  const filteredEmployees = useMemo(() => {
    const query = q.trim().toLowerCase();
    const byQuery = query
      ? demoEmployees.filter(e => `${e.name} ${e.employeeId}`.toLowerCase().includes(query))
      : demoEmployees;

    if (activeTab === 'All') return byQuery;

    const tabToStatus = {
      Pending: ['Pending'],
      Present: ['Present'],
      'Half Day': ['Half Day'],
      Absent: ['Absent'],
      'On Leave': ['Leave'],
      Holiday: ['Holiday'],
    };
    const allowed = tabToStatus[activeTab] || [];
    return byQuery.filter(e => allowed.includes(employeeStatus[e.id] || 'Not Marked'));
  }, [q, activeTab, employeeStatus]);

  const stats = useMemo(() => {
    const values = Object.values(employeeStatus);
    const count = (s) => values.filter(v => v === s).length;
    return {
      present: count('Present'),
      absent: count('Absent'),
      punchedIn: 2,
      punchedOut: 2,
      onLeave: count('Leave'),
      holiday: count('Holiday'),
      notMarked: count('Not Marked'),
      pending: count('Pending'),
      total: values.length,
    };
  }, [employeeStatus]);

  const setStatusForEmployee = (employeeId, status) => {
    setEmployeeStatus(prev => ({ ...prev, [employeeId]: status }));
  };

  const view = (record) => {
    Modal.info({
      title: 'Attendance Details (demo)',
      content: (
        <div>
          <div style={{ fontWeight: 800 }}>{record.name} ({record.employeeId})</div>
          <div style={{ marginTop: 8 }}><b>Date:</b> {selectedDate.format('ddd, MMM D, YYYY')}</div>
          <div><b>Status:</b> {employeeStatus[record.id] || 'Not Marked'}</div>
        </div>
      ),
    });
  };

  return (
    <div>
      <PageHeader
        title="Employee Attendance"
        actions={[
          <Space key="date" size={8}>
            <Button icon={<LeftOutlined />} onClick={() => setSelectedDate(d => d.subtract(1, 'day'))} />
            <DatePicker value={selectedDate} onChange={(d) => setSelectedDate(d || dayjs())} />
            <Button icon={<RightOutlined />} onClick={() => setSelectedDate(d => d.add(1, 'day'))} />
          </Space>,
        ]}
      />

      <Card className="crm-card" style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: 700, display: 'block', marginBottom: 10 }}>Statistics</Text>
        <Row gutter={[12, 12]}>
          {[
            { label: 'Present', value: stats.present, color: '#52C41A', bg: 'rgba(82,196,26,0.08)' },
            { label: 'Absent', value: stats.absent, color: '#FF4D4F', bg: 'rgba(255,77,79,0.08)' },
            { label: 'Punched In', value: stats.punchedIn, color: '#FAAD14', bg: 'rgba(250,173,20,0.10)' },
            { label: 'Punched Out', value: stats.punchedOut, color: '#FAAD14', bg: 'rgba(250,173,20,0.10)' },
            { label: 'On Leave', value: stats.onLeave, color: '#FAAD14', bg: 'rgba(250,173,20,0.10)' },
            { label: 'Holiday', value: stats.holiday, color: '#FAAD14', bg: 'rgba(250,173,20,0.10)' },
            { label: 'Not Marked', value: stats.notMarked, color: '#FAAD14', bg: 'rgba(250,173,20,0.10)' },
            { label: 'Pending', value: stats.pending, color: '#FAAD14', bg: 'rgba(250,173,20,0.10)' },
          ].map((s) => (
            <Col key={s.label} xs={12} sm={8} md={6} lg={3}>
              <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10, padding: 10, background: s.bg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>{s.label}</Text>
                  <Text style={{ fontWeight: 800, color: s.color }}>{s.value}</Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Card className="crm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 800 }}>
            Attendance for {selectedDate.format('dddd, MMMM D, YYYY')}
          </div>
          <Space wrap>
            <Button icon={<DownloadOutlined />} onClick={() => message.info('Sample file not configured')}>Sample File</Button>
            <Button icon={<FileTextOutlined />} onClick={() => message.info('Daily report not configured')}>Daily Report</Button>
            <Button icon={<UploadOutlined />} onClick={() => message.info('Import not configured')}>Import Attendance</Button>
            <Button icon={<ReloadOutlined />} onClick={() => message.success('Refreshed')}>Refresh</Button>
          </Space>
        </div>

        <Divider style={{ margin: '14px 0' }} />

        <Segmented
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { label: <>All <Text type="secondary">({stats.total})</Text></>, value: 'All' },
            { label: <>Pending <Badge count={stats.pending} style={{ backgroundColor: '#faad14' }} /></>, value: 'Pending' },
            { label: <>Present <Badge count={stats.present} style={{ backgroundColor: '#52c41a' }} /></>, value: 'Present' },
            { label: <>Half Day</>, value: 'Half Day' },
            { label: <>Absent</>, value: 'Absent' },
            { label: <>On Leave</>, value: 'On Leave' },
            { label: <>Holiday</>, value: 'Holiday' },
          ]}
        />

        <div style={{ marginTop: 14 }}>
          <Input
            placeholder="Search by employee name or ID (case-insensitive)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <Checkbox
            checked={selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0}
            indeterminate={selectedIds.length > 0 && selectedIds.length < filteredEmployees.length}
            onChange={(e) => setSelectedIds(e.target.checked ? filteredEmployees.map(x => x.id) : [])}
          >
            Select All ({selectedIds.length} selected)
          </Checkbox>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(214,159,109,0.08)', border: '1px solid rgba(214,159,109,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Text style={{ fontWeight: 800, color: '#b07a45' }}>Standard Template</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>(10:00 – 19:00)</Text>
            </div>
            <Tag style={{ borderRadius: 999 }}>{demoEmployees.length} Employees</Tag>
          </div>

          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {filteredEmployees.map((e) => {
              const st = employeeStatus[e.id] || 'Not Marked';
              return (
                <div key={e.id} style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12, padding: 12, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {e.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{e.name}</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>{e.employeeId}</Text>
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {st === 'Not Marked' ? 'No punch record' : `Status: ${st}`}
                        </Text>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <a style={{ fontSize: 12 }} onClick={() => message.info('Add note not configured')}>Add Note</a>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button size="small" onClick={() => setStatusForEmployee(e.id, 'Present')} type={st === 'Present' ? 'primary' : 'default'}>
                      P <span style={{ marginLeft: 6 }}>Present</span>
                    </Button>
                    <Button size="small" onClick={() => setStatusForEmployee(e.id, 'Half Day')} type={st === 'Half Day' ? 'primary' : 'default'}>
                      HD <span style={{ marginLeft: 6 }}>Half Day</span>
                    </Button>
                    <Button size="small" onClick={() => setStatusForEmployee(e.id, 'Absent')} type={st === 'Absent' ? 'primary' : 'default'}>
                      A <span style={{ marginLeft: 6 }}>Absent</span>
                    </Button>
                    <Button size="small" onClick={() => setStatusForEmployee(e.id, 'Fine')}>
                      F <span style={{ marginLeft: 6 }}>Fine</span>
                    </Button>
                    <Button size="small" onClick={() => setStatusForEmployee(e.id, 'Leave')}>
                      L <span style={{ marginLeft: 6 }}>Leave</span>
                    </Button>
                    <Button size="small" onClick={() => setStatusForEmployee(e.id, 'Weekly Off')}>
                      WO <span style={{ marginLeft: 6 }}>Week Off</span>
                    </Button>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => view(e)} />
                    <Button size="small" icon={<CheckOutlined />} onClick={() => message.success('Approved')} />
                    <Button size="small" danger icon={<CloseOutlined />} onClick={() => message.success('Rejected')} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

