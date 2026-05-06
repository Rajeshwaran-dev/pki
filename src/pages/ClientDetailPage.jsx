import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Row, Col, Card, Space, Button, Typography, Tag,
  Avatar, Divider, Tooltip, Empty, Modal, Form, Input, Select, Table
} from 'antd';
import {
  ArrowLeftOutlined, MailOutlined, PhoneOutlined,
  EnvironmentOutlined, EditOutlined, PlusOutlined,
  UserOutlined, ProjectOutlined, InfoCircleOutlined,
  DoubleRightOutlined, GlobalOutlined, ClockCircleOutlined,
  DollarCircleOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateClient } from '@/store/slices/clientSlice';
import { indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import useIsMobile from '@/hooks/useIsMobile';

const phoneCodeOptions = [{ value: '+91', label: '+91' }];

const { Text, Title } = Typography;

/* ── Components for UI Consistency ── */
const InfoRow = ({ label, value, icon, isDark }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
    <div style={{ 
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginRight: 12, fontSize: 16, color: isDark ? '#5ab5e8' : '#D69F6D'
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, color: '#999', fontWeight: 500, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#f0f0f0' : '#333' }}>{value || '—'}</div>
    </div>
  </div>
);

const SectionHeader = ({ title, icon, isDark }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
    <div style={{ fontSize: 18, color: isDark ? '#5ab5e8' : '#D69F6D' }}>{icon}</div>
    <Title level={5} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</Title>
  </div>
);

const ProjectSmallCard = ({ project, isDark, onNavigate }) => {
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  return (
    <Card 
      hoverable 
      styles={{ body: { padding: '14px 16px' } }}
      style={{ 
        borderRadius: 12, marginBottom: 12, 
        background: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
        border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`,
        boxShadow: 'none'
      }}
      onClick={() => onNavigate(`/projects/${project.id}`)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: isDark ? 'rgba(90,181,232,0.1)' : 'rgba(214,159,109,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: primaryColor, fontWeight: 700
          }}>
            {project.projectName.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: isDark ? '#fff' : '#333' }}>{project.projectName}</div>
            <div style={{ fontSize: 14, color: '#999' }}>{project.projectCode} • {project.stage}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor }}>₹{(project.budget / 100000).toFixed(1)}L</div>
          <div style={{ fontSize: 14, color: '#999' }}>Total Budget</div>
        </div>
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════ */
const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('detail');
  
  const clients = useAppSelector(s => s.clients.clients);
  const projects = useAppSelector(s => s.projects.projects);
  const theme = useAppSelector(s => s.ui.theme);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();

  const client = useMemo(() => clients.find(c => c.id === id), [clients, id]);
  const clientProjects = useMemo(() => 
    projects.filter(p => p.clientName === client?.clientName), 
  [projects, client]);

  if (!client) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Empty description="Client not found" />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/clients')}>Back to Clients</Button>
      </div>
    );
  }

  // Derived Info for "Other Information"
  const totalValue = clientProjects.reduce((sum, p) => sum + p.budget, 0);
  const latestProject = clientProjects.sort((a,b) => b.createdDate.localeCompare(a.createdDate))[0];

  const sidebarTabs = [
    { key: 'detail', label: 'Client Detail', icon: <UserOutlined /> },
    { key: 'projects', label: 'Projects', icon: <ProjectOutlined /> },
  ];

  const openEditClientModal = () => {
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
    setEditModalOpen(true);
  };

  const handleSaveClient = () => {
    form.validateFields().then(values => {
      dispatch(updateClient({
        ...client,
        ...values,
        phone: `${values.phoneCode || '+91'} ${values.phone || ''}`.trim(),
        contacts,
      }));
      setEditModalOpen(false);
    });
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

  return (
    <div className="client-detail-page animate-fade-in">
      <PageHeader
        title={
          <Space size={12}>
            <div style={{ position: 'relative', zIndex: 1000 }}>
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                style={{ fontSize: 20, color: '#999', cursor: 'pointer', pointerEvents: 'auto' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate('/clients');
                }}
              />
            </div>
            <span style={{ fontWeight: 800 }}>{client.clientName}</span>
          </Space>
        }
        subtitle={`Client ID: ${client.id} • Registered on ${client.createdDate}`}
        actions={
          <Space>
            <Button 
              icon={<EditOutlined />} 
              style={{ borderRadius: 8 }}
              onClick={openEditClientModal}
            >
              Edit Client
            </Button>
          </Space>
        }
      />

      <Row gutter={24}>
        {/* Sidebar Nav */}
        <Col xs={24} md={6}>
          <div style={{ 
            background: isDark ? '#0d3554' : '#fff', 
            borderRadius: 16, 
            padding: 8,
            border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`,
            marginBottom: 24
          }}>
            {sidebarTabs.map(tab => (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === tab.key ? (isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.1)') : 'transparent',
                  color: activeTab === tab.key ? primaryColor : (isDark ? '#a8b0ba' : '#555'),
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  fontSize: 15,
                  marginBottom: 4
                }}
              >
                <span style={{ fontSize: 18 }}>{tab.icon}</span>
                {tab.label}
                {tab.key === 'projects' && (
                  <Badge count={clientProjects.length} style={{ backgroundColor: primaryColor, marginLeft: 'auto' }} />
                )}
              </div>
            ))}
          </div>
        </Col>

        {/* Content Area */}
        <Col xs={24} md={18}>
          {activeTab === 'detail' && (
            <div className="animate-fade-in-up">
              <Row gutter={20}>
                {/* Primary Information */}
                <Col xs={24} lg={12} style={{ marginBottom: 20 }}>
                  <Card 
                    className="crm-card"
                    title={<SectionHeader title="Primary Information" icon={<UserOutlined />} isDark={isDark} />}
                    style={{ height: '100%', borderRadius: 16 }}
                  >
                    <Row gutter={[16, 0]}>
                      <Col span={24}><InfoRow label="Client Name" value={client.clientName} icon={<UserOutlined />} isDark={isDark} /></Col>
                      <Col span={24}><InfoRow label="Mobile Number" value={client.phone} icon={<PhoneOutlined />} isDark={isDark} /></Col>
                      <Col span={24}><InfoRow label="Email Address" value={client.email} icon={<MailOutlined />} isDark={isDark} /></Col>
                      <Col span={24}><InfoRow label="Address" value={`${client.address1}, ${client.address2 || ''}`} icon={<EnvironmentOutlined />} isDark={isDark} /></Col>
                      <Col span={12}><InfoRow label="City" value={client.city} icon={<GlobalOutlined />} isDark={isDark} /></Col>
                      <Col span={12}><InfoRow label="State" value={client.state} icon={<GlobalOutlined />} isDark={isDark} /></Col>
                    </Row>
                  </Card>
                </Col>

                {/* Other Information */}
                <Col xs={24} lg={12} style={{ marginBottom: 20 }}>
                  <Card 
                    className="crm-card"
                    title={<SectionHeader title="Other Information" icon={<InfoCircleOutlined />} isDark={isDark} />}
                    style={{ height: '100%', borderRadius: 16 }}
                  >
                    <Row gutter={[16, 0]}>
                      <Col span={24}><InfoRow label="Legal Name" value={client.legalName || client.clientName} icon={<InfoCircleOutlined />} isDark={isDark} /></Col>
                      <Col span={12}><InfoRow label="GST Number" value={client.gst || 'N/A'} icon={<GlobalOutlined />} isDark={isDark} /></Col>
                      <Col span={12}><InfoRow label="PAN" value={client.pan || 'N/A'} icon={<GlobalOutlined />} isDark={isDark} /></Col>
                      <Divider style={{ margin: '8px 0 20px' }} />
                      <Col span={12}><InfoRow label="Handled By" value="Anantha Narayana" icon={<UserOutlined />} isDark={isDark} /></Col>
                      <Col span={12}><InfoRow label="Order Date" value={latestProject?.createdDate || '—'} icon={<ClockCircleOutlined />} isDark={isDark} /></Col>
                      <Col span={12}><InfoRow label="Order Value" value={totalValue ? `₹${(totalValue / 100000).toFixed(1)}L` : '—'} icon={<DollarCircleOutlined />} isDark={isDark} /></Col>
                      <Col span={12}><InfoRow label="Location" value={client.location || 'N/A'} icon={<EnvironmentOutlined />} isDark={isDark} /></Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="animate-fade-in-up">
              <Card 
                className="crm-card"
                title={<SectionHeader title={`${client.clientName}'s Projects`} icon={<ProjectOutlined />} isDark={isDark} />}
                style={{ borderRadius: 16 }}
                extra={<Text type="secondary">{clientProjects.length} total projects</Text>}
              >
                {clientProjects.length > 0 ? (
                  <Row gutter={16}>
                    {clientProjects.map(project => (
                      <Col xs={24} xl={12} key={project.id}>
                        <ProjectSmallCard project={project} isDark={isDark} onNavigate={navigate} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description="No projects found for this client"
                    style={{ padding: '40px 0' }}
                  >
                    <Button type="primary" ghost icon={<PlusOutlined />} onClick={() => navigate('/projects', { state: { openModal: true, clientName: client.clientName } })}>Create First Project</Button>
                  </Empty>
                )}
              </Card>
            </div>
          )}
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal
        className="crm-modal"
        title="Edit Client"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSaveClient}
        okText="Save Changes"
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
                <Form.Item name="clientName" label="Name" rules={[{ required: true, message: 'Required' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Invalid email' }]}>
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
                <Form.Item name="phone" label=" " colon={false} rules={[{ required: true, message: 'Required' }]}>
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
                <Form.Item name="address1" label="Address Line 1"><Input /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address2" label="Address Line 2"><Input /></Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item name="state" label="State">
                  <Select options={indianStates.map(s => ({ value: s, label: s }))} />
                </Form.Item>
              </Col>
              <Col span={6}><Form.Item name="city" label="City"><Input /></Form.Item></Col>
              <Col span={6}><Form.Item name="location" label="Location"><Input /></Form.Item></Col>
              <Col span={6}><Form.Item name="pincode" label="Pincode"><Input /></Form.Item></Col>
            </Row>
          </div>

          <div className="crm-section">
            <div className="crm-section-title">
              <span className="crm-section-badge">3</span>
              <span>Client Details</span>
            </div>
            <Row gutter={12}>
              <Col span={8}><Form.Item name="legalName" label="Legal Name"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="pan" label="PAN"><Input /></Form.Item></Col>
              <Col span={8}><Form.Item name="gst" label="GST Number"><Input /></Form.Item></Col>
            </Row>
            <Form.Item name="remarks" label="Remarks"><Input.TextArea rows={3} /></Form.Item>
          </div>

          <div className="crm-section">
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div className="crm-section-title" style={{ marginBottom: 0 }}>
                  <span className="crm-section-badge">4</span>
                  <span>Additional Contacts</span>
                </div>
                <Button className="crm-outline-btn" icon={<PlusOutlined />} onClick={() => setContactModalOpen(true)}>Add Contact</Button>
             </div>
             <Table
                dataSource={contacts}
                rowKey="key"
                pagination={false}
                size="small"
                columns={[
                  { title: 'Name', dataIndex: 'name' },
                  { title: 'Email', dataIndex: 'email' },
                  { title: 'Phone', dataIndex: 'phone' },
                  {
                    title: '',
                    width: 50,
                    render: (_, r) => (
                      <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => setContacts(c => c.filter(x => x.key !== r.key))} />
                    )
                  }
                ]}
             />
          </div>
        </Form>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        className="crm-modal"
        title="Add Contact"
        open={contactModalOpen}
        onCancel={() => setContactModalOpen(false)}
        onOk={handleAddContact}
        centered
        width={isMobile ? '96%' : 500}
      >
        <Form form={contactForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}><Input /></Form.Item>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item name="phoneCode" label="Phone" initialValue="+91"><Select options={phoneCodeOptions} /></Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="phone" label=" " colon={false} rules={[{ required: true }]}><Input /></Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

// Helper badge component
const Badge = ({ count, style }) => (
  count > 0 ? (
    <span style={{ 
      display: 'inline-flex', padding: '2px 8px', borderRadius: 10, 
      fontSize: 14, color: '#fff', fontWeight: 700, ...style 
    }}>
      {count}
    </span>
  ) : null
);

export default ClientDetailPage;
