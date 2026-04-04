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

const ChecklistMasterTab: React.FC = () => (
  <div className="animate-fade-in">
    <div className="flex justify-end gap-3 mb-4">
      <Button type="primary" icon={<PlusOutlined />}>Create Design Checklist</Button>
      <Button icon={<PlusOutlined />}>Add Handover Checklist</Button>
    </div>
    <div className="py-12 text-center">
      <Text type="secondary">No checklists available</Text>
    </div>
  </div>
);

const MoodboardTab: React.FC = () => {
  const [subTab, setSubTab] = useState('items');
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        {['items', 'groups'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            style={{
              padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: subTab === t ? 600 : 400, cursor: 'pointer',
              background: subTab === t ? 'hsl(var(--primary))' : 'transparent',
              color: subTab === t ? 'hsl(var(--primary-foreground))' : 'inherit',
              border: subTab === t ? 'none' : '1px solid hsl(var(--border))',
            }}
          >
            {t === 'items' ? 'Items' : 'Groups'}
          </button>
        ))}
      </div>
      <Card style={{ borderRadius: 12, background: 'hsl(var(--muted))', textAlign: 'center', padding: 40 }}>
        <div className="flex justify-end mb-4">
          <Button icon={<PlusOutlined />}>Add New</Button>
        </div>
        <Empty description="No Data Found" />
      </Card>
    </div>
  );
};

