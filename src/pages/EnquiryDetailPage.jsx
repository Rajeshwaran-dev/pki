import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Button, Avatar, Modal, Form, Input, Select, DatePicker,
  TimePicker, Tag, Space, Row, Col, Tooltip, message, Upload,
  AutoComplete, Spin
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, DeleteOutlined,
  DownloadOutlined, PlusOutlined, FileImageOutlined,
  FilePdfOutlined, InboxOutlined, CheckOutlined, WhatsAppOutlined
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  updateEnquiry, deleteEnquiry, addFollowUp,
  addProposal, updateProposal, deleteProposal, addSiteVisit, updateSiteVisit, deleteSiteVisit, addFile, deleteFile, assignEnquiry, convertToClient, STAFF_MEMBERS
} from '@/store/slices/enquirySlice';
import { addClient } from '@/store/slices/clientSlice';
import { addProject } from '@/store/slices/projectSlice';
import { 
  ClipboardList, Folder, Phone, FileText, CheckCircle, 
  User, HardHat, Search, Mail, MapPin
} from 'lucide-react';
import useIsMobile from '@/hooks/useIsMobile';
import dayjs from 'dayjs';
import QuoteBuilder from '@/components/quotes/QuoteBuilder';

const { Dragger } = Upload;

const PROSPECT_STATUSES = ['Warm', 'Hot', 'Cold'];
const FOLLOWUP_STATUSES = ['Contacted', 'Not Reachable', 'Call Back', 'Meeting Fixed', '—'];
const FOLLOWUP_BY = ['Sales Person 1', 'Sales Person 2', 'Webinar Demo-Admin', 'Manager'];
const TEMPLATES = ['Comprehensive', 'Basic', 'Premium', 'Custom'];
const PROJECT_TYPES = ['Residential', 'Commercial', 'Renovation', 'Interior'];
const SOURCES = ['Instagram', 'Facebook', 'Google', 'Referral', 'Advertisement', 'Website'];
const SITE_STATUSES = ['Planning Stage', 'Ready to Start', 'Under Construction'];
const PROJECT_SUBTYPES = ['Apartment', 'Villa', 'Individual Villa', 'Duplex', 'Penthouse', 'Row House', 'Office Space', 'Independent House'];
const OCCUPATIONS = ['IT', 'Business', 'Engineer', 'Doctor', 'Lawyer', 'Architect', 'Businessman', 'Consultant', 'CA', 'Professional'];

/* ── small helpers ── */
const InfoRow = ({ label, value, isDark }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#aaa', fontWeight: 500, marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 16, color: isDark ? '#e0e8f0' : '#1f1f1f', fontWeight: 500 }}>{value || '—'}</div>
  </div>
);

const FileCard = ({ file, onDelete, isDark, primaryColor }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 10,
      background: isDark ? '#081b2f' : '#f5f8fc',
      border: `1px solid ${isDark ? '#0a2e4a' : '#e8f0fb'}`,
      marginBottom: 8,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: file.type === 'pdf' ? 'rgba(255,77,79,0.12)' : 'rgba(22,119,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {file.type === 'pdf'
        ? <FilePdfOutlined style={{ color: '#FF4D4F', fontSize: 20 }} />
        : <FileImageOutlined style={{ color: primaryColor, fontSize: 20 }} />
      }
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#1f1f1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {file.name}
      </div>
      <div style={{ fontSize: 13, color: isDark ? '#6a7f95' : '#aaa' }}>{file.date}</div>
    </div>
    <Space size={4}>
      <Tooltip title="Delete">
        <Button type="text" size="small" icon={<DeleteOutlined />} danger onClick={onDelete} />
      </Tooltip>
      <Tooltip title="Download">
        <Button type="text" size="small" icon={<DownloadOutlined />} style={{ color: primaryColor }} />
      </Tooltip>
    </Space>
  </div>
);

