import { useState, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, Select, InputNumber,
  Tooltip, DatePicker, Avatar, Row, Col, Card, Drawer, Tag,
  Space, Typography, Divider,
} from 'antd';
import {
  PlusOutlined, ExportOutlined, EditOutlined, SearchOutlined,
  FilterOutlined, AppstoreOutlined, UnorderedListOutlined,
  PhoneOutlined, UserOutlined, MoreOutlined, ArrowRightOutlined,
  CloseOutlined, InfoCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { addProject, setActiveTab } from '@/store/slices/projectSlice';
import { stages, indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';
import useIsMobile from '@/hooks/useIsMobile';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const stageColors = {
  Sales: '#1677FF',
  Designing: '#B19625',
  Execution: '#722ED1',
  Snags: '#FF4D4F',
  Handover: '#FAAD14',
  Completed: '#52C41A',
};

const primaryColor = '#B19625';
const primaryLight = '#D4B96E';

/* ── Kanban project card ── */
const KanbanCard = ({ project, onView, isDark }) => (
  <div
    style={{
      background: isDark ? '#262626' : 'white', borderRadius: 10, padding: '12px 14px', marginBottom: 8,
      boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer',
      border: `1px solid ${isDark ? '#3a3a3a' : '#f0f0f0'}`, transition: 'box-shadow 0.2s ease',
    }}
    onClick={() => onView(project)}
    onMouseEnter={e => { if (!isDark) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <div>
        <div style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>{project.projectCode}</div>
        <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>{project.projectName}</div>
      </div>
      <Button
        type="text" size="small" icon={<ArrowRightOutlined style={{ color: primaryColor }} />}
        style={{ padding: 2, border: `1px solid ${primaryColor}`, borderRadius: 6 }}
        onClick={e => { e.stopPropagation(); onView(project); }}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#666', marginTop: 8 }}>
      <UserOutlined style={{ fontSize: 11, color: '#999' }} />
      <span>{project.clientName}</span>
    </div>
    {project.phone && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#666', marginTop: 4 }}>
        <PhoneOutlined style={{ fontSize: 11, color: '#999' }} />
        <span>{project.phone}</span>
      </div>
    )}
  </div>
);

/* ── Project Overview Drawer ── */
const ProjectOverviewDrawer = ({ project, open, onClose, onNavigate }) => {
  const [tab, setTab] = useState('Details');
  if (!project) return null;
  const color = stageColors[project.stage] || '#666';

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Project Overview</span>
          <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
        </div>
      }
      closable={false}
      placement="right"
      open={open}
      onClose={onClose}
      width={420}
      styles={{ body: { padding: 0 }, header: { borderBottom: '1px solid #f0f0f0', padding: '14px 20px' } }}
    >
      {/* Project header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Space size={8} wrap>
            <span style={{ fontWeight: 800, fontSize: 16 }}>{project.projectName}</span>
            <Tag style={{ borderRadius: 6, fontWeight: 600, fontSize: 11 }}>{project.projectCode}</Tag>
            <Tag color={color} style={{ borderRadius: 6, fontSize: 11 }}>{project.stage}</Tag>
          </Space>
          <Space size={4}>
            <Button type="text" size="small" icon={<ClockCircleOutlined style={{ color: '#999' }} />} />
            <Button type="text" size="small" icon={<EditOutlined style={{ color: '#999' }} />} />
            <Button
              type="text" size="small"
              icon={<ArrowRightOutlined style={{ color: primaryColor }} />}
              style={{ border: `1px solid ${primaryColor}`, borderRadius: 6 }}
              onClick={() => onNavigate(project.id)}
            />
          </Space>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#555' }}>
          <span><UserOutlined style={{ marginRight: 5, color: '#999' }} />{project.clientName}</span>
          {project.phone && <span><PhoneOutlined style={{ marginRight: 5, color: '#999' }} />{project.phone}</span>}
        </div>
      </div>

      {/* Budget + Assignees */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 32 }}>
        <div>
          <Text type="secondary" style={{ fontSize: 11 }}>Total Budget</Text>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>₹{(project.budget / 100000).toFixed(1)}L</div>
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 11 }}>Project Assignees</Text>
          <div style={{ marginTop: 4 }}>
            <Avatar size={28} style={{ background: '#FF6B35', fontWeight: 700, fontSize: 12 }}>T</Avatar>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
        {['Details', 'Notes', 'Tasks'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontSize: 13,
              borderBottom: tab === t ? `2px solid ${primaryColor}` : '2px solid transparent',
              background: 'transparent', color: tab === t ? primaryColor : '#555',
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Details' && (
        <div style={{ padding: '16px 20px' }}>
          {/* Project Details */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <InfoCircleOutlined style={{ color: '#555' }} /> Project Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 10 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>Created on</Text>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{project.createdDate}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>Last updated on</Text>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{project.createdDate}</div>
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Description</Text>
              <div style={{ fontSize: 13, color: '#999' }}>-</div>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* Team Members */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>👥 Team Members</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar size={34} style={{ background: '#FF6B35', fontWeight: 700 }}>T</Avatar>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Thara</div>
                <div style={{ fontSize: 11, color: '#999' }}>Member</div>
              </div>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* Address Details */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>📍 Address Details</div>
            <div style={{ marginBottom: 10 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>Address</Text>
              <div style={{ fontSize: 13, color: '#999' }}>-</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>City</Text>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{project.city}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>State</Text>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{project.state}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 11 }}>Pincode</Text>
                <div style={{ fontSize: 13, color: '#999' }}>-</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Notes' && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#bbb' }}>No notes yet</div>
      )}
      {tab === 'Tasks' && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#bbb' }}>No tasks for this project</div>
      )}
    </Drawer>
  );
};

