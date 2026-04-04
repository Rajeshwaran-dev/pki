import React, { useState } from 'react';
import { Card, Typography, Input, Button, Form, Upload, Tag, Row, Col, Table, Divider, DatePicker, Select, Space, Empty } from 'antd';
import {
  CreditCardOutlined,
  BankOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  CheckSquareOutlined,
  PictureOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  UserOutlined,
  LockOutlined,
  SettingOutlined,
  RobotOutlined,
  CalendarOutlined,
  EditOutlined,
  UploadOutlined,
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

/* ========== Filter Bar Component ========== */
const FilterBar: React.FC = () => (
  <Card style={{ borderRadius: 12, border: 'none', marginBottom: 20 }} styles={{ body: { padding: '14px 20px' } }}>
    <div className="flex flex-wrap items-center gap-3">
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search settings..."
        style={{ width: 220, borderRadius: 8 }}
        allowClear
      />
      <RangePicker style={{ borderRadius: 8 }} />
      <Select
        placeholder="Category"
        style={{ width: 150, borderRadius: 8 }}
        options={[
          { value: 'all', label: 'All Categories' },
          { value: 'billing', label: 'Billing' },
          { value: 'org', label: 'Organization' },
          { value: 'master', label: 'Master Data' },
        ]}
        allowClear
      />
      <div style={{ marginLeft: 'auto' }}>
        <Button icon={<ExportOutlined />}>Export All</Button>
      </div>
    </div>
  </Card>
);

/* ========== Tab Button Component ========== */
interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const tabItems: TabItem[] = [
  { key: 'subscription', label: 'Subscription', icon: <CreditCardOutlined /> },
  { key: 'organization', label: 'Organization Details', icon: <BankOutlined /> },
  { key: 'listing', label: 'Listing Page', icon: <GlobalOutlined /> },
  { key: 'items', label: 'Item Master', icon: <AppstoreOutlined /> },
  { key: 'materials', label: 'Materials Master', icon: <DatabaseOutlined /> },
  { key: 'checklist', label: 'Checklist Master', icon: <CheckSquareOutlined /> },
  { key: 'moodboard', label: 'Moodboard', icon: <PictureOutlined /> },
  { key: 'activity', label: 'Activity', icon: <ThunderboltOutlined /> },
  { key: 'manpower', label: 'Manpower', icon: <TeamOutlined /> },
  { key: 'vendors', label: 'Vendors', icon: <TeamOutlined /> },
  { key: 'users', label: 'Users', icon: <UserOutlined /> },
  { key: 'permissions', label: 'Permissions', icon: <LockOutlined /> },
  { key: 'configuration', label: 'Configuration', icon: <SettingOutlined /> },
  { key: 'automation', label: 'Automation', icon: <RobotOutlined /> },
  { key: 'hr', label: 'HR & Policies', icon: <CalendarOutlined /> },
];

/* ========== Tab Content Components ========== */
const SubscriptionTab: React.FC = () => {
  const credits = [
    { label: 'Total Credits', value: 8, color: 'hsl(var(--info))' },
    { label: 'Total Left', value: 4, color: 'hsl(var(--primary))' },
    { label: 'Credits Used', value: 4, color: 'hsl(var(--error))' },
  ];

  const consumedProjects = [
    { key: '1', code: 'P-113', name: 'Value Kitchens (New Project) 25-02-2026', date: 'Feb 25, 2026' },
    { key: '2', code: 'P-110', name: 'SRIDHAR BUILDER', date: 'Apr 11, 2025' },
    { key: '3', code: 'P-108', name: 'DHAMODARAN', date: 'Apr 09, 2025' },
    { key: '4', code: 'P-103', name: 'DR.KAMALESH', date: 'Apr 01, 2025' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Title level={4} style={{ margin: 0 }}>Subscription Type - Per Project</Title>
        <Button type="primary" size="large">Convert to Per Seats</Button>
      </div>
      
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={14}>
          <Row gutter={[16, 16]} className="mb-6">
            {credits.map((c, i) => (
              <Col xs={8} key={i}>
                <Card className="text-center settings-stat-card" style={{ borderRadius: 12, borderLeft: `3px solid ${c.color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{c.value}</div>
                  <Text type="secondary">{c.label}</Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Title level={5}>Consumed Projects ({consumedProjects.length})</Title>
          <Table
            dataSource={consumedProjects}
            pagination={false}
            size="small"
            columns={[
              { title: 'Project Code', dataIndex: 'code', render: (v: string) => <a style={{ color: 'hsl(var(--info))' }}>{v}</a> },
              { title: 'Project Name', dataIndex: 'name' },
              { title: 'Activation Date', dataIndex: 'date' },
            ]}
          />
        </Col>
        <Col xs={24} lg={10}>
          <Card style={{ borderRadius: 12 }}>
            <Title level={5}>Payment History</Title>
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'hsl(var(--primary))' }}>₹35,400.00</div>
                <Text type="secondary">8 Projects</Text>
                <br />
                <Text type="secondary"><CalendarOutlined /> March 17, 2025</Text>
              </div>
              <Tag color="success">Success</Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const OrganizationTab: React.FC = () => (
  <div className="animate-fade-in">
    
    <Card style={{ borderRadius: 12, marginBottom: 24 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title level={5} style={{ margin: 0 }}>Company Information</Title>
        </div>
        <Button icon={<EditOutlined />}>Edit</Button>
      </div>
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>Legal Company Name</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>PERSPECTIVE KITCHENS AND INTERIORS PVT LTD</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>Studio Name</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>PERSPECTIVE KITCHENS AND INTERIORS PVT LTD</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>GST Number</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>33AAOCP2032L1ZD</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>PAN</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>AAOCP2032L</Text>
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <Text type="secondary" style={{ fontSize: 12 }}>Company Logo</Text>
        <div className="mt-2 p-6 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--muted))' }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>PK&I</Title>
        </div>
      </div>
    </Card>
    <Card style={{ borderRadius: 12, marginBottom: 24 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title level={5} style={{ margin: 0 }}>Company Address</Title>
        </div>
        <Button icon={<EditOutlined />}>Edit</Button>
      </div>
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>Address Line 1</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>No 691/13, NGGO's Colony</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>Address Line 2</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>Bagalur Road</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>State</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>Tamil Nadu</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>City</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>Hosur</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>Pincode</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>635109</Text>
          </div>
        </Col>
      </Row>
    </Card>
    <Card style={{ borderRadius: 12 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title level={5} style={{ margin: 0 }}>Bank Details</Title>
          
        </div>
        <Button icon={<EditOutlined />}>Edit</Button>
      </div>
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>Bank Name</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text type="secondary">Enter bank name</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>Account Number</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>120026377324</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>Account Holder Name</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>PERSPECTIVE KITCHENS AND INTERIORS PVT LTD</Text>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>IFSC Code</Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Text>CNRB0001972</Text>
          </div>
        </Col>
      </Row>
      <div className="mt-4 text-right">
        <Button type="link" icon={<PlusOutlined />} style={{ color: 'hsl(var(--info))' }}>Add another bank</Button>
      </div>
    </Card>
  </div>
);

const ListingPageTab: React.FC = () => (
  <div className="animate-fade-in">
    <div className="flex items-center gap-3 mb-1">
      <Title level={4} style={{ margin: 0 }}>Listing Page</Title>
      <Tag color="error" style={{ borderRadius: 12 }}>● Inactive</Tag>
    </div>
    
    <div className="text-right mb-4">
      <Button icon={<EditOutlined />}>Edit</Button>
    </div>
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Text type="secondary" style={{ fontSize: 12 }}>Studio name</Text>
        <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
          <Text>PERSPECTIVE KITCHENS AND INTERIORS PVT LTD</Text>
        </div>
        <div className="mt-4">
          <Text type="secondary" style={{ fontSize: 12 }}>WhatsApp number</Text>
          <Input placeholder="Enter whatsapp number" className="mt-1" />
        </div>
        <div className="mt-4">
          <Text type="secondary" style={{ fontSize: 12 }}>Project budget starts from</Text>
          <Input placeholder="Enter starting price" className="mt-1" />
        </div>
        <div className="mt-4">
          <Text type="secondary" style={{ fontSize: 12 }}>Select tag that suits you</Text>
          <div className="flex flex-wrap gap-2 mt-2">
            {['In House Factory', 'Budget Friendly', 'Bespoke', 'Limited Projects'].map(tag => (
              <Tag key={tag} style={{ borderRadius: 16, padding: '4px 12px' }}>{tag}</Tag>
            ))}
          </div>
        </div>
      </Col>
      <Col xs={24} md={12}>
        <Text type="secondary" style={{ fontSize: 12 }}>Studio logo</Text>
        <div className="mt-2 p-4">
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>PK&I</Title>
        </div>
        <div className="mt-4">
          <Text type="secondary" style={{ fontSize: 12 }}>Instagram link</Text>
          <Input placeholder="Enter Instagram profile link" className="mt-1" />
        </div>
        <div className="mt-4">
          <Text type="secondary" style={{ fontSize: 12 }}>How many projects will you do in a year</Text>
          <Input placeholder="Enter project count" className="mt-1" />
        </div>
        <div className="mt-4">
          <Text type="secondary" style={{ fontSize: 12 }}>Team Size</Text>
          <Input placeholder="Enter team size" className="mt-1" />
        </div>
        <div className="mt-4">
          <Text type="secondary" style={{ fontSize: 12 }}>Carousal Images</Text>
          <Upload.Dragger className="mt-2" style={{ borderRadius: 12 }}>
            <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 24 }} /></p>
            <p>Click here to upload or drop files here</p>
            <p className="ant-upload-hint">Select maximum 3 images</p>
          </Upload.Dragger>
        </div>
      </Col>
    </Row>
  </div>
);

const ItemMasterTab: React.FC = () => {
  const items = [
    { key: '1', date: '25 Feb, 2026', name: 'Accessories', desc: '', clientRate: 0, purchaseRate: 0, uom: 'LS', gst: '18 %' },
    { key: '2', date: '25 Feb, 2026', name: 'Island Counter', desc: '', clientRate: 0, purchaseRate: 0, uom: 'SQFT', gst: '18 %' },
    { key: '3', date: '25 Feb, 2026', name: 'Display Unit', desc: '', clientRate: 0, purchaseRate: 0, uom: 'SQFT', gst: '18 %' },
    { key: '4', date: '25 Feb, 2026', name: 'Kitchen Base Unit', desc: '', clientRate: 0, purchaseRate: 0, uom: 'Ft', gst: '18 %' },
    { key: '5', date: '24 Mar, 2025', name: 'Rolling Shutter', desc: 'HSN 9403', clientRate: 0, purchaseRate: 0, uom: 'Nos', gst: '18 %' },
    { key: '6', date: '24 Mar, 2025', name: 'Wicker Basket', desc: 'HSN 9403', clientRate: 0, purchaseRate: 0, uom: 'Nos', gst: '18 %' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-end gap-3 mb-4">
        <Button type="primary" icon={<PlusOutlined />}>Add Item</Button>
        <Button icon={<AppstoreOutlined />}>Export Excel</Button>
      </div>
      <Table
        dataSource={items}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t, r) => `Showing ${r[0]} to ${r[1]} of ${t} items` }}
        columns={[
          { title: 'Created On', dataIndex: 'date', width: 120 },
          { title: 'Image', dataIndex: 'image', width: 70, render: () => <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><AppstoreOutlined /></div> },
          { title: 'Name', dataIndex: 'name', render: (v: string) => <a style={{ color: 'hsl(var(--primary))' }}>{v}</a> },
          { title: 'Description', dataIndex: 'desc' },
          { title: 'Client Rate', dataIndex: 'clientRate', render: (v: number) => v.toFixed(2) },
          { title: 'Purchase Rate', dataIndex: 'purchaseRate', render: (v: number) => v.toFixed(2) },
          { title: 'UOM', dataIndex: 'uom', render: (v: string) => <Tag>{v}</Tag> },
          { title: 'GST', dataIndex: 'gst' },
          { title: 'Tag', dataIndex: 'tag' },
          {
            title: '',
            width: 80,
            render: () => (
              <div className="flex gap-2">
                <Button type="primary" shape="circle" size="small" icon={<EditOutlined />} ghost />
                <Button danger shape="circle" size="small" icon={<AppstoreOutlined />} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

const MaterialsMasterTab: React.FC = () => {
  const materials = [
    { key: '1', date: '03 Apr, 2025', name: '16mm BWP Plywood', desc: '', clientRate: 1.00, purchaseRate: 2400.00, uom: 'PCS', gst: '18 %' },
    { key: '2', date: '01 Apr, 2025', name: 'Laminate', desc: '', clientRate: 1.00, purchaseRate: 1.00, uom: 'PCS', gst: '18 %' },
    { key: '3', date: '27 Mar, 2025', name: '16mm MR Plywood', desc: '', clientRate: 1.00, purchaseRate: 2000.00, uom: 'PCS', gst: '18 %' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-end gap-3 mb-4">
        <Button type="primary" icon={<PlusOutlined />}>Add Material</Button>
        <Button icon={<AppstoreOutlined />}>Export Excel</Button>
      </div>
      <Table
        dataSource={materials}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t, r) => `Showing ${r[0]} to ${r[1]} of ${t} items` }}
        columns={[
          { title: 'Created On', dataIndex: 'date', width: 120 },
          { title: 'Image', dataIndex: 'image', width: 70, render: () => <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><AppstoreOutlined /></div> },
          { title: 'Name', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'desc' },
          { title: 'Client Rate', dataIndex: 'clientRate', render: (v: number) => v.toFixed(2) },
          { title: 'Purchase Rate', dataIndex: 'purchaseRate', render: (v: number) => v.toFixed(2) },
          { title: 'UOM', dataIndex: 'uom', render: (v: string) => <Tag>{v}</Tag> },
          { title: 'GST', dataIndex: 'gst' },
          { title: 'Tag', dataIndex: 'tag' },
          {
            title: '',
            width: 80,
            render: () => (
              <div className="flex gap-2">
                <Button type="primary" shape="circle" size="small" icon={<EditOutlined />} ghost />
                <Button danger shape="circle" size="small" icon={<AppstoreOutlined />} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

const PlaceholderTab: React.FC<{ title: string }> = ({ title }) => (
  <Card style={{ borderRadius: 12, textAlign: 'center', padding: 40 }} className="animate-fade-in">
    <SettingOutlined style={{ fontSize: 48, color: 'hsl(var(--muted-foreground))' }} />
    <Title level={4} style={{ marginTop: 16 }}>{title}</Title>
    <Text type="secondary">This section is coming soon.</Text>
  </Card>
);

/* ========== Settings Page ========== */
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('subscription');

  const renderContent = () => {
    switch (activeTab) {
      case 'subscription': return <SubscriptionTab />;
      case 'organization': return <OrganizationTab />;
      case 'listing': return <ListingPageTab />;
      case 'items': return <ItemMasterTab />;
      case 'materials': return <MaterialsMasterTab />;
      default: return <PlaceholderTab title={tabItems.find(t => t.key === activeTab)?.label || activeTab} />;
    }
  };

  return (
    <div>
      <PageHeader title="Settings" />

      {/* Pill-style tab bar like reference */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 24,
          padding: '12px 16px',
          background: 'var(--ant-color-bg-container, #fff)',
          borderRadius: 12,
          borderBottom: '1px solid hsl(var(--border))',
        }}
      >
        {tabItems.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="settings-pill-tab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 24,
                border: isActive ? '2px solid #B19625' : '1px solid transparent',
                background: isActive ? '#B1962510' : 'transparent',
                color: isActive ? '#B19625' : 'inherit',
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      <Card style={{ borderRadius: 12, border: 'none' }}>
        {renderContent()}
      </Card>
    </div>
  );
};

export default SettingsPage;
