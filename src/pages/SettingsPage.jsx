import { useState } from 'react';
import {
  Card, Typography, Button, Tag, Row, Col, Table, Avatar,
} from 'antd';
import {
  CreditCardOutlined, BankOutlined, GlobalOutlined, AppstoreOutlined,
  DatabaseOutlined, CheckSquareOutlined, PictureOutlined, ThunderboltOutlined,
  TeamOutlined, UserOutlined, LockOutlined, SettingOutlined,
  CalendarOutlined, EditOutlined, UploadOutlined, PlusOutlined, MoreOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';
import useIsMobile from '@/hooks/useIsMobile';

const { Text, Title } = Typography;

const InfoField = ({ label, value, muted }) => (
  <div>
    <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
    <div style={{
      marginTop: 6, padding: '10px 14px', borderRadius: 10,
      background: muted ? '#f7f7f7' : '#faf8f3',
      border: '1px solid #f0f0f0',
      fontSize: 13, fontWeight: 500,
    }}>
      {value || <Text type="secondary">Not set</Text>}
    </div>
  </div>
);

/* ── Subscription Tab ── */
const SubscriptionTab = () => {
  const credits = [
    { label: 'Total Credits', value: 8, color: '#1677FF' },
    { label: 'Credits Left', value: 4, color: '#B19625' },
    { label: 'Credits Used', value: 4, color: '#FF4D4F' },
  ];
  const consumed = [
    { key: '1', code: 'P-113', name: 'Value Kitchens (New Project)', date: 'Feb 25, 2026' },
    { key: '2', code: 'P-110', name: 'SRIDHAR BUILDER', date: 'Apr 11, 2025' },
    { key: '3', code: 'P-108', name: 'DHAMODARAN', date: 'Apr 09, 2025' },
    { key: '4', code: 'P-103', name: 'DR.KAMALESH', date: 'Apr 01, 2025' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Subscription — Per Project</Title>
        <Button type="primary" style={{ background: 'linear-gradient(135deg, #B19625, #C4A840)', border: 'none' }}>
          Upgrade Plan
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
            {credits.map((c, i) => (
              <Col xs={8} key={i}>
                <Card className="crm-card" style={{ textAlign: 'center', borderTop: `3px solid ${c.color}` }} styles={{ body: { padding: 16 } }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: c.color }}>{c.value}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{c.label}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Title level={5}>Consumed Projects ({consumed.length})</Title>
          <Table
            dataSource={consumed}
            pagination={false}
            size="small"
            style={{ borderRadius: 10, overflow: 'hidden' }}
            columns={[
              { title: 'Code', dataIndex: 'code', render: v => <a style={{ color: '#1677FF', fontWeight: 600 }}>{v}</a> },
              { title: 'Project Name', dataIndex: 'name' },
              { title: 'Activation Date', dataIndex: 'date' },
            ]}
          />
        </Col>
        <Col xs={24} lg={10}>
          <Card className="crm-card" styles={{ body: { padding: 20 } }}>
            <Title level={5} style={{ margin: '0 0 16px' }}>Payment History</Title>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#B19625' }}>₹35,400.00</div>
                <Text type="secondary">8 Projects</Text>
                <br />
                <Text type="secondary"><CalendarOutlined /> March 17, 2025</Text>
              </div>
              <Tag color="success" style={{ borderRadius: 10 }}>Success</Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

/* ── Organization Tab ── */
const OrganizationTab = () => (
  <div className="animate-fade-in">
    <Card className="crm-card" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={5} style={{ margin: 0 }}>Company Information</Title>
        <Button icon={<EditOutlined />} style={{ borderRadius: 8 }}>Edit</Button>
      </div>
      <Row gutter={[20, 16]}>
        <Col xs={24} md={12}><InfoField label="Legal Company Name" value="PERSPECTIVE KITCHENS AND INTERIORS PVT LTD" /></Col>
        <Col xs={24} md={12}><InfoField label="Studio Name" value="PERSPECTIVE KITCHENS AND INTERIORS PVT LTD" /></Col>
        <Col xs={24} md={12}><InfoField label="GST Number" value="33AAOCP2032L1ZD" /></Col>
        <Col xs={24} md={12}><InfoField label="PAN" value="AAOCP2032L" /></Col>
      </Row>
      <div style={{ marginTop: 20 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>Company Logo</Text>
        <div style={{
          marginTop: 8, padding: '28px 0', borderRadius: 12,
          background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px dashed #e0e0e0',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 16,
            background: 'linear-gradient(135deg, #B19625, #D4B96E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 22,
          }}>
            PK&I
          </div>
        </div>
        <Button icon={<UploadOutlined />} style={{ marginTop: 10, borderRadius: 8 }}>Upload Logo</Button>
      </div>
    </Card>

    <Card className="crm-card" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={5} style={{ margin: 0 }}>Company Address</Title>
        <Button icon={<EditOutlined />} style={{ borderRadius: 8 }}>Edit</Button>
      </div>
      <Row gutter={[20, 16]}>
        <Col xs={24} md={12}><InfoField label="Address Line 1" value="No 691/13, NGGO's Colony" /></Col>
        <Col xs={24} md={12}><InfoField label="Address Line 2" value="Bagalur Road" /></Col>
        <Col xs={24} md={8}><InfoField label="State" value="Tamil Nadu" /></Col>
        <Col xs={24} md={8}><InfoField label="City" value="Hosur" /></Col>
        <Col xs={24} md={8}><InfoField label="Pincode" value="635109" /></Col>
      </Row>
    </Card>

    <Card className="crm-card" styles={{ body: { padding: 24 } }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={5} style={{ margin: 0 }}>Bank Details</Title>
        <Button icon={<EditOutlined />} style={{ borderRadius: 8 }}>Edit</Button>
      </div>
      <Row gutter={[20, 16]}>
        <Col xs={24} md={12}><InfoField label="Bank Name" value="" muted /></Col>
        <Col xs={24} md={12}><InfoField label="Account Number" value="" muted /></Col>
        <Col xs={24} md={12}><InfoField label="IFSC Code" value="" muted /></Col>
        <Col xs={24} md={12}><InfoField label="Branch" value="" muted /></Col>
      </Row>
    </Card>
  </div>
);

/* ── Users Tab ── */
const UsersTab = () => {
  const users = [
    { key: '1', name: 'Anantha Narayana', email: 'anantha@perspective.com', role: 'Admin', status: 'Active' },
    { key: '2', name: 'Madhu Loganathan', email: 'madhu@perspective.com', role: 'Designer', status: 'Active' },
    { key: '3', name: 'Kavya S.', email: 'kavya@perspective.com', role: 'Designer', status: 'Active' },
    { key: '4', name: 'Arjun M.', email: 'arjun@perspective.com', role: 'Site Manager', status: 'Active' },
  ];
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Team Members ({users.length})</Title>
        <Button type="primary" icon={<PlusOutlined />} style={{ background: 'linear-gradient(135deg, #B19625, #C4A840)', border: 'none', borderRadius: 8 }}>
          Invite Member
        </Button>
      </div>
      <Card className="crm-card" styles={{ body: { padding: 0, overflow: 'hidden' } }}>
        {users.map((u, i) => (
          <div key={u.key} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px',
            borderBottom: i < users.length - 1 ? '1px solid #f5f5f5' : 'none',
          }}>
            <Avatar size={42} style={{ background: `hsl(${i * 70}, 60%, 50%)`, fontWeight: 700, flexShrink: 0, fontSize: 16 }}>
              {u.name.charAt(0)}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{u.email}</div>
            </div>
            <Tag style={{ borderRadius: 8 }}>{u.role}</Tag>
            <Tag color="success" style={{ borderRadius: 8 }}>{u.status}</Tag>
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ── Generic Empty Tab ── */
const EmptyTab = ({ label }) => (
  <div className="animate-fade-in">
    <Card className="crm-card" styles={{ body: { padding: '60px 24px', textAlign: 'center' } }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, background: '#faf8f3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 28, color: '#B19625',
      }}>
        <SettingOutlined />
      </div>
      <Title level={4} style={{ margin: '0 0 8px' }}>{label}</Title>
      <Text type="secondary">This section is under configuration. Check back soon.</Text>
      <div style={{ marginTop: 24 }}>
        <Button type="primary" style={{ background: 'linear-gradient(135deg, #B19625, #C4A840)', border: 'none', borderRadius: 8 }}>
          Configure Now
        </Button>
      </div>
    </Card>
  </div>
);

/* ── Tab definitions ── */
const tabs = [
  { key: 'subscription', label: 'Subscription', icon: <CreditCardOutlined />, component: <SubscriptionTab /> },
  { key: 'organization', label: 'Organization', icon: <BankOutlined />, component: <OrganizationTab /> },
  { key: 'listing', label: 'Listing Page', icon: <GlobalOutlined />, component: <EmptyTab label="Listing Page" /> },
  { key: 'items', label: 'Item Master', icon: <AppstoreOutlined />, component: <EmptyTab label="Item Master" /> },
  { key: 'materials', label: 'Materials', icon: <DatabaseOutlined />, component: <EmptyTab label="Materials Master" /> },
  { key: 'checklist', label: 'Checklist', icon: <CheckSquareOutlined />, component: <EmptyTab label="Checklist Master" /> },
  { key: 'moodboard', label: 'Moodboard', icon: <PictureOutlined />, component: <EmptyTab label="Moodboard" /> },
  { key: 'activity', label: 'Activity', icon: <ThunderboltOutlined />, component: <EmptyTab label="Activity Types" /> },
  { key: 'manpower', label: 'Manpower', icon: <TeamOutlined />, component: <EmptyTab label="Manpower" /> },
  { key: 'vendors', label: 'Vendors', icon: <TeamOutlined />, component: <EmptyTab label="Vendors" /> },
  { key: 'users', label: 'Users', icon: <UserOutlined />, component: <UsersTab /> },
  { key: 'permissions', label: 'Permissions', icon: <LockOutlined />, component: <EmptyTab label="Permissions" /> },
  { key: 'configuration', label: 'Configuration', icon: <SettingOutlined />, component: <EmptyTab label="System Configuration" /> },
];

/* ── Main Page ── */
const SettingsPage = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('subscription');

  const current = tabs.find(t => t.key === activeTab);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your workspace configuration" />

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Sidebar Nav */}
        <div style={{
          width: isMobile ? '100%' : 220,
          flexShrink: 0,
          background: 'white',
          borderRadius: 14,
          padding: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          {isMobile ? (
            /* Mobile: horizontal scroll tabs */
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {tabs.map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 20,
                      border: isActive ? '2px solid #B19625' : '2px solid transparent',
                      background: isActive ? '#B1962512' : '#f7f7f7',
                      color: isActive ? '#B19625' : '#666',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Desktop: vertical nav */
            tabs.map((tab, i) => {
              const isActive = activeTab === tab.key;
              return (
                <div
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${i * 0.03}s`,
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 10, cursor: 'pointer', marginBottom: 2,
                    background: isActive ? '#B1962512' : 'transparent',
                    color: isActive ? '#B19625' : '#666',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 13,
                    transition: 'all 0.18s ease',
                    borderLeft: isActive ? '3px solid #B19625' : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f7f7f7'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 15 }}>{tab.icon}</span>
                  {tab.label}
                </div>
              );
            })
          )}
        </div>

        {/* Content */}
        <div key={activeTab} style={{ flex: 1, minWidth: 0 }}>
          {current?.component}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
