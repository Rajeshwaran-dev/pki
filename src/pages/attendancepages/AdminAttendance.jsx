import { useMemo, useState } from 'react';
import { Badge, Button, Card, Checkbox, Col, DatePicker, Divider, Input, Modal, Row, Segmented, Space, Tag, Typography, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, LeftOutlined, RightOutlined, UploadOutlined, FileTextOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';
import dayjs from 'dayjs';
import { useAppSelector } from '@/store';

const { Text } = Typography;

const demoEmployees = [
  { id: 'e-001', name: 'Boomi', employeeId: 'EXA0005', role: 'IT', avatar: 'B' },
  { id: 'e-002', name: 'Dhanasekar', employeeId: 'EXM00002', role: 'BackEnd', avatar: 'D' },
  { id: 'e-003', name: 'Akash', employeeId: 'EXA0007', role: 'Designer', avatar: 'A' },
  { id: 'e-004', name: 'Priya', employeeId: 'EXA0008', role: 'HR', avatar: 'P' },
  { id: 'e-005', name: 'Karthik', employeeId: 'EXA0009', role: 'Engineer', avatar: 'K' },
  { id: 'e-006', name: 'Vijay', employeeId: 'EXA0010', role: 'Supervisor', avatar: 'V' },
  { id: 'e-007', name: 'Meena', employeeId: 'EXA0011', role: 'Accounts', avatar: 'M' },
  { id: 'e-008', name: 'Ramesh', employeeId: 'EXA0012', role: 'Technician', avatar: 'R' },
  { id: 'e-009', name: 'Nithya', employeeId: 'EXA0013', role: 'Architect', avatar: 'N' },
  { id: 'e-010', name: 'Suresh', employeeId: 'EXA0014', role: 'Site Engineer', avatar: 'S' },
  { id: 'e-011', name: 'Divya', employeeId: 'EXA0015', role: 'Support', avatar: 'D' },
  { id: 'e-012', name: 'Arun', employeeId: 'EXA0016', role: 'Planner', avatar: 'A' },
  { id: 'e-013', name: 'Lakshmi', employeeId: 'EXA0017', role: 'Designer', avatar: 'L' },
  { id: 'e-014', name: 'Gopi', employeeId: 'EXA0018', role: 'Foreman', avatar: 'G' },
  { id: 'e-015', name: 'Anand', employeeId: 'EXA0019', role: 'QA', avatar: 'A' },
  { id: 'e-016', name: 'Saranya', employeeId: 'EXA0020', role: 'Admin', avatar: 'S' },
  { id: 'e-017', name: 'Mohan', employeeId: 'EXA0021', role: 'Electrician', avatar: 'M' },
  { id: 'e-018', name: 'Keerthi', employeeId: 'EXA0022', role: 'Store', avatar: 'K' },
];

export default function AdminAttendance() {
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState(() => dayjs('2026-04-08'));
  const [activeTab, setActiveTab] = useState('All');
  const [q, setQ] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [employeeStatus, setEmployeeStatus] = useState(() => ({
    'e-001': 'Pending',
    'e-002': 'Not Marked',
    'e-003': 'Not Marked',
    'e-004': 'Not Marked',
    'e-005': 'Not Marked',
    'e-006': 'Not Marked',
    'e-007': 'Not Marked',
    'e-008': 'Not Marked',
    'e-009': 'Not Marked',
    'e-010': 'Not Marked',
    'e-011': 'Not Marked',
    'e-012': 'Not Marked',
    'e-013': 'Not Marked',
    'e-014': 'Not Marked',
    'e-015': 'Not Marked',
    'e-016': 'Not Marked',
    'e-017': 'Not Marked',
    'e-018': 'Not Marked',
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

  const surfaceBg = isDark ? '#0b2338' : '#ffffff';
  const surface2Bg = isDark ? '#0d3554' : '#ffffff';
  const borderColor = isDark ? '#1a4d72' : 'rgba(0,0,0,0.06)';
  const subtleBorder = isDark ? '#163f5f' : 'rgba(0,0,0,0.06)';
  const textPrimary = isDark ? '#e9edef' : '#1f1f1f';
  const textSecondary = isDark ? '#a8b0ba' : '#6b7280';
  const templateHeaderBg = isDark ? '#103a5a' : 'rgba(214,159,109,0.08)';
  const templateHeaderBorder = isDark ? '#1a4d72' : 'rgba(214,159,109,0.25)';
  const tagBg = isDark ? 'rgba(90,181,232,0.14)' : 'rgba(214,159,109,0.18)';
  const tagBorder = isDark ? 'rgba(90,181,232,0.30)' : 'rgba(214,159,109,0.35)';
  const selectDotBorder = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(214,159,109,0.35)';
  const selectDotFill = isDark ? '#5ab5e8' : '#D69F6D';

  const actionBtnStyle = isDark
    ? { background: '#0e2f49', borderColor: '#1a4d72', color: '#e9edef' }
    : undefined;

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
              <div style={{ border: `1px solid ${subtleBorder}`, borderRadius: 10, padding: 10, background: isDark ? 'rgba(255,255,255,0.03)' : s.bg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: textSecondary }}>{s.label}</Text>
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
            <span style={{ color: textPrimary }}>Attendance for {selectedDate.format('dddd, MMMM D, YYYY')}</span>
          </div>
          <Space wrap>
            <Button style={actionBtnStyle} icon={<DownloadOutlined />} onClick={() => message.info('Sample file not configured')}>Sample File</Button>
            <Button style={actionBtnStyle} icon={<FileTextOutlined />} onClick={() => message.info('Daily report not configured')}>Daily Report</Button>
            <Button style={actionBtnStyle} icon={<UploadOutlined />} onClick={() => message.info('Import not configured')}>Import Attendance</Button>
            <Button style={actionBtnStyle} icon={<ReloadOutlined />} onClick={() => message.success('Refreshed')}>Refresh</Button>
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
            style={{
              background: isDark ? '#08263d' : undefined,
              borderColor: isDark ? '#1a4d72' : undefined,
              color: isDark ? '#e9edef' : undefined,
            }}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 10, background: templateHeaderBg, border: `1px solid ${templateHeaderBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Text style={{ fontWeight: 800, color: isDark ? '#e9edef' : '#b07a45' }}>Standard Template</Text>
              <Text style={{ fontSize: 12, color: textSecondary }}>(10:00 – 19:00)</Text>
            </div>
            <Tag style={{ borderRadius: 999, background: tagBg, borderColor: tagBorder, color: textPrimary }}>
              {demoEmployees.length} Employees
            </Tag>
          </div>

          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {filteredEmployees.map((e) => {
              const st = employeeStatus[e.id] || 'Not Marked';
              const isSelected = selectedIds.includes(e.id);
              return (
                <div
                  key={e.id}
                  onClick={() =>
                    setSelectedIds((prev) => (prev.includes(e.id) ? prev.filter((x) => x !== e.id) : [...prev, e.id]))
                  }
                  style={{
                    border: `1px solid ${isSelected ? (isDark ? 'rgba(90,181,232,0.45)' : 'rgba(214,159,109,0.35)') : borderColor}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: isDark ? surface2Bg : surfaceBg,
                    boxShadow: isSelected ? (isDark ? '0 0 0 2px rgba(90,181,232,0.16)' : '0 0 0 2px rgba(214,159,109,0.10)') : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    {/* left strip like screenshot */}
                    <div style={{ width: 54, borderRight: `1px solid ${subtleBorder}`, background: isDark ? '#072235' : 'rgba(214,159,109,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 999, border: `2px solid ${selectDotBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 999, background: isSelected ? selectDotFill : 'transparent' }} />
                      </div>
                    </div>

                    <div style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      {/* employee info */}
                      <div style={{ display: 'flex', gap: 12, minWidth: 260, alignItems: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: textPrimary }}>
                          {e.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: textPrimary }}>{e.name}</div>
                          <Text style={{ fontSize: 12, color: textSecondary }}>
                            {e.employeeId}{e.role ? ` · ${e.role}` : ''}
                          </Text>
                          <div style={{ marginTop: 4 }}>
                            <Text style={{ fontSize: 12, color: textSecondary }}>
                              {st === 'Not Marked' ? 'No punch record' : `Status: ${st}`}
                            </Text>
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <a style={{ fontSize: 12, color: isDark ? '#5ab5e8' : undefined }} onClick={() => message.info('Add note not configured')}>Add Note</a>
                          </div>
                        </div>
                      </div>

                      {/* right button grid like screenshot */}
                      <div style={{ width: 360, maxWidth: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                          <Button style={st !== 'Present' ? actionBtnStyle : undefined} size="small" onClick={() => setStatusForEmployee(e.id, 'Present')} type={st === 'Present' ? 'primary' : 'default'}>
                            P&nbsp;&nbsp;Present
                          </Button>
                          <Button style={st !== 'Half Day' ? actionBtnStyle : undefined} size="small" onClick={() => setStatusForEmployee(e.id, 'Half Day')} type={st === 'Half Day' ? 'primary' : 'default'}>
                            HD&nbsp;&nbsp;Half Day
                          </Button>
                          <Button style={st !== 'Absent' ? actionBtnStyle : undefined} size="small" onClick={() => setStatusForEmployee(e.id, 'Absent')} type={st === 'Absent' ? 'primary' : 'default'}>
                            A&nbsp;&nbsp;Absent
                          </Button>
                          <Button style={actionBtnStyle} size="small" onClick={() => setStatusForEmployee(e.id, 'Fine')}>
                            F&nbsp;&nbsp;Fine
                          </Button>
                          <Button style={actionBtnStyle} size="small" onClick={() => setStatusForEmployee(e.id, 'Leave')}>
                            L&nbsp;&nbsp;Leave
                          </Button>
                          <Button style={actionBtnStyle} size="small" icon={<EyeOutlined />} onClick={() => view(e)}>
                            View
                          </Button>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Button style={actionBtnStyle} size="small" block onClick={() => setStatusForEmployee(e.id, 'Weekly Off')}>
                            WO&nbsp;&nbsp;Week Off
                          </Button>
                        </div>
                      </div>
                    </div>
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

