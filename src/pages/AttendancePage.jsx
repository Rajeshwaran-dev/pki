import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, Statistic, Table, Tag, Space, Button, 
  Tabs, Avatar, Input, DatePicker, Select, Badge
} from 'antd';
import { 
  UserOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  CloseCircleOutlined, FilterOutlined, ExportOutlined,
  SearchOutlined, CalendarOutlined, TeamOutlined,
  CarryOutOutlined, HistoryOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';
import dayjs from 'dayjs';

const AttendancePage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const [activeTab, setActiveTab] = useState(tab || 'overview');

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/attendance/${key}`);
  };

  // Multi-theme colors
  const cardBg = isDark ? '#0b2338' : '#ffffff';
  const borderColor = isDark ? '#1a4d72' : '#f0f0f0';
  const textSecondary = isDark ? '#a8b0ba' : '#666';

  const stats = [
    { title: 'Total Employees', value: 48, icon: <TeamOutlined />, color: '#1677FF' },
    { title: 'Present Today', value: 42, icon: <CheckCircleOutlined />, color: '#52C41A' },
    { title: 'On Leave', value: 3, icon: <CarryOutOutlined />, color: '#FAAD14' },
    { title: 'Late Arrivals', value: 3, icon: <ClockCircleOutlined />, color: '#FF4D4F' },
  ];

  const employeeData = [
    { key: '1', name: 'John Doe', role: 'Software Engineer', status: 'Present', checkIn: '09:00 AM', checkOut: '06:00 PM', department: 'Development' },
    { key: '2', name: 'Jane Smith', role: 'UI/UX Designer', status: 'On Leave', checkIn: '-', checkOut: '-', department: 'Design' },
    { key: '3', name: 'Mike Johnson', role: 'Project Manager', status: 'Present', checkIn: '09:15 AM', checkOut: '06:15 PM', department: 'Management' },
    { key: '4', name: 'Sarah Williams', role: 'QA Lead', status: 'Late', checkIn: '10:30 AM', checkOut: '07:30 PM', department: 'QA' },
    { key: '5', name: 'Robert Brown', role: 'DevOps Engineer', status: 'Present', checkIn: '08:45 AM', checkOut: '05:45 PM', department: 'Operations' },
  ];

  const leaveRequests = [
    { key: '1', name: 'Jane Smith', type: 'Sick Leave', range: 'Apr 07 - Apr 08', days: 2, status: 'Approved' },
    { key: '2', name: 'Alice Wong', type: 'Annual Leave', range: 'Apr 10 - Apr 15', days: 6, status: 'Pending' },
    { key: '3', name: 'Tom Harris', type: 'Casual Leave', range: 'Apr 09 - Apr 09', days: 1, status: 'Rejected' },
  ];

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: primaryColor }} />
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: 11, color: textSecondary }}>{record.role}</div>
          </div>
        </Space>
      ),
    },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'On Leave') color = 'warning';
        if (status === 'Late') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: 'Check In', dataIndex: 'checkIn', key: 'checkIn' },
    { title: 'Check Out', dataIndex: 'checkOut', key: 'checkOut' },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="link" size="small">Details</Button>,
    },
  ];

  const leaveColumns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} style={{ background: primaryColor }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    { title: 'Leave Type', dataIndex: 'type', key: 'type' },
    { title: 'Duration', dataIndex: 'range', key: 'range' },
    { title: 'Days', dataIndex: 'days', key: 'days' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'processing';
        if (status === 'Approved') color = 'success';
        if (status === 'Rejected') color = 'error';
        return <Badge status={color} text={status} />;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <>
              <Button type="primary" size="small" ghost success>Approve</Button>
              <Button type="primary" size="small" ghost danger>Reject</Button>
            </>
          )}
          <Button type="link" size="small">View</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 24px' }}>
      <PageHeader 
        title="Attendance Management" 
        subtitle="Manage employee daily presence and leave requests"
        actions={
          <Space>
            <Button icon={<ExportOutlined />}>Export Report</Button>
            <Button type="primary" icon={<CalendarOutlined />} style={{ background: primaryColor, border: 'none' }}>
              Mark Attendance
            </Button>
          </Space>
        }
      />

      {/* Statistics Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card style={{ borderRadius: 12, background: cardBg, border: `1px solid ${borderColor}` }}>
              <Statistic 
                title={<span style={{ color: textSecondary }}>{item.title}</span>}
                value={item.value}
                prefix={<span style={{ color: item.color, marginRight: 8 }}>{item.icon}</span>}
                valueStyle={{ color: isDark ? '#f0f0f0' : '#1f1f1f', fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Detailed Management Section */}
      <Card 
        style={{ borderRadius: 14, background: cardBg, border: `1px solid ${borderColor}` }}
        styles={{ body: { padding: '8px 24px 24px' } }}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          className="custom-tabs"
          items={[
            {
              key: 'overview',
              label: (<span><HistoryOutlined /> Daily Attendance</span>),
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <Space wrap>
                      <Input prefix={<SearchOutlined />} placeholder="Search employee..." style={{ width: 250, borderRadius: 8 }} />
                      <DatePicker defaultValue={dayjs()} style={{ borderRadius: 8 }} />
                      <Select defaultValue="all" style={{ width: 150, borderRadius: 8 }}>
                        <Select.Option value="all">All Departments</Select.Option>
                        <Select.Option value="dev">Development</Select.Option>
                        <Select.Option value="design">Design</Select.Option>
                      </Select>
                    </Space>
                    <Button icon={<FilterOutlined />}>Filters</Button>
                  </div>
                  <Table 
                    columns={columns} 
                    dataSource={employeeData} 
                    pagination={{ pageSize: 5 }} 
                    scroll={{ x: 'max-content' }}
                  />
                </div>
              ),
            },
            {
              key: 'leaves',
              label: (<span><CarryOutOutlined /> Leave Requests</span>),
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                    <Space>
                      <Select defaultValue="all" style={{ width: 120, borderRadius: 8 }}>
                        <Select.Option value="all">All Status</Select.Option>
                        <Select.Option value="pending">Pending</Select.Option>
                        <Select.Option value="approved">Approved</Select.Option>
                      </Select>
                    </Space>
                  </div>
                  <Table 
                    columns={leaveColumns} 
                    dataSource={leaveRequests} 
                    pagination={{ pageSize: 5 }} 
                    scroll={{ x: 'max-content' }}
                  />
                </div>
              ),
            },
            {
              key: 'reports',
              label: (<span><FileTextOutlined /> Monthly Reports</span>),
              children: (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Badge count="New" offset={[10, 0]}>
                    <FileTextOutlined style={{ fontSize: 48, color: primaryColor, opacity: 0.5 }} />
                  </Badge>
                  <div style={{ marginTop: 16, fontSize: 16, fontWeight: 600 }}>Monthly Attendance Reports</div>
                  <div style={{ color: textSecondary, marginBottom: 24 }}>Generate and download detailed attendance sheets for payroll.</div>
                  <Button type="primary" style={{ background: primaryColor, border: 'none' }}>Generate April 2024 Report</Button>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default AttendancePage;
