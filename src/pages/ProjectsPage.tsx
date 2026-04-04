import React, { useState, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, Select, InputNumber, Tooltip, DatePicker,
} from 'antd';
import {
  PlusOutlined, ExportOutlined, EditOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { addProject, setActiveTab } from '@/store/slices/projectSlice';
import { stages, Project, indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';
import useIsMobile from '@/hooks/useIsMobile';

const { RangePicker } = DatePicker;

const ProjectsPage: React.FC = () => {
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
    { title: 'Date', dataIndex: 'createdDate', width: 100, sorter: (a: Project, b: Project) => a.createdDate.localeCompare(b.createdDate) },
    { title: 'Code', dataIndex: 'projectCode', width: 100 },
    { title: 'Project Name', dataIndex: 'projectName', width: 180, ellipsis: true },
    { title: 'Client', dataIndex: 'clientName', width: 140 },
    { title: 'Budget', dataIndex: 'budget', width: 120, render: (v: number) => `₹${(v / 100000).toFixed(1)}L`, sorter: (a: Project, b: Project) => a.budget - b.budget },
    { title: 'City', dataIndex: 'city', width: 100 },
    { title: 'State', dataIndex: 'state', width: 120 },
    { title: 'Stage', dataIndex: 'stage', width: 110, render: (v: string) => <StatusTag value={v} /> },
    { title: 'Phone', dataIndex: 'phone', width: 140, responsive: ['lg' as const] },
    { title: 'Email', dataIndex: 'email', width: 180, responsive: ['xl' as const], ellipsis: true },
    {
      title: '', width: 50,
      render: () => (
        <Tooltip title="Quick Edit">
          <Button type="text" size="small" icon={<EditOutlined />} />
        </Tooltip>
      ),
    },
  ];

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newProject: Project = {
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
        projectCode: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
        ...values,
      };
      dispatch(addProject(newProject));
      setModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        actions={
          <>
            <Input prefix={<SearchOutlined />} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, borderRadius: 8 }} allowClear />
            <RangePicker style={{ borderRadius: 8 }} />
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>New Project</Button>
          </>
        }
      />

      <div style={{
        background: 'var(--ant-color-bg-container, #fff)',
        borderRadius: 12,
        padding: isMobile ? 12 : 20,
      }}>
        {/* Pill-style tabs */}
        <div className="flex flex-wrap gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
          {stages.map(s => {
            const isActive = activeTab === s;
            return (
              <button
                key={s}
                onClick={() => dispatch(setActiveTab(s))}
                className="pill-tab"
                style={{
                  padding: '6px 20px',
                  borderRadius: 24,
                  border: isActive ? '2px solid #B19625' : '1px solid transparent',
                  background: isActive ? '#B1962510' : 'transparent',
                  color: isActive ? '#B19625' : 'inherit',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `${t} projects` }}
          scroll={{ x: 1100 }}
          size="middle"
          style={{ borderRadius: 8 }}
        />
      </div>

      <Modal
        title="New Project"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleAdd}
        okText="Create Project"
        width={isMobile ? '95%' : 640}
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="clientName" label="Client" rules={[{ required: true }]}>
            <Select placeholder="Select client" showSearch optionFilterProp="label" options={clients.map(c => ({ value: c.clientName, label: c.clientName }))} />
          </Form.Item>
          <Form.Item name="projectName" label="Project Name" rules={[{ required: true }]}>
            <Input placeholder="Enter project name" />
          </Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="stage" label="Stage" rules={[{ required: true }]}>
              <Select placeholder="Select stage" options={stages.filter(s => s !== 'All').map(s => ({ value: s, label: s }))} />
            </Form.Item>
            <Form.Item name="budget" label="Budget (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="Enter budget" min={0} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="city" label="City"><Input placeholder="City" /></Form.Item>
            <Form.Item name="state" label="State"><Select placeholder="Select state" options={indianStates.map(s => ({ value: s, label: s }))} /></Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="phone" label="Phone"><Input placeholder="Phone number" /></Form.Item>
            <Form.Item name="email" label="Email"><Input placeholder="Email address" /></Form.Item>
          </div>
          <Form.Item name="description" label="Description"><Input.TextArea rows={3} placeholder="Project description..." /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
