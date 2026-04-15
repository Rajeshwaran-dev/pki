import { useState, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, Space, Dropdown,
  DatePicker, Select, Avatar, Tag, Row, Col, Card, Descriptions, Tooltip,
} from 'antd';
import {
  PlusOutlined, ExportOutlined, EditOutlined, EyeOutlined,
  SearchOutlined, MinusCircleOutlined, MoreOutlined,
  MailOutlined, PhoneOutlined, EnvironmentOutlined, FilterOutlined,
  UnorderedListOutlined, AppstoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { addClient, updateClient } from '@/store/slices/clientSlice';
import { indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import useIsMobile from '@/hooks/useIsMobile';

const { RangePicker } = DatePicker;
const phoneCodeOptions = [{ value: '+91', label: '+91' }];

const ClientCard = ({ client, index, onEdit, onView, isDark, primaryColor }) => (
  <Card
    className="crm-card animate-fade-in-up"
    style={{ animationDelay: `${index * 0.05}s` }}
    hoverable
    styles={{ body: { padding: '16px 20px' } }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <Avatar
        size={46}
        style={{
          background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)',
          color: primaryColor,
          fontWeight: 700, fontSize: 18, flexShrink: 0,
        }}
      >
        {client.clientName.charAt(0)}
      </Avatar>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{client.clientName}</div>
        <div style={{ fontSize: 11, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {client.legalName}
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#666' }}>
        <PhoneOutlined style={{ color: '#999' }} /> {client.phone}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#666' }}>
        <MailOutlined style={{ color: '#999' }} /> {client.email || '—'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#666' }}>
        <EnvironmentOutlined style={{ color: '#999' }} /> {client.city}, {client.state}
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14, paddingTop: 12, borderTop: isDark ? '1px solid #1a4d72' : '1px solid #f5f5f5' }}>
      <Button size="small" type="text" icon={<EyeOutlined />} style={{ color: primaryColor }} onClick={() => onView(client.id)}>View</Button>
      <Button size="small" type="text" icon={<EditOutlined />} style={{ color: primaryColor }} onClick={() => onEdit(client)}>Edit</Button>
    </div>
  </Card>
);

const ClientsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const clients = useAppSelector(s => s.clients.clients);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const [modalOpen, setModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [contacts, setContacts] = useState([]);

  const filtered = useMemo(() => {
    if (!search) return clients;
    return clients.filter(c =>
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.legalName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  }, [clients, search]);

  const columns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      width: 200,
      render: (name, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar size={36} style={{ background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)', color: primaryColor, fontWeight: 700, fontSize: 15 }}>
            {name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
            <div style={{ fontSize: 11, color: '#999' }}>since {row.createdDate}</div>
          </div>
        </div>
      ),
    },
    { title: 'Legal Name', dataIndex: 'legalName', width: 200, ellipsis: true },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 150,
      render: v => <a href={`tel:${v}`} style={{ color: '#1677FF' }}>{v}</a>,
    },
    { title: 'City', dataIndex: 'city', width: 110 },
    { title: 'State', dataIndex: 'state', width: 130 },
    {
      title: 'GST/PAN',
      dataIndex: 'gst',
      width: 160,
      render: (gst, row) => gst ? <Tag color="gold" style={{ borderRadius: 6 }}>{gst}</Tag> : (row.pan ? <Tag style={{ borderRadius: 6 }}>{row.pan}</Tag> : '—'),
    },
    {
      title: 'Actions',
      width: 80,
      fixed: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'view',
                  icon: <EyeOutlined style={{ color: '#1677FF' }} />,
                  label: 'View',
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    navigate(`/clients/${row.id}`);
                  },
                },
                {
                  key: 'edit',
                  icon: <EditOutlined style={{ color: primaryColor }} />,
                  label: 'Edit',
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    openEditClientModal(row);
                  },
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined style={{ fontSize: 16, color: '#999' }} />}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    form.validateFields().then(values => {
      const payload = {
        ...(editingClient || {}),
        id: editingClient?.id || Date.now().toString(),
        createdDate: editingClient?.createdDate || new Date().toISOString().split('T')[0],
        phone: `${values.phoneCode || '+91'} ${values.phone || ''}`.trim(),
        contacts,
        ...values,
      };
      if (editingClient) {
        dispatch(updateClient(payload));
      } else {
        dispatch(addClient(payload));
      }
      setModalOpen(false);
      form.resetFields();
      contactForm.resetFields();
      setContacts([]);
      setEditingClient(null);
    });
  };

  const openCreateClientModal = () => {
    setEditingClient(null);
    form.resetFields();
    setContacts([]);
    setModalOpen(true);
  };

  const openViewClientModal = (client) => {
    setViewClient(client);
    setViewModalOpen(true);
  };

  const closeViewClientModal = () => {
    setViewModalOpen(false);
    setViewClient(null);
  };

  const openEditClientModal = (client) => {
    setEditingClient(client);
    setContacts(client.contacts || []);
    form.setFieldsValue({
      clientName: client.clientName,
      email: client.email || '',
      phoneCode: client.phone?.startsWith('+91') ? '+91' : '+91',
      phone: client.phone?.replace(/^\+91\s*/, '') || client.phone || '',
      address1: client.address1 || '',
      address2: client.address2 || '',
      state: client.state || '',
      city: client.city || '',
      location: client.location || '',
      pincode: client.pincode || '',
      legalName: client.legalName || '',
      pan: client.pan || '',
      gst: client.gst || '',
      remarks: client.remarks || '',
    });
    setModalOpen(true);
  };

  const handleAddContact = () => {
    contactForm.validateFields().then(values => {
      setContacts(prev => [
        ...prev,
        {
          key: Date.now().toString(),
          name: values.name,
          email: values.email || '',
          phone: `${values.phoneCode || '+91'} ${values.phone || ''}`.trim(),
        },
      ]);
      setContactModalOpen(false);
      contactForm.resetFields();
    });
  };

  const panelBg = isDark ? '#0d3554' : '#ffffff';
  const panelBorder = isDark ? '#1a4d72' : '#f0f0f0';

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} total clients`}
        actions={
          <>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search clients…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: isMobile ? 180 : 220, borderRadius: 8 }}
              allowClear
            />
            {!isMobile && <RangePicker style={{ borderRadius: 8 }} />}
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8 }} className="crm-outline-btn">Filter</Button>
            <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }} className="crm-outline-btn">Export</Button>
            <Space.Compact style={{ borderRadius: 8, overflow: 'hidden' }}>
              <Tooltip title="List View">
                <Button
                  icon={<UnorderedListOutlined />}
                  type={viewMode === 'table' ? 'primary' : 'default'}
                  onClick={() => setViewMode('table')}
                  style={viewMode === 'table' ? { background: primaryColor, border: 'none', color: '#fff' } : {}}
                >
                  {!isMobile && 'List'}
                </Button>
              </Tooltip>
              <Tooltip title="Grid View">
                <Button
                  icon={<AppstoreOutlined />}
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                  style={viewMode === 'grid' ? { background: primaryColor, border: 'none', color: '#fff' } : {}}
                >
                  {!isMobile && 'Grid'}
                </Button>
              </Tooltip>
            </Space.Compact>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateClientModal}
              style={{ background: primaryColor, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 500 }}
            >
              {!isMobile && 'Add Client'}
            </Button>
          </>
        }
      />

      {viewMode === 'grid' ? (
        <Row gutter={[16, 16]}>
          {filtered.map((client, i) => (
            <Col key={client.id} xs={24} sm={12} lg={8} xl={6}>
              <ClientCard client={client} index={i} onEdit={openEditClientModal} onView={(id) => navigate(`/clients/${id}`)} isDark={isDark} primaryColor={primaryColor} />
            </Col>
          ))}
        </Row>
      ) : (
        <div
          style={{
            background: panelBg,
            borderRadius: 14,
            padding: isMobile ? 12 : 20,
            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
            border: `1px solid ${panelBorder}`,
          }}
        >
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showTotal: t => `${t} clients` }}
            scroll={{ x: 900 }}
            size="middle"
            onRow={(record) => ({
              onClick: () => navigate(`/clients/${record.id}`),
              style: { cursor: 'pointer' }
            })}
          />
        </div>
      )}

      <Modal
        className="crm-modal"
        title={<span>Client Details</span>}
        open={viewModalOpen}
        onCancel={closeViewClientModal}
        footer={null}
        width={isMobile ? '96%' : 720}
        centered
      >
        {viewClient ? (
          <Descriptions
            column={1}
            size="small"
            bordered
            layout={isMobile ? 'vertical' : 'horizontal'}
            labelStyle={{ width: 140, fontWeight: 600 }}
          >
            <Descriptions.Item label="Client Name">{viewClient.clientName}</Descriptions.Item>
            <Descriptions.Item label="Legal Name">{viewClient.legalName || '—'}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewClient.email || '—'}</Descriptions.Item>
            <Descriptions.Item label="Phone">{viewClient.phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="City">{viewClient.city || '—'}</Descriptions.Item>
            <Descriptions.Item label="State">{viewClient.state || '—'}</Descriptions.Item>
            <Descriptions.Item label="PAN">{viewClient.pan || '—'}</Descriptions.Item>
            <Descriptions.Item label="GST">{viewClient.gst || '—'}</Descriptions.Item>
            <Descriptions.Item label="Created Date">{viewClient.createdDate || '—'}</Descriptions.Item>
            <Descriptions.Item label="Address Line 1">{viewClient.address1 || '—'}</Descriptions.Item>
            <Descriptions.Item label="Address Line 2">{viewClient.address2 || '—'}</Descriptions.Item>
            <Descriptions.Item label="Location">{viewClient.location || '—'}</Descriptions.Item>
            <Descriptions.Item label="Pincode">{viewClient.pincode || '—'}</Descriptions.Item>
            <Descriptions.Item label="Remarks">{viewClient.remarks || '—'}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>

      {/* Add Modal */}
      <Modal
        className="crm-modal"
        title={<span>{editingClient ? 'Edit Client' : 'New Client'}</span>}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          contactForm.resetFields();
          setContacts([]);
          setEditingClient(null);
        }}
        onOk={handleAdd}
        okText="Submit"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : 860}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          className="crm-form-shell"
          initialValues={{ phoneCode: '+91' }}
        >
          <div className="crm-section">
            <div className="crm-section-title">
              <span className="crm-section-badge">1</span>
              <span>Primary Details</span>
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="clientName" label="Name" rules={[{ required: true, message: 'This is a required field.' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Enter a valid email address.' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item name="phoneCode" label="Phone" rules={[{ required: true }]}>
                  <Select options={phoneCodeOptions} />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="phone" label=" " colon={false} rules={[{ required: true, message: 'This is a required field.' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="crm-section">
            <div className="crm-section-title">
              <span className="crm-section-badge">2</span>
              <span>Address Details</span>
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="address1" label="Address Line 1">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address2" label="Address Line 2">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item name="state" label="State">
                  <Select placeholder="Select state" options={indianStates.map(s => ({ value: s, label: s }))} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="city" label="City">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="location" label="Location">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="pincode" label="Pincode">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="crm-section">
            <div className="crm-section-title">
              <span className="crm-section-badge">3</span>
              <span>Client Details</span>
            </div>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="legalName" label="Legal Name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="pan" label="PAN">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="gst" label="GST Number">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>

          <div className="crm-section" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div className="crm-section-title" style={{ marginBottom: 0 }}>
                <span className="crm-section-badge">4</span>
                <span>Additional Contacts</span>
              </div>
              <Button className="crm-outline-btn" icon={<PlusOutlined />} onClick={() => setContactModalOpen(true)}>
                Add Contact
              </Button>
            </div>

            <div className="crm-muted-table">
              <Table
                dataSource={contacts}
                rowKey="key"
                pagination={false}
                locale={{ emptyText: 'No data available' }}
                columns={[
                  { title: 'Name', dataIndex: 'name' },
                  { title: 'E-Mail', dataIndex: 'email' },
                  { title: 'Phone', dataIndex: 'phone' },
                  {
                    title: '',
                    width: 56,
                    render: (_, record) => (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => setContacts(prev => prev.filter(item => item.key !== record.key))}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </Form>

        <Modal
          className="crm-modal"
          title={<span>Add Contact</span>}
          open={contactModalOpen}
          onCancel={() => {
            setContactModalOpen(false);
            contactForm.resetFields();
          }}
          onOk={handleAddContact}
          okText="Submit"
          cancelButtonProps={{ style: { display: 'none' } }}
          okButtonProps={{ className: 'crm-primary-btn' }}
          width={isMobile ? '96%' : 520}
          centered
        >
          <Form
            form={contactForm}
            layout="vertical"
            className="crm-form-shell"
            initialValues={{ phoneCode: '+91' }}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="E-Mail" rules={[{ type: 'email', message: 'Enter a valid email address.' }]}>
              <Input />
            </Form.Item>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item name="phoneCode" label="Phone" rules={[{ required: true }]}>
                  <Select options={phoneCodeOptions} />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item name="phone" label=" " colon={false} rules={[{ required: true, message: 'Phone is required' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Modal>
    </div>
  );
};

export default ClientsPage;
