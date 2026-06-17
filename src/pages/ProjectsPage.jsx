import { useState, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, Select, InputNumber,
  Tooltip, DatePicker, Avatar, Row, Col, Drawer, Tag,
  Space, Typography, Divider, Checkbox, Dropdown,
} from 'antd';
import {
  PlusOutlined, ExportOutlined, EditOutlined, SearchOutlined,
  FilterOutlined, AppstoreOutlined, UnorderedListOutlined,
  PhoneOutlined, UserOutlined, MoreOutlined, ArrowRightOutlined,
  CloseOutlined, InfoCircleOutlined, ClockCircleOutlined, MailOutlined, DeleteOutlined, EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { addProject, updateProject, setActiveTab, assignProject } from '@/store/slices/projectSlice';
import { STAFF_MEMBERS } from '@/store/slices/enquirySlice';
import { addClient } from '@/store/slices/clientSlice';
import { stages, indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';
import useIsMobile from '@/hooks/useIsMobile';
import { Folder, Users, MapPin } from 'lucide-react';

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

// Light: buff/brown  |  Dark: blue — imported from StatusTag palette
const LIGHT_STAGE_COLORS = {
  Sales:     '#D69F6D',
  Designing: '#C07230',
  Execution: '#7A4218',
  Snags:     '#B87C4A',
  Handover:  '#E8C49A',
  Completed: '#4F312A',
};
const DARK_STAGE_COLORS = {
  Sales:     '#5AB5E8',
  Designing: '#3A8FC4',
  Execution: '#7ED3F0',
  Snags:     '#2A7DB5',
  Handover:  '#A8D8F0',
  Completed: '#1A6499',
};
// used in ProjectOverviewDrawer (receives isDark)
const stageColors = LIGHT_STAGE_COLORS;

const phoneCodeOptions = [{ value: '+91', label: '+91' }];
const modalUserOptions = [
  'Anantha Narayana',
  'Chandra Bose',
  'Madhu Loganathan',
  'Praveen Kumar',
  'Ramu',
  'Renuga Devi',
  'Sathish',
];
const vendorOptions = ['Studio Grid', 'Value Kitchens', 'Blue Stone Works'];

/* ── Kanban project card ── */
const KanbanCard = ({ project, onView, isDark }) => {
  const primaryColor = isDark ? '#5AB5E8' : '#D69F6D';
  return (
  <div
    style={{
      background: isDark ? '#0d3554' : 'white', borderRadius: 10, padding: '12px 14px', marginBottom: 8,
      boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer',
      border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`, transition: 'box-shadow 0.2s ease',
    }}
    onClick={() => onView(project)}
    onMouseEnter={e => { if (!isDark) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <div>
        <div style={{ fontSize: 14, color: '#999', fontWeight: 500 }}>{project.projectCode}</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{project.projectName}</div>
      </div>
      <Button
        type="text" size="small" icon={<ArrowRightOutlined style={{ color: primaryColor }} />}
        style={{ padding: 2, border: `1px solid ${primaryColor}`, borderRadius: 6 }}
        onClick={e => { e.stopPropagation(); onView(project); }}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: '#666', marginTop: 8 }}>
      <UserOutlined style={{ fontSize: 15, color: '#999' }} />
      <span>{project.clientName}</span>
    </div>
    {project.phone && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: '#666', marginTop: 4 }}>
        <PhoneOutlined style={{ fontSize: 15, color: '#999' }} />
        <span>{project.phone}</span>
      </div>
    )}
  </div>
  );
};

/* ── Project Overview Drawer ── */
const ProjectOverviewDrawer = ({ project, open, onClose, onNavigate }) => {
  const isDark = useAppSelector(s => s.ui.theme) === 'dark';
  const primaryColor = isDark ? '#5AB5E8' : '#D69F6D';
  const [tab, setTab] = useState('Details');
  if (!project) return null;
  const color = (isDark ? DARK_STAGE_COLORS : LIGHT_STAGE_COLORS)[project.stage] || (isDark ? '#5AB5E8' : '#B87C4A');

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Project Overview</span>
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
            <span style={{ fontWeight: 800, fontSize: 18 }}>{project.projectName}</span>
            <Tag style={{ borderRadius: 6, fontWeight: 600, fontSize: 15 }}>{project.projectCode}</Tag>
            <Tag color={color} style={{ borderRadius: 6, fontSize: 15 }}>{project.stage}</Tag>
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
        <div style={{ display: 'flex', gap: 16, fontSize: 15, color: '#555' }}>
          <span><UserOutlined style={{ marginRight: 5, color: '#999' }} />{project.clientName}</span>
          {project.phone && <span><PhoneOutlined style={{ marginRight: 5, color: '#999' }} />{project.phone}</span>}
        </div>
      </div>

      {/* Budget + Assignees */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 32 }}>
        <div>
          <Text type="secondary" style={{ fontSize: 15 }}>Total Budget</Text>
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 2 }}>₹{(project.budget / 100000).toFixed(1)}L</div>
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 15 }}>Project Assignees</Text>
          <div style={{ marginTop: 4 }}>
            <Avatar size={28} style={{ background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)', color: primaryColor, fontWeight: 700, fontSize: 16 }}>T</Avatar>
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
              flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontSize: 15,
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
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <InfoCircleOutlined style={{ color: '#555' }} /> Project Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 10 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 15 }}>Created on</Text>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{project.createdDate}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 15 }}>Last updated on</Text>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{project.createdDate}</div>
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 15 }}>Description</Text>
              <div style={{ fontSize: 15, color: '#999' }}>-</div>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* Team Members */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} color="#555" /> Team Members
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar size={34} style={{ background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)', color: primaryColor, fontWeight: 700 }}>T</Avatar>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Thara</div>
                <div style={{ fontSize: 15, color: '#999' }}>Member</div>
              </div>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          {/* Address Details */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} color="#555" /> Address Details
            </div>
            <div style={{ marginBottom: 10 }}>
              <Text type="secondary" style={{ fontSize: 15 }}>Address</Text>
              <div style={{ fontSize: 15, color: '#999' }}>-</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <Text type="secondary" style={{ fontSize: 15 }}>City</Text>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{project.city}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 15 }}>State</Text>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{project.state}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 15 }}>Pincode</Text>
                <div style={{ fontSize: 15, color: '#999' }}>-</div>
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
  const isDark = useAppSelector(s => s.ui.theme) === 'dark';
  const primaryColor = isDark ? '#0B2B44' : '#D69F6D';
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
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Created Date</div>
        <RangePicker style={{ width: '100%', borderRadius: 8 }} onChange={v => set('dateRange', v)} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Client</div>
        <Select
          placeholder="Select client" style={{ width: '100%' }} allowClear
          options={clients.map(c => ({ value: c.clientName, label: c.clientName }))}
          onChange={v => set('client', v)}
        />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Stage</div>
        <Select
          placeholder="Select stage" style={{ width: '100%' }} allowClear
          options={stages.filter(s => s !== 'All').map(s => ({ value: s, label: s }))}
          onChange={v => set('stage', v)}
        />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Assigned To</div>
        <Select placeholder="Search assignee" style={{ width: '100%' }} allowClear
          options={[{ value: 'Arjun M.', label: 'Arjun M.' }, { value: 'Kavya S.', label: 'Kavya S.' }, { value: 'Rohan K.', label: 'Rohan K.' }]}
          onChange={v => set('assignee', v)}
        />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>City</div>
        <Input placeholder="Enter city" style={{ borderRadius: 8 }} onChange={e => set('city', e.target.value)} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Client Phone</div>
        <Input placeholder="Enter phone" style={{ borderRadius: 8 }} onChange={e => set('phone', e.target.value)} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Client Email</div>
        <Input placeholder="Enter email" style={{ borderRadius: 8 }} onChange={e => set('email', e.target.value)} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Budget</div>
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
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const primaryLight = isDark ? '#5ab5e8' : '#D69F6D';
  const modalAccent = isDark ? '#5ab5e8' : '#D69F6D';

  const [modalOpen, setModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editClientInviteOpen, setEditClientInviteOpen] = useState(false);
  const [editVendorInviteOpen, setEditVendorInviteOpen] = useState(false);
  const [editUserPickerOpen, setEditUserPickerOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [projectUsers, setProjectUsers] = useState([{ key: '1', name: 'Anantha Narayana', role: 'Client' }]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'board' | 'list'
  const [filterOpen, setFilterOpen] = useState(false);
  const [overviewProject, setOverviewProject] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [form] = Form.useForm();
  const [clientForm] = Form.useForm();
  const [editClientInviteForm] = Form.useForm();
  const [editVendorInviteForm] = Form.useForm();

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
      if (editingProject) {
        dispatch(updateProject({
          ...editingProject,
          ...values,
          phone: `${values.phoneCode || '+91'} ${values.phoneNumber || ''}`.trim(),
        }));
      } else {
        dispatch(addProject({
          id: Date.now().toString(),
          createdDate: new Date().toISOString().split('T')[0],
          projectCode: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
          ...values,
        }));
      }
      setModalOpen(false);
      form.resetFields();
      setEditingProject(null);
    });
  };

  const openCreateProjectModal = () => {
    setEditingProject(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditProjectModal = (project) => {
    const matchedClient = clients.find(c => c.clientName === project.clientName);
    const phoneText = String(project.phone || matchedClient?.phone || '').trim();
    const phoneCode = phoneText.startsWith('+91') ? '+91' : '+91';
    const phoneNumber = phoneText.replace(/^\+91\s*/, '');
    setEditingProject(project);
    form.setFieldsValue({
      clientName: project.clientName,
      projectName: project.projectName,
      stage: project.stage,
      subStage: 'BOQ Discussion',
      budget: project.budget,
      description: project.description || '',
      address1: project.address1 || '',
      address2: project.address2 || '',
      state: project.state || '',
      city: project.city || '',
      location: project.location || '',
      pincode: project.pincode || '',
      email: project.email || matchedClient?.email || '',
      phoneCode,
      phoneNumber,
      legalName: project.legalName || matchedClient?.legalName || '',
      gst: project.gst || matchedClient?.gst || '',
    });
    setProjectUsers([{ key: '1', name: 'Anantha Narayana', role: 'Client' }]);
    setModalOpen(true);
  };

  const handleEditClientInvite = () => {
    editClientInviteForm.validateFields().then(values => {
      setProjectUsers(prev => [...prev, { key: Date.now().toString(), name: values.username, role: values.role || 'Client' }]);
      setEditClientInviteOpen(false);
      editClientInviteForm.resetFields();
    });
  };

  const handleEditVendorInvite = () => {
    editVendorInviteForm.validateFields().then(values => {
      setProjectUsers(prev => [...prev, { key: Date.now().toString(), name: values.username, role: values.role || 'Vendor' }]);
      setEditVendorInviteOpen(false);
      editVendorInviteForm.resetFields();
    });
  };

  const handleCreateClient = () => {
    clientForm.validateFields().then(values => {
      const client = {
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
        clientName: values.clientName,
        legalName: values.legalName || values.clientName,
        phone: `${values.phoneCode || '+91'} ${values.phone || ''}`.trim(),
        email: values.email || '',
        address1: values.address1 || '',
        address2: values.address2 || '',
        city: values.city || '',
        state: values.state || '',
        location: values.location || '',
        pincode: values.pincode || '',
        pan: values.pan || '',
        gst: values.gst || '',
      };
      dispatch(addClient(client));
      form.setFieldValue('clientName', client.clientName);
      setClientModalOpen(false);
      clientForm.resetFields();
    });
  };

  const tableColumns = [
    {
      title: 'Project', dataIndex: 'projectName', width: 220,
      render: (name, row) => (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate(`/projects/${row.id}/v2`)}
        >
          <Avatar size={36} style={{ background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)', color: isDark ? '#5ab5e8' : primaryColor, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
            {name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: isDark ? '#a8cce8' : primaryColor }}>{name}</div>
            <div style={{ fontSize: 15, color: '#999' }}>{row.projectCode}</div>
          </div>
        </div>
      ),
    },
    { title: 'Client', dataIndex: 'clientName', width: 140, render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: 'Budget', dataIndex: 'budget', width: 110, render: v => <span style={{ color: isDark ? '#a8cce8' : '#D69F6D', fontWeight: 600 }}>₹{(v / 100000).toFixed(1)}L</span>, sorter: (a, b) => a.budget - b.budget },
    { title: 'City', dataIndex: 'city', width: 100 },
    { title: 'State', dataIndex: 'state', width: 130 },
    { title: 'Stage', dataIndex: 'stage', width: 120, render: v => <StatusTag value={v} />, filters: stages.filter(s => s !== 'All').map(s => ({ text: s, value: s })), onFilter: (v, r) => r.stage === v },
    { title: 'Phone', dataIndex: 'phone', width: 145, responsive: ['lg'] },
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
    { title: 'Date', dataIndex: 'createdDate', width: 100, sorter: (a, b) => a.createdDate.localeCompare(b.createdDate) },
    {
      title: 'Actions', width: 80, fixed: 'right',
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
                    setOverviewProject(row);
                  },
                },
                {
                  key: 'edit',
                  icon: <EditOutlined style={{ color: primaryColor }} />,
                  label: 'Edit',
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    openEditProjectModal(row);
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
                      dispatch(assignProject({ projectId: row.id, personName: staff.name }));
                    },
                  })),
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined style={{ fontSize: 18, color: '#999' }} />}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  const activeStages = stages.filter(s => s !== 'All');
  const pageCardBg = isDark ? '#0d3554' : '#ffffff';
  const pageCardBorder = isDark ? '#1a4d72' : '#f0f0f0';
  const mutedSurface = isDark ? '#0a2235' : '#f0f0f0';
  const chipBg = isDark ? '#0d3554' : '#ffffff';
  const chipBorder = isDark ? '#1a4d72' : '#e0e0e0';
  const boardBg = isDark ? '#0d3554' : '#f9f9f9';
  const visibleUsers = modalUserOptions.filter(name => name.toLowerCase().includes(userSearch.toLowerCase()));

  const viewToggle = (
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
      <Tooltip title="Board View">
        <Button
          icon={<AppstoreOutlined />}
          type={viewMode === 'board' ? 'primary' : 'default'}
          onClick={() => setViewMode('board')}
          style={viewMode === 'board' ? { background: primaryColor, border: 'none', color: '#fff' } : {}}
        >
          {!isMobile && 'Board'}
        </Button>
      </Tooltip>
    </Space.Compact>
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
              style={{ width: isMobile ? 180 : 200, borderRadius: 8 }}
              allowClear
            />
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8 }} className="crm-outline-btn" onClick={() => setFilterOpen(true)}>
              Filter
            </Button>
            <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }} className="crm-outline-btn">Export</Button>
            {viewToggle}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateProjectModal}
              style={{ background: primaryColor, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 500 }}
            >
              {!isMobile && 'New Project'}
            </Button>
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
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.transform = 'scale(1)'; }}
              style={{
                padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 15,
                border: isActive ? 'none' : `1px solid ${chipBorder}`,
                background: isActive ? (isDark ? '#133d5e' : primaryColor) : chipBg,
                color: isActive ? 'white' : (isDark ? '#a8b0ba' : '#555'),
                fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: isActive ? (isDark ? '0 4px 14px rgba(19,61,94,0.55)' : '0 6px 16px rgba(11,43,68,0.22)') : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {s} ({count})
            </button>
          );
        })}
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
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{stage}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: `${color}20`, color, borderRadius: 10, fontSize: 15, fontWeight: 700, padding: '1px 8px' }}>
                      {stageProjects.length}
                    </span>
                    <Button type="text" size="small" icon={<MoreOutlined />} style={{ padding: 2 }} />
                  </div>
                </div>

                {/* Cards */}
                <div style={{ flex: 1, padding: '4px 10px 8px' }}>
                  {stageProjects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#bbb' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                        <Folder size={30} color="#bbb" />
                      </div>
                      <div style={{ fontSize: 16 }}>No projects in this stage</div>
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
                    onClick={openCreateProjectModal}
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
            onRow={row => ({ style: { cursor: 'pointer' }, onClick: () => navigate(`/projects/${row.id}/v2`) })}
          />
        </div>
      )}

      {/* Project Overview Drawer */}
      <ProjectOverviewDrawer
        project={overviewProject}
        open={!!overviewProject}
        onClose={() => setOverviewProject(null)}
        onNavigate={(id) => { setOverviewProject(null); navigate(`/projects/${id}/v2`); }}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setAppliedFilters}
      />

      {/* Add Project Modal */}
      <Modal
        className={editingProject ? 'crm-sheet-modal' : 'crm-modal'}
        title={<span>{editingProject ? 'Edit Project' : 'New Project'}</span>}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingProject(null);
        }}
        onOk={handleAdd}
        okText="Submit"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : (editingProject ? 1080 : 860)}
        centered
      >
        {!editingProject ? (
          <>
            <Form form={form} layout="vertical" className="crm-form-shell">
              <div className="crm-section">
                <div className="crm-section-title">
                  <span className="crm-section-badge">1</span>
                  <span>Client Details</span>
                </div>
                <Row gutter={10} align="bottom">
                  <Col flex="auto">
                    <Form.Item name="clientName" label="Client" rules={[{ required: true, message: 'Client is required' }]}>
                      <Select
                        showSearch
                        placeholder="Select client"
                        filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={clients.map(c => ({ value: c.clientName, label: c.clientName }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Button className="crm-primary-btn" icon={<PlusOutlined />} style={{ marginBottom: 18, background: modalAccent }} onClick={() => setClientModalOpen(true)}>
                      Client
                    </Button>
                  </Col>
                </Row>
              </div>

              <div className="crm-section">
                <div className="crm-section-title">
                  <span className="crm-section-badge">2</span>
                  <span>Project Details</span>
                </div>
                <Form.Item name="projectName" label="Project Name" rules={[{ required: true, message: 'Project name is required' }]}>
                  <Input />
                </Form.Item>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="stage" label="Project Stage" rules={[{ required: true, message: 'Project stage is required' }]}><Select placeholder="Select stage" options={stages.filter(s => s !== 'All').map(s => ({ value: s, label: s }))} /></Form.Item></Col>
                  <Col span={12}><Form.Item name="budget" label="Budget"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
                </Row>
                <Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item>
              </div>

              <div className="crm-section" style={{ marginBottom: 8 }}>
                <div className="crm-section-title">
                  <span className="crm-section-badge">3</span>
                  <span>Address Details</span>
                </div>
                <Form.Item name="sameAsClientAddress" valuePropName="checked" style={{ marginBottom: 12 }}><Checkbox>Same as Client Address</Checkbox></Form.Item>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="address1" label="Address Line 1"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="address2" label="Address Line 2"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={12}>
                  <Col span={6}><Form.Item name="state" label="State"><Select placeholder="Select state" options={indianStates.map(s => ({ value: s, label: s }))} /></Form.Item></Col>
                  <Col span={6}><Form.Item name="city" label="City"><Input /></Form.Item></Col>
                  <Col span={6}><Form.Item name="location" label="Location"><Input /></Form.Item></Col>
                  <Col span={6}><Form.Item name="pincode" label="Pincode"><Input /></Form.Item></Col>
                </Row>
              </div>
            </Form>

            <Modal className="crm-modal" title={<span>New Client</span>} open={clientModalOpen} onCancel={() => { setClientModalOpen(false); clientForm.resetFields(); }} onOk={handleCreateClient} okText="Submit" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ className: 'crm-primary-btn' }} width={isMobile ? '96%' : 860} centered>
              <Form form={clientForm} layout="vertical" className="crm-form-shell" initialValues={{ phoneCode: '+91' }}>
                <div className="crm-section">
                  <div className="crm-section-title"><span className="crm-section-badge">1</span><span>Primary Details</span></div>
                  <Row gutter={12}>
                    <Col span={12}><Form.Item name="clientName" label="Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item name="email" label="Email"><Input /></Form.Item></Col>
                  </Row>
                  <Row gutter={12}>
                    <Col span={6}><Form.Item name="phoneCode" label="Phone"><Select options={phoneCodeOptions} /></Form.Item></Col>
                    <Col span={10}><Form.Item name="phone" label=" " colon={false} rules={[{ required: true }]}><Input /></Form.Item></Col>
                  </Row>
                </div>
                <div className="crm-section">
                  <div className="crm-section-title"><span className="crm-section-badge">2</span><span>Address Details</span></div>
                  <Row gutter={12}>
                    <Col span={12}><Form.Item name="address1" label="Address Line 1"><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item name="address2" label="Address Line 2"><Input /></Form.Item></Col>
                  </Row>
                  <Row gutter={12}>
                    <Col span={6}><Form.Item name="state" label="State"><Select placeholder="Select state" options={indianStates.map(s => ({ value: s, label: s }))} /></Form.Item></Col>
                    <Col span={6}><Form.Item name="city" label="City"><Input /></Form.Item></Col>
                    <Col span={6}><Form.Item name="location" label="Location"><Input /></Form.Item></Col>
                    <Col span={6}><Form.Item name="pincode" label="Pincode"><Input /></Form.Item></Col>
                  </Row>
                </div>
                <div className="crm-section" style={{ marginBottom: 8 }}>
                  <div className="crm-section-title"><span className="crm-section-badge">3</span><span>Client Details</span></div>
                  <Row gutter={12}>
                    <Col span={8}><Form.Item name="legalName" label="Legal Name"><Input /></Form.Item></Col>
                    <Col span={8}><Form.Item name="pan" label="PAN"><Input /></Form.Item></Col>
                    <Col span={8}><Form.Item name="gst" label="GST Number"><Input /></Form.Item></Col>
                  </Row>
                </div>
              </Form>
            </Modal>
          </>
        ) : (
          <>
            <Form form={form} layout="vertical" className="crm-form-shell">
              <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: 16, marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#e9edef' : '#111827' }}>{editingProject.clientName} ({editingProject.projectName}) {editingProject.createdDate}</span>
                  <EditOutlined style={{ color: isDark ? '#5ab5e8' : '#0B2B44', fontSize: 18 }} />
                  <MoreOutlined style={{ color: isDark ? '#8696a0' : '#111827', fontSize: 20 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(140px, 1fr))', gap: 12, width: isMobile ? '100%' : 300 }}>
                  <Form.Item name="stage" label="Main Stage" style={{ marginBottom: 0 }}><Select placeholder="Select stage" options={stages.filter(s => s !== 'All').map(s => ({ value: s, label: s }))} /></Form.Item>
                  <Form.Item name="subStage" label="Sub Stage" style={{ marginBottom: 0 }}><Select placeholder="Select sub stage" options={[{ value: 'BOQ Discussion', label: 'BOQ Discussion' }, { value: 'Concept Design', label: 'Concept Design' }, { value: 'Design Approval', label: 'Design Approval' }]} /></Form.Item>
                </div>
              </div>
              <div className="crm-panel-card" style={{ marginBottom: 12 }}>
                <div className="crm-panel-card__head">Contact Details</div>
                <div className="crm-panel-card__body">
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1.2fr', gap: 14 }}>
                    <Form.Item name="clientName" label="Name"><Input /></Form.Item>
                    <Form.Item name="email" label="Email"><Input /></Form.Item>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#a8cce8' : '#333', marginBottom: 8 }}>Phone *</div>
                      <Row gutter={10}>
                        <Col span={8}><Form.Item name="phoneCode" style={{ marginBottom: 0 }}><Select options={phoneCodeOptions} /></Form.Item></Col>
                        <Col span={16}><Form.Item name="phoneNumber" style={{ marginBottom: 0 }}><Input /></Form.Item></Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
              <div className="crm-panel-card" style={{ marginBottom: 12 }}>
                <div className="crm-panel-card__head">Project Details</div>
                <div className="crm-panel-card__body">
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 14, marginBottom: 12 }}>
                    <div><div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#a8cce8' : '#111827', marginBottom: 8 }}>Created on</div><div style={{ fontSize: 16 }}>{editingProject.createdDate}</div></div>
                    <div><div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#a8cce8' : '#111827', marginBottom: 8 }}>Last updated on</div><div style={{ fontSize: 16 }}>{editingProject.createdDate}</div></div>
                    <Form.Item name="budget" label="Budget"><Input /></Form.Item>
                  </div>
                  <Form.Item name="description" label="Description" style={{ maxWidth: 320, marginBottom: 0 }}><Input.TextArea rows={2} /></Form.Item>
                </div>
              </div>
              <div className="crm-panel-card" style={{ marginBottom: 12 }}>
                <div className="crm-panel-card__head">Address Details</div>
                <div className="crm-panel-card__body">
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 14 }}>
                    <Form.Item name="address1" label="Address line 1"><Input /></Form.Item>
                    <Form.Item name="address2" label="Address line 2"><Input /></Form.Item>
                    <Form.Item name="city" label="City"><Input /></Form.Item>
                    <Form.Item name="state" label="State"><Select placeholder="Select state" options={indianStates.map(s => ({ value: s, label: s }))} /></Form.Item>
                    <Form.Item name="pincode" label="Pincode"><Input /></Form.Item>
                    <Form.Item name="location" label="Location"><Input /></Form.Item>
                  </div>
                </div>
              </div>
              <div className="crm-panel-card" style={{ marginBottom: 12 }}>
                <div className="crm-panel-card__head">Other Details</div>
                <div className="crm-panel-card__body">
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                    <Form.Item name="legalName" label="Legal name"><Input /></Form.Item>
                    <Form.Item name="gst" label="GST number"><Input /></Form.Item>
                  </div>
                </div>
              </div>
              <div className="crm-panel-card" style={{ marginBottom: 12 }}>
                <div className="crm-panel-card__head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Documents</span>
                  <Button type="link" style={{ padding: 0 }}>+ Add Documents</Button>
                </div>
                <div className="crm-panel-card__body" style={{ color: '#6b7280' }}>No documents found for this project.</div>
              </div>
              <div className="crm-panel-card">
                <div className="crm-panel-card__head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <span>Project Users</span>
                  <Space wrap>
                    <Button className="crm-primary-btn" icon={<PlusOutlined />} onClick={() => setEditClientInviteOpen(true)} style={{ minWidth: 0, paddingInline: 12 }}>Client</Button>
                    <Button className="crm-primary-btn" icon={<PlusOutlined />} onClick={() => setEditVendorInviteOpen(true)} style={{ minWidth: 0, paddingInline: 12 }}>Vendor</Button>
                    <Button className="crm-primary-btn" icon={<PlusOutlined />} onClick={() => setEditUserPickerOpen(true)} style={{ minWidth: 0, paddingInline: 12 }}>User</Button>
                  </Space>
                </div>
                <div className="crm-panel-card__body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 14, marginBottom: 10, fontSize: 15, fontWeight: 700, color: isDark ? '#a8cce8' : '#111827' }}><div>Name</div><div>Role</div><div /></div>
                  {projectUsers.map(user => (
                    <div key={user.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 14, padding: '8px 0', borderTop: `1px solid ${isDark ? '#1a4d72' : '#ededed'}` }}>
                      <div>{user.name}</div><div>{user.role}</div>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => setProjectUsers(prev => prev.filter(item => item.key !== user.key))} />
                    </div>
                  ))}
                </div>
              </div>
            </Form>
            <Modal className="crm-modal" title={<span>Add Client</span>} open={editClientInviteOpen} onCancel={() => { setEditClientInviteOpen(false); editClientInviteForm.resetFields(); }} onOk={handleEditClientInvite} okText="Submit" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ className: 'crm-primary-btn' }} width={isMobile ? '96%' : 420} centered>
              <Form form={editClientInviteForm} layout="vertical" className="crm-form-shell" initialValues={{ username: editingProject.clientName, role: 'Client', phoneCode: '+91' }}>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input prefix={<UserOutlined />} /></Form.Item>
                <Row gutter={10}><Col span={8}><Form.Item name="phoneCode" label="Phone" rules={[{ required: true }]}><Select options={phoneCodeOptions} /></Form.Item></Col><Col span={16}><Form.Item name="phone" label=" " colon={false} rules={[{ required: true }]}><Input /></Form.Item></Col></Row>
                <Form.Item name="email" label="Email"><Input prefix={<MailOutlined />} /></Form.Item>
                <Form.Item name="role" label="Role"><Select options={[{ value: 'Client', label: 'Client' }, { value: 'Vendor', label: 'Vendor' }, { value: 'User', label: 'User' }]} /></Form.Item>
              </Form>
            </Modal>
            <Modal className="crm-modal" title={<span>Add Vendor</span>} open={editVendorInviteOpen} onCancel={() => { setEditVendorInviteOpen(false); editVendorInviteForm.resetFields(); }} onOk={handleEditVendorInvite} okText="Submit" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ className: 'crm-primary-btn' }} width={isMobile ? '96%' : 420} centered>
              <Form form={editVendorInviteForm} layout="vertical" className="crm-form-shell" initialValues={{ role: 'Vendor', phoneCode: '+91' }}>
                <Form.Item name="vendor" label="Select Vendor" rules={[{ required: true }]}><Select options={vendorOptions.map(value => ({ value, label: value }))} /></Form.Item>
                <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input prefix={<UserOutlined />} /></Form.Item>
                <Row gutter={10}><Col span={8}><Form.Item name="phoneCode" label="Phone" rules={[{ required: true }]}><Select options={phoneCodeOptions} /></Form.Item></Col><Col span={16}><Form.Item name="phone" label=" " colon={false} rules={[{ required: true }]}><Input /></Form.Item></Col></Row>
                <Form.Item name="email" label="Email"><Input prefix={<MailOutlined />} /></Form.Item>
                <Form.Item name="role" label="Role"><Select options={[{ value: 'Vendor', label: 'Vendor' }, { value: 'Client', label: 'Client' }, { value: 'User', label: 'User' }]} /></Form.Item>
              </Form>
            </Modal>
            <Modal className="crm-modal" title={<span>Select Users</span>} open={editUserPickerOpen} onCancel={() => setEditUserPickerOpen(false)} onOk={() => {
              setProjectUsers(prev => ([...prev, ...selectedUsers.filter(name => !prev.some(item => item.name === name)).map(name => ({ key: String(Date.now()) + '-' + name, name, role: 'User' }))]));
              setEditUserPickerOpen(false);
              setSelectedUsers([]);
              setUserSearch('');
            }} okText="Confirm" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ className: 'crm-primary-btn' }} width={isMobile ? '96%' : 360} centered>
              <div className="crm-form-shell">
                <Input prefix={<SearchOutlined />} placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ marginBottom: 12 }} />
                <div style={{ paddingRight: 4 }}>
                  {visibleUsers.map(name => (
                    <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 2px', color: '#4b5563' }}>
                      <Checkbox checked={selectedUsers.includes(name)} onChange={e => setSelectedUsers(prev => e.target.checked ? [...prev, name] : prev.filter(item => item !== name))} />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Modal>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsPage;