/* ── Filter Drawer ── */
const FilterDrawer = ({ open, onClose, onApply }) => {
  const clients = useAppSelector(s => s.clients.clients);
  const [filters, setFilters] = useState({});
  const set = (key, val) => setFilters(p => ({ ...p, [key]: val }));

  return (
    <Drawer
      title={<span style={{ fontWeight: 700 }}>Filters</span>}
      placement="right"
      open={open}
      onClose={onClose}
      width={320}
      styles={{ body: { padding: '20px 20px 80px', display: 'flex', flexDirection: 'column', gap: 18 } }}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <Button block onClick={() => { setFilters({}); onApply({}); }}>Clear All</Button>
          <Button type="primary" block style={{ background: primaryColor, border: 'none' }} onClick={() => { onApply(filters); onClose(); }}>
            Apply Filters
          </Button>
        </div>
      }
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Created Date</div>
        <RangePicker style={{ width: '100%', borderRadius: 8 }} onChange={v => set('dateRange', v)} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Client</div>
        <Select
          placeholder="Select client" style={{ width: '100%' }} allowClear
          options={clients.map(c => ({ value: c.clientName, label: c.clientName }))}
          onChange={v => set('client', v)}
        />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Stage</div>
        <Select
          placeholder="Select stage" style={{ width: '100%' }} allowClear
          options={stages.filter(s => s !== 'All').map(s => ({ value: s, label: s }))}
          onChange={v => set('stage', v)}
        />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Assigned To</div>
        <Select placeholder="Search assignee" style={{ width: '100%' }} allowClear
          options={[{ value: 'Arjun M.', label: 'Arjun M.' }, { value: 'Kavya S.', label: 'Kavya S.' }, { value: 'Rohan K.', label: 'Rohan K.' }]}
          onChange={v => set('assignee', v)}
        />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>City</div>
        <Input placeholder="Enter city" style={{ borderRadius: 8 }} onChange={e => set('city', e.target.value)} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Client Phone</div>
        <Input placeholder="Enter phone" style={{ borderRadius: 8 }} onChange={e => set('phone', e.target.value)} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Client Email</div>
        <Input placeholder="Enter email" style={{ borderRadius: 8 }} onChange={e => set('email', e.target.value)} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Budget</div>
        <Input placeholder="Enter budget" style={{ borderRadius: 8 }} onChange={e => set('budget', e.target.value)} />
      </div>
    </Drawer>
  );
};

