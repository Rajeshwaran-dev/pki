import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateProject } from '@/store/slices/projectSlice';
import useIsMobile from '@/hooks/useIsMobile';
import {
  Button, Tag, Avatar, Select, Space, Modal, Form, Input, Checkbox,Row, Col, DatePicker, TimePicker, Tooltip, notification, Popover, Divider, Upload, Dropdown, Menu, Badge, Switch, Slider, Progress, Steps, Carousel, Collapse, List, Skeleton, Empty, Typography, Tabs, Table, Card, Timeline, Tree, Calendar, BackTop
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, InfoCircleOutlined, UploadOutlined,
  AppstoreOutlined, UnorderedListOutlined, CheckCircleOutlined,
  FileTextOutlined, PictureOutlined, CodeOutlined, PercentageOutlined,
  ShoppingCartOutlined, ReconciliationOutlined, InboxOutlined,
  ThunderboltOutlined, LineChartOutlined, AimOutlined, TeamOutlined,
  DollarOutlined, CheckSquareOutlined, PlusOutlined, DownloadOutlined,
  ExportOutlined, MoreOutlined, SearchOutlined, FilterOutlined,
  AudioOutlined, ReloadOutlined, FileImageOutlined, MailOutlined,
  DeleteOutlined, EllipsisOutlined,UserOutlined, PhoneOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const PROJECT_TABS = [
  { key: 'Files', label: 'Files', icon: <FileTextOutlined /> },
  { key: 'Moodboard', label: 'Moodboard', icon: <PictureOutlined /> },
  { key: 'Notes', label: 'Notes', icon: <FileTextOutlined /> },
  { key: 'Tasks', label: 'Tasks', icon: <CodeOutlined /> },
  { key: 'Quotes', label: 'Quotes', icon: <PercentageOutlined /> },
  { key: 'Orders', label: 'Orders', icon: <ShoppingCartOutlined /> },
  { key: 'Invoices', label: 'Invoices', icon: <ReconciliationOutlined /> },
  { key: 'Purchase Request', label: 'Purchase Request', icon: <InboxOutlined /> },
  { key: 'Inventory', label: 'Inventory', icon: <InboxOutlined /> },
  { key: 'Activities', label: 'Activities', icon: <ThunderboltOutlined /> },
  { key: 'Client Progress', label: 'Client Progress', icon: <LineChartOutlined /> },
  { key: 'Milestones', label: 'Milestones', icon: <AimOutlined /> },
  { key: 'Vendor Milestone', label: 'Vendor Milestone', icon: <AimOutlined /> },
  { key: 'Manpower', label: 'Manpower', icon: <TeamOutlined /> },
  { key: 'Financials', label: 'Financials', icon: <DollarOutlined /> },
  { key: 'Checklists', label: 'Checklists', icon: <CheckSquareOutlined /> },
  { key: 'Details', label: 'Details', icon: <InfoCircleOutlined /> },
];

const FILE_SUBTABS = ['Recce', 'Design', 'Drawing'];
const TASK_SUBTABS = ['All', 'Task', 'Snags', 'Hindrance', 'Followup'];
const ACTIVITY_SUBTABS = ['Daily Updates', 'Details', 'Chart'];
const CLIENT_PROGRESS_SUBTABS = ['Details', 'Chart'];
const INVOICE_SUBTABS = ['Clients', 'Vendors'];
const PROJECT_USER_PICKER = [
  'Anantha Narayana',
  'Chandra Bose',
  'Madhu Loganathan',
  'Praveen Kumar',
  'Ramu',
  'Renuga Devi',
  'Sathish',
];
const VENDOR_OPTIONS = ['Studio Grid', 'Value Kitchens', 'Blue Stone Works'];

const subStages = {
  Sales: ['Initial Discussion', 'Site Visit', 'Proposal Sent', 'Negotiation'],
  Designing: ['BOQ Discussion', 'Concept Design', 'Design Approval', 'Working Drawing'],
  Execution: ['Material Procurement', 'Civil Work', 'Carpentry', 'Finishing'],
  Snags: ['Snag List', 'Rectification', 'Final Check'],
  Handover: ['Final Walkthrough', 'Handover Done'],
  Completed: ['Feedback', 'Closed'],
};

const actionBtn = {
  borderRadius: 10,
  height: 32,
  fontWeight: 600,
  borderColor: 'var(--pd-primary)',
  color: 'var(--pd-primary)',
  background: 'var(--pd-surface)',
  boxShadow: 'none',
};

const topPillStyle = (isActive) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  padding: '7px 12px',
  cursor: 'pointer',
  fontSize: 12,
  border: 'none',
  borderRadius: 10,
  background: isActive ? 'var(--pd-primary-soft)' : 'var(--pd-pill-bg)',
  color: isActive ? 'var(--pd-primary)' : 'var(--pd-text)',
  fontWeight: isActive ? 600 : 500,
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
  lineHeight: 1,
});

const subPillStyle = (isActive) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '7px 14px',
  cursor: 'pointer',
  fontSize: 12,
  border: '1px solid transparent',
  borderRadius: 10,
  background: isActive ? 'var(--pd-primary-soft)' : 'var(--pd-pill-bg)',
  color: isActive ? 'var(--pd-primary)' : 'var(--pd-text-muted)',
  fontWeight: isActive ? 600 : 500,
  whiteSpace: 'nowrap',
});

