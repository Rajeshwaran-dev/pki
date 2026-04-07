import { useState } from 'react';
import {
  Card, Typography, Button, Tag, Row, Col, Table, Avatar,
  Input, DatePicker, Switch, Space,
} from 'antd';
import {
  BankOutlined, AppstoreOutlined, DatabaseOutlined,
  CheckSquareOutlined, PictureOutlined, ThunderboltOutlined,
  TeamOutlined, UserOutlined, LockOutlined, SettingOutlined,
  EditOutlined, UploadOutlined, PlusOutlined, MoreOutlined,
  DeleteOutlined, ExportOutlined, EyeOutlined,
} from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';
import { useAppSelector } from '@/store';

const { Text, Title } = Typography;

const getGoldBtn = (isDark) => ({ background: isDark ? '#5ab5e8' : '#D69F6D', border: 'none', borderRadius: 8 });
const getTableCard = (isDark) => ({
  background: isDark ? '#0d3554' : 'white',
  borderRadius: 14,
  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
  overflow: 'hidden',
  border: isDark ? '1px solid #1a4d72' : 'none',
});
const tableCard = getTableCard(false);

/* ── Pill Sub-tabs ── */
const SubTabs = ({ tabs, active, onChange, isDark }) => (
  <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
    {tabs.map(t => {
      const isActive = active === t.key;
      return (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            padding: '5px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13,
            border: isActive ? `1.5px solid ${isDark ? '#5ab5e8' : '#D69F6D'}` : `1.5px solid ${isDark ? '#1a4d72' : '#e0e0e0'}`,
            background: isActive ? (isDark ? 'rgba(90,181,232,0.18)' : 'rgba(214,159,109,0.12)') : (isDark ? '#0a2235' : 'white'),
            color: isActive ? (isDark ? '#5ab5e8' : '#D69F6D') : (isDark ? '#a8b0ba' : '#555'),
            fontWeight: isActive ? 600 : 400,
          }}
        >
          {t.label}
        </button>
      );
    })}
  </div>
);

/* ── Action edit/delete buttons ── */
const ActionBtns = () => (
  <Space size={6}>
    <Button size="small" icon={<EditOutlined />} style={{ borderRadius: 6, color: '#1677FF', borderColor: '#1677FF' }} />
    <Button size="small" icon={<DeleteOutlined />} danger style={{ borderRadius: 6 }} />
  </Space>
);

/* ── InfoField ── */
const InfoField = ({ label, value, muted, isDark }) => (
  <div>
    <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
    <div style={{ marginTop: 6, padding: '10px 14px', borderRadius: 10, background: isDark ? '#0a2235' : (muted ? '#f7f7f7' : '#e8f2fa'), border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`, fontSize: 13, fontWeight: 500 }}>
      {value || <Text type="secondary">Not set</Text>}
    </div>
  </div>
);

/* ══════════════ ORGANIZATION ══════════════ */
const OrganizationTab = ({ isDark }) => (
  <div className="animate-fade-in">
    <Card className="crm-card" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={5} style={{ margin: 0 }}>Company Information</Title>
        <Button icon={<EditOutlined />} style={{ borderRadius: 8 }}>Edit</Button>
      </div>
      <Row gutter={[20, 16]}>
        <Col xs={24} md={12}><InfoField label="Legal Company Name" value="PERSPECTIVE KITCHENS AND INTERIORS PVT LTD" isDark={isDark} /></Col>
        <Col xs={24} md={12}><InfoField label="Studio Name" value="PERSPECTIVE KITCHENS AND INTERIORS PVT LTD" isDark={isDark} /></Col>
        <Col xs={24} md={12}><InfoField label="GST Number" value="33AAOCP2032L1ZD" isDark={isDark} /></Col>
        <Col xs={24} md={12}><InfoField label="PAN" value="AAOCP2032L" isDark={isDark} /></Col>
      </Row>
      <div style={{ marginTop: 20 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>Company Logo</Text>
        <div style={{ marginTop: 8, padding: '28px 0', borderRadius: 12, background: isDark ? '#0a2235' : '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${isDark ? '#1a4d72' : '#e0e0e0'}` }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: '#1a4d72', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22 }}>PK&I</div>
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
        <Col xs={24} md={12}><InfoField label="Address Line 1" value="No 691/13, NGGO's Colony" isDark={isDark} /></Col>
        <Col xs={24} md={12}><InfoField label="Address Line 2" value="Bagalur Road" isDark={isDark} /></Col>
        <Col xs={24} md={8}><InfoField label="State" value="Tamil Nadu" isDark={isDark} /></Col>
        <Col xs={24} md={8}><InfoField label="City" value="Hosur" isDark={isDark} /></Col>
        <Col xs={24} md={8}><InfoField label="Pincode" value="635109" isDark={isDark} /></Col>
      </Row>
    </Card>
    <Card className="crm-card" styles={{ body: { padding: 24 } }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={5} style={{ margin: 0 }}>Bank Details</Title>
        <Button icon={<EditOutlined />} style={{ borderRadius: 8 }}>Edit</Button>
      </div>
      <Row gutter={[20, 16]}>
        <Col xs={24} md={12}><InfoField label="Bank Name" value="" muted isDark={isDark} /></Col>
        <Col xs={24} md={12}><InfoField label="Account Number" value="" muted isDark={isDark} /></Col>
        <Col xs={24} md={12}><InfoField label="IFSC Code" value="" muted isDark={isDark} /></Col>
        <Col xs={24} md={12}><InfoField label="Branch" value="" muted isDark={isDark} /></Col>
      </Row>
    </Card>
  </div>
);

