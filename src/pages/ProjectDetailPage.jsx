import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateProject } from '@/store/slices/projectSlice';
import useIsMobile from '@/hooks/useIsMobile';
import {
  Button, Avatar, Select, Space, Modal, Form, Input, Checkbox, Row, Col,
  Progress,
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, InfoCircleOutlined,
  PlusOutlined, DownloadOutlined, DeleteOutlined, EyeOutlined,
  FilePdfOutlined, CalendarOutlined, FlagOutlined, LineChartOutlined,
  SnippetsOutlined, AppstoreOutlined, CreditCardOutlined, FileAddOutlined,
  UserOutlined, UnorderedListOutlined, CheckCircleOutlined,
} from '@ant-design/icons';

/* ─────────────── MOCK DATA ─────────────── */
const MOCK_FILES = {
  designFiles: [
    { id: 1, name: 'Drawing Final', date: 'Jan 8, 2026' },
    { id: 2, name: 'Floor Plan', date: 'Jan 8, 2026' },
    { id: 3, name: 'Unit Placement', date: 'Jan 8, 2026' },
    { id: 4, name: 'Floor Plan final', date: 'Jan 8, 2026' },
  ],
  schedules: [
    { id: 1, name: 'Execution schedule', date: 'Jan 8, 2026' },
    { id: 2, name: 'Design Schedule', date: 'Jan 8, 2026' },
  ],
  otherRecords: [
    { id: 1, name: 'Project Docket', date: 'Jan 8, 2026' },
    { id: 2, name: 'Builder Floor Plan', date: 'Dec 9, 2025' },
  ],
};

const MOCK_SPACES = ['Modular Kitchen', 'Living Room', 'Master Bedroom', 'Kitchen'];

const MOCK_COMPONENTS = [
  { id: 1, name: 'Kitchen Below The Counter Cabinet', type: 'Box', length: 8, height: 2.9, depth: 0, qty: 1 },
  { id: 2, name: 'Kitchen Tall Pantry Unit', type: 'Box', length: 2, height: 7, depth: 0, qty: 1 },
  { id: 3, name: 'Kitchen Over-head Cabinet', type: 'Box', length: 8, height: 2, depth: 0, qty: 1 },
  { id: 4, name: 'RCC Loft Shutter Enclosure', type: 'Frame', length: 16, height: 2.9, depth: 0, qty: 1 },
];

const MOCK_ACCESSORIES = [
  { id: 1, name: 'Cutlery Inlet', brand: 'Ebco', qty: 1 },
  { id: 2, name: 'Pro Motion Drawer System S3 Series 122mm', brand: 'Ebco', qty: 1 },
];

const MOCK_ORDER_VERSIONS = [
  { id: 'ORDER-736-004', version: 4, date: 'Jan 8, 2026', amount: '₹9,46,886' },
  { id: 'ORDER-736-003', version: 3, date: 'Jan 8, 2026', amount: '₹9,21,523' },
  { id: 'ORDER-736-002', version: 2, date: 'Jan 8, 2026', amount: '₹10,06,513' },
  { id: 'ORDER-736-001', version: 1, date: 'Dec 10, 2025', amount: '₹9,72,476' },
];

const MOCK_MILESTONES = [
  { id: 1, name: 'Design', phase: 'Design', status: 'Completed', progress: 100, duration: 6, expStart: 'Dec 11, 2025', expEnd: 'Dec 16, 2025', actStart: 'Dec 11, 2025', actEnd: 'Dec 16, 2025' },
  { id: 2, name: 'Measurement At site', phase: 'Measurement', status: 'Completed', progress: 100, duration: 1, expStart: 'Dec 17, 2025', expEnd: 'Dec 17, 2025', actStart: 'Dec 17, 2025', actEnd: 'Dec 17, 2025' },
  { id: 3, name: 'Milestone 3', phase: 'Procurement', status: 'Completed', progress: 100, duration: 2, expStart: 'Dec 18, 2025', expEnd: 'Dec 19, 2025', actStart: 'Dec 18, 2025', actEnd: 'Dec 19, 2025' },
  { id: 4, name: 'Milestone 4', phase: 'Production', status: 'Completed', progress: 100, duration: 4, expStart: 'Dec 20, 2025', expEnd: 'Dec 23, 2025', actStart: 'Dec 20, 2025', actEnd: 'Dec 24, 2025' },
];

const MOCK_SCHEDULE_INFO = {
  clientName: 'Mr. Rohit',
  handledBy: 'Sales Person 1',
  expectedStart: 'Dec 11, 2025',
  expectedEnd: 'Feb 27, 2026',
};

