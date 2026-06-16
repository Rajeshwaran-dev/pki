import { useState, useMemo, useRef } from 'react';
import {
  Table, Button, Input, Space, Tag, Avatar, Tooltip, Modal, Form,
  Row, Col, Select, DatePicker, Dropdown, AutoComplete, Spin, message
} from 'antd';
import {
  PlusOutlined, SearchOutlined, FilterOutlined, UploadOutlined,
  UnorderedListOutlined, AppstoreOutlined, EyeOutlined, DeleteOutlined,
  PhoneOutlined, MailOutlined, UserOutlined, MoreOutlined, CheckCircleOutlined, LinkOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { addEnquiry, deleteEnquiry, assignEnquiry, convertToClient, STAFF_MEMBERS } from '@/store/slices/enquirySlice';
import { addClient } from '@/store/slices/clientSlice';
import PageHeader from '@/components/shared/PageHeader';
import useIsMobile from '@/hooks/useIsMobile';
import dayjs from 'dayjs';
const PROJECT_TYPES = ['Residential', 'Commercial', 'Renovation', 'Interior'];
const SOURCES = ['Instagram', 'Facebook', 'Google', 'Referral', 'Advertisement', 'Website'];
const SITE_STATUSES = ['Planning Stage', 'Ready to Start', 'Under Construction'];
const PROJECT_SUBTYPES = ['Apartment', 'Villa', 'Individual Villa', 'Duplex', 'Penthouse', 'Row House', 'Office Space', 'Independent House'];
const OCCUPATIONS = ['IT', 'Business', 'Engineer', 'Doctor', 'Lawyer', 'Architect', 'Businessman', 'Consultant', 'CA', 'Professional'];


const EnquiryPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const enquiries = useAppSelector(s => s.enquiry.enquiries);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'pipeline'
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [convertForm] = Form.useForm();
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [convertingEnquiry, setConvertingEnquiry] = useState(null);
  const [convertLoading, setConvertLoading] = useState(false);

  const OCCUPATIONS = ['IT', 'Business', 'Engineer', 'Doctor', 'Lawyer', 'Architect', 'Businessman', 'Consultant', 'CA', 'Professional'];

  const searchTimeoutRef = useRef(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleLocationSearch = (value) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!value) {
      setLocationOptions([]);
      return;
    }
    setFetchingLocation(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=10&countrycodes=in`);
        const data = await res.json();
        const options = data.map(item => ({
          value: item.display_name,
          label: item.display_name,
        }));
        setLocationOptions(options);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setFetchingLocation(false);
      }
    }, 600);
  };

  const openConvertModal = (enquiry) => {
    setConvertingEnquiry(enquiry);
    convertForm.setFieldsValue({
      clientName: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email || '',
      address1: enquiry.address || '',
      gst: enquiry.gstNo || '',
    });
    setConvertModalOpen(true);
  };

  const handleConvertConfirm = async () => {
    setConvertLoading(true);
    try {
      const values = await convertForm.validateFields();
      const clientId = `CLT-${dayjs().year()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const clientData = {
        id: clientId,
        ...values,
        legalName: values.clientName,
        createdDate: dayjs().format('YYYY-MM-DD'),
        convertedDate: dayjs().format('MMM D, YYYY'),
        sourceEnquiryId: convertingEnquiry.id,
      };
      await new Promise(r => setTimeout(r, 800));
      dispatch(addClient(clientData));
      dispatch(convertToClient({ enquiryId: convertingEnquiry.id, clientData }));
      setConvertModalOpen(false);
      convertForm.resetFields();
      setConvertingEnquiry(null);
      Modal.success({
        title: 'Lead Converted!',
        content: `${values.clientName} has been added as a client successfully.`,
        okText: 'View Clients',
        onOk: () => navigate('/clients'),
      });
    } catch {
      // validation failed
    } finally {
      setConvertLoading(false);
    }
  };

  const handleCopyPublicLink = () => {
    const link = `${window.location.origin}/public-enquiry`;
    navigator.clipboard.writeText(link).then(() => {
      message.success('Public enquiry link copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy link');
    });
  };

  const filtered = useMemo(() => {
    if (!search) return enquiries;
    const q = search.toLowerCase();
    return enquiries.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  }, [enquiries, search]);

  const panelBg = isDark ? '#0d3554' : '#ffffff';
  const panelBorder = isDark ? '#1a4d72' : '#f0f0f0';

  const handleRowClick = (record) => {
    navigate(`/enquiry/${record.id}`);
  };

  const handleAddEnquiry = () => {
    form.validateFields().then(values => {
      const newId = `ENQ-${new Date().getFullYear()}-${String(enquiries.length + 1).padStart(3, '0')}`;
      dispatch(addEnquiry({
        id: newId,
        enquiryDate: values.enquiryDate ? values.enquiryDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        name: values.name,
        phone: `+91 ${values.phone}`,
        email: values.email || '',
        projectType: values.projectType || 'Residential',
        source: values.source || 'Instagram',
        occupation: values.occupation || '',
        address: values.address || '',
        location: values.location || '',
        remarks: values.remarks || '',
        siteStatus: values.siteStatus || 'Planning Stage',
        projectSubtype: values.projectSubtype || 'Apartment',
        siteLocation: values.siteLocation || '',
        siteSize: values.siteSize || '',
        siteAddress: values.siteAddress || '',
        gstNo: values.gstNo || '',
        assignedTo: values.assignedTo || null,
        files: { site: [], design: [], other: [] },
        followUps: [],
        proposals: [],
      }));
      setNewModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Enquiry No',
      dataIndex: 'id',
      width: 140,
      render: (id) => (
        <span style={{ color: primaryColor, fontWeight: 600, fontSize: 16 }}>{id}</span>
      ),
    },
    {
      title: 'Enquiry Date',
      dataIndex: 'enquiryDate',
      width: 130,
      render: (d) => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 160,
      render: (name, row, idx) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar
            size={30}
            style={{
              background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)',
              color: primaryColor,
              fontSize: 16,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {name.replace('Mr. ', '').replace('Ms. ', '').charAt(0)}
          </Avatar>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{name}</span>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 150,
      render: (v) => (
        <a href={`tel:${v}`} style={{ color: primaryColor, fontSize: 15 }}>{v}</a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 190,
      ellipsis: true,
      render: (v) => (
        <a href={`mailto:${v}`} style={{ color: isDark ? '#a8b0ba' : '#666', fontSize: 15 }}>{v || 'â€”'}</a>
      ),
    },
    {
      title: 'Project Type',
      dataIndex: 'projectType',
      width: 130,
      render: (v) => (
        <Tag
          style={{
            borderRadius: 6,
            fontWeight: 500,
            fontSize: 15,
            border: 'none',
            background: isDark ? 'rgba(90,181,232,0.12)' : 'rgba(214,159,109,0.12)',
            color: primaryColor,
          }}
        >
          {v}
        </Tag>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      width: 130,
      render: (v) => (
        <Tag
          style={{
            borderRadius: 6,
            fontWeight: 500,
            fontSize: 15,
            border: 'none',
            background: isDark ? 'rgba(90,181,232,0.12)' : 'rgba(214,159,109,0.12)',
            color: primaryColor,
          }}
        >
          {v}
        </Tag>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      width: 170,
      render: (assignedTo) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {assignedTo ? (
            <>
              <Avatar
                size={24}
                style={{
                  background: isDark ? 'rgba(90,181,232,0.2)' : 'rgba(214,159,109,0.2)',
                  color: primaryColor,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {assignedTo.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{assignedTo}</span>
            </>
          ) : (
            <span style={{ color: '#999', fontStyle: 'italic', fontSize: 14 }}>Not Assigned</span>
          )}
        </div>
      ),
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
                  icon: <EyeOutlined style={{ color: primaryColor }} />,
                  label: 'View',
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    navigate(`/enquiry/${row.id}`);
                  },
                },
                {
                  key: 'convert',
                  icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,
                  label: <span style={{ color: '#52C41A', fontWeight: 600 }}>Convert to Client</span>,
                  disabled: row.convertedToClient,
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    if (!row.convertedToClient) openConvertModal(row);
                  },
                },
                {
                  key: 'assign',
                  icon: <UserOutlined style={{ color: primaryColor }} />,
                  label: 'Assign To',
                  children: STAFF_MEMBERS.map(staff => ({
                    key: `assign-${staff.id}`,
                    label: staff.name,
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      dispatch(assignEnquiry({ enquiryId: row.id, personName: staff.name }));
                    },
                  })),
                },
                {
                  key: 'delete',
                  icon: <DeleteOutlined style={{ color: '#FF4D4F' }} />,
                  label: <span style={{ color: '#FF4D4F' }}>Delete</span>,
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    Modal.confirm({
                      title: 'Delete Enquiry',
                      content: `Are you sure you want to delete ${row.id}?`,
                      okText: 'Delete',
                      okButtonProps: { danger: true },
                      onOk: () => dispatch(deleteEnquiry(row.id)),
                    });
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
              icon={<MoreOutlined style={{ fontSize: 22, color: '#999' }} />}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  // Pipeline (Kanban) view grouping by project type
  const pipelineGroups = useMemo(() => {
    const groups = {};
    filtered.forEach(e => {
      if (!groups[e.projectType]) groups[e.projectType] = [];
      groups[e.projectType].push(e);
    });
    return groups;
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="Enquiry"
        subtitle={`${enquiries.length} total enquiries`}
        actions={
          <>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by Name, Phone, Email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: isMobile ? 180 : 240, borderRadius: 8 }}
              allowClear
            />
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8 }} className="crm-outline-btn">Filter</Button>
            {!isMobile && (
              <Button icon={<UploadOutlined />} style={{ borderRadius: 8 }} className="crm-outline-btn">Bulk Upload</Button>
            )}
            <Space.Compact style={{ borderRadius: 8, overflow: 'hidden' }}>
              <Tooltip title="List View">
                <Button
                  icon={<UnorderedListOutlined />}
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => setViewMode('list')}
                  style={viewMode === 'list' ? { background: primaryColor, border: 'none', color: '#fff' } : {}}
                >
                  {!isMobile && 'List'}
                </Button>
              </Tooltip>
              <Tooltip title="Pipeline View">
                <Button
                  icon={<AppstoreOutlined />}
                  type={viewMode === 'pipeline' ? 'primary' : 'default'}
                  onClick={() => setViewMode('pipeline')}
                  style={viewMode === 'pipeline' ? { background: primaryColor, border: 'none', color: '#fff' } : {}}
                >
                  {!isMobile && 'Pipeline'}
                </Button>
              </Tooltip>
            </Space.Compact>
            <Button
              icon={<LinkOutlined />}
              onClick={handleCopyPublicLink}
              style={{ borderRadius: 8, fontWeight: 500 }}
              className="crm-outline-btn"
            >
              {!isMobile && 'Copy Public Link'}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setNewModalOpen(true)}
              style={{ background: primaryColor, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 500 }}
            >
              {!isMobile && 'New Enquiry'}
            </Button>
          </>
        }
      />

      {/* List View */}
      {viewMode === 'list' && (
        <div
          style={{
            background: panelBg,
            borderRadius: 14,
            padding: isMobile ? 8 : 16,
            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
            border: `1px solid ${panelBorder}`,
          }}
        >
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showTotal: t => `${t} enquiries`, showSizeChanger: false }}
            scroll={{ x: 1100 }}
            size="middle"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' },
            })}
            rowClassName={() => 'enquiry-row-hover'}
          />
        </div>
      )}

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
          {Object.entries(pipelineGroups).map(([type, items]) => (
            <div
              key={type}
              style={{
                minWidth: 280,
                flex: '0 0 280px',
                background: panelBg,
                borderRadius: 14,
                border: `1px solid ${panelBorder}`,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: primaryColor }}>{type}</span>
                <span style={{
                  background: isDark ? 'rgba(90,181,232,0.12)' : 'rgba(214,159,109,0.12)',
                  color: primaryColor,
                  borderRadius: 20,
                  padding: '1px 8px',
                  fontSize: 15,
                  fontWeight: 600,
                }}>{items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((e, idx) => (
                  <div
                    key={e.id}
                    onClick={() => navigate(`/enquiry/${e.id}`)}
                    style={{
                      background: isDark ? '#081b2f' : '#f8f8f8',
                      borderRadius: 10,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      border: `1px solid ${isDark ? '#0a2e4a' : '#eee'}`,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = primaryColor; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? '#0a2e4a' : '#eee'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Avatar size={26} style={{ background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)', color: primaryColor, fontSize: 15, fontWeight: 700 }}>
                        {e.name.replace('Mr. ', '').replace('Ms. ', '').charAt(0)}
                      </Avatar>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{e.name}</span>
                      {e.convertedToClient && (
                        <Tag 
                          color="success" 
                          style={{ margin: 0, borderRadius: 4, fontSize: 11, fontWeight: 700, padding: '0 4px', height: 18, lineHeight: '16px' }}
                        >
                          CONVERTED
                        </Tag>
                      )}
                    </div>
                    <div style={{ fontSize: 15, color: isDark ? '#8a98a8' : '#999', marginBottom: 4 }}>{e.id}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Tag style={{ fontSize: 14, borderRadius: 4, margin: 0, border: 'none', background: isDark ? 'rgba(90,181,232,0.12)' : 'rgba(214,159,109,0.12)', color: primaryColor }}>
                          {e.source}
                        </Tag>
                        <Tag style={{ fontSize: 14, borderRadius: 4, margin: 0, border: 'none', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: isDark ? '#aaa' : '#666' }}>
                          {e.phone}
                        </Tag>
                      </div>
                      {e.assignedTo && (
                        <Tooltip title={`Assigned to: ${e.assignedTo}`}>
                          <Avatar 
                            size={22} 
                            style={{ 
                              background: isDark ? 'rgba(90,181,232,0.2)' : 'rgba(214,159,109,0.2)', 
                              color: primaryColor, 
                              fontSize: 10, 
                              fontWeight: 700,
                              border: `1px solid ${primaryColor}40`
                            }}
                          >
                            {e.assignedTo.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Enquiry Modal */}
      <Modal
        className="crm-modal"
        title="New Enquiry"
        open={newModalOpen}
        onCancel={() => { setNewModalOpen(false); form.resetFields(); }}
        onOk={handleAddEnquiry}
        okText="Create Enquiry"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : 760}
        centered
      >
        <Form form={form} layout="vertical" className="crm-form-shell">
          <div className="crm-section">
            <div className="crm-section-title">
              <span className="crm-section-badge">1</span>
              <span>Primary Information</span>
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Name is required' }]}>
                  <Input placeholder="e.g. Mr. Suresh" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Phone is required' }]}>
                  <Input addonBefore="+91" placeholder="73586 23475" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Enter valid email' }]}>
                  <Input placeholder="email@example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="enquiryDate" label="Enquiry Date">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="occupation" label="Occupation">
                  <Select placeholder="Select occupation" options={OCCUPATIONS.map(o => ({ value: o, label: o }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="source" label="Source">
                  <Select placeholder="Select source" options={SOURCES.map(s => ({ value: s, label: s }))} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="address" label="Address">
              <Input.TextArea rows={2} placeholder="Full address" />
            </Form.Item>
            <Form.Item name="location" label="Location (Area / Street)">
              <AutoComplete
                options={locationOptions}
                onSearch={handleLocationSearch}
                placeholder="Type to search location..."
                notFoundContent={fetchingLocation ? <Spin size="small" /> : null}
              >
                <Input />
              </AutoComplete>
            </Form.Item>
            <Form.Item name="assignedTo" label="Assign To">
              <Select 
                placeholder="Assign to person" 
                options={STAFF_MEMBERS.map(s => ({ value: s.name, label: s.name }))} 
                allowClear
              />
            </Form.Item>
          </div>

          <div className="crm-section">
            <div className="crm-section-title">
              <span className="crm-section-badge">2</span>
              <span>Project Details</span>
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="projectType" label="Project Type">
                  <Select placeholder="Select type" options={PROJECT_TYPES.map(t => ({ value: t, label: t }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectSubtype" label="Project Subtype">
                  <Select placeholder="Select subtype" options={PROJECT_SUBTYPES.map(t => ({ value: t, label: t }))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="siteStatus" label="Site Status">
                  <Select placeholder="Select status" options={SITE_STATUSES.map(s => ({ value: s, label: s }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="siteLocation" label="Site Location">
                  <Input placeholder="e.g. Hyderabad" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="siteSize" label="Site Size">
                  <Input placeholder="e.g. 3BHK, 1500 sqft" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="gstNo" label="GST No">
                  <Input placeholder="GST Number" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="siteAddress" label="Site Address">
              <Input.TextArea rows={2} placeholder="Site address" />
            </Form.Item>
          </div>

          <div className="crm-section" style={{ marginBottom: 0 }}>
            <div className="crm-section-title">
              <span className="crm-section-badge">3</span>
              <span>Remarks</span>
            </div>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={3} placeholder="Any additional notes..." />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Convert to Client Modal */}
      <Modal
        className="crm-modal"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(82,196,26,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircleOutlined style={{ color: '#52C41A', fontSize: 18 }} />
            </div>
            <span>Convert to Client</span>
          </div>
        }
        open={convertModalOpen}
        onCancel={() => {
          setConvertModalOpen(false);
          convertForm.resetFields();
          setConvertingEnquiry(null);
        }}
        onOk={handleConvertConfirm}
        okText="Confirm & Convert"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{
          style: { background: '#52C41A', border: 'none', borderRadius: 8, fontWeight: 700 },
          loading: convertLoading,
        }}
        width={isMobile ? '96%' : 560}
        centered
      >
        {convertingEnquiry && (
          <div>
            <div style={{
              background: isDark ? 'rgba(82,196,26,0.08)' : 'rgba(82,196,26,0.05)',
              border: isDark ? '1px solid rgba(82,196,26,0.18)' : '1px solid rgba(82,196,26,0.14)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <Avatar
                size={38}
                style={{ background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)', color: primaryColor, fontWeight: 700, fontSize: 16, flexShrink: 0 }}
              >
                {convertingEnquiry.name.replace('Mr. ', '').replace('Ms. ', '').charAt(0)}
              </Avatar>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#d8e8f8' : '#1f1f1f' }}>{convertingEnquiry.name}</div>
                <div style={{ fontSize: 13, color: isDark ? '#6a7f95' : '#888' }}>
                  {convertingEnquiry.id} · {convertingEnquiry.projectType} · {convertingEnquiry.source}
                </div>
              </div>
            </div>
            <Form form={convertForm} layout="vertical" className="crm-form-shell">
              <Form.Item name="clientName" label="Client Name" rules={[{ required: true, message: 'Client name is required' }]}>
                <Input />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Phone is required' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="address1" label="Address">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="gst" label="GST Number">
                <Input />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EnquiryPage;