/* ══════════════ ITEM MASTER ══════════════ */
const itemData = [
  { key: '1', createdOn: '25 Feb, 2026', name: 'Accessories', description: '', clientRate: '0.00', purchaseRate: '0.00', uom: 'LS', gst: '18 %' },
  { key: '2', createdOn: '25 Feb, 2026', name: 'Island Counter', description: '', clientRate: '0.00', purchaseRate: '0.00', uom: 'SQFT', gst: '18 %' },
  { key: '3', createdOn: '25 Feb, 2026', name: 'Display Unit', description: '', clientRate: '0.00', purchaseRate: '0.00', uom: 'SQFT', gst: '18 %' },
  { key: '4', createdOn: '25 Feb, 2026', name: 'Kitchen Base Unit', description: '', clientRate: '0.00', purchaseRate: '0.00', uom: 'Ft', gst: '18 %' },
  { key: '5', createdOn: '24 Mar, 2025', name: 'Rolling Shutter', description: 'HSN 9403', clientRate: '0.00', purchaseRate: '0.00', uom: 'Nos', gst: '18 %' },
  { key: '6', createdOn: '24 Mar, 2025', name: 'Wicker Basket', description: 'HSN 9403', clientRate: '0.00', purchaseRate: '0.00', uom: 'Nos', gst: '18 %' },
  { key: '7', createdOn: '24 Mar, 2025', name: 'TV Unit with Panel', description: 'HSN 9403', clientRate: '0.00', purchaseRate: '0.00', uom: 'Sqft', gst: '18 %' },
  { key: '8', createdOn: '24 Mar, 2025', name: 'Wall Box- Glossy Laminate', description: 'HSN 9403', clientRate: '0.00', purchaseRate: '0.00', uom: 'Sqft', gst: '18 %' },
];
const ItemMasterTab = () => (
  <div className="animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
      <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add Item</Button>
      <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>Export Excel</Button>
    </div>
    <div style={tableCard}>
      <Table dataSource={itemData} size="small" scroll={{ x: 900 }}
        pagination={{ pageSize: 20, showTotal: (t, r) => `Showing ${r[0]} to ${r[1]} of ${t} items` }}
        columns={[
          { title: 'Created On', dataIndex: 'createdOn', width: 130 },
          { title: 'Image', width: 60, render: () => <div style={{ width: 28, height: 28, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#bbb' }}>🖼</div> },
          { title: 'Name', dataIndex: 'name', render: v => <a style={{ color: '#1677FF' }}>{v}</a> },
          { title: 'Description', dataIndex: 'description' },
          { title: 'Client Rate', dataIndex: 'clientRate', width: 110 },
          { title: 'Purchase Rate', dataIndex: 'purchaseRate', width: 120 },
          { title: 'UOM', dataIndex: 'uom', width: 80, render: v => v ? <Tag style={{ borderRadius: 6 }}>{v}</Tag> : null },
          { title: 'GST', dataIndex: 'gst', width: 80, render: v => v ? <Tag style={{ borderRadius: 6 }}>{v}</Tag> : null },
          { title: 'Tag', dataIndex: 'tag', width: 80 },
          { title: '', width: 90, render: () => <ActionBtns /> },
        ]}
      />
    </div>
  </div>
);

/* ══════════════ MATERIALS MASTER ══════════════ */
const materialData = [
  { key: '1', createdOn: '03 Apr, 2025', name: '16mm BWP Plywood', clientRate: '1.00', purchaseRate: '2400.00', uom: 'PCS', gst: '18 %' },
  { key: '2', createdOn: '01 Apr, 2025', name: 'Laminate', clientRate: '1.00', purchaseRate: '1.00', uom: 'PCS', gst: '18 %' },
  { key: '3', createdOn: '27 Mar, 2025', name: '16mm MR Plywood', clientRate: '1.00', purchaseRate: '2000.00', uom: 'PCS', gst: '18 %' },
];
const MaterialsTab = () => {
  const [sub, setSub] = useState('all');
  const matCols = [
    { title: 'Created On', dataIndex: 'createdOn', width: 130 },
    { title: 'Image', width: 60, render: () => <div style={{ width: 28, height: 28, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#bbb' }}>🖼</div> },
    { title: 'Name', dataIndex: 'name', render: v => <a style={{ color: '#1677FF' }}>{v}</a> },
    { title: 'Description', dataIndex: 'description' },
    { title: 'Client Rate', dataIndex: 'clientRate', width: 110 },
    { title: 'Purchase Rate', dataIndex: 'purchaseRate', width: 120 },
    { title: 'UOM', dataIndex: 'uom', width: 80, render: v => v ? <Tag style={{ borderRadius: 6 }}>{v}</Tag> : null },
    { title: 'GST', dataIndex: 'gst', width: 80, render: v => v ? <Tag style={{ borderRadius: 6 }}>{v}</Tag> : null },
    { title: 'Tag', dataIndex: 'tag', width: 80 },
    { title: '', width: 90, render: () => <ActionBtns /> },
  ];
  return (
    <div className="animate-fade-in">
      <SubTabs tabs={[{ key: 'all', label: 'All Materials' }, { key: 'rate', label: 'Rate contracts' }]} active={sub} onChange={setSub} />
      {sub === 'all' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add Material</Button>
            <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>Export Excel</Button>
          </div>
          <div style={tableCard}><Table dataSource={materialData} columns={matCols} size="small" scroll={{ x: 900 }} pagination={{ showTotal: (t, r) => `Showing ${r[0]} to ${r[1]} of ${t} items` }} /></div>
        </>
      )}
      {sub === 'rate' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add Rate Contract</Button>
          </div>
          <div style={tableCard}>
            <Table dataSource={[]} size="small" locale={{ emptyText: 'No data available' }}
              pagination={{ showTotal: () => 'Showing 0 to 0 of 0 items' }}
              columns={[
                { title: 'Contract ID', dataIndex: 'contractId' },
                { title: 'Created date', dataIndex: 'createdDate' },
                { title: 'Created by', dataIndex: 'createdBy' },
                { title: 'Vendor name', dataIndex: 'vendorName' },
                { title: 'Contract Start date', dataIndex: 'startDate' },
                { title: 'Contract End date', dataIndex: 'endDate' },
                { title: 'Total Items', dataIndex: 'totalItems' },
                { title: 'Actions', render: () => <ActionBtns /> },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
};

/* ══════════════ CHECKLIST MASTER ══════════════ */
const ChecklistTab = () => (
  <div className="animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
      <Button style={{ borderRadius: 8, borderColor: '#D69F6D', color: '#D69F6D' }}>+ Create Design Checklist</Button>
      <Button style={{ borderRadius: 8, borderColor: '#D69F6D', color: '#D69F6D' }}>+ Add Handover Checklist</Button>
    </div>
    <div style={{ ...tableCard, padding: '48px 24px', textAlign: 'center' }}>
      <CheckSquareOutlined style={{ fontSize: 40, color: '#d0d0d0', display: 'block', marginBottom: 12 }} />
      <Text type="secondary">No checklists available</Text>
    </div>
  </div>
);

/* ══════════════ MOODBOARD ══════════════ */
const MoodboardTab = ({ isDark }) => {
  const [sub, setSub] = useState('items');
  return (
    <div className="animate-fade-in">
      <SubTabs tabs={[{ key: 'items', label: 'Items' }, { key: 'groups', label: 'Groups' }]} active={sub} onChange={setSub} isDark={isDark} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add New</Button>
      </div>
      <div style={{ ...getTableCard(isDark), padding: '48px 24px', textAlign: 'center' }}>
        <PictureOutlined style={{ fontSize: 40, color: '#d0d0d0', display: 'block', marginBottom: 12 }} />
        <Text type="secondary">No Data Found</Text>
      </div>
    </div>
  );
};

/* ══════════════ ACTIVITY ══════════════ */
const tagData = [
  { key: '1', name: 'Painting' },
  { key: '2', name: 'Countertops' },
  { key: '3', name: 'Electrical' },
];
const activityData = [
  { key: '1', name: 'Snags', tag: '' }, { key: '2', name: 'Wallpaper', tag: '' },
  { key: '3', name: 'Loose Furniture', tag: '' }, { key: '4', name: 'Furnishing', tag: '' },
  { key: '5', name: 'Paint', tag: 'Painting' }, { key: '6', name: 'Putty', tag: 'Painting' },
  { key: '7', name: 'Plasting', tag: 'Painting' }, { key: '8', name: 'Windows & Doors', tag: '' },
  { key: '9', name: 'Carpentry', tag: '' }, { key: '10', name: 'Tiling', tag: '' },
  { key: '11', name: 'Stone', tag: 'Countertops' }, { key: '12', name: 'Tiles', tag: 'Countertops' },
  { key: '13', name: 'Wiring', tag: 'Electrical' }, { key: '14', name: 'Conduting', tag: 'Electrical' },
];
const ActivityTab = () => {
  const [sub, setSub] = useState('tags');
  return (
    <div className="animate-fade-in">
      <SubTabs tabs={[{ key: 'tags', label: 'Tags' }, { key: 'master', label: 'Activity Master' }]} active={sub} onChange={setSub} />
      {sub === 'tags' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add Tag</Button>
          </div>
          <div style={tableCard}>
            <Table dataSource={tagData} size="small" pagination={{ showTotal: t => `${t} items` }}
              columns={[
                { title: 'Name', dataIndex: 'name', render: v => <a style={{ color: '#1677FF' }}>{v}</a> },
                { title: 'Actions', width: 100, render: () => <ActionBtns /> },
              ]}
            />
          </div>
        </>
      )}
      {sub === 'master' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add Activity</Button>
            <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>Import Excel</Button>
          </div>
          <div style={tableCard}>
            <Table dataSource={activityData} size="small" pagination={{ showTotal: t => `${t} items` }}
              columns={[
                { title: 'Name', dataIndex: 'name' },
                { title: 'Activity tag', dataIndex: 'tag', render: v => v ? <a style={{ color: '#1677FF' }}>{v}</a> : null },
                { title: 'Actions', width: 100, render: () => <ActionBtns /> },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
};

/* ══════════════ MANPOWER ══════════════ */
const manpowerData = [
  { key: '1', createdOn: '27 Mar, 2025', name: 'Logistics Team' },
  { key: '2', createdOn: '27 Mar, 2025', name: 'Demolition Crew' },
  { key: '3', createdOn: '27 Mar, 2025', name: 'Plumber' },
  { key: '4', createdOn: '27 Mar, 2025', name: 'Electrician' },
  { key: '5', createdOn: '27 Mar, 2025', name: 'Tile Worker' },
  { key: '6', createdOn: '27 Mar, 2025', name: 'Painter' },
  { key: '7', createdOn: '27 Mar, 2025', name: 'Carpenter' },
];
const ManpowerTab = () => (
  <div className="animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
      <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add Manpower</Button>
      <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>Import Excel</Button>
    </div>
    <div style={tableCard}>
      <Table dataSource={manpowerData} size="small" pagination={{ showTotal: t => `${t} items` }}
        columns={[
          { title: 'Created On', dataIndex: 'createdOn', width: 160 },
          { title: 'Name', dataIndex: 'name', render: v => <a style={{ color: '#1677FF' }}>{v}</a> },
          { title: 'Actions', width: 60, render: () => <Button type="text" size="small" icon={<MoreOutlined />} /> },
        ]}
      />
    </div>
  </div>
);

/* ══════════════ VENDORS ══════════════ */
const vendorData = [
  { key: '1', createdOn: '01 Apr, 2025', code: 'PSVR-002', displayName: 'Shri Karani', pan: 'N/A', gst: '', legalName: 'Shri Karani', phone: '', city: 'Salem', vendorType: '', status: 'Active' },
  { key: '2', createdOn: '27 Mar, 2025', code: 'PSVR-001', displayName: 'Test Vendor', pan: 'N/A', gst: '', legalName: '', phone: '', city: 'Kadapa', vendorType: '', status: 'Active' },
];
const VendorsTab = () => {
  const [sub, setSub] = useState('all');
  const filtered = sub === 'all' ? vendorData : sub === 'active' ? vendorData.filter(v => v.status === 'Active') : sub === 'inactive' ? vendorData.filter(v => v.status === 'Inactive') : [];
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SubTabs
          tabs={[
            { key: 'all', label: `All (${vendorData.length})` },
            { key: 'active', label: `Active (${vendorData.filter(v => v.status === 'Active').length})` },
            { key: 'inactive', label: `Inactive (0)` },
            { key: 'blacklist', label: `Blacklist (0)` },
          ]}
          active={sub} onChange={setSub}
        />
        <Space>
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add Vendor</Button>
          <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>Export Excel</Button>
        </Space>
      </div>
      <div style={tableCard}>
        <Table dataSource={filtered} size="small" scroll={{ x: 1000 }}
          pagination={{ showTotal: t => `${t} items` }}
          columns={[
            { title: 'Created On', dataIndex: 'createdOn', width: 120 },
            { title: 'Vendor Code', dataIndex: 'code', width: 120, render: v => <a style={{ color: '#1677FF' }}>{v}</a> },
            { title: 'Display name', dataIndex: 'displayName', width: 140 },
            { title: 'PAN', dataIndex: 'pan', width: 80, render: v => v ? <Tag style={{ borderRadius: 6 }}>{v}</Tag> : null },
            { title: 'GST Number', dataIndex: 'gst', width: 130 },
            { title: 'Legal Name', dataIndex: 'legalName' },
            { title: 'Phone', dataIndex: 'phone', width: 120 },
            { title: 'City', dataIndex: 'city', width: 100 },
            { title: 'Vendor Type', dataIndex: 'vendorType', width: 110 },
            { title: 'Status', dataIndex: 'status', width: 90, render: v => v ? <Tag color={v === 'Active' ? 'success' : 'default'} style={{ borderRadius: 6 }}>{v}</Tag> : null },
            { title: 'View Details', width: 100, render: () => <Button size="small" icon={<EyeOutlined />} style={{ borderRadius: 6, borderColor: '#1677FF', color: '#1677FF' }} /> },
          ]}
        />
      </div>
    </div>
  );
};

/* ══════════════ USERS ══════════════ */
const internalUsers = [
  { key: '1', name: 'Ramu', phone: '+91 9626419878', joiningDate: '', email: '', role: '', groups: ['Project Files', '+7'] },
  { key: '2', name: 'Chandra Bose', phone: '+91 8925835892', joiningDate: '', email: '', role: '', groups: ['Quote', '+6'] },
  { key: '3', name: 'Sathish', phone: '+91 8925835895', joiningDate: '', email: '', role: '', groups: ['Project Files', '+10'] },
  { key: '4', name: 'Vighnesh Shetty', phone: '+91 7348941417', joiningDate: '', email: '', role: '', groups: ['Moodboard', '+10'] },
  { key: '5', name: 'Renuga Devi', phone: '+91 6369467389', joiningDate: '', email: '', role: '', groups: ['Moodboard', '+5'] },
  { key: '6', name: 'Praveen Kumar', phone: '+91 7010017410', joiningDate: '', email: '', role: '', groups: ['Moodboard', '+5'] },
  { key: '7', name: 'Madhu Loganathan', phone: '+91 8925835894', joiningDate: '', email: '', role: '', groups: ['Project Files', '+8'] },
  { key: '8', name: 'Sharmila', phone: '+91 7200989485', joiningDate: '', email: '', role: '', groups: ['Moodboard', '+15'] },
  { key: '9', name: 'Thara', phone: '+91 9008949311', joiningDate: '', email: '', role: '', groups: ['Can Punch In Punch Out', '+1'] },
  { key: '10', name: 'Anantha Narayana', phone: '+91 9944166332', joiningDate: '', email: 'ananth@perspectivekitchens.com', role: '', groups: ['Can Punch In Punch Out', '+1'] },
];
const UsersTab = () => {
  const [sub, setSub] = useState('internal');
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SubTabs
          tabs={[
            { key: 'internal', label: `Internal Users (${internalUsers.length})` },
            { key: 'clients', label: 'Clients (0)' },
            { key: 'vendors', label: 'Vendors (0)' },
          ]}
          active={sub} onChange={setSub}
        />
        <Button type="primary" icon={<PlusOutlined />} style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Add User</Button>
      </div>
      <div style={tableCard}>
        <Table
          dataSource={sub === 'internal' ? internalUsers : []}
          size="small"
          pagination={{ showTotal: t => `${t} items` }}
          columns={[
            { title: 'Name', dataIndex: 'name', render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
            { title: 'Phone', dataIndex: 'phone', width: 160 },
            { title: 'Joining Date', dataIndex: 'joiningDate', width: 130 },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Role', dataIndex: 'role', width: 120 },
            {
              title: 'Groups', dataIndex: 'groups', width: 200,
              render: groups => groups?.length ? (
                <Space size={4} wrap>
                  <Tag style={{ borderRadius: 6, fontSize: 11 }}>{groups[0]}</Tag>
                  {groups[1] && <Tag style={{ borderRadius: 6, fontSize: 11 }}>{groups[1]}</Tag>}
                </Space>
              ) : null,
            },
            { title: 'Actions', width: 60, render: () => <Button type="text" size="small" icon={<MoreOutlined style={{ color: '#1677FF' }} />} style={{ border: '1px solid #1677FF', borderRadius: 6 }} /> },
          ]}
        />
      </div>
    </div>
  );
};

/* ══════════════ PERMISSIONS ══════════════ */
const PermissionsTab = () => {
  const roles = ['Admin', 'Designer', 'Site Manager', 'Viewer'];
  const modules = ['Projects', 'Clients', 'Tasks', 'Reports', 'Settings', 'Users'];
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Button type="primary" style={{ background: '#D69F6D', border: 'none', borderRadius: 8 }}>Save Changes</Button>
      </div>
      <div style={tableCard}>
        <Table size="small" pagination={false}
          dataSource={modules.map((m, i) => ({ key: i, module: m, admin: true, designer: m !== 'Settings' && m !== 'Users', sitemanager: m === 'Projects' || m === 'Tasks', viewer: true }))}
          columns={[
            { title: 'Module', dataIndex: 'module', width: 160, render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
            ...roles.map(r => ({ title: r, dataIndex: r.toLowerCase().replace(' ', ''), width: 120, render: v => <Tag color={v ? 'success' : 'default'} style={{ borderRadius: 6 }}>{v ? 'Allowed' : 'Denied'}</Tag> })),
          ]}
        />
      </div>
    </div>
  );
};

/* ══════════════ CONFIGURATION ══════════════ */
const configModules = ['Finance', 'Orders', 'Invoices', 'Checklist', 'Tasks', 'Projects'];

const FinanceConfig = ({ isDark }) => {
  const fields = [
    { key: 'date', label: 'Date', on: true },
    { key: 'amount', label: 'Amount', on: true },
    { key: 'type', label: 'Type', on: false },
    { key: 'ref', label: 'Reference number', on: false },
    { key: 'channel', label: 'Channel', on: false },
    { key: 'vendor', label: 'Vendor', on: false },
    { key: 'fileupload', label: 'File Upload', on: false },
    { key: 'order', label: 'Order', on: false },
    { key: 'remarks', label: 'remarks', on: false },
  ];
  const [toggles, setToggles] = useState(Object.fromEntries(fields.map(f => [f.key, f.on])));
  return (
    <>
      <Title level={5} style={{ margin: '0 0 16px' }}>Select Fields that are mandatory</Title>
      <div style={{ border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`, borderRadius: 10, padding: 20, marginBottom: 16, background: isDark ? '#0d3554' : 'transparent' }}>
        <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 16 }}>Form Settings</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {fields.map(f => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: toggles[f.key] ? (isDark ? 'rgba(22,119,255,0.18)' : '#EEF4FF') : (isDark ? '#0a2235' : '#fafafa'), borderRadius: 8, padding: '10px 14px' }}>
              <div>
                <div style={{ fontSize: 13 }}>{f.label}</div>
                <div style={{ fontSize: 11, color: toggles[f.key] ? '#1677FF' : '#999' }}>{toggles[f.key] ? 'On' : 'Off'}</div>
              </div>
              <Switch size="small" checked={toggles[f.key]} onChange={v => setToggles(p => ({ ...p, [f.key]: v }))} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`, borderRadius: 10, padding: 16, marginBottom: 16, background: isDark ? '#0d3554' : 'transparent' }}>
        <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10 }}>Mandatory Fields Selected:</Text>
        <Space wrap>{Object.entries(toggles).filter(([, v]) => v).map(([k]) => <Tag key={k} color="blue" style={{ borderRadius: 6 }}>{fields.find(f => f.key === k)?.label}</Tag>)}</Space>
      </div>
      <div style={{ border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`, borderRadius: 10, padding: 16, marginBottom: 16, background: isDark ? '#0d3554' : 'transparent' }}>
        <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 12 }}>Payment Settings</Text>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isDark ? 'rgba(22,119,255,0.18)' : '#EEF4FF', borderRadius: 8, padding: '12px 16px' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Create payments for approved orders only</div>
            <div style={{ fontSize: 11, color: '#1677FF' }}>Enabled</div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
      <div style={{ border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`, borderRadius: 10, padding: 16, background: isDark ? '#0d3554' : 'transparent' }}>
        <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 12 }}>Razorpay Integration</Text>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isDark ? '#0a2235' : '#fafafa', borderRadius: 8, padding: '12px 16px' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Connect with Razorpay</div>
            <div style={{ fontSize: 11, color: '#999' }}>Not Connected</div>
          </div>
          <Button type="primary" size="small" style={{ borderRadius: 6 }}>Connect</Button>
        </div>
      </div>
    </>
  );
};

const OrdersConfig = ({ isDark }) => (
  <>
    <Title level={5} style={{ margin: '0 0 16px' }}>Order Settings</Title>
    <div style={{ border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`, borderRadius: 10, padding: 16, background: isDark ? '#0d3554' : 'transparent' }}>
      <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 12 }}>Permissions</Text>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isDark ? '#0a2235' : '#fafafa', borderRadius: 8, padding: '12px 16px' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Can edit order if approved</div>
          <div style={{ fontSize: 11, color: '#999' }}>Disabled</div>
        </div>
        <Switch defaultChecked={false} />
      </div>
    </div>
  </>
);

const CustomFieldsConfig = ({ label }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <Title level={5} style={{ margin: 0 }}>Custom Fields for {label}</Title>
      <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>+ Add Row</Button>
    </div>
    <div style={tableCard}>
      <Table dataSource={[]} size="small"
        locale={{ emptyText: <div style={{ padding: '32px 0', color: '#bbb' }}><div style={{ fontSize: 28, marginBottom: 8 }}>⊞</div>No custom fields yet. Click "Add Row" to create one.</div> }}
        pagination={false}
        columns={[
          { title: 'FIELD NAME', dataIndex: 'fieldName' },
          { title: 'FIELD TYPE', dataIndex: 'fieldType' },
          { title: 'INPUT TYPE', dataIndex: 'inputType' },
          { title: 'OPTIONS (FOR SELECT TYPE)', dataIndex: 'options' },
          { title: 'ACTIONS', dataIndex: 'actions' },
        ]}
      />
    </div>
  </>
);

const moduleContent = {
  Finance: <FinanceConfig />,
  Orders: <OrdersConfig />,
  Invoices: <CustomFieldsConfig label="Invoices" />,
  Checklist: <CustomFieldsConfig label="Checklist" />,
  Tasks: <CustomFieldsConfig label="Tasks" />,
  Projects: <CustomFieldsConfig label="Projects" />,
};

const ConfigurationTab = ({ isDark }) => {
  const [activeModule, setActiveModule] = useState('Finance');
  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: 0, background: isDark ? '#0d3554' : 'white', borderRadius: 14, boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', minHeight: 400, border: isDark ? '1px solid #1a4d72' : 'none' }}>
      {/* Left module list */}
      <div style={{ width: 180, flexShrink: 0, borderRight: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`, padding: '20px 0' }}>
        <div style={{ fontSize: 14, fontWeight: 700, padding: '0 20px 14px', color: isDark ? '#f0f0f0' : '#0d3554' }}>Modules</div>
        {configModules.map(m => (
          <div
            key={m}
            onClick={() => setActiveModule(m)}
            style={{
              padding: '10px 20px', cursor: 'pointer', fontSize: 13,
              color: activeModule === m ? '#1677FF' : (isDark ? '#a8b0ba' : '#555'),
              background: activeModule === m ? (isDark ? 'rgba(22,119,255,0.18)' : '#EEF4FF') : 'transparent',
              fontWeight: activeModule === m ? 600 : 400,
              borderLeft: activeModule === m ? '3px solid #1677FF' : '3px solid transparent',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { if (activeModule !== m) e.currentTarget.style.background = isDark ? '#0a2235' : '#fafafa'; }}
            onMouseLeave={e => { if (activeModule !== m) e.currentTarget.style.background = 'transparent'; }}
          >
            {m}
          </div>
        ))}
      </div>
      {/* Right content */}
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ borderBottom: '2px solid #1677FF', display: 'inline-block', paddingBottom: 8, marginBottom: 24 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1677FF' }}>Form settings</span>
        </div>
        {activeModule === 'Finance' && <FinanceConfig isDark={isDark} />}
        {activeModule === 'Orders' && <OrdersConfig isDark={isDark} />}
        {!['Finance', 'Orders'].includes(activeModule) && moduleContent[activeModule]}
      </div>
    </div>
  );
};

/* ══════════════ TAB DEFINITIONS ══════════════ */
const tabs = [
  { key: 'organization', label: 'Organization Details', icon: <BankOutlined /> },
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

const tabComponents = {
  organization: <OrganizationTab />,
  items: <ItemMasterTab />,
  materials: <MaterialsTab />,
  checklist: <ChecklistTab />,
  moodboard: <MoodboardTab />,
  activity: <ActivityTab />,
  manpower: <ManpowerTab />,
  vendors: <VendorsTab />,
  users: <UsersTab />,
  permissions: <PermissionsTab />,
  configuration: <ConfigurationTab />,
};

/* ══════════════ MAIN PAGE ══════════════ */
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('organization');
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';
  const tableCard = getTableCard(isDark);

  return (
    <div>
      <PageHeader title="Settings" />

      <div style={{ background: isDark ? '#0d3554' : 'white', borderRadius: 14, padding: '10px 16px', marginBottom: 16, boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)', border: isDark ? '1px solid #1a4d72' : 'none' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 2 }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="pill-tab"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 24,
                  border: isActive ? `2px solid ${isDark ? '#5ab5e8' : '#D69F6D'}` : '2px solid transparent',
                  background: isActive ? (isDark ? 'rgba(90,181,232,0.2)' : 'rgba(214,159,109,0.12)') : (isDark ? 'rgba(255,255,255,0.04)' : '#f7f7f7'),
                  color: isActive ? (isDark ? '#5ab5e8' : '#D69F6D') : (isDark ? '#8c9baf' : '#666'),
                  fontWeight: isActive ? 700 : 400,
                  fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 13 }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div key={activeTab}>
        {activeTab === 'organization' && <OrganizationTab isDark={isDark} />}
        {activeTab === 'configuration' && <ConfigurationTab isDark={isDark} />}
        {activeTab === 'moodboard' && <MoodboardTab isDark={isDark} />}
        {!['organization', 'configuration', 'moodboard'].includes(activeTab) && tabComponents[activeTab]}
      </div>
    </div>
  );
};

export default SettingsPage;