/* ══════════════════════════════
   MAIN PAGE
══════════════════════════════ */
const ProjectsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects, activeTab } = useAppSelector(s => s.projects);
  const clients = useAppSelector(s => s.clients.clients);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'board' | 'list'
  const [filterOpen, setFilterOpen] = useState(false);
  const [overviewProject, setOverviewProject] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    let list = projects;
    if (activeTab !== 'All') list = list.filter(p => p.stage === activeTab);
    if (search) list = list.filter(p =>
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase())
    );
    if (appliedFilters.client) list = list.filter(p => p.clientName === appliedFilters.client);
    if (appliedFilters.stage) list = list.filter(p => p.stage === appliedFilters.stage);
    if (appliedFilters.city) list = list.filter(p => p.city?.toLowerCase().includes(appliedFilters.city.toLowerCase()));
    return list;
  }, [projects, activeTab, search, appliedFilters]);

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

  const tableColumns = [
    {
      title: 'Project', dataIndex: 'projectName', width: 220,
      render: (name, row) => (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate(`/projects/${row.id}`)}
        >
          <Avatar size={36} style={{ background: '#B1962515', color: '#B19625', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
            {name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: primaryColor }}>{name}</div>
            <div style={{ fontSize: 11, color: '#999' }}>{row.projectCode}</div>
          </div>
        </div>
      ),
    },
    { title: 'Client', dataIndex: 'clientName', width: 140, render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: 'Budget', dataIndex: 'budget', width: 110, render: v => <span style={{ color: '#B19625', fontWeight: 600 }}>₹{(v / 100000).toFixed(1)}L</span>, sorter: (a, b) => a.budget - b.budget },
    { title: 'City', dataIndex: 'city', width: 100 },
    { title: 'State', dataIndex: 'state', width: 130 },
    { title: 'Stage', dataIndex: 'stage', width: 120, render: v => <StatusTag value={v} />, filters: stages.filter(s => s !== 'All').map(s => ({ text: s, value: s })), onFilter: (v, r) => r.stage === v },
    { title: 'Phone', dataIndex: 'phone', width: 145, responsive: ['lg'] },
    { title: 'Date', dataIndex: 'createdDate', width: 100, sorter: (a, b) => a.createdDate.localeCompare(b.createdDate) },
    {
      title: '', width: 80,
      render: (_, row) => (
        <Space size={4}>
          <Tooltip title="View"><Button type="text" size="small" icon={<ArrowRightOutlined style={{ color: primaryColor }} />} onClick={e => { e.stopPropagation(); setOverviewProject(row); }} /></Tooltip>
          <Tooltip title="Edit"><Button type="text" size="small" icon={<EditOutlined />} style={{ color: '#B19625' }} onClick={e => e.stopPropagation()} /></Tooltip>
        </Space>
      ),
    },
  ];

  const activeStages = stages.filter(s => s !== 'All');
  const pageCardBg = isDark ? '#1f1f1f' : '#ffffff';
  const pageCardBorder = isDark ? '#303030' : '#f0f0f0';
  const mutedSurface = isDark ? '#232323' : '#f0f0f0';
  const chipBg = isDark ? '#262626' : '#ffffff';
  const chipBorder = isDark ? '#3a3a3a' : '#e0e0e0';
  const boardBg = isDark ? '#1f1f1f' : '#f9f9f9';

  const viewToggle = (
    <div style={{ display: 'flex', background: mutedSurface, borderRadius: 8, padding: 3, gap: 2 }}>
      <button
        onClick={() => setViewMode('list')}
        style={{
          padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: viewMode === 'list' ? '#B19625' : 'transparent',
          color: viewMode === 'list' ? 'white' : '#888',
          fontSize: 14, lineHeight: 1, display: 'flex', alignItems: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <UnorderedListOutlined />
      </button>
      <button
        onClick={() => setViewMode('board')}
        style={{
          padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: viewMode === 'board' ? '#B19625' : 'transparent',
          color: viewMode === 'board' ? 'white' : '#888',
          fontSize: 14, lineHeight: 1, display: 'flex', alignItems: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <AppstoreOutlined />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="All Projects"
        subtitle={`${projects.length} total projects`}
        actions={
          <>
            <Input
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              placeholder="Search projects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 200, borderRadius: 8 }}
              allowClear
            />
            <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>Excel</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ background: primaryColor, border: 'none', borderRadius: 8 }}
            >
              New Project
            </Button>
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8 }} onClick={() => setFilterOpen(true)}>
              Filters
            </Button>
            {viewToggle}
          </>
        }
      />

      {/* Stage filter tabs row */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {stages.map(s => {
          const isActive = activeTab === s;
          const count = s === 'All' ? projects.length : projects.filter(p => p.stage === s).length;
          return (
            <button
              key={s}
              onClick={() => dispatch(setActiveTab(s))}
              style={{
                padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13,
                border: isActive ? 'none' : `1.5px solid ${s === 'All' ? primaryLight : chipBorder}`,
                background: isActive ? primaryColor : chipBg,
                color: isActive ? 'white' : (s === 'All' ? primaryColor : '#555'),
                fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: isActive ? '0 6px 16px rgba(177,150,37,0.22)' : 'none',
              }}
            >
              {s} ({count})
            </button>
          );
        })}
        <button style={{ padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${primaryLight}`, background: chipBg, cursor: 'pointer', fontSize: 14, color: primaryColor, flexShrink: 0 }}>+</button>
      </div>

      {/* BOARD VIEW */}
      {viewMode === 'board' && (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, WebkitOverflowScrolling: 'touch', alignItems: 'flex-start' }}>
          {activeStages.map(stage => {
            const stageProjects = filtered.filter(p => p.stage === stage);
            const color = stageColors[stage] || '#999';
            return (
              <div
                key={stage}
                style={{
                  minWidth: 260, width: 260, flexShrink: 0,
                  background: boardBg, borderRadius: 12,
                  border: `1px solid ${pageCardBorder}`,
                  borderTop: `3px solid ${color}`,
                  display: 'flex', flexDirection: 'column',
                  minHeight: 400,
                }}
              >
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{stage}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: `${color}20`, color, borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '1px 8px' }}>
                      {stageProjects.length}
                    </span>
                    <Button type="text" size="small" icon={<MoreOutlined />} style={{ padding: 2 }} />
                  </div>
                </div>

                {/* Cards */}
                <div style={{ flex: 1, padding: '4px 10px 8px' }}>
                  {stageProjects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#bbb' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
                      <div style={{ fontSize: 12 }}>No projects in this stage</div>
                    </div>
                  ) : (
                    stageProjects.map(p => (
                      <KanbanCard key={p.id} project={p} onView={setOverviewProject} isDark={isDark} />
                    ))
                  )}
                </div>

                {/* Add button */}
                <div style={{ padding: '8px 10px 12px' }}>
                  <Button
                    block
                    icon={<PlusOutlined />}
                    style={{ borderRadius: 8, background: primaryColor, color: 'white', border: 'none', fontWeight: 600 }}
                    onClick={() => setModalOpen(true)}
                  >
                    Add Project
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div
          style={{
            background: pageCardBg,
            borderRadius: 14,
            padding: isMobile ? 12 : 20,
            boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
            border: `1px solid ${pageCardBorder}`,
          }}
        >
          <Table
            dataSource={filtered}
            columns={tableColumns}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `${t} projects`, style: { marginTop: 16 } }}
            scroll={{ x: 1100 }}
            size="middle"
            onRow={row => ({ style: { cursor: 'pointer' }, onClick: () => navigate(`/projects/${row.id}`) })}
          />
        </div>
      )}

      {/* Project Overview Drawer */}
      <ProjectOverviewDrawer
        project={overviewProject}
        open={!!overviewProject}
        onClose={() => setOverviewProject(null)}
        onNavigate={(id) => { setOverviewProject(null); navigate(`/projects/${id}`); }}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setAppliedFilters}
      />

      {/* Add Project Modal */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>New Project</span>}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleAdd}
        okText="Create Project"
        okButtonProps={{ style: { background: primaryColor, border: 'none' } }}
        width={isMobile ? '95%' : 640}
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="clientName" label="Client" rules={[{ required: true }]}>
            <Select placeholder="Select client" showSearch filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={clients.map(c => ({ value: c.clientName, label: c.clientName }))} />
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
            <Col span={12}><Form.Item name="city" label="City"><Input placeholder="City" /></Form.Item></Col>
            <Col span={12}>
              <Form.Item name="state" label="State">
                <Select placeholder="Select state" options={indianStates.map(s => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="phone" label="Phone"><Input placeholder="Phone number" /></Form.Item></Col>
            <Col span={12}><Form.Item name="email" label="Email"><Input placeholder="Email address" /></Form.Item></Col>
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