const ActivityTab: React.FC = () => {
  const [subTab, setSubTab] = useState('tags');
  const tags = [
    { key: '1', name: 'Painting' },
    { key: '2', name: 'Countertops' },
    { key: '3', name: 'Electrical' },
  ];
  const activities = [
    { key: '1', name: 'Site Visit' },
    { key: '2', name: 'Design Review' },
    { key: '3', name: 'Client Meeting' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        {['tags', 'activity'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            style={{
              padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: subTab === t ? 600 : 400, cursor: 'pointer',
              background: subTab === t ? 'hsl(var(--primary))' : 'transparent',
              color: subTab === t ? 'hsl(var(--primary-foreground))' : 'inherit',
              border: subTab === t ? 'none' : '1px solid hsl(var(--border))',
            }}
          >
            {t === 'tags' ? 'Tags' : 'Activity Master'}
          </button>
        ))}
      </div>
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />}>Add Tag</Button>
      </div>
      <Table
        dataSource={subTab === 'tags' ? tags : activities}
        pagination={{ pageSize: 25, showSizeChanger: true, showTotal: (t) => `${t} items` }}
        columns={[
          { title: 'Name', dataIndex: 'name', render: (v: string) => <Text style={{ color: 'hsl(var(--primary))' }}>{v}</Text> },
          {
            title: 'Actions', width: 120, align: 'center' as const,
            render: () => (
              <div className="flex justify-center gap-2">
                <Button type="primary" shape="circle" size="small" icon={<EditOutlined />} ghost />
                <Button danger shape="circle" size="small" icon={<DeleteOutlined />} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

const ManpowerTab: React.FC = () => {
  const data = [
    { key: '1', date: '27 Mar, 2025', name: 'Logistics Team' },
    { key: '2', date: '27 Mar, 2025', name: 'Demolition Crew' },
    { key: '3', date: '27 Mar, 2025', name: 'Plumber' },
    { key: '4', date: '27 Mar, 2025', name: 'Electrician' },
    { key: '5', date: '27 Mar, 2025', name: 'Tile Worker' },
    { key: '6', date: '27 Mar, 2025', name: 'Painter' },
    { key: '7', date: '27 Mar, 2025', name: 'Carpenter' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-end gap-3 mb-4">
        <Button type="primary" icon={<PlusOutlined />}>Add Manpower</Button>
        <Button icon={<UploadOutlined />}>Import Excel</Button>
      </div>
      <Table
        dataSource={data}
        pagination={{ pageSize: 25, showSizeChanger: true, showTotal: (t) => `${t} items` }}
        columns={[
          { title: 'Created On', dataIndex: 'date', width: 150 },
          { title: 'Name', dataIndex: 'name' },
          {
            title: 'Actions', width: 80, align: 'center' as const,
            render: () => <Button type="text" icon={<MoreOutlined />} />,
          },
        ]}
      />
    </div>
  );
};

const VendorsTab: React.FC = () => {
  const [subTab, setSubTab] = useState('all');
  const vendors = [
    { key: '1', date: '01 Apr, 2025', code: 'PSVR-002', name: 'Shri Karani', pan: '', gst: 'N/A', legalName: 'Shri Karani', phone: '', city: 'Salem', type: '', status: 'Active' },
    { key: '2', date: '27 Mar, 2025', code: 'PSVR-001', name: 'Test Vendor', pan: '', gst: 'N/A', legalName: '', phone: '', city: 'Kadapa', type: '', status: 'Active' },
  ];
  const tabs = [
    { key: 'all', label: `All (${vendors.length})` },
    { key: 'active', label: `Active (${vendors.filter(v => v.status === 'Active').length})` },
    { key: 'inactive', label: 'Inactive (0)' },
    { key: 'blacklist', label: 'Blacklist (0)' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              style={{
                padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: subTab === t.key ? 600 : 400, cursor: 'pointer',
                background: subTab === t.key ? 'hsl(var(--primary))' : 'transparent',
                color: subTab === t.key ? 'hsl(var(--primary-foreground))' : 'inherit',
                border: subTab === t.key ? 'none' : '1px solid hsl(var(--border))',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button type="primary" icon={<PlusOutlined />}>Add Vendor</Button>
          <Button icon={<ExportOutlined />}>Export Excel</Button>
        </div>
      </div>
      <Table
        dataSource={vendors}
        scroll={{ x: 1100 }}
        pagination={{ pageSize: 25, showSizeChanger: true, showTotal: (t) => `${t} items` }}
        columns={[
          { title: 'Created On', dataIndex: 'date', width: 110 },
          { title: 'Vendor Code', dataIndex: 'code', width: 110 },
          { title: 'Display name', dataIndex: 'name', render: (v: string) => <Text style={{ color: 'hsl(var(--primary))' }}>{v}</Text> },
          { title: 'PAN', dataIndex: 'pan', width: 100 },
          { title: 'GST Number', dataIndex: 'gst', width: 100, render: (v: string) => v ? <Tag>{v}</Tag> : '-' },
          { title: 'Legal Name', dataIndex: 'legalName' },
          { title: 'Phone', dataIndex: 'phone', width: 120 },
          { title: 'City', dataIndex: 'city', width: 100 },
          { title: 'Vendor Type', dataIndex: 'type', width: 110 },
          { title: 'Status', dataIndex: 'status', width: 90, render: (v: string) => <Tag color={v === 'Active' ? 'success' : 'default'}>{v}</Tag> },
          { title: 'View Details', width: 100, align: 'center' as const, render: () => <Button type="primary" shape="circle" size="small" icon={<EyeOutlined />} ghost /> },
        ]}
      />
    </div>
  );
};

const UsersTab: React.FC = () => {
  const [subTab, setSubTab] = useState('internal');
  const users = [
    { key: '1', name: 'Ramu', phone: '+91 9626419878', joining: '', email: '', role: '', groups: ['Project Files'], groupCount: 7 },
    { key: '2', name: 'Chandra Bose', phone: '+91 8925835892', joining: '', email: '', role: '', groups: ['Quote'], groupCount: 6 },
    { key: '3', name: 'Sathish', phone: '+91 8925835895', joining: '', email: '', role: '', groups: ['Project Files'], groupCount: 10 },
    { key: '4', name: 'Vighnesh Shetty', phone: '+91 7348941417', joining: '', email: '', role: '', groups: ['Moodboard'], groupCount: 10 },
    { key: '5', name: 'Renuga Devi', phone: '+91 6369467389', joining: '', email: '', role: '', groups: ['Moodboard'], groupCount: 5 },
    { key: '6', name: 'Praveen Kumar', phone: '+91 7010017410', joining: '', email: '', role: '', groups: ['Moodboard'], groupCount: 5 },
    { key: '7', name: 'Madhu Loganathan', phone: '+91 8925835894', joining: '', email: '', role: '', groups: ['Project Files'], groupCount: 8 },
    { key: '8', name: 'Sharmila', phone: '+91 7200989485', joining: '', email: '', role: '', groups: ['Moodboard'], groupCount: 15 },
    { key: '9', name: 'Thara', phone: '+91 9008949311', joining: '', email: '', role: '', groups: ['Can Punch In Punch Out'], groupCount: 1 },
    { key: '10', name: 'Anantha Narayana', phone: '+91 9944166332', joining: '', email: 'ananth@perspectivekitchens.com', role: '', groups: ['Can Punch In Punch Out'], groupCount: 1 },
  ];
  const tabs = [
    { key: 'internal', label: `Internal Users (${users.length})` },
    { key: 'clients', label: 'Clients (0)' },
    { key: 'vendors', label: 'Vendors (0)' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              style={{
                padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: subTab === t.key ? 600 : 400, cursor: 'pointer',
                background: subTab === t.key ? 'hsl(var(--primary))' : 'transparent',
                color: subTab === t.key ? 'hsl(var(--primary-foreground))' : 'inherit',
                border: subTab === t.key ? 'none' : '1px solid hsl(var(--border))',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button type="primary" icon={<PlusOutlined />}>Add User</Button>
      </div>
      <Table
        dataSource={subTab === 'internal' ? users : []}
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 25, showSizeChanger: true, showTotal: (t) => `${t} items` }}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Phone', dataIndex: 'phone', width: 150 },
          { title: 'Joining Date', dataIndex: 'joining', width: 120 },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Role', dataIndex: 'role', width: 100 },
          {
            title: 'Groups', dataIndex: 'groups', width: 200,
            render: (_: any, record: any) => (
              <div className="flex items-center gap-1">
                {record.groups.map((g: string, i: number) => <Tag key={i} color="blue">{g}</Tag>)}
                {record.groupCount > 1 && <Text type="secondary" style={{ fontSize: 12 }}>+{record.groupCount}</Text>}
              </div>
            ),
          },
          {
            title: 'Actions', width: 60, align: 'center' as const,
            render: () => <Button type="text" icon={<MoreOutlined />} />,
          },
        ]}
      />
    </div>
  );
};

/* ========== Permissions Tab ========== */
const PermissionsTab: React.FC = () => {
  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input placeholder="Search role" size="small" prefix={<SearchOutlined />} />
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input placeholder="Search permissions" size="small" prefix={<SearchOutlined />} />
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8, background: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' }}>
          Add Role
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={[]}
        locale={{ emptyText: 'No data available' }}
        pagination={{
          pageSize: 25,
          showSizeChanger: true,
          showTotal: (total) => <span style={{ color: 'hsl(var(--primary))' }}>{total} items</span>,
        }}
        style={{ borderRadius: 8 }}
      />
    </div>
  );
};

/* ========== Configuration Tab ========== */
const ConfigurationTab: React.FC = () => {
  const [activeModule, setActiveModule] = useState('finance');
  const modules = [
    { key: 'finance', label: 'Finance' },
    { key: 'orders', label: 'Orders' },
    { key: 'invoices', label: 'Invoices' },
    { key: 'checklist', label: 'Checklist' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'projects', label: 'Projects' },
  ];

  const [formSettings, setFormSettings] = useState({
    date: true,
    amount: true,
    type: false,
    referenceNumber: false,
    channel: false,
    vendor: false,
    fileUpload: false,
    order: false,
    remarks: false,
  });

  const [paymentApproved, setPaymentApproved] = useState(true);

  const toggleField = (field: string) => {
    setFormSettings(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const mandatoryFields = Object.entries(formSettings)
    .filter(([, v]) => v)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1'));

  return (
    <div className="animate-fade-in flex gap-0" style={{ minHeight: 500 }}>
      {/* Sidebar */}
      <div style={{ width: 200, borderRight: '1px solid hsl(var(--border))', paddingRight: 0 }}>
        <Title level={5} style={{ padding: '0 16px', marginBottom: 16 }}>Modules</Title>
        {modules.map(m => (
          <div
            key={m.key}
            onClick={() => setActiveModule(m.key)}
            style={{
              padding: '10px 16px',
              cursor: 'pointer',
              borderLeft: activeModule === m.key ? '3px solid hsl(var(--primary))' : '3px solid transparent',
              background: activeModule === m.key ? 'hsl(var(--primary) / 0.06)' : 'transparent',
              color: activeModule === m.key ? 'hsl(var(--primary))' : 'inherit',
              fontWeight: activeModule === m.key ? 600 : 400,
              fontSize: 14,
              transition: 'all 0.2s',
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px' }}>
        <Text type="secondary" style={{ fontSize: 13, marginBottom: 4, display: 'block' }}>Form settings</Text>
        <Title level={5} style={{ marginBottom: 16 }}>Select Fields that are mandatory</Title>

        <Card style={{ borderRadius: 12, marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 16, fontSize: 14 }}>Form Settings</Title>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(formSettings).map(([key, value]) => {
              const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
              return (
                <div key={key} className="flex items-center justify-between gap-2 p-3 rounded-lg" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>{value ? 'On' : 'Off'}</div>
                  </div>
                  <div
                    onClick={() => toggleField(key)}
                    style={{
                      width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                      background: value ? 'hsl(var(--primary))' : '#ccc',
                      position: 'relative', transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 2, left: value ? 20 : 2, transition: 'left 0.2s',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ borderRadius: 12, marginBottom: 16 }}>
          <Text strong style={{ color: 'hsl(var(--error))', fontSize: 13 }}>Mandatory Fields Selected:</Text>
          <div className="flex flex-wrap gap-2 mt-2">
            {mandatoryFields.map(f => (
              <Tag key={f} color="blue" style={{ borderRadius: 4 }}>{f}</Tag>
            ))}
            <Tag color="blue" style={{ borderRadius: 4 }}>Approved Order Vendors Flag</Tag>
          </div>
        </Card>

        <Card style={{ borderRadius: 12, marginBottom: 16 }}>
          <Title level={5} style={{ fontSize: 14, marginBottom: 12 }}>Payment Settings</Title>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>Create payments for approved orders only</div>
              <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{paymentApproved ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div
              onClick={() => setPaymentApproved(!paymentApproved)}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                background: paymentApproved ? 'hsl(var(--primary))' : '#ccc',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 2, left: paymentApproved ? 22 : 2, transition: 'left 0.2s',
              }} />
            </div>
          </div>
        </Card>

        <Card style={{ borderRadius: 12 }}>
          <Title level={5} style={{ fontSize: 14, marginBottom: 12 }}>Razorpay Integration</Title>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>Connect with Razorpay</div>
              <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>Not Connected</div>
            </div>
            <Button type="primary" style={{ borderRadius: 8, background: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))' }}>
              Connect
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};


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
      case 'checklist': return <ChecklistMasterTab />;
      case 'moodboard': return <MoodboardTab />;
      case 'activity': return <ActivityTab />;
      case 'manpower': return <ManpowerTab />;
      case 'vendors': return <VendorsTab />;
      case 'users': return <UsersTab />;
      case 'permissions': return <PermissionsTab />;
      case 'configuration': return <ConfigurationTab />;
      default: return <PermissionsTab />;
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
        <Title level={4} style={{ marginBottom: 20 }}>
          {tabItems.find(t => t.key === activeTab)?.icon}{' '}
          {tabItems.find(t => t.key === activeTab)?.label}
        </Title>
        {renderContent()}
      </Card>
    </div>
  );
};

export default SettingsPage;
