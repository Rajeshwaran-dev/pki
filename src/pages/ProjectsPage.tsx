import React, { useState, useMemo } from 'react';
import {
  Table, Button, Tabs, Input, Modal, Form, Select, InputNumber, Space, message, Tooltip,
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
      message.success('Project created successfully');
      setModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${filtered.length} projects`}
        actions={
          <>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              New Project
            </Button>
          </>
        }
      />

      <div style={{
        background: 'var(--ant-color-bg-container, #fff)',
        borderRadius: 12,
        padding: isMobile ? 12 : 20,
      }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300, borderRadius: 8 }}
            allowClear
          />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={key => dispatch(setActiveTab(key))}
          items={stages.map(s => ({ key: s, label: s }))}
          style={{ marginBottom: 16 }}
        />

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
            <Select
              placeholder="Select client"
              showSearch
              optionFilterProp="label"
              options={clients.map(c => ({ value: c.clientName, label: c.clientName }))}
            />
          </Form.Item>
          <Form.Item name="projectName" label="Project Name" rules={[{ required: true }]}>
            <Input placeholder="Enter project name" />
          </Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="stage" label="Stage" rules={[{ required: true }]}>
              <Select
                placeholder="Select stage"
                options={stages.filter(s => s !== 'All').map(s => ({ value: s, label: s }))}
              />
            </Form.Item>
            <Form.Item name="budget" label="Budget (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="Enter budget" min={0} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="city" label="City">
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item name="state" label="State">
              <Select placeholder="Select state" options={indianStates.map(s => ({ value: s, label: s }))} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="phone" label="Phone">
              <Input placeholder="Phone number" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Email address" />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Project description..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