const MOCK_PAYMENTS = [
  { id: 1, milestone: 'Design', phase: 'Design', status: 'Completed', pct: 10, expected: '₹97,248', received: '₹97,248' },
  { id: 2, milestone: 'Measurement At site', phase: 'Measurement', status: 'Completed', pct: 50, expected: '₹4,86,238', received: '₹4,86,000' },
  { id: 3, milestone: 'Milestone 5', phase: 'Shifting', status: 'Completed', pct: 35, expected: '₹3,40,367', received: '₹3,40,367' },
  { id: 4, milestone: 'Handover', phase: 'Handover', status: 'Yet To Start', pct: 5, expected: '₹48,624', received: '₹0' },
];

/* ─────────────── SIDEBAR NAV TABS ─────────────── */
const SIDEBAR_TABS = [
  { key: 'Project Detail', label: 'Project Detail', icon: '📋' },
  { key: 'Files', label: 'Files', icon: '📁' },
  { key: 'Scope of Work', label: 'Scope of Work', icon: '⚒️' },
  { key: 'Order Sheet', label: 'Order Sheet', icon: '📄' },
  { key: 'Project Planning', label: 'Project Planning', icon: '🚩' },
  { key: 'Schedule', label: 'Schedule', icon: '📅' },
  { key: 'Payment Schedule', label: 'Payment Schedule', icon: '💳' },
  { key: 'Tracker', label: 'Tracker', icon: '📈' },
  { key: 'Raise Invoice', label: 'Raise Invoice', icon: '📝' },
];

const subStages = {
  Sales: ['Initial Discussion', 'Site Visit', 'Proposal Sent', 'Negotiation'],
  Designing: ['BOQ Discussion', 'Concept Design', 'Design Approval', 'Working Drawing'],
  Execution: ['Material Procurement', 'Civil Work', 'Carpentry', 'Finishing'],
  Snags: ['Snag List', 'Rectification', 'Final Check'],
  Handover: ['Final Walkthrough', 'Handover Done'],
  Completed: ['Feedback', 'Closed'],
};

const splitPhone = (value) => {
  const text = String(value || '').trim();
  if (text.startsWith('+91')) return { phoneCode: '+91', phoneNumber: text.replace(/^\+91\s*/, '') };
  return { phoneCode: '+91', phoneNumber: text };
};

const formatDisplayDate = (value) => {
  if (!value) return '';
  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
};

/* ── small helpers ── */
const InfoRow = ({ label, value, isDark }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ fontSize: 11, color: isDark ? '#6a7f95' : '#aaa', fontWeight: 500, marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 13, color: isDark ? '#e0e8f0' : '#1f1f1f', fontWeight: 500 }}>{value || '—'}</div>
  </div>
);

/* ─────────────── SUB-COMPONENTS ─────────────── */
const StatusBadge = ({ status }) => {
  const colorMap = {
    'Completed': { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
    'Yet To Start': { bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
    'In Progress': { bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe' },
  };
  const style = colorMap[status] || colorMap['Yet To Start'];
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
    }}>
      {status}
    </span>
  );
};

const PdfFileRow = ({ file }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px', borderRadius: 10,
    border: '1px solid #f0f0f0', background: '#fafafa', marginBottom: 8,
  }}>
    <FilePdfOutlined style={{ color: '#ef4444', fontSize: 26, flexShrink: 0 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#1f1f1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{file.date}</div>
    </div>
    <DeleteOutlined style={{ color: '#ef4444', fontSize: 14, cursor: 'pointer', flexShrink: 0 }} />
    <DownloadOutlined style={{ color: '#3b82f6', fontSize: 14, cursor: 'pointer', flexShrink: 0 }} />
  </div>
);

const FileColumn = ({ title, files, primary }) => (
  <div style={{ flex: 1, minWidth: 240 }}>
    <div style={{
      borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: primary }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 10px', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#1f1f1f' }}>{title}</span>
        <Button type="text" icon={<PlusOutlined />} size="small" style={{ border: '1px solid #e5e7eb', borderRadius: 6, width: 26, height: 26, padding: 0 }} />
      </div>
      <div style={{ padding: '10px 10px 6px' }}>
        {files.map(f => <PdfFileRow key={f.id} file={f} />)}
        {files.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', fontSize: 13 }}>No files</div>
        )}
      </div>
    </div>
  </div>
);

