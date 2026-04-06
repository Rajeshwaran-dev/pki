import { useState, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, Space,
  DatePicker, Select, Avatar, Tag, Row, Col, Card,
} from 'antd';
import {
  PlusOutlined, ExportOutlined, EditOutlined, EyeOutlined,
  SearchOutlined, MinusCircleOutlined,
  MailOutlined, PhoneOutlined, EnvironmentOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { addClient, updateClient } from '@/store/slices/clientSlice';
import { indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import useIsMobile from '@/hooks/useIsMobile';

const { RangePicker } = DatePicker;
const phoneCodeOptions = [{ value: '+91', label: '+91' }];

const avatarColors = ['#B19625', '#1677FF', '#52C41A', '#722ED1', '#FF4D4F', '#FAAD14'];

const ClientCard = ({ client, index, onEdit }) => (
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
          background: `linear-gradient(135deg, ${avatarColors[index % avatarColors.length]}, ${avatarColors[index % avatarColors.length]}cc)`,
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
        <PhoneOutlined style={{ color: '#B19625' }} /> {client.phone}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#666' }}>
        <MailOutlined style={{ color: '#1677FF' }} /> {client.email || '—'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#666' }}>
        <EnvironmentOutlined style={{ color: '#52C41A' }} /> {client.city}, {client.state}
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
      <Button size="small" type="text" icon={<EyeOutlined />} style={{ color: '#1677FF' }}>View</Button>
      <Button size="small" type="text" icon={<EditOutlined />} style={{ color: '#B19625' }} onClick={() => onEdit(client)}>Edit</Button>
    </div>
  </Card>
);

const ClientsPage = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(s => s.clients.clients);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';
  const [modalOpen, setModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
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
          <Avatar size={36} style={{ background: '#B1962515', color: '#B19625', fontWeight: 700, fontSize: 15 }}>
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
      width: 100,
      render: (_, row) => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: '#1677FF' }} />
          <Button type="text" size="small" icon={<EditOutlined />} style={{ color: '#B19625' }} onClick={() => openEditClientModal(row)} />
        </Space>
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

  const panelBg = isDark ? '#1f1f1f' : '#ffffff';
  const panelBorder = isDark ? '#303030' : '#f0f0f0';

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
              style={{ width: 200, borderRadius: 8 }}
              allowClear
            />
            {!isMobile && <RangePicker style={{ borderRadius: 8 }} />}
            <Space.Compact>
              <Button
                icon={<span style={{ fontSize: 14 }}>☰</span>}
                type={viewMode === 'table' ? 'primary' : 'default'}
                onClick={() => setViewMode('table')}
                style={viewMode === 'table' ? { background: '#B19625', border: 'none' } : {}}
              />
              <Button
                icon={<span style={{ fontSize: 14 }}>⊞</span>}
                type={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewMode('grid')}
                style={viewMode === 'grid' ? { background: '#B19625', border: 'none' } : {}}
              />
            </Space.Compact>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateClientModal}
              style={{ background: 'linear-gradient(135deg, #B19625, #C4A840)', border: 'none' }}
            >
              Add Client
            </Button>
          </>
        }
      />

      {viewMode === 'grid' ? (
        <Row gutter={[16, 16]}>
          {filtered.map((client, i) => (
            <Col key={client.id} xs={24} sm={12} lg={8} xl={6}>
              <ClientCard client={client} index={i} onEdit={openEditClientModal} />
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
          />
        </div>
      )}

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
                  <Select options={indianStates.map(s => ({ value: s, label: s }))} />
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
