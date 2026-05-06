import { useState } from 'react';
import { Table, Button, Tag, Space, Avatar, Tooltip, Modal, Form, Input, Select, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';
import { useAppSelector } from '@/store';
import useIsMobile from '@/hooks/useIsMobile';

// Single source of truth for colors moved inside component to use theme primary

const internalUsers = [
  { key: '1',  name: 'Anantha Narayana', initials: 'AN', phone: '+91 9944166332', joiningDate: '2022-04-01', email: 'ananth@perspectivekitchens.com',      role: 'Super Admin', status: 'Active' },
  { key: '2',  name: 'Ramu',             initials: 'RM', phone: '+91 9626419878', joiningDate: '2022-06-15', email: 'ramu@perspectivekitchens.com',         role: 'Designer',    status: 'Active' },
  { key: '3',  name: 'Chandra Bose',     initials: 'CB', phone: '+91 8925835892', joiningDate: '2022-08-01', email: 'chandrabose@perspectivekitchens.com',  role: 'Designer',    status: 'Active' },
  { key: '4',  name: 'Sathish',          initials: 'ST', phone: '+91 8925835895', joiningDate: '2023-01-10', email: 'sathish@perspectivekitchens.com',      role: 'Site Manager',status: 'Active' },
  { key: '5',  name: 'Vighnesh Shetty',  initials: 'VS', phone: '+91 7348941417', joiningDate: '2023-03-20', email: 'vighnesh@perspectivekitchens.com',     role: 'Designer',    status: 'Active' },
  { key: '6',  name: 'Renuga Devi',      initials: 'RD', phone: '+91 6369467389', joiningDate: '2023-05-01', email: 'renuga@perspectivekitchens.com',       role: 'Designer',    status: 'Active' },
  { key: '7',  name: 'Praveen Kumar',    initials: 'PK', phone: '+91 7010017410', joiningDate: '2023-06-12', email: 'praveen@perspectivekitchens.com',      role: 'Site Manager',status: 'Active' },
  { key: '8',  name: 'Madhu Loganathan', initials: 'ML', phone: '+91 8925835894', joiningDate: '2023-07-01', email: 'madhu@perspectivekitchens.com',        role: 'Designer',    status: 'Active' },
  { key: '9',  name: 'Sharmila',         initials: 'SH', phone: '+91 7200989485', joiningDate: '2023-09-15', email: 'sharmila@perspectivekitchens.com',     role: 'Accountant',  status: 'Active' },
  { key: '10', name: 'Thara',            initials: 'TH', phone: '+91 9008949311', joiningDate: '2024-01-05', email: 'thara@perspectivekitchens.com',        role: 'Viewer',      status: 'Active' },
];

const SubTabs = ({ tabs, active, onChange, primaryColor, sectionBorder }) => (
  <div style={{ overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
    <div style={{ display: 'flex', gap: 6, width: 'max-content' }}>
      {tabs.map(t => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              padding: '5px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 14,
              border: `1.5px solid ${isActive ? primaryColor : sectionBorder}`,
              background: isActive ? `${primaryColor}18` : 'transparent',
              color: isActive ? primaryColor : '#888',
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default function UserManagementSettings() {
  const [sub, setSub] = useState('internal');
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [form] = Form.useForm();
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';

  const primaryColor  = isDark ? '#5ab5e8'  : '#D69F6D';
  const sectionBg     = isDark ? '#081b2f'  : '#f8fafd';
  const sectionBorder = isDark ? '#1a4d72'  : '#e8f0fb';
  const cardBg        = isDark ? '#0d3554'  : '#ffffff';

  const filtered = internalUsers.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="User Management" />

      <div className="animate-fade-in">
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap', gap: 12, marginBottom: 16,
        }}>
          <SubTabs
            tabs={[
              { key: 'internal', label: `Internal Users (${internalUsers.length})` },
              { key: 'clients',  label: 'Clients (0)' },
              { key: 'vendors',  label: 'Vendors (0)' },
            ]}
            active={sub}
            onChange={setSub}
            primaryColor={primaryColor}
            sectionBorder={sectionBorder}
          />
          <Space wrap={isMobile} style={{ width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: '#aaa' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: isMobile ? 'calc(100% - 100px)' : 180, borderRadius: 8 }}
              size="small"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModal(true)}
              style={{ background: primaryColor, border: 'none', borderRadius: 8 }}
            >
              Add
            </Button>
          </Space>
        </div>

        {/* Table card */}
        <div style={{
          background: cardBg,
          borderRadius: 14,
          boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          border: `1px solid ${sectionBorder}`,
        }}>
          <Table
            dataSource={sub === 'internal' ? filtered : []}
            size="small"
            pagination={{ pageSize: 10, showTotal: t => `${t} users` }}
            scroll={{ x: 'max-content' }}
            columns={[
              {
                title: 'Name', dataIndex: 'name', width: 210,
                render: (v, r) => (
                  <Space>
                    <Avatar size={32} style={{ background: primaryColor, fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                      {r.initials}
                    </Avatar>
                    <span style={{ fontWeight: 500, fontSize: 16 }}>{v}</span>
                  </Space>
                ),
              },
              { title: 'Phone',        dataIndex: 'phone',       width: 150 },
              { title: 'Joining Date', dataIndex: 'joiningDate', width: 120 },
              { title: 'Email',        dataIndex: 'email' },
              {
                title: 'Role', dataIndex: 'role', width: 130,
                render: v => (
                    <Tag style={{
                    background: `${primaryColor}18`, color: primaryColor,
                    border: `1px solid ${primaryColor}40`,
                    borderRadius: 6, fontSize: 14, fontWeight: 500,
                  }}>
                    {v}
                  </Tag>
                ),
              },
              {
                title: 'Status', dataIndex: 'status', width: 90,
                render: v => (
                  <Tag color={v === 'Active' ? 'success' : 'default'} style={{ borderRadius: 6, fontSize: 14 }}>
                    {v}
                  </Tag>
                ),
              },
              {
                title: 'Actions', width: 80, align: 'center',
                render: () => (
                  <Space size={4}>
                    <Tooltip title="Edit">
                      <Button size="small" type="text" icon={<EditOutlined />} style={{ color: primaryColor }} />
                    </Tooltip>
                    <Tooltip title="Remove">
                      <Button size="small" type="text" icon={<DeleteOutlined />} danger />
                    </Tooltip>
                  </Space>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={addModal}
        onCancel={() => { setAddModal(false); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Add User"
        okButtonProps={{ style: { background: primaryColor, border: 'none' } }}
      >
        <Form form={form} layout="vertical" onFinish={() => { setAddModal(false); form.resetFields(); }}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. John Doe" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="+91 XXXXX XXXXX" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="user@perspectivekitchens.com" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              {['Super Admin', 'Admin', 'Designer', 'Site Manager', 'Accountant', 'Viewer'].map(r => <Select.Option key={r} value={r}>{r}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="joiningDate" label="Joining Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