const cardStyle = {
  background: 'var(--pd-surface)',
  borderRadius: 14,
  border: '1px solid var(--pd-border)',
  boxShadow: 'var(--pd-shadow)',
};

const toolbarWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap',
  padding: '14px 14px 10px',
  borderBottom: '1px solid var(--pd-border-soft)',
};

const SearchBox = ({ placeholder = 'Search...', width = 230, icon = <SearchOutlined /> }) => (
  <div
    style={{
      width,
      height: 30,
      borderRadius: 8,
      background: 'var(--pd-control-bg)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 10px',
      color: 'var(--pd-text-soft)',
      fontSize: 12,
    }}
  >
    {icon}
    <span>{placeholder}</span>
  </div>
);

const SelectBox = ({ label, width = 170, icon = null }) => (
  <div
    style={{
      width,
      height: 30,
      borderRadius: 8,
      background: 'var(--pd-control-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      padding: '0 12px',
      color: 'var(--pd-text-soft)',
      fontSize: 12,
    }}
  >
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon}
      {label}
    </span>
    <span style={{ fontSize: 10 }}>▼</span>
  </div>
);

const ToolbarButton = ({ icon, label, onClick }) => (
  <Button icon={icon} style={actionBtn} onClick={onClick}>
    {label}
  </Button>
);

const IconButton = ({ icon }) => (
  <Button icon={icon} style={{ ...actionBtn, width: 32, paddingInline: 0 }} />
);

const MiniTabs = ({ items, active, onChange }) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {items.map(item => {
      const key = typeof item === 'string' ? item : item.key;
      const label = typeof item === 'string' ? item : item.label;
      const icon = typeof item === 'string' ? null : item.icon;
      const isActive = active === key;
      return (
        <button key={key} onClick={() => onChange(key)} style={subPillStyle(isActive)}>
          {icon}
          {label}
        </button>
      );
    })}
  </div>
);

