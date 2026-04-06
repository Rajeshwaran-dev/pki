import { useState, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, Space, Divider, Typography,
  DatePicker, Select, Avatar, Tag, Row, Col, Card,
} from 'antd';
import {
  PlusOutlined, ExportOutlined, EditOutlined, EyeOutlined,
  SearchOutlined, MinusCircleOutlined, UserOutlined,
  MailOutlined, PhoneOutlined, EnvironmentOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { addClient } from '@/store/slices/clientSlice';
import { indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import useIsMobile from '@/hooks/useIsMobile';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const avatarColors = ['#B19625', '#1677FF', '#52C41A', '#722ED1', '#FF4D4F', '#FAAD14'];

const ClientCard = ({ client, index }) => (
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
      <Button size="small" type="text" icon={<EditOutlined />} style={{ color: '#B19625' }}>Edit</Button>
    </div>
  </Card>
);

const ClientsPage = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(s => s.clients.clients);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [form] = Form.useForm();

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
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: '#1677FF' }} />
          <Button type="text" size="small" icon={<EditOutlined />} style={{ color: '#B19625' }} />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.validateFields().then(values => {
      dispatch(addClient({
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
        ...values,
      }));
      setModalOpen(false);
      form.resetFields();
    });
  };

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
              onClick={() => setModalOpen(true)}
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
              <ClientCard client={client} index={i} />
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ background: 'white', borderRadius: 14, padding: isMobile ? 12 : 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
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
        title={<span style={{ fontWeight: 700 }}>Add New Client</span>}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleAdd}
        okText="Add Client"
        okButtonProps={{ style: { background: 'linear-gradient(135deg, #B19625, #C4A840)', border: 'none' } }}
        width={isMobile ? '95%' : 660}
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16, maxHeight: '60vh', overflow: 'auto', paddingRight: 4 }}>
          <Text strong style={{ fontSize: 13, color: '#B19625' }}>Primary Details</Text>
          <Divider style={{ margin: '8px 0 16px' }} />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="clientName" label="Full Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} placeholder="Client name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input prefix={<PhoneOutlined />} placeholder="Phone number" />
          </Form.Item>

          <Text strong style={{ fontSize: 13, color: '#B19625' }}>Address</Text>
          <Divider style={{ margin: '8px 0 16px' }} />
          <Form.Item name="address1" label="Address Line 1"><Input placeholder="Address line 1" /></Form.Item>
          <Form.Item name="address2" label="Address Line 2"><Input placeholder="Address line 2" /></Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="state" label="State">
                <Select placeholder="State" options={indianStates.map(s => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="city" label="City"><Input placeholder="City" /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="pincode" label="Pincode"><Input placeholder="Pincode" /></Form.Item>
            </Col>
          </Row>

          <Text strong style={{ fontSize: 13, color: '#B19625' }}>Business Details</Text>
          <Divider style={{ margin: '8px 0 16px' }} />
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="legalName" label="Legal Name" rules={[{ required: true }]}>
                <Input placeholder="Legal name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="pan" label="PAN"><Input placeholder="PAN number" /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gst" label="GST"><Input placeholder="GST number" /></Form.Item>
            </Col>
          </Row>

          <Text strong style={{ fontSize: 13, color: '#B19625' }}>Additional Contacts</Text>
          <Divider style={{ margin: '8px 0 16px' }} />
          <Form.List name="contacts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Row key={key} gutter={12} align="bottom">
                    <Col span={7}>
                      <Form.Item {...rest} name={[name, 'name']} label="Name">
                        <Input placeholder="Name" />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item {...rest} name={[name, 'phone']} label="Phone">
                        <Input placeholder="Phone" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...rest} name={[name, 'email']} label="Email">
                        <Input placeholder="Email" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Contact
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientsPage;
