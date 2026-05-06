import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Button, Avatar, Modal, Form, Input, Select, DatePicker,
  TimePicker, Tag, Space, Row, Col, Tooltip, message, Upload,
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, DeleteOutlined,
  DownloadOutlined, PlusOutlined, FileImageOutlined,
  FilePdfOutlined, InboxOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  updateEnquiry, deleteEnquiry, addFollowUp,
  addProposal, deleteProposal, addFile, deleteFile,
} from '@/store/slices/enquirySlice';
import { 
  ClipboardList, Folder, Phone, FileText, CheckCircle, 
  User, HardHat, Search, Mail
} from 'lucide-react';
import useIsMobile from '@/hooks/useIsMobile';
import dayjs from 'dayjs';

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

const ProposalVersionCard = ({ proposal, isDark, primaryColor, onDelete }) => (
  <div
    style={{
      background: isDark ? '#0b2338' : '#fff',
      border: `2px solid ${isDark ? '#1a4d72' : '#e8f0fb'}`,
      borderRadius: 12,
      padding: '14px 16px',
      marginBottom: 12,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Tag
          style={{
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            padding: '3px 10px',
            border: 'none',
            background: isDark ? 'rgba(90,181,232,0.14)' : 'rgba(214,159,109,0.14)',
            color: primaryColor,
          }}
        >
          #{proposal.id}
        </Tag>
        <span style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#d8e8f8' : '#1f1f1f' }}>{proposal.version}</span>
        <span style={{ fontSize: 13, color: isDark ? '#6a7f95' : '#bbb' }}>{proposal.date}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#52C41A' }}>{proposal.amount}</span>
        {proposal.notes && (
          <span style={{ fontSize: 13, color: isDark ? '#8a9ab0' : '#888', fontStyle: 'italic' }}>{proposal.notes}</span>
        )}
      </div>
      <Space size={6} wrap>
        <Button size="small" style={{ borderRadius: 6 }}>View</Button>
        <Button size="small" style={{ borderRadius: 6 }}>Edit</Button>
        <Button size="small" style={{ borderRadius: 6 }}>Edit BOQ</Button>
        <Button size="small" icon={<DownloadOutlined />} style={{ borderRadius: 6 }} />
        <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} onClick={onDelete} />
      </Space>
    </div>
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

  const TABS = [
    { key: 'detail', label: 'Enquiry Detail', icon: <ClipboardList size={19} /> },
    { key: 'files', label: 'Files', icon: <Folder size={19} /> },
    { key: 'followup', label: 'Follow Up', icon: <Phone size={19} /> },
    { key: 'proposal', label: 'Proposal', icon: <FileText size={19} /> },
    { key: 'confirm', label: 'Confirm Order', icon: <CheckCircle size={19} /> },
  ];

  /* ── handlers ── */
  const openEditModal = () => {
    editForm.setFieldsValue({
      name: enquiry.name,
      phone: enquiry.phone.replace(/^\+91\s*/, ''),
      email: enquiry.email,
      occupation: enquiry.occupation,
      address: enquiry.address,
      source: enquiry.source,
      remarks: enquiry.remarks,
      projectType: enquiry.projectType,
      projectSubtype: enquiry.projectSubtype,
      siteStatus: enquiry.siteStatus,
      siteLocation: enquiry.siteLocation,
      siteSize: enquiry.siteSize,
      siteAddress: enquiry.siteAddress,
      gstNo: enquiry.gstNo,
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

  const tabStyle = (key) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: activeTab === key ? 600 : 500,
    color: activeTab === key ? primaryColor : (isDark ? '#8a9ab0' : '#666'),
    background: activeTab === key
      ? (isDark ? 'rgba(90,181,232,0.1)' : 'rgba(214,159,109,0.1)')
      : 'transparent',
    borderLeft: activeTab === key ? `3px solid ${primaryColor}` : '3px solid transparent',
    marginBottom: 4,
    transition: 'all 0.15s ease',
  });

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
        <InfoRow label="Source" value={enquiry.source} isDark={isDark} />
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
        <button style={subTabStyle('new')} onClick={() => setProposalSubTab('new')}>New Proposal</button>
        <button style={subTabStyle('versions')} onClick={() => setProposalSubTab('versions')}>
          Proposal Versions
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
        <div style={{ maxWidth: 560 }}>
          <Form form={proposalForm} layout="vertical" className="crm-form-shell">
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="template" label="Template" rules={[{ required: true, message: 'Select template' }]}>
                  <Select placeholder="Select template" options={TEMPLATES.map(t => ({ value: t, label: t }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="displayNo" label="Display No">
                  <Input placeholder={`PRO-${Date.now().toString().slice(-6)}`} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="expiryDate" label="Expiry Date">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="subject" label="Subject">
              <Input.TextArea rows={4} placeholder={`Dear ${enquiry.name}...`} />
            </Form.Item>
            <Button
              type="primary"
              size="large"
              onClick={handleGenerateProposal}
              style={{ background: primaryColor, border: 'none', borderRadius: 10, fontWeight: 600 }}
            >
              Generate Proposal
            </Button>
          </Form>
        </div>
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
                onDelete={() =>
                  Modal.confirm({
                    title: 'Delete Proposal',
                    content: `Delete ${p.id} ${p.version}?`,
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
    </div>
  );

  const renderConfirmOrder = () => (
    <div style={{ textAlign: 'center', padding: '64px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <CheckCircle size={56} color="#52C41A" />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: isDark ? '#d8e8f8' : '#1f1f1f', marginBottom: 8 }}>
        Confirm Order
      </div>
      <div style={{ fontSize: 15, color: isDark ? '#6a7f95' : '#aaa', marginBottom: 24 }}>
        Once the proposal is accepted, confirm the order to proceed.
      </div>
      <Button
        type="primary"
        size="large"
        style={{ background: '#52C41A', border: 'none', borderRadius: 10, fontWeight: 600, padding: '0 32px' }}
      >
        Confirm Order
      </Button>
    </div>
  );

  const tabContent = {
    detail: renderDetail(),
    files: renderFiles(),
    followup: renderFollowUp(),
    proposal: renderProposal(),
    confirm: renderConfirmOrder(),
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
                    e.currentTarget.style.background = 'transparent';
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
    </div>
  );
};

export default EnquiryDetailPage;
