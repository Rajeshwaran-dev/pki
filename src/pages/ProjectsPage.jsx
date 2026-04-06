import { useState, useMemo } from 'react';
import { Table, Button, Input, Modal, Form, Select, InputNumber, Tooltip, DatePicker, Avatar, Row, Col, Card } from 'antd';
import {
  PlusOutlined, ExportOutlined, EditOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { addProject, setActiveTab } from '@/store/slices/projectSlice';
import { stages, indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';
import useIsMobile from '@/hooks/useIsMobile';

const { RangePicker } = DatePicker;

const stageStats = {
  Sales: { color: '#1677FF' },
  Designing: { color: '#B19625' },
  Execution: { color: '#722ED1' },
  Snags: { color: '#FF4D4F' },
  Handover: { color: '#FAAD14' },
  Completed: { color: '#52C41A' },
};

const ProjectsPage = () => {
  const dispatch = useAppDispatch();
  const { projects, activeTab } = useAppSelector(s => s.projects);
  const clients = useAppSelector(s => s.clients.clients);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    let list = projects;
    if (activeTab !== 'All') list = list.filter(p => p.stage === activeTab);
    if (search) list = list.filter(p =>
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [projects, activeTab, search]);

  const columns = [
    {
      title: 'Project',
      dataIndex: 'projectName',
      width: 220,
      render: (name, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar size={36} style={{ background: '#B1962515', color: '#B19625', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
            {name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
            <div style={{ fontSize: 11, color: '#999' }}>{row.projectCode}</div>
          </div>
        </div>
      ),
    },
    { title: 'Client', dataIndex: 'clientName', width: 140, render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
    {
      title: 'Budget',
      dataIndex: 'budget',
      width: 110,
      render: v => <span style={{ color: '#B19625', fontWeight: 600 }}>₹{(v / 100000).toFixed(1)}L</span>,
      sorter: (a, b) => a.budget - b.budget,
    },
    { title: 'City', dataIndex: 'city', width: 100 },
    { title: 'State', dataIndex: 'state', width: 130 },
    {
      title: 'Stage',
      dataIndex: 'stage',
      width: 120,
      render: v => <StatusTag value={v} />,
      filters: stages.filter(s => s !== 'All').map(s => ({ text: s, value: s })),
      onFilter: (v, r) => r.stage === v,
    },
    { title: 'Phone', dataIndex: 'phone', width: 145, responsive: ['lg'] },
    { title: 'Date', dataIndex: 'createdDate', width: 100, sorter: (a, b) => a.createdDate.localeCompare(b.createdDate) },
    {
      title: '',
      width: 50,
      render: () => (
        <Tooltip title="Edit">
          <Button type="text" size="small" icon={<EditOutlined />} style={{ color: '#B19625' }} />
        </Tooltip>
      ),
    },
  ];

  const handleAdd = () => {
    form.validateFields().then(values => {
      dispatch(addProject({
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
        projectCode: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
        ...values,
      }));
      setModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} total projects`}
        actions={
          <>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search projects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 200, borderRadius: 8 }}
              allowClear
            />
            {!isMobile && <RangePicker style={{ borderRadius: 8 }} />}
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #B19625, #C4A840)', border: 'none' }}
            >
              New Project
            </Button>
          </>
        }
      />

      {/* Stage quick-stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        {Object.entries(stageStats).map(([stage, meta]) => {
          const count = projects.filter(p => p.stage === stage).length;
          return (
            <Col key={stage} xs={12} sm={8} md={4}>
              <Card
                hoverable
                size="small"
                onClick={() => dispatch(setActiveTab(stage))}
                className="crm-card"
                style={{
                  cursor: 'pointer',
                  borderTop: activeTab === stage ? `3px solid ${meta.color}` : '3px solid transparent',
                  transition: 'all 0.2s',
                }}
                styles={{ body: { padding: '10px 14px' } }}
              >
                <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>{stage}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: meta.color }}>{count}</div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 14, padding: isMobile ? 12 : 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {/* Pill Tabs */}
        <div
          className="flex flex-wrap gap-2 mb-4 pb-3"
          style={{ borderBottom: '1px solid #f0f0f0' }}
        >
          {stages.map(s => {
            const isActive = activeTab === s;
            const count = s === 'All' ? projects.length : projects.filter(p => p.stage === s).length;
            return (
              <button
                key={s}
                onClick={() => dispatch(setActiveTab(s))}
                className="pill-tab"
                style={{
                  padding: '6px 16px',
                  borderRadius: 24,
                  border: isActive ? '2px solid #B19625' : '2px solid transparent',
                  background: isActive ? '#B1962512' : '#f7f7f7',
                  color: isActive ? '#B19625' : '#666',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {s}
                <span style={{
                  background: isActive ? '#B19625' : '#ddd',
                  color: isActive ? '#fff' : '#666',
                  borderRadius: 10, fontSize: 10, fontWeight: 700,
                  padding: '1px 6px',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `${t} projects`, style: { marginTop: 16 } }}
          scroll={{ x: 1100 }}
          size="middle"
          rowClassName={() => 'crm-table-row'}
        />
      </div>

      {/* Add Modal */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>New Project</span>}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleAdd}
        okText="Create Project"
        okButtonProps={{ style: { background: 'linear-gradient(135deg, #B19625, #C4A840)', border: 'none' } }}
        width={isMobile ? '95%' : 640}
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="clientName" label="Client" rules={[{ required: true }]}>
            <Select
              placeholder="Select client"
              showSearch
              filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={clients.map(c => ({ value: c.clientName, label: c.clientName }))}
            />
          </Form.Item>
          <Form.Item name="projectName" label="Project Name" rules={[{ required: true }]}>
            <Input placeholder="Enter project name" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="stage" label="Stage" rules={[{ required: true }]}>
                <Select placeholder="Select stage" options={stages.filter(s => s !== 'All').map(s => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="budget" label="Budget (₹)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} placeholder="Enter budget" min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="city" label="City"><Input placeholder="City" /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="state" label="State">
                <Select placeholder="Select state" options={indianStates.map(s => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="Phone"><Input placeholder="Phone number" /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email"><Input placeholder="Email address" /></Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Project description…" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