/* ─────────────── MAIN COMPONENT ─────────────── */
const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(s => s.projects.projects);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isCompact = useIsMobile(1100);
  const isDark = theme === 'dark';
  const project = projects.find(p => p.id === id) || projects[0];

  const [activeTab, setActiveTab] = useState('Files');
  const [mainStage, setMainStage] = useState(project?.stage || 'Designing');
  const [subStage, setSubStage] = useState((subStages[project?.stage] || subStages.Designing)[0]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();

  // Order Sheet state
  const [orderView, setOrderView] = useState('new'); // 'new' | 'versions'

  // Project Planning state
  const [planTab, setPlanTab] = useState('Milestone List');

  // Scope of Work state
  const [selectedSpace, setSelectedSpace] = useState('Modular Kitchen');

  // Invoice state
  const [sameAddress, setSameAddress] = useState(false);

  if (!project) return <div style={{ padding: 40 }}>Project not found</div>;

  const css = {
    '--bg': isDark ? '#031726' : '#f4f5f7',
    '--surface': isDark ? '#0d3554' : '#ffffff',
    '--border': isDark ? '#1a4d72' : '#e5e7eb',
    '--border-soft': isDark ? '#0d3050' : '#f0f0f0',
    '--text': isDark ? '#f3f4f6' : '#1f1f1f',
    '--text-muted': isDark ? '#c7cad1' : '#6b7280',
    '--text-soft': isDark ? '#8696a0' : '#9ca3af',
    '--primary': isDark ? '#5ab5e8' : '#D69F6D',
    '--primary-soft': isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.1)',
    '--nav-active-bg': isDark ? 'rgba(90,181,232,0.15)' : '#eff6ff',
    '--nav-active-color': isDark ? '#5ab5e8' : '#2563eb',
    '--shadow': isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.07)',
  };

  const card = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
  };

  const openEditModal = () => {
    const { phoneCode, phoneNumber } = splitPhone(project.phone);
    editForm.setFieldsValue({
      projectName: project.projectName,
      stage: mainStage, subStage,
      clientName: project.clientName,
      email: project.email || '',
      phoneCode, phoneNumber,
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
        ...project, ...values,
        stage: values.stage || mainStage,
        phone: `${values.phoneCode || '+91'} ${values.phoneNumber || ''}`.trim(),
        budget: Number(values.budget || 0),
      }));
      setMainStage(values.stage || mainStage);
      setSubStage(values.subStage || subStage);
      setEditModalOpen(false);
    });
  };

  /* ── TAB CONTENT RENDERERS ── */

  const renderProjectDetail = () => {
    const sectionBox = {
      background: isDark ? '#081b2f' : '#f8fafd',
      border: `1px solid ${isDark ? '#1a4d72' : '#e8f0fb'}`,
      borderRadius: 12,
      padding: '16px 20px',
      flex: 1,
      minWidth: 0,
    };
    const sectionTitleColor = isDark ? '#5ab5e8' : '#1677FF';

    return (
      <div style={{ display: 'flex', gap: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        {/* Primary Information */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: sectionTitleColor }}>Client Details</span>
          </div>
          <InfoRow label="Client Name" value={project.clientName} isDark={isDark} />
          <InfoRow label="Email" value={project.email} isDark={isDark} />
          <InfoRow label="Phone" value={project.phone} isDark={isDark} />
          <InfoRow label="Address Line 1" value={project.address1} isDark={isDark} />
          <InfoRow label="Address Line 2" value={project.address2} isDark={isDark} />
          <InfoRow label="City" value={project.city} isDark={isDark} />
          <InfoRow label="State" value={project.state} isDark={isDark} />
          <InfoRow label="Pincode" value={project.pincode} isDark={isDark} />
        </div>

        {/* Project Details */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>🏗️</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: sectionTitleColor }}>Project Information</span>
          </div>
          <InfoRow label="Project Code" value={project.projectCode} isDark={isDark} />
          <InfoRow label="Project Name" value={project.projectName} isDark={isDark} />
          <InfoRow label="Budget" value={`₹${project.budget?.toLocaleString() || 0}`} isDark={isDark} />
          <InfoRow label="Stage" value={mainStage} isDark={isDark} />
          <InfoRow label="Sub Stage" value={subStage} isDark={isDark} />
          <InfoRow label="Legal Name" value={project.legalName} isDark={isDark} />
          <InfoRow label="GST Number" value={project.gst} isDark={isDark} />
          <InfoRow label="Description" value={project.description} isDark={isDark} />
        </div>
      </div>
    );
  };

  const renderFiles = () => (
    <div>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
        <FileColumn title="Design Files" files={MOCK_FILES.designFiles} primary="#3b82f6" />
        <FileColumn title="Schedules" files={MOCK_FILES.schedules} primary="#3b82f6" />
        <FileColumn title="Other Records" files={MOCK_FILES.otherRecords} primary="#3b82f6" />
      </div>
    </div>
  );

  const renderScopeOfWork = () => (
    <div style={{ ...card, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Select Space</span>
          <Select
            value={selectedSpace}
            onChange={setSelectedSpace}
            style={{ width: 200 }}
            options={MOCK_SPACES.map(s => ({ value: s, label: s }))}
          />
        </div>
        <Button icon={<DownloadOutlined />} style={{ background: '#D69F6D', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          Download as Excel
        </Button>
      </div>

      {/* Components */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 10 }}>Components</div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
            {['Name', 'Type / Unit', 'Length (ft.inch)', 'Height (ft.inch)', 'Depth (ft.inch)', 'Quantity'].map(col => (
              <div key={col} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{col}</div>
            ))}
          </div>
          {MOCK_COMPONENTS.map((comp, i) => (
            <div key={comp.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', borderBottom: i < MOCK_COMPONENTS.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{comp.name}</div>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{comp.type}</div>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{comp.length}</div>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{comp.height}</div>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{comp.depth}</div>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{comp.qty}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 10 }}>Accessories</div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
            {['Name', 'Brand', 'Quantity'].map(col => (
              <div key={col} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{col}</div>
            ))}
          </div>
          {MOCK_ACCESSORIES.map((acc, i) => (
            <div key={acc.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', borderBottom: i < MOCK_ACCESSORIES.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{acc.name}</div>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{acc.brand}</div>
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text)' }}>{acc.qty}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrderSheet = () => (
    <div style={card}>
      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border-soft)' }}>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setOrderView('new')}
          style={{
            borderRadius: 8, fontWeight: 600,
            background: orderView === 'new' ? 'var(--primary-soft)' : 'transparent',
            color: orderView === 'new' ? 'var(--primary)' : 'var(--text-muted)',
            border: `1px solid ${orderView === 'new' ? 'var(--primary)' : 'var(--border)'}`,
          }}
        >
          New Order Sheet
        </Button>
        <Button
          icon={<SnippetsOutlined />}
          onClick={() => setOrderView('versions')}
          style={{
            borderRadius: 8, fontWeight: 600,
            background: orderView === 'versions' ? 'var(--primary-soft)' : 'transparent',
            color: orderView === 'versions' ? 'var(--primary)' : 'var(--text-muted)',
            border: `1px solid ${orderView === 'versions' ? 'var(--primary)' : 'var(--border)'}`,
          }}
        >
          Order Sheet Versions
        </Button>
      </div>

      {orderView === 'new' ? (
        <div style={{ padding: 20, maxWidth: 680 }}>
          <Row gutter={20} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Display No</div>
              <Input defaultValue="ORDER-736-005" style={{ borderRadius: 8 }} />
            </Col>
            <Col span={12}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Expiry Date</div>
              <Input type="date" defaultValue="2026-03-12" style={{ borderRadius: 8, width: '100%' }} />
            </Col>
          </Row>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Subject</div>
            <Input.TextArea rows={4} placeholder="Dear Mr..." style={{ borderRadius: 8 }} />
          </div>
          <Button style={{ background: '#D69F6D', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, paddingInline: 24 }}>
            Generate Order Sheet
          </Button>
        </div>
      ) : (
        <div style={{ padding: 16 }}>
          {MOCK_ORDER_VERSIONS.map((v, i) => (
            <div key={v.id} style={{
              display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12,
              padding: '16px 14px',
              borderBottom: i < MOCK_ORDER_VERSIONS.length - 1 ? '1px solid var(--border-soft)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                <span style={{
                  background: '#D69F6D', color: '#fff', borderRadius: 999, padding: '4px 12px',
                  fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                  #{v.id}
                </span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>Version {v.version}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}><CalendarOutlined style={{ marginRight: 4 }} />{v.date}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.amount}</span>
                  </div>
                </div>
              </div>
              <Space wrap size={[8, 8]}>
                <Button type="link" icon={<EyeOutlined />} size="small" style={{ color: '#3b82f6', padding: 0, fontWeight: 600 }}>View</Button>
                <Button type="link" icon={<EditOutlined />} size="small" style={{ color: '#3b82f6', padding: 0, fontWeight: 600 }}>Edit</Button>
                <Button type="link" icon={<AppstoreOutlined />} size="small" style={{ color: '#3b82f6', padding: 0, fontWeight: 600 }}>Edit BOQ</Button>
                <Button type="link" icon={<DownloadOutlined />} size="small" style={{ color: '#3b82f6', padding: 0, fontWeight: 600 }}>Download</Button>
                <Button type="link" icon={<DeleteOutlined />} size="small" style={{ color: '#ef4444', padding: 0, fontWeight: 600 }}>Delete</Button>
              </Space>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProjectPlanning = () => (
    <div style={card}>
      {/* Sub-tabs row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-soft)', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {['Milestone List', 'Task List', 'Gantt Chart'].map(tab => (
            <button
              key={tab}
              onClick={() => setPlanTab(tab)}
              style={{
                padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: 'none', background: 'transparent',
                color: planTab === tab ? '#3b82f6' : 'var(--text-muted)',
                borderBottom: planTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button icon={<PlusOutlined />} style={{ background: '#D69F6D', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          New Milestone
        </Button>
      </div>

      {planTab === 'Milestone List' && (
        <div>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-soft)' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
              <UnorderedListOutlined style={{ marginRight: 8 }} />Milestone List
            </span>
          </div>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 0.8fr 1.5fr 1.5fr 80px', background: '#f9fafb', borderBottom: '1px solid var(--border)', padding: '10px 16px', gap: 8 }}>
            {['MILESTONE / PHASE', 'STATUS', 'PROGRESS', 'DURATION', 'EXPECTED SCHEDULE', 'ACTUAL ACT.', ''].map(col => (
              <div key={col} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{col}</div>
            ))}
          </div>

          {MOCK_MILESTONES.map((m, i) => (
            <div key={m.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 0.8fr 1.5fr 1.5fr 80px',
              padding: '14px 16px', gap: 8, alignItems: 'center',
              borderBottom: i < MOCK_MILESTONES.length - 1 ? '1px solid var(--border-soft)' : 'none',
            }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>{m.phase}</div>
              </div>
              <div><StatusBadge status={m.status} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Progress percent={m.progress} size="small" strokeColor="#16a34a" style={{ flex: 1, marginBottom: 0 }} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--text)' }}>{m.duration}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                <div>{m.expStart}</div>
                <div>{m.expEnd}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                <div>{m.actStart}</div>
                <div>{m.actEnd}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Button type="text" icon={<UnorderedListOutlined />} size="small" style={{ color: 'var(--text-muted)' }} />
                <Button type="text" icon={<EditOutlined />} size="small" style={{ color: 'var(--text-muted)' }} />
                <Button type="text" icon={<DeleteOutlined />} size="small" danger />
              </div>
            </div>
          ))}
        </div>
      )}

      {planTab === 'Task List' && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
          <FlagOutlined style={{ fontSize: 40, marginBottom: 12 }} />
          <div style={{ fontWeight: 600 }}>No tasks found</div>
        </div>
      )}

      {planTab === 'Gantt Chart' && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
          <LineChartOutlined style={{ fontSize: 40, marginBottom: 12 }} />
          <div style={{ fontWeight: 600 }}>Gantt chart view</div>
        </div>
      )}
    </div>
  );

  const renderSchedule = () => (
    <div>
      {/* Header info card */}
      <div style={{ ...card, marginBottom: 14, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <InfoCircleOutlined style={{ color: '#3b82f6' }} />
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Project Schedules</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {MOCK_MILESTONES.length} milestones · Track project progress and timelines
            </div>
          </div>
          <Space wrap>
            <Button icon={<EditOutlined />} style={{ borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Edit</Button>
            <Button icon={<DownloadOutlined />} style={{ borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Download</Button>
            <Button style={{ borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <Checkbox style={{ marginRight: 6 }} />Show Payments
            </Button>
          </Space>
        </div>

        {/* Info cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'CLIENT NAME', value: MOCK_SCHEDULE_INFO.clientName, icon: <UserOutlined />, color: '#D69F6D' },
            { label: 'HANDLED BY', value: MOCK_SCHEDULE_INFO.handledBy, icon: <UserOutlined />, color: '#D69F6D' },
            { label: 'EXPECTED START', value: MOCK_SCHEDULE_INFO.expectedStart, icon: <CalendarOutlined />, color: '#D69F6D' },
            { label: 'EXPECTED END', value: MOCK_SCHEDULE_INFO.expectedEnd, icon: <CalendarOutlined />, color: '#D69F6D' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.5 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones & Tasks table */}
      <div style={card}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-soft)' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
            <UnorderedListOutlined style={{ marginRight: 8 }} />Milestones & Tasks
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.2fr 0.8fr 1.5fr 1.5fr 1.5fr', background: '#f9fafb', borderBottom: '1px solid var(--border)', padding: '10px 16px', gap: 8 }}>
          {['', 'MILESTONE / PHASE', 'STATUS', 'DURATION', 'PROGRESS', 'EXPECTED SCHEDULE', 'ACTUAL ACC.'].map(col => (
            <div key={col} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{col}</div>
          ))}
        </div>

        {MOCK_MILESTONES.map((m, i) => (
          <div key={m.id} style={{
            display: 'grid', gridTemplateColumns: '36px 2fr 1.2fr 0.8fr 1.5fr 1.5fr 1.5fr',
            padding: '14px 16px', gap: 8, alignItems: 'center',
            borderBottom: i < MOCK_MILESTONES.length - 1 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <Button type="text" size="small" style={{ color: 'var(--text-muted)', padding: 0 }}>▾</Button>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>{m.phase}</div>
            </div>
            <div><StatusBadge status={m.status} /></div>
            <div style={{ fontSize: 13, color: 'var(--text)' }}>{m.duration}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Progress percent={m.progress} size="small" strokeColor="#16a34a" style={{ flex: 1, marginBottom: 0 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              <div>{m.expStart}</div>
              <div>{m.expEnd}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              <div>{m.actStart}</div>
              <div>{m.actEnd}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentSchedule = () => (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
        {[
          { label: 'ORDER VALUE', value: '₹9,72,476', icon: <SnippetsOutlined />, iconBg: '#3b82f6' },
          { label: 'RECEIVED', value: '₹9,23,615', icon: <CheckCircleOutlined />, iconBg: '#22c55e' },
          { label: 'BALANCE', value: '₹48,861', icon: <CreditCardOutlined />, iconBg: '#f59e0b' },
        ].map(item => (
          <div key={item.label} style={{ ...card, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, flexShrink: 0 }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment table card */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-soft)', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Payment Schedule</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>4 payments recorded</div>
          </div>
          <Select defaultValue="All Milestones" style={{ width: 180 }} options={['All Milestones', ...MOCK_MILESTONES.map(m => m.name)].map(v => ({ value: v, label: v }))} />
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-soft)' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
            <UnorderedListOutlined style={{ marginRight: 8 }} />Milestones & Payments
          </span>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.2fr 0.8fr 1.5fr 1.5fr 60px', background: '#f9fafb', borderBottom: '1px solid var(--border)', padding: '10px 16px', gap: 8 }}>
          {['', 'MILESTONE / PHASE', 'STATUS', 'PAYMENT %', 'EXPECTED AMOUNT', 'RECEIVED AMOUNT', 'ACTION'].map(col => (
            <div key={col} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{col}</div>
          ))}
        </div>

        {MOCK_PAYMENTS.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '36px 2fr 1.2fr 0.8fr 1.5fr 1.5fr 60px',
            padding: '14px 16px', gap: 8, alignItems: 'center',
            borderBottom: i < MOCK_PAYMENTS.length - 1 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <Button type="text" size="small" style={{ color: 'var(--text-muted)', padding: 0 }}>▾</Button>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{p.milestone}</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>{p.phase}</div>
            </div>
            <div><StatusBadge status={p.status} /></div>
            <div style={{ fontSize: 13, color: 'var(--text)' }}>{p.pct}%</div>
            <div style={{ fontSize: 13, color: 'var(--text)' }}>{p.expected}</div>
            <div style={{ fontSize: 13, color: 'var(--text)' }}>{p.received}</div>
            <Button type="text" icon={<EditOutlined />} size="small" style={{ color: '#3b82f6' }} />
          </div>
        ))}

        {/* Total row */}
        <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.2fr 0.8fr 1.5fr 1.5fr 60px', padding: '12px 16px', gap: 8, borderTop: '2px solid var(--border)', background: '#fafafa' }}>
          <div /><div /><div /><div />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>₹9,72,477</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>₹9,23,615</div>
          <div />
        </div>
      </div>
    </div>
  );

  const renderTracker = () => (
    <div style={{ ...card, padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      <LineChartOutlined style={{ fontSize: 48, marginBottom: 14 }} />
      <div style={{ fontWeight: 700, fontSize: 16 }}>Tracker</div>
      <div style={{ fontSize: 13, marginTop: 6 }}>Project tracker coming soon</div>
    </div>
  );

  const renderRaiseInvoice = () => (
    <div style={{ display: 'flex', gap: 16, flexDirection: isCompact ? 'column' : 'row', alignItems: 'flex-start' }}>
      {/* Left: main form */}
      <div style={{ ...card, flex: 1, minWidth: 0, padding: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 16 }}>Invoice</div>

        <div style={{ display: 'flex', gap: 24, marginBottom: 18, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
          <div><span style={{ fontWeight: 600, color: 'var(--text)' }}>Project Name</span><br />{project.projectName}</div>
          <div><span style={{ fontWeight: 600, color: 'var(--text)' }}>Project Number</span><br />{project.projectCode}</div>
          <div><span style={{ fontWeight: 600, color: 'var(--text)' }}>Invoice Number</span><br />INV-2026-001</div>
        </div>

        {/* Bill To */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#3b82f6', marginBottom: 12 }}>Bill To (User Details)</div>
          <Row gutter={[14, 14]}>
            <Col xs={24} sm={8}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Name *</div>
              <Input defaultValue={project.clientName} style={{ borderRadius: 8 }} />
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Email</div>
              <Input defaultValue={project.email || ''} style={{ borderRadius: 8 }} />
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Phone *</div>
              <Input.Group compact>
                <Select defaultValue="+91" style={{ width: 80 }} options={[{ value: '+91', label: '🇮🇳 +91' }]} />
                <Input defaultValue={project.phone?.replace(/^\+91\s*/, '') || ''} style={{ width: 'calc(100% - 80px)', borderRadius: '0 8px 8px 0' }} />
              </Input.Group>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>GST number <InfoCircleOutlined /></div>
              <Input placeholder="Enter GST number" style={{ borderRadius: 8 }} />
            </Col>
            <Col xs={24} sm={16}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Address</span>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Checkbox checked={sameAddress} onChange={e => setSameAddress(e.target.checked)} />
                  Apply same details to ship to
                </label>
              </div>
              <Input defaultValue={project.address1 || ''} style={{ borderRadius: 8 }} placeholder="Enter address" />
            </Col>
          </Row>
        </div>

        {/* Ship To */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#3b82f6', marginBottom: 12 }}>Ship To (User Details)</div>
          <Row gutter={[14, 14]}>
            <Col xs={24} sm={8}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Name</div>
              <Input placeholder="Enter name" style={{ borderRadius: 8 }} value={sameAddress ? project.clientName : undefined} />
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Email</div>
              <Input placeholder="Enter email" style={{ borderRadius: 8 }} />
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Phone</div>
              <Input.Group compact>
                <Select defaultValue="+91" style={{ width: 80 }} options={[{ value: '+91', label: '🇮🇳 +91' }]} />
                <Input placeholder="Enter phone" style={{ width: 'calc(100% - 80px)', borderRadius: '0 8px 8px 0' }} />
              </Input.Group>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>GST number <InfoCircleOutlined /></div>
              <Input placeholder="Enter GST number" style={{ borderRadius: 8 }} />
            </Col>
            <Col xs={24} sm={16}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Address</div>
              <Input placeholder="Enter address" style={{ borderRadius: 8 }} />
            </Col>
          </Row>
        </div>

        {/* Other Details */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 12 }}>Other Details</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Notes</div>
          <Input.TextArea rows={4} placeholder="Enter Notes" style={{ borderRadius: 8 }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={() => navigate('/projects')} style={{ borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-muted)', paddingInline: 28 }}>Back</Button>
          <Button style={{ background: '#D69F6D', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, paddingInline: 28 }}>Preview</Button>
        </div>
      </div>

      {/* Right: invoice details panel */}
      <div style={{ ...card, width: isCompact ? '100%' : 280, flexShrink: 0, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 14 }}>Invoice Details</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Invoice Date *</div>
          <Input type="date" style={{ borderRadius: 8, width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Due Date</div>
          <Input type="date" style={{ borderRadius: 8, width: '100%' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Invoice Type *</div>
          <Select placeholder="Select" style={{ width: '100%' }} options={[{ value: 'tax', label: 'Tax Invoice' }, { value: 'proforma', label: 'Proforma Invoice' }]} />
        </div>

        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 12 }}>Invoice Amount Details</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sub Total</span>
          <span style={{ fontSize: 13, color: 'var(--text)' }}>₹0</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>GST Amount</span>
          <span style={{ fontSize: 13, color: 'var(--text)' }}>₹0</span>
        </div>
        <div style={{ background: '#1e3a5f', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Total Amount</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>₹0</span>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Bank Details & Payment Instructions</div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 10, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Account Name : Company Name<br />
            Account No : 12345678<br />
            Bank Name : Bank Name
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Project Detail': return renderProjectDetail();
      case 'Files': return renderFiles();
      case 'Scope of Work': return renderScopeOfWork();
      case 'Order Sheet': return renderOrderSheet();
      case 'Project Planning': return renderProjectPlanning();
      case 'Schedule': return renderSchedule();
      case 'Payment Schedule': return renderPaymentSchedule();
      case 'Tracker': return renderTracker();
      case 'Raise Invoice': return renderRaiseInvoice();
      default: return null;
    }
  };

  const initials = project.clientName?.charAt(0)?.toUpperCase() || 'P';

  /* ─────────────── RENDER ─────────────── */
  return (
    <div style={{ ...css }}>
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/projects')}
        style={{ marginBottom: 14, color: isDark ? '#8a9ab0' : '#666', fontWeight: 500 }}
      >
        Back to Projects
      </Button>

      {/* ── Header card ── */}
      <div
        style={{
          background: 'var(--surface)',
          border: `1px solid var(--border)`,
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={44}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
              {project.clientName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
              {project.projectCode}
            </div>
          </div>
        </div>

        <Space wrap size={8}>
          <Button
            icon={<EditOutlined />}
            onClick={openEditModal}
            style={{
              background: '#1677FF',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Edit Project
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Delete Project',
                content: `Are you sure you want to delete ${project.projectCode}?`,
                okText: 'Delete',
                okButtonProps: { danger: true },
                onOk: () => {
                  // dispatch(deleteProject(project.id));
                  navigate('/projects');
                },
              });
            }}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Delete Project
          </Button>
        </Space>
      </div>

      {/* ── Main two-column layout ── */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {/* Left tab sidebar */}
        <div
          style={{
            width: isMobile ? '100%' : 200,
            flexShrink: 0,
            background: 'var(--surface)',
            border: `1px solid var(--border)`,
            borderRadius: 14,
            padding: '12px 10px',
            boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {isMobile ? (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {SIDEBAR_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: 12,
                    fontWeight: activeTab === tab.key ? 600 : 500,
                    color: activeTab === tab.key ? '#fff' : (isDark ? '#8a9ab0' : '#666'),
                    background: activeTab === tab.key ? 'var(--primary)' : (isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'),
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            SIDEBAR_TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <div
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--primary)' : (isDark ? '#8a9ab0' : '#666'),
                    background: isActive
                      ? (isDark ? 'rgba(90,181,232,0.1)' : 'rgba(214,159,109,0.1)')
                      : 'transparent',
                    borderLeft: isActive ? `3px solid var(--primary)` : '3px solid transparent',
                    marginBottom: 4,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                      e.currentTarget.style.color = isDark ? '#d8e8f8' : '#333';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = isDark ? '#8a9ab0' : '#666';
                    }
                  }}
                >
                  <span style={{ fontSize: 15 }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Right content */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: 'var(--surface)',
            border: `1px solid var(--border)`,
            borderRadius: 14,
            padding: isMobile ? 14 : 20,
            boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
            minHeight: 400,
          }}
        >
          {renderContent()}
        </div>
      </div>

      {/* ── Edit Project Modal ── */}
      <Modal
        className="crm-sheet-modal"
        title="Edit Project"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSaveProject}
        okText="Submit"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : 860}
        centered
      >
        <Form form={editForm} layout="vertical" className="crm-form-shell">
          <Row gutter={14} style={{ marginBottom: 12 }}>
            <Col xs={24} sm={12}>
              <Form.Item name="stage" label="Main Stage" style={{ marginBottom: 0 }}>
                <Select
                  onChange={value => {
                    setMainStage(value);
                    editForm.setFieldValue('subStage', (subStages[value] || [])[0] || '');
                  }}
                  options={['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(v => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="subStage" label="Sub Stage" style={{ marginBottom: 0 }}>
                <Select options={(subStages[mainStage] || []).map(v => ({ value: v, label: v }))} />
              </Form.Item>
            </Col>
          </Row>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Contact Details</div>
            <div className="crm-panel-card__body">
              <Row gutter={14}>
                <Col xs={24} sm={8}><Form.Item name="clientName" label="Name"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="email" label="Email"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 8 }}>Phone</div>
                  <Row gutter={8}>
                    <Col span={8}><Form.Item name="phoneCode" style={{ marginBottom: 0 }}><Select options={[{ value: '+91', label: '+91' }]} /></Form.Item></Col>
                    <Col span={16}><Form.Item name="phoneNumber" style={{ marginBottom: 0 }}><Input /></Form.Item></Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Project Details</div>
            <div className="crm-panel-card__body">
              <Row gutter={14}>
                <Col xs={24} sm={8}><Form.Item name="budget" label="Budget"><Input /></Form.Item></Col>
                <Col xs={24} sm={16}><Form.Item name="description" label="Description"><Input.TextArea rows={2} /></Form.Item></Col>
              </Row>
            </div>
          </div>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Address Details</div>
            <div className="crm-panel-card__body">
              <Row gutter={14}>
                <Col xs={24} sm={8}><Form.Item name="address1" label="Address line 1"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="address2" label="Address line 2"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="state" label="State"><Select options={['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi'].map(v => ({ value: v, label: v }))} /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="city" label="City"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="pincode" label="Pincode"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="location" label="Location"><Input /></Form.Item></Col>
              </Row>
            </div>
          </div>

          <div className="crm-panel-card">
            <div className="crm-panel-card__head">Other Details</div>
            <div className="crm-panel-card__body">
              <Row gutter={14}>
                <Col xs={24} sm={12}><Form.Item name="legalName" label="Legal name"><Input /></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="gst" label="GST number"><Input /></Form.Item></Col>
              </Row>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