const EmptyPanel = ({ height = 420, text = 'No Data Found', image = false, action = null }) => (
  <div style={{ ...cardStyle, padding: '18px 14px 12px' }}>
    <div style={{ minHeight: height, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {image ? (
        <>
          <FileImageOutlined style={{ fontSize: 82, color: '#b19625', marginBottom: 18 }} />
          {action}
        </>
      ) : (
        <Text style={{ fontWeight: 600, color: 'var(--pd-text)' }}>{text}</Text>
      )}
    </div>
  </div>
);

const TableShell = ({ columns, rowsText = 'No data available', footerText = '0 items', pagination = true }) => (
  <div style={{ ...cardStyle, overflow: 'hidden' }}>
    <div style={{ overflowX: 'auto' }}>
      <div style={{ background: 'var(--pd-table-head)', borderBottom: '1px solid var(--pd-border-soft)', minWidth: Math.max(columns.length * 140, 680) }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`, gap: 14, padding: '12px 14px 8px' }}>
        {columns.map(col => (
          <div key={col}>
            <div style={{ fontSize: 11, color: 'var(--pd-text-soft)', fontWeight: 600, marginBottom: 6 }}>{col}</div>
            <SearchBox width="100%" />
          </div>
        ))}
      </div>
    </div>
    </div>
    <div style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}>
      <Text style={{ fontWeight: 600, color: 'var(--pd-text)' }}>{rowsText}</Text>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '10px 14px 12px', color: 'var(--pd-text-muted)', fontSize: 12 }}>
      <span>{footerText}</span>
      {pagination && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#b1b8c3' }}>‹</span>
          <span style={{ color: '#b1b8c3' }}>›</span>
          <SelectBox label="25" width={86} />
          <ReloadOutlined style={{ color: '#b19625' }} />
        </div>
      )}
    </div>
  </div>
);

const FinancialCard = ({ leftTitle, leftValue, leftColor = '#52c41a', rightTitle, rightValue, rightColor = '#52c41a', middleTitle = null, middleValue = null }) => (
  <div style={{ ...cardStyle, flex: 1, overflow: 'hidden' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pd-text)', marginBottom: 8 }}>{leftTitle}</div>
        <div style={{ fontSize: 14, color: leftColor, fontWeight: 700 }}>{leftValue}</div>
        {middleTitle && (
          <>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pd-text)', margin: '18px 0 8px' }}>{middleTitle}</div>
            <div style={{ fontSize: 14, color: 'var(--pd-text)', fontWeight: 700 }}>{middleValue}</div>
          </>
        )}
      </div>
      <div style={{ padding: 16, borderLeft: '1px solid var(--pd-border-soft)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pd-text)', marginBottom: 8 }}>{rightTitle}</div>
        <div style={{ fontSize: 14, color: rightColor, fontWeight: 700 }}>{rightValue}</div>
      </div>
    </div>
  </div>
);

const DetailsCard = ({ title, action, children }) => (
  <div style={{ ...cardStyle, marginBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--pd-border-soft)' }}>
      <span style={{ fontWeight: 700, color: 'var(--pd-text)' }}>{title}</span>
      {action}
    </div>
    <div style={{ padding: '12px 14px' }}>{children}</div>
  </div>
);

const ModalField = ({ label, value, children }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{label}</div>
    {children || <div style={{ color: '#111827', fontSize: 12 }}>{value || 'N/A'}</div>}
  </div>
);

const formatDisplayDate = (value) => {
  if (!value) return '';
  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
};

const splitPhone = (value) => {
  const text = String(value || '').trim();
  if (text.startsWith('+91')) {
    return { phoneCode: '+91', phoneNumber: text.replace(/^\+91\s*/, '') };
  }
  return { phoneCode: '+91', phoneNumber: text };
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(s => s.projects.projects);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isCompact = useIsMobile(1200);
  const isDark = theme === 'dark';
  const project = projects.find(p => p.id === id) || projects[0];

  const [activeTab, setActiveTab] = useState('Files');
  const [fileSubTab, setFileSubTab] = useState('Recce');
  const [mainStage, setMainStage] = useState(project?.stage || 'Designing');
  const [subStage, setSubStage] = useState((subStages[project?.stage] || subStages.Designing)[0]);
  const [invoiceSubTab, setInvoiceSubTab] = useState('Vendors');
  const [activitySubTab, setActivitySubTab] = useState('Daily Updates');
  const [clientProgressSubTab, setClientProgressSubTab] = useState('Details');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clientInviteOpen, setClientInviteOpen] = useState(false);
  const [vendorInviteOpen, setVendorInviteOpen] = useState(false);
  const [userPickerOpen, setUserPickerOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([
    { key: '1', name: 'Anantha Narayana', role: 'Client' },
  ]);
  const [editForm] = Form.useForm();
  const [clientInviteForm] = Form.useForm();
  const [vendorInviteForm] = Form.useForm();

  if (!project) return <div style={{ padding: 40 }}>Project not found</div>;

  const responsiveVars = {
    '--pd-page-bg': isDark ? '#141414' : '#f8fafc',
    '--pd-surface': isDark ? '#0d3554' : '#ffffff',
    '--pd-pill-bg': isDark ? '#0a2235' : '#f6f6f8',
    '--pd-primary-soft': isDark ? 'rgba(11,43,68,0.22)' : '#e8f0f7',
    '--pd-control-bg': isDark ? '#0d2a3e' : '#e8f0f7',
    '--pd-table-head': isDark ? '#242424' : '#f6f7f9',
    '--pd-border': isDark ? '#303030' : '#e9e9ee',
    '--pd-border-soft': isDark ? '#383838' : '#eef0f4',
    '--pd-text': isDark ? '#f3f4f6' : '#2f2f2f',
    '--pd-text-muted': isDark ? '#c7cad1' : '#4b5563',
    '--pd-text-soft': isDark ? '#98a2b3' : '#8ea0b8',
    '--pd-primary': '#b19625',
    '--pd-shadow': isDark ? 'none' : '0 1px 2px rgba(16, 24, 40, 0.04)',
  };

  const openEditModal = () => {
    const { phoneCode, phoneNumber } = splitPhone(project.phone);
    editForm.setFieldsValue({
      projectName: project.projectName,
      stage: mainStage,
      subStage,
      clientName: project.clientName,
      email: project.email || '',
      phoneCode,
      phoneNumber,
      budget: project.budget || '',
      description: project.description || '',
      address1: project.address1 || '',
      address2: project.address2 || '',
      city: project.city || '',
      state: project.state || '',
      location: project.location || '',
      pincode: project.pincode || '',
      legalName: project.legalName || '',
      gst: project.gst || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveProject = () => {
    editForm.validateFields().then(values => {
      dispatch(updateProject({
        ...project,
        ...values,
        stage: values.stage || mainStage,
        phone: `${values.phoneCode || '+91'} ${values.phoneNumber || ''}`.trim(),
        budget: Number(values.budget || 0),
      }));
      setMainStage(values.stage || mainStage);
      setSubStage(values.subStage || subStage);
      setEditModalOpen(false);
    });
  };

  const handleInviteClient = () => {
    clientInviteForm.validateFields().then(values => {
      setProjectUsers(prev => [
        ...prev,
        { key: Date.now().toString(), name: values.username, role: values.role || 'Client' },
      ]);
      setClientInviteOpen(false);
      clientInviteForm.resetFields();
    });
  };

  const handleInviteVendor = () => {
    vendorInviteForm.validateFields().then(values => {
      setProjectUsers(prev => [
        ...prev,
        { key: Date.now().toString(), name: values.username, role: values.role || 'Vendor' },
      ]);
      setVendorInviteOpen(false);
      vendorInviteForm.resetFields();
    });
  };

  const visibleUsers = PROJECT_USER_PICKER.filter(name =>
    name.toLowerCase().includes(userSearch.toLowerCase())
  );
  const displayTitle = `${project.clientName} (${project.projectName}) ${formatDisplayDate(project.createdDate)}`;

  const renderTabContent = () => {
    if (activeTab === 'Files') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={toolbarWrapStyle}>
            <MiniTabs items={FILE_SUBTABS} active={fileSubTab} onChange={setFileSubTab} />
            <Space wrap>
              <ToolbarButton icon={<UploadOutlined />} label="Upload Files" />
              <IconButton icon={<AppstoreOutlined />} />
              <IconButton icon={<UnorderedListOutlined />} />
            </Space>
          </div>
          <div style={{ minHeight: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 600, color: 'var(--pd-text)' }}>No Data Found</Text>
          </div>
        </div>
      );
    }

    if (activeTab === 'Moodboard') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={toolbarWrapStyle}>
            <ToolbarButton icon={<DownloadOutlined />} label="Download All" />
            <ToolbarButton icon={<PlusOutlined />} label="Board" />
          </div>
          <div style={{ minHeight: 230, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 600, color: 'var(--pd-text)' }}>No Data Found</Text>
          </div>
        </div>
      );
    }

    if (activeTab === 'Notes') {
      return (
        <div style={{ ...cardStyle, padding: 14 }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div style={{ ...cardStyle, padding: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Title *</div>
              <div style={{ height: 26, borderRadius: 8, background: 'var(--pd-control-bg)', marginBottom: 10 }} />
              <div style={{ border: '1px solid var(--pd-border-soft)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 4, padding: '10px 12px', borderBottom: '1px solid var(--pd-border-soft)', flexWrap: 'wrap' }}>
                  {['B', 'I', 'U', 'P', 'H1', 'H2', 'H3', '≡', '•', '-', '↩', '↪', '⌂'].map(item => (
                    <span key={item} style={{ minWidth: 20, height: 20, borderRadius: 4, border: '1px solid var(--pd-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--pd-text-muted)' }}>{item}</span>
                  ))}
                </div>
                <div style={{ minHeight: 92, position: 'relative', padding: 12 }}>
                  <div style={{ position: 'absolute', right: 16, bottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <AudioOutlined style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #7e73ff, #5b7dff)', color: '#fff' }} />
                    <span style={{ fontSize: 11, color: 'var(--pd-text-soft)' }}>00:00</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, margin: '10px 0 6px' }}>CC</div>
              <div style={{ height: 28, borderRadius: 8, background: 'var(--pd-control-bg)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingInline: 12, color: 'var(--pd-text-soft)', fontSize: 10 }}>▼</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Files</div>
              <div style={{ fontSize: 12, color: 'var(--pd-text-muted)', margin: '4px 0 8px' }}>No files selected</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <ToolbarButton icon={<UploadOutlined />} label="Upload" />
                <Button disabled style={{ borderRadius: 8 }}>Submit</Button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--pd-primary)' }}>All notes <ReloadOutlined style={{ marginLeft: 8, fontSize: 14 }} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <SearchBox placeholder="Search notes..." width={290} />
            </div>
            <div style={{ ...cardStyle, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--pd-border-soft)', flexWrap: 'wrap' }}>
                <Avatar size={28} style={{ background: '#48c774' }}>S</Avatar>
                <span style={{ fontWeight: 700, color: 'var(--pd-text)' }}>Sharmila</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, color: '#222' }}>
                  <span>💬</span>
                  <span>➤</span>
                  <span>✎</span>
                  <span>⋮</span>
                </div>
              </div>
              <div style={{ padding: '14px 14px 10px' }}>
                <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 6, color: '#3b3b3b' }}>sridar builder</div>
                <div style={{ fontSize: isMobile ? 18 : 24, color: 'var(--pd-text-muted)', marginBottom: 18 }}>design completed</div>
                <div style={{ fontSize: 12, color: 'var(--pd-text-soft)' }}>15 Apr, 2025</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Tasks') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={toolbarWrapStyle}>
            <MiniTabs
              items={[
                { key: 'tasks', label: 'All Tasks (0)', icon: <UnorderedListOutlined /> },
                { key: 'requests', label: 'All Requests', icon: <FileTextOutlined /> },
              ]}
              active="tasks"
              onChange={() => {}}
            />
            <Space wrap>
              <IconButton icon={<AppstoreOutlined />} />
              <IconButton icon={<UnorderedListOutlined />} />
              <IconButton icon={<AudioOutlined />} />
              <ToolbarButton icon={<PlusOutlined />} label="Add Task" />
              <IconButton icon={<MoreOutlined />} />
            </Space>
          </div>
          <div style={{ padding: '0 14px 14px' }}>
            <div style={{ display: 'flex', alignItems: isCompact ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexDirection: isCompact ? 'column' : 'row' }}>
              <MiniTabs items={TASK_SUBTABS} active="All" onChange={() => {}} />
            </div>
            <div style={{ display: 'flex', alignItems: isCompact ? 'stretch' : 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10, flexDirection: isCompact ? 'column' : 'row' }}>
              <SearchBox placeholder="Search tasks..." width={198} />
              <IconButton icon={<FilterOutlined />} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(5, minmax(220px, 1fr))', gap: 10 }}>
              {[
                ['Created', '#c5cbd6'],
                ['In Progress', '#3b82f6'],
                ['Completed', '#52c41a'],
                ['On Hold', '#f59e0b'],
                ['Discarded', '#ef4444'],
              ].map(([name, color]) => (
                <div key={name} style={{ ...cardStyle, minHeight: 460, overflow: 'hidden' }}>
                  <div style={{ height: 4, background: color }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid var(--pd-border-soft)', fontWeight: 700, color: 'var(--pd-text)' }}>
                    <span>{name}</span>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid var(--pd-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--pd-text-soft)' }}>0</span>
                  </div>
                  <div style={{ minHeight: 410, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 56, color: 'var(--pd-text-soft)', fontWeight: 600 }}>
                    No tasks
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Quotes') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ ...toolbarWrapStyle, justifyContent: 'flex-end' }}>
            <Space wrap>
              <ToolbarButton icon={<PlusOutlined />} label="Quote" />
              <IconButton icon={<MoreOutlined />} />
            </Space>
          </div>
          <div style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 700, color: 'var(--pd-text)' }}>No Data Found</Text>
          </div>
        </div>
      );
    }

    if (activeTab === 'Orders') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={toolbarWrapStyle}>
            <Space wrap>
              <SelectBox label="Select Status" width={160} />
              <SelectBox label="Select Order Type" width={160} />
              <SelectBox label="Select vendor" width={160} />
            </Space>
            <Space wrap>
              <ToolbarButton icon={<PlusOutlined />} label="Order" />
              <IconButton icon={<MoreOutlined />} />
            </Space>
          </div>
          <div style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 700, color: 'var(--pd-text)' }}>No Data Found</Text>
          </div>
        </div>
      );
    }

    if (activeTab === 'Invoices') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={toolbarWrapStyle}>
            <MiniTabs items={INVOICE_SUBTABS} active={invoiceSubTab} onChange={setInvoiceSubTab} />
            <Space wrap>
              <ToolbarButton icon={<PlusOutlined />} label="Add Vendor Invoice" />
              <ToolbarButton icon={<ExportOutlined />} label="Export" />
            </Space>
          </div>
          <div style={{ padding: 14 }}>
            <TableShell
              columns={['Created At', 'Created By', 'Invoice No.', 'Vendor Name', 'Order ID', 'Invoice Date', 'Amount', 'Total Amount', 'GST', 'Remarks', 'Invoices']}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'Purchase Request') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ ...toolbarWrapStyle, justifyContent: 'flex-end' }}>
            <Space wrap>
              <ToolbarButton icon={<PlusOutlined />} label="Create PR" />
              <ToolbarButton icon={<PlusOutlined />} label="Create GRN" />
              <ToolbarButton icon={<ExportOutlined />} label="Export Excel" />
            </Space>
          </div>
          <div style={{ padding: 14 }}>
            <TableShell columns={['PR Number', 'Created On', 'Created By', 'Items', 'Status', 'Edit', 'Details']} />
          </div>
        </div>
      );
    }

    if (activeTab === 'Inventory') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ ...toolbarWrapStyle, justifyContent: 'flex-end' }}>
            <ToolbarButton icon={<ExportOutlined />} label="Export Excel" />
          </div>
          <div style={{ padding: 14 }}>
            <TableShell columns={['Name', 'In Stock', 'Approved', 'Total Utilized', 'Pending', 'Details']} footerText="Showing 0 to 0 of 0 items" />
          </div>
        </div>
      );
    }

    if (activeTab === 'Activities') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={toolbarWrapStyle}>
            <MiniTabs items={ACTIVITY_SUBTABS} active={activitySubTab} onChange={setActivitySubTab} />
            <Space wrap>
              <ToolbarButton icon={<PlusOutlined />} label="Activity" />
              <ToolbarButton icon={<UploadOutlined />} label="Daily Update" />
            </Space>
          </div>
          <div style={{ padding: 14 }}>
            <TableShell columns={['Updated By', 'Updated date', 'Activities Updated', 'Files Uploaded']} />
          </div>
        </div>
      );
    }

    if (activeTab === 'Client Progress') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={toolbarWrapStyle}>
            <MiniTabs items={CLIENT_PROGRESS_SUBTABS} active={clientProgressSubTab} onChange={setClientProgressSubTab} />
            <Space wrap>
              <ToolbarButton icon={<PlusOutlined />} label="Activity" />
              <ToolbarButton icon={<PlusOutlined />} label="Import from Other Project" />
              <IconButton icon={<MoreOutlined />} />
            </Space>
          </div>
          <div style={{ padding: 14 }}>
            <TableShell columns={['Activity', 'Description', 'Dependency', 'Start Date', 'End Date', 'Tag', 'Owner', 'Current Status', 'Comments', 'Details', 'Actions']} />
          </div>
        </div>
      );
    }

    if (activeTab === 'Milestones' || activeTab === 'Vendor Milestone') {
      return (
        <EmptyPanel
          image
          action={<ToolbarButton icon={<PlusOutlined />} label="Add Milestone" />}
        />
      );
    }

    if (activeTab === 'Manpower') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ ...toolbarWrapStyle, justifyContent: 'flex-end' }}>
            <Space wrap>
              <ToolbarButton icon={<PlusOutlined />} label="Add manpower" />
              <IconButton icon={<MoreOutlined />} />
            </Space>
          </div>
          <div style={{ padding: 14 }}>
            <TableShell columns={['Date', 'Count', 'Remark', 'Amount', 'Type', 'Comments', 'Details']} />
          </div>
        </div>
      );
    }

    if (activeTab === 'Financials') {
      return (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr 1fr', gap: 18, marginBottom: 16 }}>
            <FinancialCard leftTitle="Quotes Approved" leftValue="₹ 0" middleTitle="Orders Approved" middleValue="₹ 0" rightTitle="% Margin" rightValue="₹ 0" />
            <FinancialCard leftTitle="Client Invoices" leftValue="₹ 0" middleTitle="Vendor Invoices" middleValue="₹ 0" rightTitle="Profit/Loss" rightValue="▲ ₹ 0" />
            <FinancialCard leftTitle="Payment Received" leftValue="₹ 15,000" rightTitle="Cashflow" rightValue="₹ -10,000" rightColor="#ff4d4f" middleTitle="Payment Done" middleValue="₹ 25,000" />
          </div>
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div style={{ ...toolbarWrapStyle, justifyContent: 'flex-end' }}>
              <Space wrap>
                <ToolbarButton icon={<PlusOutlined />} label="Payment" />
                <IconButton icon={<MoreOutlined />} />
              </Space>
            </div>
            <div style={{ padding: 14 }}>
              <TableShell columns={['Created On', 'Date', 'Created By', 'Vendor', 'Transaction', 'Channel', 'Amount', 'Reciept', 'User', 'Order', 'Invoice', 'Tasks Created', 'Details', 'Comments', 'Remarks', 'Actions']} footerText="Showing 1 to 2 of 2 items" />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Checklists') {
      return (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ ...toolbarWrapStyle, justifyContent: 'flex-end' }}>
            <Space wrap>
              <ToolbarButton icon={<PlusOutlined />} label="Create Design Checklist" />
              <ToolbarButton icon={<PlusOutlined />} label="Add Handover Checklist" />
            </Space>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ background: 'var(--pd-pill-bg)', borderRadius: 8, padding: '12px 14px', fontWeight: 600, color: 'var(--pd-text)' }}>
              <InfoCircleOutlined style={{ marginRight: 10 }} />
              No checklists available
            </div>
            <div style={{ minHeight: 420 }} />
          </div>
        </div>
      );
    }

    if (activeTab === 'Details') {
      return (
        <div>
          <DetailsCard
            title="Project Users"
            action={
              <Space wrap>
                <ToolbarButton icon={<PlusOutlined />} label="Client" onClick={() => setClientInviteOpen(true)} />
                <ToolbarButton icon={<PlusOutlined />} label="Vendor" onClick={() => setVendorInviteOpen(true)} />
                <ToolbarButton icon={<PlusOutlined />} label="User" onClick={() => setUserPickerOpen(true)} />
              </Space>
            }
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 16, marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700 }}>Name</div>
              <div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700 }}>Role</div>
              <div />
            </div>
            {projectUsers.map(user => (
              <div key={user.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 16, padding: '8px 0', borderTop: '1px solid var(--pd-border-soft)' }}>
                <div style={{ fontSize: 13, color: 'var(--pd-text)' }}>{user.name}</div>
                <div style={{ fontSize: 13, color: 'var(--pd-text)' }}>{user.role}</div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setProjectUsers(prev => prev.filter(item => item.key !== user.key))}
                />
              </div>
            ))}
          </DetailsCard>

          <DetailsCard title="Contact Details" action={<ToolbarButton icon={<EditOutlined />} label="Edit" onClick={openEditModal} />}>
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Name</div><div style={{ color: 'var(--pd-text)' }}>{project.clientName}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Email</div><div style={{ color: 'var(--pd-text)' }}>{project.email || 'N/A'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Phone</div><div style={{ color: 'var(--pd-text)' }}>{project.phone}</div></div>
            </div>
          </DetailsCard>

          <DetailsCard title="Project Details" action={<ToolbarButton icon={<EditOutlined />} label="Edit" onClick={openEditModal} />}>
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Created on</div><div style={{ color: 'var(--pd-text)' }}>{project.createdDate}</div><div style={{ marginTop: 10, fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700 }}>Description</div><div style={{ color: 'var(--pd-text)' }}>{project.description || 'N/A'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Last updated on</div><div style={{ color: 'var(--pd-text)' }}>{project.createdDate}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Budget</div><div style={{ color: 'var(--pd-text)' }}>Rs {project.budget || 0}</div></div>
            </div>
          </DetailsCard>

          <DetailsCard title="Address Details" action={<ToolbarButton icon={<EditOutlined />} label="Edit" onClick={openEditModal} />}>
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Address line 1</div><div style={{ color: 'var(--pd-text)' }}>{project.address1 || 'N/A'}</div><div style={{ marginTop: 10, fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700 }}>State</div><div style={{ color: 'var(--pd-text)' }}>{project.state || 'N/A'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Address line 2</div><div style={{ color: 'var(--pd-text)' }}>{project.address2 || 'N/A'}</div><div style={{ marginTop: 10, fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700 }}>Pincode</div><div style={{ color: 'var(--pd-text)' }}>{project.pincode || 'N/A'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>City</div><div style={{ color: 'var(--pd-text)' }}>{project.city || 'N/A'}</div><div style={{ marginTop: 10, fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700 }}>Location</div><div style={{ color: 'var(--pd-text)' }}>{project.location || 'N/A'}</div></div>
            </div>
          </DetailsCard>

          <DetailsCard title="Other Details" action={<ToolbarButton icon={<EditOutlined />} label="Edit" onClick={openEditModal} />}>
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>Legal name</div><div style={{ color: 'var(--pd-text)' }}>{project.legalName || 'N/A'}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--pd-text-muted)', fontWeight: 700, marginBottom: 8 }}>GST number</div><div style={{ color: 'var(--pd-text)' }}>{project.gst || 'N/A'}</div></div>
            </div>
          </DetailsCard>

          <DetailsCard title="Documents" action={<Button type="link" style={{ padding: 0 }}>+ Add Documents</Button>}>
            <div style={{ color: 'var(--pd-text-muted)' }}>No documents found for this project.</div>
          </DetailsCard>
        </div>
      );
    }

    return <EmptyPanel />;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pd-page-bg)', color: 'var(--pd-text)', ...responsiveVars }}>
      <div style={{ background: 'var(--pd-surface)', borderBottom: '1px solid var(--pd-border)' }}>
        <div style={{ display: 'flex', alignItems: isCompact ? 'stretch' : 'center', justifyContent: 'space-between', flexDirection: isCompact ? 'column' : 'row', gap: 18, padding: isMobile ? '14px 14px 10px' : '14px 24px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')} style={{ padding: 0, color: 'var(--pd-text-muted)' }} />
            <span style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: 'var(--pd-text)' }}>{project.projectName}</span>
            <Button type="text" size="small" icon={<EditOutlined style={{ color: '#b19625' }} />} style={{ padding: 0 }} onClick={openEditModal} />
            <Button type="text" size="small" icon={<EllipsisOutlined style={{ color: 'var(--pd-text-muted)' }} />} style={{ padding: 0 }} />
            <Tag color="blue" style={{ borderRadius: 999, fontWeight: 700 }}>{project.projectCode}</Tag>
            <CheckCircleOutlined style={{ color: '#52C41A', fontSize: 16 }} />
            <InfoCircleOutlined style={{ color: '#1677FF', fontSize: 16 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(2, minmax(220px, 1fr))', gap: 18, width: isCompact ? '100%' : 'auto' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--pd-text-muted)', marginBottom: 5, fontWeight: 600 }}>Main Stage</div>
              <Select
                value={mainStage}
                onChange={value => { setMainStage(value); setSubStage((subStages[value] || [])[0] || ''); }}
                style={{ width: '100%' }}
                size="middle"
                options={['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(value => ({ value, label: value }))}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--pd-text-muted)', marginBottom: 5, fontWeight: 600 }}>Sub Stage</div>
              <Select
                value={subStage}
                onChange={setSubStage}
                style={{ width: '100%' }}
                size="middle"
                options={(subStages[mainStage] || []).map(value => ({ value, label: value }))}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: isMobile ? '0 14px 14px' : '0 24px 14px' }}>
          <Tag style={{ borderRadius: 999, background: '#e8f0f7', borderColor: '#b8d0e8', color: '#0B2B44', fontWeight: 600 }}>
            <span style={{ marginRight: 6 }}>👤</span>{project.clientName}
          </Tag>
          <Tag style={{ borderRadius: 999, background: '#e8f0f7', borderColor: '#b8d0e8', color: '#0B2B44', fontWeight: 600 }}>
            <span style={{ marginRight: 6 }}>📞</span>{project.phone}
          </Tag>
        </div>
      </div>

      <div style={{ padding: isMobile ? 10 : 14 }}>
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ padding: isMobile ? '12px 10px 10px' : '14px 12px 10px', borderBottom: '1px solid var(--pd-border-soft)' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
              {PROJECT_TABS.map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ ...topPillStyle(isActive), flex: '0 0 auto', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ padding: isMobile ? 10 : 14 }}>
            {renderTabContent()}
          </div>
        </div>
      </div>

      <Modal
        className="crm-sheet-modal"
        title={<span>Edit Project</span>}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSaveProject}
        okText="Submit"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : 1180}
        centered
      >
        <Form form={editForm} layout="vertical" className="crm-form-shell">
          <div style={{ display: 'flex', alignItems: isCompact ? 'stretch' : 'center', justifyContent: 'space-between', flexDirection: isCompact ? 'column' : 'row', gap: 18, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: isMobile ? 18 : 21, fontWeight: 800, color: '#111827' }}>{displayTitle}</span>
              <EditOutlined style={{ color: '#b19625', fontSize: 14 }} />
              <EllipsisOutlined style={{ color: '#111827', fontSize: 16 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(2, minmax(140px, 1fr))', gap: 12, width: isCompact ? '100%' : 300 }}>
              <Form.Item name="stage" label="Main Stage" style={{ marginBottom: 0 }}>
                <Select
                  onChange={value => {
                    setMainStage(value);
                    editForm.setFieldValue('subStage', (subStages[value] || [])[0] || '');
                  }}
                  options={['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(value => ({ value, label: value }))}
                />
              </Form.Item>
              <Form.Item name="subStage" label="Sub Stage" style={{ marginBottom: 0 }}>
                <Select options={(subStages[mainStage] || []).map(value => ({ value, label: value }))} />
              </Form.Item>
            </div>
          </div>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Contact Details</div>
            <div className="crm-panel-card__body">
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1.2fr 1.2fr 1.4fr', gap: 14 }}>
                <Form.Item name="clientName" label="Name"><Input /></Form.Item>
                <Form.Item name="email" label="Email"><Input /></Form.Item>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 8 }}>Phone *</div>
                  <Row gutter={10}>
                    <Col span={8}><Form.Item name="phoneCode" style={{ marginBottom: 0 }}><Select options={[{ value: '+91', label: '+91' }]} /></Form.Item></Col>
                    <Col span={16}><Form.Item name="phoneNumber" style={{ marginBottom: 0 }}><Input /></Form.Item></Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Project Details</div>
            <div className="crm-panel-card__body">
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr 1fr', gap: 14, marginBottom: 12 }}>
                <ModalField label="Created on" value={project.createdDate} />
                <ModalField label="Last updated on" value={project.createdDate} />
                <Form.Item name="budget" label="Budget"><Input /></Form.Item>
              </div>
              <Form.Item name="description" label="Description" style={{ maxWidth: 320, marginBottom: 0 }}>
                <Input.TextArea rows={2} />
              </Form.Item>
            </div>
          </div>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Address Details</div>
            <div className="crm-panel-card__body">
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr 1fr', gap: 14 }}>
                <Form.Item name="address1" label="Address line 1"><Input /></Form.Item>
                <Form.Item name="address2" label="Address line 2"><Input /></Form.Item>
                <Form.Item name="state" label="State"><Select options={['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi'].map(value => ({ value, label: value }))} /></Form.Item>
                <Form.Item name="city" label="City"><Input /></Form.Item>
                <Form.Item name="pincode" label="Pincode"><Input /></Form.Item>
                <Form.Item name="location" label="Location"><Input /></Form.Item>
              </div>
            </div>
          </div>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Other Details</div>
            <div className="crm-panel-card__body">
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: 14 }}>
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
                <Button className="crm-primary-btn" icon={<PlusOutlined />} onClick={() => setClientInviteOpen(true)} style={{ minWidth: 0, paddingInline: 12 }}>Client</Button>
                <Button className="crm-primary-btn" icon={<PlusOutlined />} onClick={() => setVendorInviteOpen(true)} style={{ minWidth: 0, paddingInline: 12 }}>Vendor</Button>
                <Button className="crm-primary-btn" icon={<PlusOutlined />} onClick={() => setUserPickerOpen(true)} style={{ minWidth: 0, paddingInline: 12 }}>User</Button>
              </Space>
            </div>
            <div className="crm-panel-card__body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 14, marginBottom: 10, fontSize: 11, fontWeight: 700, color: '#111827' }}>
                <div>Name</div>
                <div>Role</div>
                <div />
              </div>
              {projectUsers.map(user => (
                <div key={user.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 14, padding: '8px 0', borderTop: '1px solid #ededed' }}>
                  <div>{user.name}</div>
                  <div>{user.role}</div>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => setProjectUsers(prev => prev.filter(item => item.key !== user.key))} />
                </div>
              ))}
            </div>
          </div>
        </Form>
      </Modal>

      <Modal className="crm-modal" title={<span>Add Client</span>} open={clientInviteOpen} onCancel={() => { setClientInviteOpen(false); clientInviteForm.resetFields(); }} onOk={handleInviteClient} okText="Submit" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ className: 'crm-primary-btn' }} width={isMobile ? '96%' : 560} centered>
        <Form form={clientInviteForm} layout="vertical" className="crm-form-shell" initialValues={{ username: project.clientName, role: 'Client', phoneCode: '+91' }}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input prefix={<UserOutlined />} /></Form.Item>
          <Row gutter={10}>
            <Col span={8}><Form.Item name="phoneCode" label="Phone" rules={[{ required: true }]}><Select options={[{ value: '+91', label: '+91' }]} /></Form.Item></Col>
            <Col span={16}><Form.Item name="phone" label=" " colon={false} rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="email" label="Email"><Input prefix={<MailOutlined />} /></Form.Item>
          <Form.Item name="role" label="Role"><Select options={[{ value: 'Client', label: 'Client' }, { value: 'Vendor', label: 'Vendor' }, { value: 'User', label: 'User' }]} /></Form.Item>
        </Form>
      </Modal>

      <Modal className="crm-modal" title={<span>Add Vendor</span>} open={vendorInviteOpen} onCancel={() => { setVendorInviteOpen(false); vendorInviteForm.resetFields(); }} onOk={handleInviteVendor} okText="Submit" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ className: 'crm-primary-btn' }} width={isMobile ? '96%' : 560} centered>
        <Form form={vendorInviteForm} layout="vertical" className="crm-form-shell" initialValues={{ role: 'Vendor', phoneCode: '+91' }}>
          <Form.Item name="vendor" label="Select Vendor" rules={[{ required: true }]}><Select options={VENDOR_OPTIONS.map(value => ({ value, label: value }))} /></Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input prefix={<UserOutlined />} /></Form.Item>
          <Row gutter={10}>
            <Col span={8}><Form.Item name="phoneCode" label="Phone" rules={[{ required: true }]}><Select options={[{ value: '+91', label: '+91' }]} /></Form.Item></Col>
            <Col span={16}><Form.Item name="phone" label=" " colon={false} rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="email" label="Email"><Input prefix={<MailOutlined />} /></Form.Item>
          <Form.Item name="role" label="Role"><Select options={[{ value: 'Vendor', label: 'Vendor' }, { value: 'Client', label: 'Client' }, { value: 'User', label: 'User' }]} /></Form.Item>
        </Form>
      </Modal>

      <Modal className="crm-modal" title={<span>Select Users</span>} open={userPickerOpen} onCancel={() => setUserPickerOpen(false)} onOk={() => {
        setProjectUsers(prev => ([
          ...prev,
          ...selectedUsers
            .filter(name => !prev.some(item => item.name === name))
            .map(name => ({ key: `${Date.now()}-${name}`, name, role: 'User' })),
        ]));
        setUserPickerOpen(false);
        setSelectedUsers([]);
        setUserSearch('');
      }} okText="Confirm" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ className: 'crm-primary-btn' }} width={isMobile ? '96%' : 480} centered>
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
    </div>
  );
};

export default ProjectDetailPage;