const FollowUpCard = ({ fu, isDark, primaryColor }) => {
  const prospectColor = fu.prospectStatus === 'Hot' ? '#FF4D4F' : fu.prospectStatus === 'Warm' ? '#FAAD14' : primaryColor;
  return (
    <div
      style={{
        background: isDark ? '#0b2338' : '#fff',
        border: `1px solid ${isDark ? '#1a4d72' : '#eef1f6'}`,
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        position: 'relative',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Date</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#222' }}>{fu.date}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Prospect Status</div>
            <Tag
              style={{
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                border: 'none',
                background: `${prospectColor}18`,
                color: prospectColor,
                marginTop: 2,
              }}
            >
              {fu.prospectStatus}
            </Tag>
          </div>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Follow Up Status</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#222', marginTop: 3 }}>{fu.followUpStatus}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Next Follow Up</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#222', marginTop: 3 }}>{fu.nextFollowUp}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Follow Up By</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#222', marginTop: 3 }}>{fu.followUpBy}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500, marginBottom: 2 }}>Remarks</div>
          <div style={{ fontSize: 15, color: isDark ? '#a8b8c8' : '#444' }}>{fu.remarks}</div>
        </div>
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: primaryColor,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {fu.number}
      </div>
    </div>
  );
};

const SiteVisitCard = ({ visit, isDark, primaryColor }) => {
  return (
    <div
      style={{
        background: isDark ? '#0b2338' : '#fff',
        border: `1px solid ${isDark ? '#1a4d72' : '#eef1f6'}`,
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36, height: 36, borderRadius: '50%', background: isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.15)',
          color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        <MapPin size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Visit Date</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#222' }}>{visit.date}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Visited By</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#222' }}>{visit.visitedBy}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Carpet Area</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#222' }}>{visit.carpetArea || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500 }}>Condition</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#d8e8f8' : '#222' }}>{visit.condition || '—'}</div>
          </div>
        </div>
        {(visit.mep && visit.mep.length > 0) && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500, marginBottom: 2 }}>MEP Provisions</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {visit.mep.map(m => <Tag key={m} style={{ borderRadius: 6, border: 'none', background: `${primaryColor}20`, color: primaryColor }}>{m}</Tag>)}
            </div>
          </div>
        )}
        {visit.observations && (
          <div>
            <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#bbb', fontWeight: 500, marginBottom: 2 }}>Observations</div>
            <div style={{ fontSize: 15, color: isDark ? '#a8b8c8' : '#444' }}>{visit.observations}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProposalVersionCard = ({ proposal, isDark, primaryColor, enquiryPhone, onView, onEdit, onDownload, onDelete, onApprove }) => (
  <div
    style={{
      background: isDark ? '#0b2338' : '#fff',
      border: `1px solid ${isDark ? '#1a4d72' : '#e0e0e0'}`,
      borderRadius: 8,
      padding: '12px 16px',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Tag
        style={{
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 13,
          padding: '4px 10px',
          border: 'none',
          background: isDark ? 'rgba(90,181,232,0.1)' : 'rgba(214,159,109,0.15)',
          color: primaryColor,
          margin: 0
        }}
      >
        #{proposal.id}
      </Tag>
      <span style={{ fontWeight: 700, fontSize: 14, color: isDark ? '#d8e8f8' : '#1f1f1f' }}>{proposal.version}</span>
      <span style={{ fontSize: 13, color: isDark ? '#6a7f95' : '#bbb' }}>{proposal.date}</span>
      <span style={{ fontWeight: 700, fontSize: 14, color: '#52C41A' }}>{proposal.amount}</span>
      {proposal.notes && (
        <span style={{ fontSize: 13, color: isDark ? '#8a9ab0' : '#888', fontStyle: 'italic', marginLeft: 8 }}>{proposal.notes}</span>
      )}
    </div>
    <Space size={8} wrap>
      <Button size="small" style={{ borderRadius: 6, borderColor: '#d9d9d9', color: '#666' }} onClick={onView}>View</Button>
      <Button size="small" style={{ borderRadius: 6, borderColor: '#d9d9d9', color: '#666' }} onClick={onEdit}>Edit</Button>
      <Button size="small" icon={<DownloadOutlined />} style={{ borderRadius: 6, borderColor: '#d9d9d9', color: '#666' }} onClick={onDownload} disabled={!proposal.approved} />
      
      {!proposal.approved ? (
        <>
          <Button size="small" icon={<CheckOutlined style={{ color: '#52c41a' }} />} style={{ borderRadius: 6, borderColor: '#52c41a' }} onClick={onApprove} />
          <Button size="small" icon={<DeleteOutlined />} style={{ borderRadius: 6, borderColor: '#ff4d4f', color: '#ff4d4f' }} onClick={onDelete} />
        </>
      ) : (
        <>
          <Button size="small" icon={<DeleteOutlined />} style={{ borderRadius: 6, borderColor: '#d9d9d9', color: '#d9d9d9' }} disabled />
          <Button size="small" icon={<WhatsAppOutlined style={{ color: '#25D366' }} />} style={{ borderRadius: 6, borderColor: '#25D366' }} onClick={() => {
            if (enquiryPhone) {
              const formattedPhone = enquiryPhone.replace(/[^0-9]/g, '');
              window.open(`https://wa.me/${formattedPhone}?text=Hello, please find the approved quotation ${proposal.id} attached.`);
            } else {
              message.error('No phone number found for this enquiry');
            }
          }} />
        </>
      )}
    </Space>
  </div>
);

/* ══════════════════ MAIN COMPONENT ══════════════════ */
const EnquiryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.ui.theme);
  const enquiries = useAppSelector(s => s.enquiry.enquiries);
  const isMobile = useIsMobile();

  const enquiry = enquiries.find(e => e.id === id);

  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const panelBg = isDark ? '#0d3554' : '#ffffff';
  const panelBorder = isDark ? '#1a4d72' : '#f0f0f0';
  const sectionTitleColor = primaryColor;

  const [activeTab, setActiveTab] = useState('detail');
  const [proposalSubTab, setProposalSubTab] = useState('new');

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [proposalModalConfirmOpen, setProposalModalConfirmOpen] = useState(false);

  // Forms
  const [editForm] = Form.useForm();
  const [followUpForm] = Form.useForm();
  const [proposalForm] = Form.useForm();
  const [clientInfoForm] = Form.useForm();
  const [siteVisitForm] = Form.useForm();

  const [siteVisitModalOpen, setSiteVisitModalOpen] = useState(false);

  // Convert Wizard State
  const [convertStep, setConvertStep] = useState(0);
  const [convertLoading, setConvertLoading] = useState(false);

  const [editingProposal, setEditingProposal] = useState(null);
  const [viewingProposal, setViewingProposal] = useState(null);

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

  if (!enquiry) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Search size={48} color={primaryColor} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Enquiry Not Found</div>
        <Button type="primary" onClick={() => navigate('/enquiry')} style={{ background: primaryColor, border: 'none' }}>
          Back to Enquiries
        </Button>
      </div>
    );
  }

  const avatarLetter = enquiry.name.replace('Mr. ', '').replace('Ms. ', '').charAt(0);

  const hasApprovedQuote = enquiry.proposals?.some(p => p.approved);

  const TABS = [
    { key: 'detail', label: 'Enquiry Detail', icon: <ClipboardList size={19} /> },
    { key: 'site_visit', label: 'Site Visit', icon: <MapPin size={19} /> },
    { key: 'files', label: 'Files', icon: <Folder size={19} /> },
    { key: 'followup', label: 'Follow Up', icon: <Phone size={19} /> },
    { key: 'proposal', label: 'Quotes', icon: <FileText size={19} /> },
  ];

  if (hasApprovedQuote) {
    TABS.push({ key: 'convert', label: 'Convert to Client', icon: <CheckCircle size={19} /> });
  }

  /* ── handlers ── */
  const openEditModal = () => {
    editForm.setFieldsValue({
      name: enquiry.name,
      phone: enquiry.phone.replace(/^\+91\s*/, ''),
      email: enquiry.email,
      occupation: enquiry.occupation,
      address: enquiry.address,
      location: enquiry.location,
      source: enquiry.source,
      remarks: enquiry.remarks,
      projectType: enquiry.projectType,
      projectSubtype: enquiry.projectSubtype,
      siteStatus: enquiry.siteStatus,
      siteLocation: enquiry.siteLocation,
      siteSize: enquiry.siteSize,
      siteAddress: enquiry.siteAddress,
      gstNo: enquiry.gstNo,
      assignedTo: enquiry.assignedTo,
    });
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    editForm.validateFields().then(values => {
      dispatch(updateEnquiry({
        ...enquiry,
        ...values,
        phone: `+91 ${values.phone}`,
      }));
      setEditModalOpen(false);
      message.success('Enquiry updated');
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Enquiry',
      content: `Are you sure you want to delete ${enquiry.id}?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(deleteEnquiry(enquiry.id));
        navigate('/enquiry');
      },
    });
  };

  const handleAddFollowUp = () => {
    followUpForm.validateFields().then(values => {
      const nextDate = values.nextDate ? values.nextDate.format('MMM D, YYYY') : '';
      const nextTime = values.nextTime ? values.nextTime.format('hh:mm A') : '';
      const maxNum = enquiry.followUps.length > 0 ? Math.max(...enquiry.followUps.map(f => f.number)) : 0;
      dispatch(addFollowUp({
        enquiryId: enquiry.id,
        followUp: {
          id: Date.now(),
          date: dayjs().format('MMM D, YYYY'),
          prospectStatus: values.prospectStatus,
          followUpStatus: values.followUpStatus || '—',
          nextFollowUp: nextDate && nextTime ? `${nextDate} - ${nextTime}` : nextDate || '—',
          followUpBy: values.followUpBy,
          remarks: values.remarks || '',
          number: maxNum + 1,
        },
      }));
      setFollowUpModalOpen(false);
      followUpForm.resetFields();
      message.success('Follow-up added');
    });
  };

  const handleAddSiteVisit = () => {
    siteVisitForm.validateFields().then(values => {
      dispatch(addSiteVisit({
        enquiryId: enquiry.id,
        siteVisit: {
          id: Date.now(),
          date: values.date ? values.date.format('MMM D, YYYY') : dayjs().format('MMM D, YYYY'),
          visitedBy: values.visitedBy,
          carpetArea: values.carpetArea,
          ceilingHeight: values.ceilingHeight,
          condition: values.condition,
          mep: values.mep || [],
          observations: values.observations || '',
        },
      }));
      setSiteVisitModalOpen(false);
      siteVisitForm.resetFields();
      message.success('Site Visit logged successfully');
    });
  };

  const handleGenerateProposal = () => {
    proposalForm.validateFields().then(values => {
      const versionNum = enquiry.proposals.length + 1;
      dispatch(addProposal({
        enquiryId: enquiry.id,
        proposal: {
          id: values.displayNo || `PRO-${Date.now()}`,
          version: `Ver${versionNum}`,
          date: dayjs().format('MMM D, YYYY'),
          amount: '₹0',
          notes: values.subject || '',
        },
      }));
      setProposalSubTab('versions');
      proposalForm.resetFields();
      message.success('Proposal generated');
    });
  };

  const handleFileUpload = (fileType, info) => {
    const file = info.file;
    const ext = file.name.split('.').pop().toLowerCase();
    const isPdf = ['pdf', 'doc', 'docx'].includes(ext);
    dispatch(addFile({
      enquiryId: enquiry.id,
      fileType,
      file: {
        id: Date.now(),
        name: file.name,
        date: dayjs().format('MMM D, YYYY'),
        type: isPdf ? 'pdf' : 'image',
      },
    }));
    message.success(`${file.name} uploaded`);
    return false; // prevent default upload
  };

  /* ── shared styles ── */
  const sectionBox = {
    background: isDark ? '#081b2f' : '#f8fafd',
    border: `1px solid ${isDark ? '#1a4d72' : '#e8f0fb'}`,
    borderRadius: 12,
    padding: '16px 20px',
    flex: 1,
    minWidth: 0,
  };

  const tabStyle = (key) => {
    const isConvert = key === 'convert';
    const isActive = activeTab === key;
    
    return {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      borderRadius: 10,
      cursor: 'pointer',
      fontSize: 15,
      fontWeight: isActive ? 600 : 500,
      color: isActive ? (isConvert ? '#fff' : primaryColor) : (isDark ? '#8a9ab0' : '#666'),
      background: isActive
        ? (isConvert ? '#52C41A' : (isDark ? 'rgba(90,181,232,0.1)' : 'rgba(214,159,109,0.1)'))
        : (isConvert && !enquiry.convertedToClient ? (isDark ? 'rgba(82,196,26,0.08)' : 'rgba(82,196,26,0.05)') : 'transparent'),
      borderLeft: isActive && !isConvert ? `3px solid ${primaryColor}` : '3px solid transparent',
      border: isConvert && !isActive ? `1px dashed ${isDark ? 'rgba(82,196,26,0.3)' : 'rgba(82,196,26,0.4)'}` : '1px solid transparent',
      marginBottom: 4,
      transition: 'all 0.15s ease',
    };
  };

  const subTabStyle = (key) => ({
    padding: '7px 18px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: proposalSubTab === key ? 600 : 500,
    color: proposalSubTab === key ? '#fff' : (isDark ? '#8a9ab0' : '#666'),
    background: proposalSubTab === key ? primaryColor : (isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'),
    border: 'none',
    transition: 'all 0.15s ease',
  });

  /* ────────────── TAB CONTENTS ────────────── */

  const renderDetail = () => (
    <div>
      {/* Convert CTA Banner (if not yet converted) */}
      {!enquiry.convertedToClient && (
        hasApprovedQuote ? (
          <div style={{
            marginBottom: 16,
            background: isDark ? 'rgba(82,196,26,0.1)' : '#f6ffed',
            border: `1px solid ${isDark ? 'rgba(82,196,26,0.2)' : '#b7eb8f'}`,
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            width: '100%'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: isDark ? '#d8e8f8' : '#1f1f1f' }}>Lead ready for conversion?</div>
              <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#888' }}>Convert this enquiry into a client and create a project instantly.</div>
            </div>
            <Button 
              type="primary" 
              icon={<CheckCircle size={16} />}
              onClick={() => setActiveTab('convert')}
              style={{ background: '#52C41A', border: 'none', borderRadius: 8, fontWeight: 600 }}
            >
              Convert Now
            </Button>
          </div>
        ) : (
          <div style={{
            marginBottom: 16,
            background: isDark ? 'rgba(250, 173, 20, 0.1)' : '#fffbe6',
            border: `1px solid ${isDark ? 'rgba(250, 173, 20, 0.2)' : '#ffe58f'}`,
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <span style={{ fontWeight: 600, color: isDark ? '#ffc53d' : '#d48806', fontSize: 15 }}>
              Please add and approve a quotation before converting this enquiry to a client.
            </span>
          </div>
        )
      )}

      <div style={{ display: 'flex', gap: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        {/* Primary Information */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <User size={18} color={sectionTitleColor} />
            <span style={{ fontWeight: 700, fontSize: 16, color: sectionTitleColor }}>Primary Information</span>
          </div>
          <InfoRow label="Enquiry Number" value={enquiry.id} isDark={isDark} />
          <InfoRow
            label="Enquiry Date"
            value={new Date(enquiry.enquiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            isDark={isDark}
          />
          <InfoRow label="Name" value={enquiry.name} isDark={isDark} />
          <InfoRow label="Phone" value={enquiry.phone} isDark={isDark} />
          <InfoRow label="Email" value={enquiry.email} isDark={isDark} />
          <InfoRow label="Occupation" value={enquiry.occupation} isDark={isDark} />
          <InfoRow label="Address" value={enquiry.address} isDark={isDark} />
          <InfoRow label="Location" value={enquiry.location} isDark={isDark} />
          <InfoRow label="Source" value={enquiry.source} isDark={isDark} />
          <InfoRow 
            label="Assigned To" 
            value={
              enquiry.assignedTo ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar size={20} style={{ background: primaryColor, fontSize: 10 }}>
                    {enquiry.assignedTo.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  {enquiry.assignedTo}
                </div>
              ) : 'Not Assigned'
            } 
            isDark={isDark} 
          />
          <InfoRow label="Remarks" value={enquiry.remarks} isDark={isDark} />
        </div>

        {/* Project Details */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <HardHat size={18} color={sectionTitleColor} />
            <span style={{ fontWeight: 700, fontSize: 16, color: sectionTitleColor }}>Project Details</span>
          </div>
          <InfoRow label="Project Type" value={enquiry.projectType} isDark={isDark} />
          <InfoRow label="Site Status" value={enquiry.siteStatus} isDark={isDark} />
          <InfoRow label="Project Subtype" value={enquiry.projectSubtype} isDark={isDark} />
          <InfoRow label="Site Location" value={enquiry.siteLocation} isDark={isDark} />
          <InfoRow label="Site Size" value={enquiry.siteSize} isDark={isDark} />
          <InfoRow label="Site Address" value={enquiry.siteAddress} isDark={isDark} />
          <InfoRow label="GST No" value={enquiry.gstNo} isDark={isDark} />
        </div>
      </div>
    </div>
  );

  const renderFiles = () => {
    const FilesSection = ({ title, fileType, files }) => (
      <div style={{ flex: 1, minWidth: isMobile ? '100%' : 220 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            paddingBottom: 8,
            borderBottom: `1px solid ${isDark ? '#1a4d72' : '#e8f0fb'}`,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#d8e8f8' : '#1f1f1f' }}>{title}</span>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => { handleFileUpload(fileType, { file }); return false; }}
          >
            <Tooltip title="Add file">
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                style={{
                  color: primaryColor,
                  background: isDark ? 'rgba(90,181,232,0.1)' : 'rgba(214,159,109,0.1)',
                  borderRadius: 6,
                }}
              />
            </Tooltip>
          </Upload>
        </div>
        {files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: isDark ? '#5a7a95' : '#ccc', fontSize: 14 }}>
            <InboxOutlined style={{ fontSize: 28, display: 'block', marginBottom: 6 }} />
            No files yet
          </div>
        ) : (
          files.map(file => (
            <FileCard
              key={file.id}
              file={file}
              isDark={isDark}
              primaryColor={primaryColor}
              onDelete={() => dispatch(deleteFile({ enquiryId: enquiry.id, fileType, fileId: file.id }))}
            />
          ))
        )}
      </div>
    );

    return (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <FilesSection title="Site Files" fileType="site" files={enquiry.files.site} />
        <FilesSection title="Design Files" fileType="design" files={enquiry.files.design} />
        <FilesSection title="Other Files" fileType="other" files={enquiry.files.other} />
      </div>
    );
  };

  const renderFollowUp = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setFollowUpModalOpen(true)}
          style={{ background: primaryColor, border: 'none', borderRadius: 8 }}
        >
          New Follow Up
        </Button>
      </div>
      {enquiry.followUps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: isDark ? '#5a7a95' : '#ccc' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Phone size={40} color={isDark ? '#5a7a95' : '#ccc'} />
          </div>
          <div style={{ fontSize: 16 }}>No follow-ups yet. Add your first follow-up!</div>
        </div>
      ) : (
        enquiry.followUps.map(fu => (
          <FollowUpCard key={fu.id} fu={fu} isDark={isDark} primaryColor={primaryColor} />
        ))
      )}
    </div>
  );

  const renderProposal = () => (
    <div>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button style={subTabStyle('new')} onClick={() => {
          setEditingProposal(null);
          setProposalSubTab('new');
        }}>
          {editingProposal ? 'Edit Quote' : 'New Quotes'}
        </button>
        <button style={subTabStyle('versions')} onClick={() => setProposalSubTab('versions')}>
          Quotes Versions
          {enquiry.proposals.length > 0 && (
            <span style={{
              marginLeft: 6,
              background: isDark ? 'rgba(90,181,232,0.25)' : 'rgba(214,159,109,0.25)',
              color: primaryColor,
              borderRadius: 10,
              padding: '1px 6px',
              fontSize: 14,
              fontWeight: 700,
            }}>
              {enquiry.proposals.length}
            </span>
          )}
        </button>
      </div>

      {proposalSubTab === 'new' ? (
        <QuoteBuilder 
          initialData={editingProposal ? { title: editingProposal.title || '', items: editingProposal.items || [] } : null}
          onGenerate={({ title, items }) => {
            const versionNum = editingProposal ? parseInt(editingProposal.version.replace('Ver', '')) : enquiry.proposals.length + 1;
            const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) * 1.18;
            
            const proposalData = {
              id: editingProposal ? editingProposal.id : `PRO-${Date.now().toString().slice(-6)}`,
              version: `Ver${versionNum}`,
              date: dayjs().format('MMM D, YYYY'),
              amount: `₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
              notes: title || (editingProposal ? 'Updated from Quote Builder' : 'Generated from Quote Builder'),
              title: title,
              items: items
            };

            if (editingProposal) {
              dispatch(updateProposal({ enquiryId: enquiry.id, proposal: proposalData }));
              message.success('Quote updated');
            } else {
              dispatch(addProposal({ enquiryId: enquiry.id, proposal: proposalData }));
              message.success('Quote generated');
            }
            
            setEditingProposal(null);
            setProposalSubTab('versions');
        }} />
      ) : (
        <div>
          {enquiry.proposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: isDark ? '#5a7a95' : '#ccc' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <FileText size={40} color={isDark ? '#5a7a95' : '#ccc'} />
              </div>
              <div style={{ fontSize: 16 }}>No proposals generated yet.</div>
            </div>
          ) : (
            enquiry.proposals.map(p => (
              <ProposalVersionCard
                key={p.id}
                proposal={p}
                isDark={isDark}
                primaryColor={primaryColor}
                enquiryPhone={enquiry.phone}
                onView={() => setViewingProposal(p)}
                onEdit={() => {
                  setEditingProposal(p);
                  setProposalSubTab('new');
                }}
                onDownload={() => message.success(`Downloading ${p.version}`)}
                onApprove={() => {
                  Modal.confirm({
                    title: 'Approve Quote',
                    content: `Are you sure you want to approve ${p.version}? This will disable deletion and enable downloading.`,
                    okText: 'Approve',
                    onOk: () => {
                      dispatch(updateProposal({ enquiryId: enquiry.id, proposal: { ...p, approved: true } }));
                      message.success(`${p.version} approved`);
                    }
                  });
                }}
                onDelete={() =>
                  Modal.confirm({
                    title: 'Delete Quote',
                    content: `Are you sure you want to delete ${p.id} ${p.version}?`,
                    okText: 'Delete',
                    okButtonProps: { danger: true },
                    onOk: () => dispatch(deleteProposal({ enquiryId: enquiry.id, proposalId: p.id })),
                  })
                }
              />
            ))
          )}
        </div>
      )}

      {/* View Quote Modal */}
      <Modal
        title={`Viewing ${viewingProposal?.version} (${viewingProposal?.id})`}
        open={!!viewingProposal}
        onCancel={() => setViewingProposal(null)}
        width={1000}
        footer={null}
        className="crm-modal"
        destroyOnClose
        centered
      >
        {viewingProposal && (
          <QuoteBuilder 
            initialData={{ title: viewingProposal.title, items: viewingProposal.items || [] }} 
            isReadOnly={true} 
          />
        )}
      </Modal>
    </div>
  );

  const renderConvertToClient = () => {
    if (enquiry.convertedToClient && enquiry.clientData) {
      const cd = enquiry.clientData;
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', 
              background: '#52C41A15', display: 'flex', 
              alignItems: 'center', justifyContent: 'center',
              border: '1px solid #52C41A30'
            }}>
              <CheckCircle size={44} color="#52C41A" />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: isDark ? '#f0f4f8' : '#1f1f1f', marginBottom: 12 }}>
            Converted to Client & Project Created!
          </div>
          <div style={{ fontSize: 16, color: isDark ? '#8a9ab0' : '#666', marginBottom: 24 }}>
            This enquiry was successfully converted to <strong>{cd.clientName}</strong> on {cd.convertedDate}.
            A new project based on the approved quote has also been created.
          </div>
          <Space size={16}>
            <Button 
              size="large" 
              type="primary" 
              style={{ 
                background: primaryColor, 
                border: 'none', 
                borderRadius: 12, 
                height: 48, 
                paddingInline: 32,
                fontWeight: 700
              }} 
              onClick={() => navigate('/clients')}
            >
              View Clients
            </Button>
            <Button 
              size="large" 
              style={{ 
                borderRadius: 12, 
                height: 48, 
                paddingInline: 32,
                fontWeight: 600
              }} 
              onClick={() => navigate('/projects')}
            >
              View Projects
            </Button>
          </Space>
        </div>
      );
    }

    const handleConvertConfirm = async () => {
      setConvertLoading(true);
      try {
        const clientValues = await clientInfoForm.validateFields();

        const clientId = `CLT-${dayjs().year()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        const projectId = `PRJ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        const clientData = {
          id: clientId,
          ...clientValues,
          legalName: clientValues.clientName, // Default legal name to client name
          createdDate: dayjs().format('YYYY-MM-DD'),
          convertedDate: dayjs().format('MMM D, YYYY'),
          sourceEnquiryId: enquiry.id,
        };

        const approvedQuote = enquiry.proposals?.find(p => p.approved);
        let numericBudget = 0;
        if (approvedQuote && approvedQuote.amount) {
          numericBudget = Number(approvedQuote.amount.replace(/[^0-9.-]+/g, ""));
        }

        const projectData = {
          id: projectId,
          createdDate: dayjs().format('YYYY-MM-DD'),
          projectCode: projectId,
          projectName: approvedQuote?.title || `${clientData.clientName}'s Project`,
          clientName: clientData.clientName,
          budget: numericBudget || 0,
          city: enquiry.location || '',
          state: 'Unknown',
          stage: 'Designing',
          phone: clientData.phone,
          email: clientData.email,
          approvedQuote: approvedQuote
        };

        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));

        dispatch(addClient(clientData));
        dispatch(addProject(projectData));
        dispatch(convertToClient({ enquiryId: enquiry.id, clientData }));

        message.success('Lead converted and project created!');
        setConvertLoading(false);
      } catch (err) {
        setConvertLoading(false);
        message.error('Please complete all required fields');
      }
    };

    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: isDark ? '#d8e8f8' : '#1f1f1f', marginBottom: 4 }}>
            Convert to Client
          </div>
          <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#888' }}>
            Complete the details below to convert this lead into a formal client.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          {/* Client Details Section */}
          <div style={{ maxWidth: 600, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <User size={18} color={primaryColor} />
              <span style={{ fontWeight: 700, fontSize: 16, color: primaryColor }}>Client Details</span>
            </div>
            <Form 
              form={clientInfoForm} 
              layout="vertical" 
              className="crm-form-shell"
              initialValues={{
                clientName: enquiry.name,
                phone: enquiry.phone,
                email: enquiry.email,
                address1: enquiry.address,
                occupation: enquiry.occupation,
                gst: enquiry.gstNo,
              }}
            >
              <Form.Item name="clientName" label="Client Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="occupation" label="Occupation">
                <Select options={OCCUPATIONS.map(o => ({ value: o, label: o }))} />
              </Form.Item>
              <Form.Item name="address1" label="Address">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="gst" label="GST Number">
                <Input />
              </Form.Item>
            </Form>
          </div>
        </div>

        <div style={{ 
          marginTop: 32, 
          paddingTop: 24, 
          borderTop: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Button
            type="primary"
            size="large"
            loading={convertLoading}
            onClick={handleConvertConfirm}
            style={{ 
              background: '#52C41A', 
              border: 'none', 
              borderRadius: 10, 
              fontWeight: 700, 
              padding: '0 40px',
              height: 48
            }}
          >
            Confirm & Convert to Client
          </Button>
        </div>
      </div>
    );
  };

  const renderSiteVisit = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setSiteVisitModalOpen(true)}
          style={{ background: primaryColor, border: 'none', borderRadius: 8 }}
        >
          Add Site Visit
        </Button>
      </div>
      {(!enquiry.siteVisits || enquiry.siteVisits.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: isDark ? '#5a7a95' : '#ccc' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <MapPin size={40} color={isDark ? '#5a7a95' : '#ccc'} />
          </div>
          <div style={{ fontSize: 16 }}>No site visits logged yet.</div>
        </div>
      ) : (
        enquiry.siteVisits.map(visit => (
          <SiteVisitCard key={visit.id} visit={visit} isDark={isDark} primaryColor={primaryColor} />
        ))
      )}
    </div>
  );

  const tabContent = {
    detail: renderDetail(),
    site_visit: renderSiteVisit(),
    files: renderFiles(),
    followup: renderFollowUp(),
    proposal: renderProposal(),
    convert: renderConvertToClient(),
  };

  /* ──────────────────── RENDER ──────────────────── */
  return (
    <div>
      {/* Back button */}
      <div style={{ marginBottom: 14, position: 'relative', zIndex: 1000 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/enquiry');
          }}
          style={{ 
            color: isDark ? '#8a9ab0' : '#666', 
            fontWeight: 500,
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
        >
          Back to Enquiries
        </Button>
      </div>

      {/* ── Header card ── */}
      <div
        style={{
          background: panelBg,
          border: `1px solid ${panelBorder}`,
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
              background: primaryColor,
              fontWeight: 800,
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {avatarLetter}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: isDark ? '#f0f4f8' : '#1f1f1f' }}>
              {enquiry.name}
            </div>
            <div style={{ fontSize: 15, color: isDark ? '#5ab5e8' : '#D69F6D', fontWeight: 600 }}>
              {enquiry.id}
            </div>
            {enquiry.assignedTo && (
              <div style={{ fontSize: 14, color: isDark ? '#8a9ab0' : '#666', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} />
                <span>Assigned to: <strong>{enquiry.assignedTo}</strong></span>
              </div>
            )}
            {enquiry.convertedToClient && (
              <div
                style={{
                  marginTop: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: isDark ? 'rgba(82,196,26,0.12)' : 'rgba(82,196,26,0.08)',
                  border: `1px solid ${isDark ? 'rgba(82,196,26,0.2)' : 'rgba(82,196,26,0.25)'}`,
                  color: '#52C41A',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <CheckCircle size={14} />
                <span>CONVERTED TO CLIENT</span>
              </div>
            )}
          </div>
        </div>

        <Space wrap size={8}>
          <Button
            icon={<EditOutlined />}
            onClick={openEditModal}
            style={{
              background: primaryColor,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Edit Enquiry
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Delete Enquiry
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
            background: panelBg,
            border: `1px solid ${panelBorder}`,
            borderRadius: 14,
            padding: '12px 10px',
            boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {isMobile ? (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                    fontWeight: activeTab === tab.key ? 600 : 500,
                    color: activeTab === tab.key ? '#fff' : (isDark ? '#8a9ab0' : '#666'),
                    background: activeTab === tab.key ? primaryColor : (isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'),
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            TABS.map(tab => (
              <div
                key={tab.key}
                style={tabStyle(tab.key)}
                onClick={() => setActiveTab(tab.key)}
                onMouseEnter={e => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                    e.currentTarget.style.color = isDark ? '#d8e8f8' : '#333';
                  }
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.key) {
                    const isConvert = tab.key === 'convert';
                    e.currentTarget.style.background = isConvert && !enquiry.convertedToClient 
                      ? (isDark ? 'rgba(82,196,26,0.08)' : 'rgba(82,196,26,0.05)') 
                      : 'transparent';
                    e.currentTarget.style.color = isDark ? '#8a9ab0' : '#666';
                  }
                }}
              >
                <span style={{ fontSize: 19 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            ))
          )}
        </div>

        {/* Right content */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: panelBg,
            border: `1px solid ${panelBorder}`,
            borderRadius: 14,
            padding: isMobile ? 14 : 20,
            boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {tabContent[activeTab]}
        </div>
      </div>

      {/* ── Edit Enquiry Modal ── */}
      <Modal
        className="crm-modal"
        title="Edit Enquiry"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleEditSave}
        okText="Save Changes"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : 760}
        centered
      >
        <Form form={editForm} layout="vertical" className="crm-form-shell">
          <div className="crm-section">
            <div className="crm-section-title">
              <span className="crm-section-badge">1</span>
              <span>Primary Information</span>
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                  <Input addonBefore="+91" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="occupation" label="Occupation">
                  <Select options={OCCUPATIONS.map(o => ({ value: o, label: o }))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="source" label="Source">
                  <Select options={SOURCES.map(s => ({ value: s, label: s }))} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="address" label="Address">
              <Input.TextArea rows={2} />
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
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={2} />
            </Form.Item>
          </div>
          <div className="crm-section" style={{ marginBottom: 0 }}>
            <div className="crm-section-title">
              <span className="crm-section-badge">2</span>
              <span>Project Details</span>
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="projectType" label="Project Type">
                  <Select options={PROJECT_TYPES.map(t => ({ value: t, label: t }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectSubtype" label="Project Subtype">
                  <Select options={PROJECT_SUBTYPES.map(t => ({ value: t, label: t }))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="siteStatus" label="Site Status">
                  <Select options={SITE_STATUSES.map(s => ({ value: s, label: s }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="siteLocation" label="Site Location">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="siteSize" label="Site Size">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="gstNo" label="GST No">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="siteAddress" label="Site Address">
              <Input.TextArea rows={2} />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* ── Add Follow Up Modal ── */}
      <Modal
        className="crm-modal"
        title="New Follow Up"
        open={followUpModalOpen}
        onCancel={() => { setFollowUpModalOpen(false); followUpForm.resetFields(); }}
        onOk={handleAddFollowUp}
        okText="Add Follow Up"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : 520}
        centered
      >
        <Form form={followUpForm} layout="vertical" className="crm-form-shell">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="prospectStatus" label="Prospect Status" rules={[{ required: true, message: 'Required' }]}>
                <Select options={PROSPECT_STATUSES.map(s => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="followUpStatus" label="Follow Up Status">
                <Select options={FOLLOWUP_STATUSES.map(s => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="nextDate" label="Next Follow Up Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nextTime" label="Time">
                <TimePicker style={{ width: '100%' }} format="hh:mm A" use12Hours />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="followUpBy" label="Follow Up By" rules={[{ required: true, message: 'Required' }]}>
            <Select options={FOLLOWUP_BY.map(s => ({ value: s, label: s }))} />
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={3} placeholder="Notes about this follow-up..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Add Site Visit Modal ── */}
      <Modal
        className="crm-modal"
        title="Add Site Visit"
        open={siteVisitModalOpen}
        onCancel={() => { setSiteVisitModalOpen(false); siteVisitForm.resetFields(); }}
        onOk={handleAddSiteVisit}
        okText="Save Visit"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : 600}
        centered
      >
        <Form form={siteVisitForm} layout="vertical" className="crm-form-shell">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="date" label="Visit Date" rules={[{ required: true, message: 'Date required' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="visitedBy" label="Visited By" rules={[{ required: true }]}>
                <Select placeholder="Select staff" options={STAFF_MEMBERS.map(s => ({ value: s.name, label: s.name }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="carpetArea" label="Carpet Area (sq ft)">
                <Input placeholder="e.g. 1200" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ceilingHeight" label="Ceiling Height (ft)">
                <Input placeholder="e.g. 10.5" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="condition" label="Site Condition">
            <Select placeholder="Select condition" options={[
              { value: 'Raw', label: 'Raw' },
              { value: 'Plastered', label: 'Plastered' },
              { value: 'Semi-finished', label: 'Semi-finished' },
              { value: 'Fully Finished', label: 'Fully Finished' },
            ]} />
          </Form.Item>
          <Form.Item name="mep" label="MEP Provisions (Check all that apply)">
            <Select mode="multiple" placeholder="Select provisions" options={[
              { value: 'Electrical Points', label: 'Electrical Points' },
              { value: 'Plumbing', label: 'Plumbing' },
              { value: 'Gas Pipeline', label: 'Gas Pipeline' },
              { value: 'HVAC/AC Ducts', label: 'HVAC/AC Ducts' },
            ]} />
          </Form.Item>
          <Form.Item name="observations" label="Observations / Notes">
            <Input.TextArea rows={3} placeholder="Any specific issues or requests..." />
          </Form.Item>
          <Form.Item label="Site Media (Optional)">
            <Dragger multiple beforeUpload={() => false}>
              <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: primaryColor }} /></p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnquiryDetailPage;