import { useState, useRef, useEffect } from 'react';
import { Input, Avatar, Tooltip, Drawer, Tabs, Checkbox, Button, InputNumber, Modal } from 'antd';
import {
  SearchOutlined, SettingOutlined, PaperClipOutlined,
  AudioOutlined, SendOutlined, FileTextOutlined,
  PictureOutlined, ArrowLeftOutlined, BarChartOutlined,
  CloseOutlined, UsergroupAddOutlined, PlusOutlined,
  UserOutlined, DeleteOutlined, EditOutlined, TeamOutlined,
  UserAddOutlined, WarningOutlined, CameraOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/store';
import useIsMobile from '@/hooks/useIsMobile';

/* ═══════════════════════════════════════════
   BASE MEMBER DATA
═══════════════════════════════════════════ */
const CURRENT_USER = {
  id: 'current', name: 'Super Admin', code: 'EKA00000',
  email: 'admin@perspective.com', initials: 'SA', color: '#B19625',
};

const ALL_MEMBERS = [
  { id: 'm1', name: 'Rahul Sharma',  code: 'EKA00001', email: 'rahul@example.com',  initials: 'RS', color: '#B19625' },
  { id: 'm2', name: 'Priya Patel',   code: 'EKA00002', email: 'priya@example.com',  initials: 'PP', color: '#059669' },
  { id: 'm3', name: 'Amit Gupta',    code: 'EKA00003', email: 'amit@example.com',   initials: 'AG', color: '#DB2777' },
  { id: 'm4', name: 'Sneha Reddy',   code: 'EKA00004', email: 'sneha@example.com',  initials: 'SR', color: '#DC2626' },
  { id: 'm5', name: 'Vikram Singh',  code: 'EKA00005', email: 'vikram@example.com', initials: 'VS', color: '#9333EA' },
  { id: 'm6', name: 'Neha Kapoor',   code: 'EKA00006', email: 'neha@example.com',   initials: 'NK', color: '#16A34A' },
  { id: 'm7', name: 'Rajesh Iyer',   code: 'EKA00007', email: 'rajesh@example.com', initials: 'RI', color: '#0891B2' },
  { id: 'm8', name: 'Ananya Das',    code: 'EKA00008', email: 'ananya@example.com', initials: 'AD', color: '#7C3AED' },
];

const MEMBER_MAP = Object.fromEntries(
  [CURRENT_USER, ...ALL_MEMBERS].map(m => [m.id, m])
);

/* ═══════════════════════════════════════════
   INITIAL CONVERSATIONS
═══════════════════════════════════════════ */
const INITIAL_CONVERSATIONS = [
  {
    id: 'broadcast', type: 'broadcast', name: 'Broadcast',
    initials: 'B', color: '#F59E0B',
    lastMsg: 'You: Project updates shared', time: '05:54 PM', unread: 0,
    members: [{ id: 'current', role: 'admin' }],
  },
  {
    id: 'luxury-villa-team', type: 'group', name: 'Luxury Villa Team',
    initials: 'LV', color: '#7C3AED',
    lastMsg: 'Rahul: Design approved!', time: '05:17 PM', unread: 2,
    members: [
      { id: 'current', role: 'admin' },
      { id: 'm1', role: 'admin' },
      { id: 'm2', role: 'member' },
      { id: 'm3', role: 'member' },
    ],
  },
  {
    id: 'office-reno-team', type: 'group', name: 'Office Renovation Team',
    initials: 'OR', color: '#0891B2',
    lastMsg: 'Priya: Site visit scheduled', time: '04:13 PM', unread: 0,
    members: [
      { id: 'current', role: 'admin' },
      { id: 'm2', role: 'admin' },
      { id: 'm4', role: 'member' },
      { id: 'm5', role: 'member' },
      { id: 'm6', role: 'member' },
    ],
  },
  { id: 'rahul', type: 'direct', name: 'Rahul Sharma',   initials: 'RS', color: '#B19625', online: true,  lastMsg: 'Sounds good, thank you!',      time: '05:58 PM', unread: 0 },
  { id: 'priya', type: 'direct', name: 'Priya Patel',    initials: 'PP', color: '#059669', online: true,  lastMsg: 'Please review the layout.',    time: '04:45 PM', unread: 1 },
  { id: 'amit',  type: 'direct', name: 'Amit Gupta',     initials: 'AG', color: '#DB2777', online: false, lastMsg: 'Budget revision needed.',      time: '03:30 PM', unread: 0 },
  { id: 'sneha', type: 'direct', name: 'Sneha Reddy',    initials: 'SR', color: '#DC2626', online: false, lastMsg: 'Snag list sent.',              time: '01:20 PM', unread: 0 },
  { id: 'vikram',type: 'direct', name: 'Vikram Singh',   initials: 'VS', color: '#9333EA', online: true,  lastMsg: 'Final walkthrough done!',      time: '11:00 AM', unread: 0 },
  { id: 'neha',  type: 'direct', name: 'Neha Kapoor',    initials: 'NK', color: '#16A34A', online: false, lastMsg: 'Handover documents ready.',    time: '10:30 AM', unread: 0 },
];

/* ═══════════════════════════════════════════
   INITIAL MESSAGES
═══════════════════════════════════════════ */
const INITIAL_MESSAGES = {
  broadcast: [
    { id: 'd1', type: 'date', text: 'Today' },
    { id: 'm1', type: 'system', text: 'You shared project updates to all contacts' },
    { id: 'm2', type: 'text', text: 'Project updates shared', sent: true, time: '05:54 PM', status: 'read' },
  ],
  'luxury-villa-team': [
    { id: 'd1', type: 'date', text: 'Mon Apr 06 2026' },
    { id: 'm1', type: 'system', text: 'Super Admin added Rahul Sharma' },
    { id: 'm2', type: 'system', text: 'Super Admin added Priya Patel' },
    { id: 'm3', type: 'text', text: 'Welcome to the Luxury Villa Interior project team!', sent: true, time: '09:00 AM', status: 'read' },
    { id: 'm4', type: 'text', text: 'Design approved!', sent: false, sender: 'Rahul Sharma', senderColor: '#B19625', time: '05:17 PM' },
  ],
  'office-reno-team': [
    { id: 'd1', type: 'date', text: 'Mon Apr 06 2026' },
    { id: 'm1', type: 'system', text: 'Super Admin added Priya Patel' },
    { id: 'm2', type: 'system', text: 'Super Admin added Sneha Reddy' },
    { id: 'm3', type: 'text', text: 'Kick-off meeting notes attached. Let\'s align on the timeline.', sent: true, time: '10:00 AM', status: 'delivered' },
    { id: 'm4', type: 'text', text: 'Site visit scheduled for next week.', sent: false, sender: 'Priya Patel', senderColor: '#059669', time: '04:13 PM' },
  ],
  rahul: [
    { id: 'd1', type: 'date', text: 'Fri Apr 03 2026' },
    { id: 'm1', type: 'text', text: 'Hi Rahul, how is the Luxury Villa project progressing?', sent: true, time: '11:34 AM', status: 'read' },
    { id: 'm2', type: 'poll', sent: true, time: '11:39 AM',
      poll: {
        title: 'TEAM LUNCH',
        options: [
          { label: 'NO', votes: 1, pct: 50, voters: [{ name: 'Neha Kapoor', initials: 'NK', color: '#16A34A' }] },
          { label: 'YES', votes: 1, pct: 50, voters: [{ name: 'Rahul Sharma', initials: 'RS', color: '#B19625' }] },
        ],
        totalVotes: 2,
      },
    },
    { id: 'm3', type: 'text', text: 'Sounds good, thank you!', sent: false, sender: 'Rahul Sharma', senderColor: '#B19625', time: '05:58 PM' },
  ],
  priya:  [{ id: 'd1', type: 'date', text: 'Today' }, { id: 'm1', type: 'text', text: 'Hi Priya, the Office Renovation designs are ready for review.', sent: true, time: '04:00 PM', status: 'read' }, { id: 'm2', type: 'text', text: 'Please review the layout.', sent: false, sender: 'Priya Patel', senderColor: '#059669', time: '04:45 PM' }],
  amit:   [{ id: 'd1', type: 'date', text: 'Today' }, { id: 'm1', type: 'text', text: 'Amit, shall we schedule a call for the Penthouse project?', sent: true, time: '02:00 PM', status: 'read' }, { id: 'm2', type: 'text', text: 'Budget revision needed.', sent: false, sender: 'Amit Gupta', senderColor: '#DB2777', time: '03:30 PM' }],
  sneha:  [{ id: 'd1', type: 'date', text: 'Today' }, { id: 'm1', type: 'text', text: 'Sneha, the Restaurant Makeover snags are pending.', sent: true, time: '01:00 PM', status: 'read' }, { id: 'm2', type: 'text', text: 'Snag list sent.', sent: false, sender: 'Sneha Reddy', senderColor: '#DC2626', time: '01:20 PM' }],
  vikram: [{ id: 'd1', type: 'date', text: 'Today' }, { id: 'm1', type: 'text', text: 'Vikram, is the Farmhouse Interior ready for final walkthrough?', sent: true, time: '10:30 AM', status: 'read' }, { id: 'm2', type: 'text', text: 'Final walkthrough done!', sent: false, sender: 'Vikram Singh', senderColor: '#9333EA', time: '11:00 AM' }],
  neha:   [{ id: 'd1', type: 'date', text: 'Today' }, { id: 'm1', type: 'text', text: 'Neha, Studio Apartment handover docs ready?', sent: true, time: '10:00 AM', status: 'read' }, { id: 'm2', type: 'text', text: 'Handover documents ready.', sent: false, sender: 'Neha Kapoor', senderColor: '#16A34A', time: '10:30 AM' }],
};

/* ═══════════════════════════════════════════
   POLL MESSAGE
═══════════════════════════════════════════ */
const PollMessage = ({ poll, isDark }) => (
  <div style={{ background: isDark ? '#1a3a2e' : '#fff', borderRadius: 10, padding: '10px 12px', border: `1px solid ${isDark ? '#2a4a3a' : '#e5e7eb'}`, minWidth: 220, maxWidth: 280 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
      <BarChartOutlined style={{ color: '#059669', fontSize: 14 }} />
      <span style={{ fontWeight: 700, fontSize: 13, color: isDark ? '#f0f0f0' : '#1f1f1f', letterSpacing: 0.5 }}>{poll.title}</span>
    </div>
    {poll.options.map((opt, i) => (
      <div key={i} style={{ marginBottom: i < poll.options.length - 1 ? 10 : 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#d0d0d0' : '#374151' }}>{opt.label}</span>
          <span style={{ fontSize: 11, color: '#6b7280' }}>{opt.votes} ({opt.pct}%)</span>
        </div>
        <div style={{ height: 4, borderRadius: 4, background: isDark ? '#2a2a2a' : '#e5e7eb', overflow: 'hidden', marginBottom: 5 }}>
          <div style={{ height: '100%', width: `${opt.pct}%`, borderRadius: 4, background: '#F59E0B' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {opt.voters.map((v, vi) => (
            <div key={vi} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Avatar size={18} style={{ background: v.color, fontSize: 9, fontWeight: 700 }}>{v.initials}</Avatar>
              <span style={{ fontSize: 10, color: '#9ca3af' }}>{v.name}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   MESSAGE BUBBLE
═══════════════════════════════════════════ */
const MessageBubble = ({ msg, isDark, userInitials, userColor }) => {
  if (msg.type === 'date') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <span style={{ background: 'rgba(255,255,255,0.88)', borderRadius: 20, padding: '3px 12px', fontSize: 11, color: '#6b7280', fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
          {msg.text}
        </span>
      </div>
    );
  }
  if (msg.type === 'system') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <span style={{
          background: 'rgba(255, 214, 100, 0.35)',
          border: '1px solid rgba(177,150,37,0.3)',
          borderRadius: 20, padding: '3px 14px',
          fontSize: 11.5, color: '#7a6010', fontWeight: 500,
        }}>
          {msg.text}
        </span>
      </div>
    );
  }

  const isSent = msg.sent;
  const bubbleBg = isSent ? (isDark ? '#025144' : '#d9fdd3') : (isDark ? '#202c33' : '#ffffff');

  return (
    <div style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start', marginBottom: 4, paddingLeft: isSent ? 48 : 0, paddingRight: isSent ? 0 : 48 }}>
      {!isSent && (
        <Avatar size={28} style={{ background: msg.senderColor || '#888', fontSize: 11, fontWeight: 700, marginRight: 6, flexShrink: 0, alignSelf: 'flex-end' }}>
          {msg.sender?.charAt(0) || '?'}
        </Avatar>
      )}
      <div style={{ maxWidth: '65%' }}>
        {!isSent && msg.sender && (
          <div style={{ fontSize: 11, fontWeight: 600, color: msg.senderColor || '#888', marginBottom: 2, paddingLeft: 2 }}>{msg.sender}</div>
        )}
        <div style={{ background: bubbleBg, borderRadius: isSent ? '12px 2px 12px 12px' : '2px 12px 12px 12px', padding: msg.type === 'poll' ? '8px 10px 10px' : '7px 10px 6px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          {msg.type === 'poll'
            ? <PollMessage poll={msg.poll} isDark={isDark} />
            : <span style={{ fontSize: 13.5, color: isDark ? '#e9edef' : '#1f1f1f', lineHeight: 1.4 }}>{msg.text}</span>
          }
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 3 }}>
            <span style={{ fontSize: 10, color: isDark ? '#8696a0' : '#999' }}>{msg.time}</span>
            {isSent && <span style={{ fontSize: 12, color: msg.status === 'read' ? '#53bdeb' : '#8696a0' }}>✓✓</span>}
          </div>
        </div>
      </div>
      {isSent && (
        <Avatar size={28} style={{ background: userColor || '#B19625', fontSize: 11, fontWeight: 700, marginLeft: 6, flexShrink: 0, alignSelf: 'flex-end' }}>
          {userInitials || 'SA'}
        </Avatar>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   ATTACHMENT MENU
═══════════════════════════════════════════ */
const AttachmentMenu = ({ isDark }) => (
  <div style={{ position: 'absolute', bottom: 68, left: 12, background: isDark ? '#1f1f1f' : '#fff', borderRadius: 14, padding: '8px 0', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 10, minWidth: 200 }}>
    {[
      { icon: <FileTextOutlined />, label: 'Document', color: '#6366F1' },
      { icon: <PictureOutlined />, label: 'Photos & videos', color: '#8B5CF6' },
      { icon: <AudioOutlined />, label: 'Audio', color: '#F59E0B' },
    ].map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: isDark ? '#e9edef' : '#1f1f1f' }}
        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f5f5'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>{item.icon}</div>
        {item.label}
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   CONVERSATION ITEM
═══════════════════════════════════════════ */
const ConversationItem = ({ conv, isActive, onClick, isDark }) => (
  <div
    onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderRadius: 10, background: isActive ? 'linear-gradient(135deg, #B19625 0%, #C4A840 100%)' : 'transparent', transition: 'background 0.18s', marginBottom: 2 }}
    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f5f3eb'; }}
    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
  >
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <Avatar size={42} style={{ background: conv.color, fontWeight: 700, fontSize: conv.initials?.length > 1 ? 13 : 16, color: '#fff' }}>{conv.initials}</Avatar>
      {conv.online && (
        <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#52C41A', border: `2px solid ${isActive ? '#C4A840' : (isDark ? '#111b21' : '#fff')}` }} />
      )}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <span style={{ fontWeight: 700, fontSize: 13.5, color: isActive ? '#fff' : (isDark ? '#e9edef' : '#1f1f1f'), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{conv.name}</span>
        <span style={{ fontSize: 10.5, color: isActive ? 'rgba(255,255,255,0.75)' : '#999', flexShrink: 0, marginLeft: 4 }}>{conv.time}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: isActive ? 'rgba(255,255,255,0.8)' : (isDark ? '#8696a0' : '#888'), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{conv.lastMsg}</span>
        {conv.unread > 0 && !isActive && (
          <div style={{ minWidth: 18, height: 18, borderRadius: 9, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0, paddingInline: 4 }}>{conv.unread}</div>
        )}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   GROUP SETTINGS DRAWER
═══════════════════════════════════════════ */
const GroupSettingsDrawer = ({ open, onClose, conversation, onUpdateGroup, onDeleteGroup, isDark }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [groupName, setGroupName] = useState(conversation?.name || '');
  const [addSearch, setAddSearch] = useState('');
  const [addSelected, setAddSelected] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setGroupName(conversation?.name || '');
      setActiveTab('profile');
      setAddSearch('');
      setAddSelected([]);
      setConfirmDelete(false);
    }
  }, [open, conversation?.id]);

  if (!conversation) return null;

  const currentMembers = (conversation.members || []).map(m => ({ ...MEMBER_MAP[m.id], role: m.role })).filter(Boolean);
  const memberCount = currentMembers.length;
  const currentMemberIds = new Set(currentMembers.map(m => m.id));

  const availableToAdd = [CURRENT_USER, ...ALL_MEMBERS].filter(m =>
    !currentMemberIds.has(m.id) &&
    (m.name.toLowerCase().includes(addSearch.toLowerCase()) ||
     m.email.toLowerCase().includes(addSearch.toLowerCase()) ||
     m.code.toLowerCase().includes(addSearch.toLowerCase()))
  );

  const toggleRole = (memberId) => {
    const updated = conversation.members.map(m =>
      m.id === memberId ? { ...m, role: m.role === 'admin' ? 'member' : 'admin' } : m
    );
    onUpdateGroup(conversation.id, { members: updated });
  };

  const removeMember = (memberId) => {
    const updated = conversation.members.filter(m => m.id !== memberId);
    onUpdateGroup(conversation.id, { members: updated });
  };

  const handleAddMembers = () => {
    if (!addSelected.length) return;
    const newMembers = addSelected.map(id => ({ id, role: 'member' }));
    const updated = [...(conversation.members || []), ...newMembers];
    const names = addSelected.map(id => MEMBER_MAP[id]?.name).filter(Boolean).join(', ');
    onUpdateGroup(conversation.id, {
      members: updated,
      systemMsg: `Super Admin added ${names}`,
    });
    setAddSelected([]);
    setActiveTab('members');
  };

  const handleDeleteGroup = () => {
    onDeleteGroup(conversation.id);
    onClose();
  };

  const sectionBg = isDark ? '#1f1f1f' : '#fff';
  const borderC = isDark ? '#2a2a2a' : '#e5e7eb';
  const textPrimary = isDark ? '#e9edef' : '#111827';
  const textSecondary = '#9ca3af';
  const inputStyle = { borderRadius: 8, fontSize: 13, height: 42, background: isDark ? '#1a1a1a' : '#fff', border: `1px solid ${isDark ? '#333' : '#d1d5db'}`, color: textPrimary };

  const tabs = [
    {
      key: 'profile',
      label: <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600 }}><SettingOutlined />Profile</span>,
      children: (
        <div style={{ padding: '24px 24px 20px' }}>
          {/* Avatar + description row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 24 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                size={80}
                style={{ background: isDark ? '#374151' : '#9ca3af', fontWeight: 800, fontSize: conversation.initials?.length > 1 ? 24 : 30, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {conversation.initials?.charAt(0)}
              </Avatar>
              <div style={{
                position: 'absolute', bottom: 2, right: -2,
                background: 'linear-gradient(135deg, #B19625, #C4A840)',
                borderRadius: 6, padding: '2px 8px',
                fontSize: 11, fontWeight: 700, color: '#fff',
                cursor: 'pointer', boxShadow: '0 2px 6px rgba(177,150,37,0.4)',
              }}>
                Edit
              </div>
            </div>
            <p style={{ fontSize: 13, color: textSecondary, margin: 0, lineHeight: 1.6, paddingTop: 2 }}>
              Update the group photo (optional). Square images work best.
            </p>
          </div>
          {/* Name input */}
          <label style={{ fontSize: 13.5, fontWeight: 600, color: textPrimary, display: 'block', marginBottom: 8 }}>Group name</label>
          <Input
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            style={{ ...inputStyle, fontSize: 14 }}
          />
          <Button
            onClick={() => { if (groupName.trim()) onUpdateGroup(conversation.id, { name: groupName.trim() }); }}
            disabled={!groupName.trim() || groupName.trim() === conversation.name}
            style={{
              marginTop: 16, height: 40, borderRadius: 8, fontWeight: 700, fontSize: 13, paddingInline: 24,
              background: (groupName.trim() && groupName.trim() !== conversation.name) ? 'linear-gradient(135deg, #B19625, #C4A840)' : (isDark ? '#2a2a2a' : '#e0c97a'),
              color: (groupName.trim() && groupName.trim() !== conversation.name) ? '#fff' : (isDark ? '#555' : '#7a5e00'),
              border: 'none',
            }}
          >
            Save name
          </Button>
        </div>
      ),
    },
    {
      key: 'members',
      label: <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600 }}><TeamOutlined />Members</span>,
      children: (
        <div style={{ overflowY: 'auto', padding: '16px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: textSecondary, marginBottom: 12 }}>{memberCount} members</div>
          {currentMembers.map((member) => (
            <div key={member.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', marginBottom: 8,
              border: `1px solid ${borderC}`, borderRadius: 10,
              background: sectionBg,
              boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <Avatar size={42} style={{ background: member.color, fontWeight: 700, fontSize: member.initials?.length > 1 ? 13 : 16, color: '#fff', flexShrink: 0 }}>
                {member.initials}
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: textPrimary }}>{member.name}</div>
                <div style={{ fontSize: 11.5, color: textSecondary, marginTop: 1 }}>
                  {member.code}&nbsp;&nbsp;{member.email}
                </div>
                {member.role === 'admin' ? (
                  <span style={{ fontSize: 11, color: '#B19625', fontWeight: 600, background: '#B1962518', borderRadius: 20, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 10 }}>⭐</span> Group admin
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: textSecondary, display: 'block', marginTop: 3 }}>Member</span>
                )}
              </div>
              {member.id !== 'current' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span onClick={() => toggleRole(member.id)} style={{ fontSize: 12, color: '#B19625', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {member.role === 'admin' ? 'Make member' : 'Make admin'}
                  </span>
                  <span onClick={() => removeMember(member.id)} style={{ fontSize: 12, color: '#EF4444', cursor: 'pointer', fontWeight: 600 }}>
                    Remove
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'add',
      label: <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600 }}><UserAddOutlined />Add people</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 220px)' }}>
          {/* Fixed top section */}
          <div style={{ padding: '16px 20px 10px', flexShrink: 0 }}>
            <p style={{ fontSize: 12.5, color: textSecondary, margin: '0 0 10px', lineHeight: 1.6 }}>
              People already in this group are hidden here. Search by name, email, or employee code.
            </p>
            <Input
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Search to add..."
              value={addSearch}
              onChange={e => setAddSearch(e.target.value)}
              style={{ ...inputStyle, height: 38 }}
            />
          </div>
          {/* Scrollable list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 8px' }}>
            {availableToAdd.map(member => (
              <div
                key={member.id}
                onClick={() => setAddSelected(prev => prev.includes(member.id) ? prev.filter(x => x !== member.id) : [...prev, member.id])}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', marginBottom: 8,
                  border: `1px solid ${addSelected.includes(member.id) ? '#B19625' : borderC}`,
                  borderRadius: 10, cursor: 'pointer',
                  background: addSelected.includes(member.id) ? (isDark ? '#1a2a1a' : '#fefce8') : sectionBg,
                  transition: 'all 0.15s',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => { if (!addSelected.includes(member.id)) e.currentTarget.style.background = isDark ? '#1f2a1f' : '#f9fafb'; }}
                onMouseLeave={e => { e.currentTarget.style.background = addSelected.includes(member.id) ? (isDark ? '#1a2a1a' : '#fefce8') : sectionBg; }}
              >
                <Checkbox checked={addSelected.includes(member.id)} onChange={() => {}} style={{ flexShrink: 0 }} />
                <Avatar size={38} style={{ background: isDark ? '#374151' : '#6b7280', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                  {member.initials?.charAt(0)}
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>{member.name}</div>
                  <div style={{ fontSize: 11.5, color: textSecondary }}>
                    {member.code}&nbsp;&nbsp;{member.email}
                  </div>
                </div>
              </div>
            ))}
            {availableToAdd.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 16px', color: textSecondary, fontSize: 13 }}>
                No more people to add
              </div>
            )}
          </div>
          {/* Sticky footer button */}
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${borderC}`, background: sectionBg, flexShrink: 0 }}>
            <Button
              block disabled={!addSelected.length}
              onClick={handleAddMembers}
              style={{
                height: 44, borderRadius: 8, fontWeight: 700, fontSize: 13,
                background: addSelected.length ? 'linear-gradient(135deg, #B19625, #C4A840)' : (isDark ? '#2a2a2a' : '#e5d98a'),
                color: addSelected.length ? '#fff' : (isDark ? '#555' : '#8a6c00'),
                border: 'none', opacity: addSelected.length ? 1 : 0.7,
              }}
            >
              Add members{addSelected.length > 0 ? ` (${addSelected.length})` : ''}
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'danger',
      label: <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: '#EF4444' }}><DeleteOutlined />Danger</span>,
      children: (
        <div style={{ padding: '20px' }}>
          <div style={{ borderRadius: 10, border: '1px solid #FCA5A5', background: isDark ? '#2a1a1a' : '#FFF5F5', padding: '18px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#EF4444', marginBottom: 6 }}>Delete this group</div>
            <p style={{ fontSize: 13, color: isDark ? '#fca5a5' : '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
              Permanently deletes the group, its messages, and member list. This cannot be undone.
            </p>
            {!confirmDelete ? (
              <Button
                block
                onClick={() => setConfirmDelete(true)}
                style={{ height: 42, borderRadius: 8, fontWeight: 700, fontSize: 13, background: '#EF4444', color: '#fff', border: 'none' }}
              >
                Delete group
              </Button>
            ) : (
              <div>
                <p style={{ fontSize: 12.5, color: '#EF4444', fontWeight: 600, marginBottom: 10 }}>Are you sure? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button onClick={() => setConfirmDelete(false)} style={{ flex: 1, borderRadius: 8, height: 38 }}>Cancel</Button>
                  <Button onClick={handleDeleteGroup} style={{ flex: 1, borderRadius: 8, height: 38, background: '#EF4444', color: '#fff', border: 'none', fontWeight: 700 }}>Yes, Delete</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={480}
      closable={false}
      styles={{ body: { padding: 0, background: isDark ? '#141414' : '#fff', display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      {/* Header — fixed */}
      <div style={{ padding: '18px 24px 14px', background: sectionBg, borderBottom: `1px solid ${borderC}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: textPrimary }}>Group settings</span>
          <CloseOutlined onClick={onClose} style={{ fontSize: 14, color: textSecondary, cursor: 'pointer' }} />
        </div>
        <p style={{ fontSize: 12.5, color: textSecondary, margin: 0 }}>
          Profile, members, and permissions — same actions as before, organized in tabs.
        </p>
      </div>

      {/* Tabs — fill remaining height, content scrolls inside */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabs}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          tabBarStyle={{ padding: '0 24px', marginBottom: 0, background: sectionBg, borderBottom: `1px solid ${borderC}`, flexShrink: 0 }}
          tabBarGutter={16}
        />
      </div>
    </Drawer>
  );
};

/* ═══════════════════════════════════════════
   CREATE GROUP DRAWER
═══════════════════════════════════════════ */
const CreateGroupDrawer = ({ open, onClose, onCreateGroup, isDark }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [groupName, setGroupName] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const filteredMembers = ALL_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.code.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleCreate = () => {
    if (!groupName.trim()) return;
    const members = ALL_MEMBERS.filter(m => selectedMembers.includes(m.id));
    onCreateGroup(groupName.trim(), members);
    setGroupName(''); setSelectedMembers([]); setMemberSearch(''); setActiveTab('details');
    onClose();
  };

  const borderC = isDark ? '#333' : '#d1d5db';
  const inputStyle = { borderRadius: 8, fontSize: 13, height: 42, background: isDark ? '#1f1f1f' : '#fff', border: `1px solid ${borderC}` };
  const sectionBg = isDark ? '#1f1f1f' : '#fff';

  const tabs = [
    {
      key: 'details',
      label: <span style={{ fontWeight: 600, fontSize: 13 }}>Details</span>,
      children: (
        <div style={{ padding: '20px 20px 0' }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: isDark ? '#ccc' : '#374151', marginBottom: 6, display: 'block' }}>Group name</label>
          <Input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="e.g. Project Alpha" style={inputStyle} onPressEnter={() => groupName.trim() && setActiveTab('members')} />
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>Next, open the Members tab to search and select people.</p>
        </div>
      ),
    },
    {
      key: 'members',
      label: <span style={{ fontWeight: 600, fontSize: 13 }}>Members ({selectedMembers.length})</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 20px 8px' }}>
            <Input prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} placeholder="Search by name, email, or employee code..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} style={{ ...inputStyle, height: 38 }} />
          </div>
          <div>
            {filteredMembers.map(member => (
              <div key={member.id}
                onClick={() => setSelectedMembers(prev => prev.includes(member.id) ? prev.filter(x => x !== member.id) : [...prev, member.id])}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', cursor: 'pointer', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#f3f4f6'}`, background: selectedMembers.includes(member.id) ? (isDark ? '#1a2a1a' : '#fefce8') : sectionBg, transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!selectedMembers.includes(member.id)) e.currentTarget.style.background = isDark ? '#1f1f1f' : '#f9fafb'; }}
                onMouseLeave={e => { e.currentTarget.style.background = selectedMembers.includes(member.id) ? (isDark ? '#1a2a1a' : '#fefce8') : sectionBg; }}
              >
                <Checkbox checked={selectedMembers.includes(member.id)} onChange={() => {}} style={{ flexShrink: 0 }} />
                <Avatar size={36} style={{ background: member.color, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{member.initials}</Avatar>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: isDark ? '#e9edef' : '#1f1f1f' }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{member.code}&nbsp;&nbsp;{member.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Drawer open={open} onClose={() => { onClose(); setGroupName(''); setSelectedMembers([]); setMemberSearch(''); setActiveTab('details'); }} placement="right" width={420} closable={false}
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', background: isDark ? '#141414' : '#f9fafb' } }}
    >
      <div style={{ padding: '18px 20px 12px', background: sectionBg, borderBottom: `1px solid ${borderC}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 17, color: isDark ? '#e9edef' : '#111827' }}>Create group</span>
          <CloseOutlined onClick={onClose} style={{ fontSize: 14, color: '#9ca3af', cursor: 'pointer' }} />
        </div>
        <p style={{ fontSize: 12.5, color: '#9ca3af', margin: 0 }}>Choose a name, then pick people to add.</p>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs} tabBarStyle={{ padding: '0 20px', marginBottom: 0, background: sectionBg, borderBottom: `1px solid ${borderC}` }} tabBarGutter={24} />
      </div>
      <div style={{ padding: '14px 20px', background: sectionBg, borderTop: `1px solid ${borderC}` }}>
        <Button block disabled={!groupName.trim()} onClick={handleCreate}
          style={{ height: 44, borderRadius: 10, fontWeight: 700, fontSize: 14, background: groupName.trim() ? 'linear-gradient(135deg, #B19625, #C4A840)' : (isDark ? '#2a2a2a' : '#e5e7eb'), color: groupName.trim() ? '#fff' : (isDark ? '#555' : '#aaa'), border: 'none' }}
        >
          Create group
        </Button>
      </div>
    </Drawer>
  );
};

/* ═══════════════════════════════════════════
   CHAT SETTINGS DRAWER
═══════════════════════════════════════════ */
const ChatSettingsDrawer = ({ open, onClose, isDark }) => {
  const [retentionDays, setRetentionDays] = useState(30);
  const [alertDays, setAlertDays] = useState(7);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const borderC = isDark ? '#333' : '#d1d5db';
  const sectionBg = isDark ? '#1f1f1f' : '#fff';

  return (
    <Drawer open={open} onClose={onClose} placement="right" width={420} closable={false}
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', background: isDark ? '#141414' : '#f9fafb' } }}
    >
      <div style={{ padding: '18px 20px 12px', background: sectionBg, borderBottom: `1px solid ${borderC}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 17, color: isDark ? '#e9edef' : '#111827' }}>Chat settings</span>
          <CloseOutlined onClick={onClose} style={{ fontSize: 14, color: '#9ca3af', cursor: 'pointer' }} />
        </div>
        <p style={{ fontSize: 12.5, color: '#9ca3af', margin: 0 }}>Message retention and deletion alerts for your company.</p>
      </div>
      <div style={{ flex: 1, padding: '24px 20px' }}>
        <div style={{ borderRadius: 12, background: sectionBg, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: isDark ? '#ccc' : '#374151', marginBottom: 6, display: 'block' }}>Retention days</label>
            <InputNumber value={retentionDays} onChange={setRetentionDays} min={1} max={365} style={{ width: '100%', borderRadius: 8, fontSize: 13, height: 42 }} controls={false} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: isDark ? '#ccc' : '#374151', marginBottom: 6, display: 'block' }}>Alert days before deletion</label>
            <InputNumber value={alertDays} onChange={setAlertDays} min={1} max={retentionDays} style={{ width: '100%', borderRadius: 8, fontSize: 13, height: 42 }} controls={false} />
          </div>
          <div onClick={() => setAlertEnabled(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <Checkbox checked={alertEnabled} onChange={e => setAlertEnabled(e.target.checked)} />
            <span style={{ fontSize: 13, fontWeight: 500, color: isDark ? '#e9edef' : '#374151' }}>Enable deletion alerts</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 20px', background: sectionBg, borderTop: `1px solid ${borderC}` }}>
        <Button block onClick={onClose} style={{ height: 44, borderRadius: 10, fontWeight: 700, fontSize: 14, background: 'linear-gradient(135deg, #B19625, #C4A840)', color: '#fff', border: 'none' }}>
          Save settings
        </Button>
      </div>
    </Drawer>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
const MessagesPage = () => {
  const isMobile = useIsMobile();
  const theme = useAppSelector(s => s.ui.theme);
  const user = useAppSelector(s => s.auth.user);
  const isDark = theme === 'dark';

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeId, setActiveId] = useState('rahul');
  const [showChat, setShowChat] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [inputText, setInputText] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [chatSearchText, setChatSearchText] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatSearchRef = useRef(null);

  const userInitials = user?.avatar || 'SA';
  const userColor = '#B19625';

  const activeConv = conversations.find(c => c.id === activeId);
  const activeMessages = messages[activeId] || [];
  const isGroup = activeConv?.type === 'group' || activeConv?.type === 'broadcast';
  const memberCount = activeConv?.members?.length || 0;

  const filteredConvs = conversations.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Unread') return matchSearch && c.unread > 0;
    if (filter === 'Groups') return matchSearch && (c.type === 'group' || c.type === 'broadcast');
    return matchSearch;
  });

  const groupConvs = conversations.filter(c => c.type === 'group' || c.type === 'broadcast');

  const displayMessages = chatSearchText.trim()
    ? activeMessages.filter(m => m.type === 'text' && m.text?.toLowerCase().includes(chatSearchText.toLowerCase()))
    : activeMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeMessages.length]);

  useEffect(() => {
    if (showChatSearch) setTimeout(() => chatSearchRef.current?.focus(), 50);
  }, [showChatSearch]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg = { id: `msg-${Date.now()}`, type: 'text', text, sent: true, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), status: 'sent' };
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), newMsg] }));
    setConversations(prev => prev.map(c => c.id === activeId ? { ...c, lastMsg: text, time: newMsg.time } : c));
    setInputText('');
    inputRef.current?.focus();
  };

  const handleSelectConv = (id) => {
    setActiveId(id);
    setShowAttach(false);
    setShowChatSearch(false);
    setChatSearchText('');
    if (isMobile) setShowChat(true);
  };

  const handleCreateGroup = (name, members) => {
    const id = `group-${Date.now()}`;
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const colors = ['#7C3AED', '#0891B2', '#DB2777', '#059669', '#DC2626'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newMembers = [{ id: 'current', role: 'admin' }, ...members.map(m => ({ id: m.id, role: 'member' }))];
    const systemMsg = members.length ? `Super Admin added ${members.map(m => m.name).join(', ')}` : 'Group created';
    setConversations(prev => [{ id, type: 'group', name, initials, color, lastMsg: systemMsg, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), unread: 0, members: newMembers }, ...prev]);
    setMessages(prev => ({ ...prev, [id]: [{ id: 'd1', type: 'date', text: 'Today' }, { id: 'm1', type: 'system', text: systemMsg }] }));
    handleSelectConv(id);
  };

  const handleUpdateGroup = (id, updates) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, ...(updates.name ? { name: updates.name } : {}), ...(updates.members ? { members: updates.members } : {}) } : c));
    if (updates.systemMsg) {
      setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), { id: `sys-${Date.now()}`, type: 'system', text: updates.systemMsg }] }));
    }
  };

  const handleDeleteGroup = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setMessages(prev => { const next = { ...prev }; delete next[id]; return next; });
    const remaining = conversations.filter(c => c.id !== id);
    if (remaining.length > 0) setActiveId(remaining[0].id);
    else setActiveId(null);
    if (isMobile) setShowChat(false);
  };

  const negMargin = isMobile ? '-16px -12px' : '-24px -28px';
  const panelHeight = 'calc(100vh - 64px)';
  const leftBg = isDark ? '#111b21' : '#ffffff';
  const borderColor = isDark ? '#2a373f' : '#e9edef';

  /* ── LEFT PANEL ── */
  const leftPanel = (
    <div style={{ width: isMobile ? '100%' : 300, minWidth: isMobile ? undefined : 300, height: panelHeight, display: 'flex', flexDirection: 'column', background: leftBg, borderRight: `1px solid ${borderColor}`, flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: isDark ? '#e9edef' : '#1f1f1f' }}>Chat</span>
          <span onClick={() => setShowCreateGroup(true)} style={{ fontSize: 12, fontWeight: 600, color: '#B19625', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>New Group</span>
          <span onClick={() => handleSelectConv('broadcast')} style={{ fontSize: 12, fontWeight: 600, color: '#B19625', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Broadcast</span>
        </div>
        <Tooltip title="Chat settings">
          <SettingOutlined onClick={() => setShowChatSettings(true)} style={{ fontSize: 16, color: isDark ? '#8696a0' : '#888', cursor: 'pointer' }} />
        </Tooltip>
      </div>
      {/* Search */}
      <div style={{ padding: '10px 12px 8px' }}>
        <Input prefix={<SearchOutlined style={{ color: '#999', fontSize: 13 }} />} placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ borderRadius: 20, fontSize: 13, background: isDark ? '#202c33' : '#f0f2f5', border: `1px solid ${isDark ? '#2a373f' : 'transparent'}` }} variant="outlined" />
      </div>
      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '0 12px 10px' }}>
        {['All', 'Unread', 'Groups'].map(tab => (
          <div key={tab} onClick={() => setFilter(tab)} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: filter === tab ? (isDark ? '#2a3942' : '#fff') : 'transparent', color: filter === tab ? (isDark ? '#e9edef' : '#1f1f1f') : (isDark ? '#8696a0' : '#888'), boxShadow: filter === tab ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', border: filter === tab ? `1px solid ${isDark ? '#3a4a52' : '#e0e0e0'}` : '1px solid transparent' }}>{tab}</div>
        ))}
      </div>
      {/* Conversations */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {filter === 'Groups' && groupConvs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <UsergroupAddOutlined style={{ fontSize: 36, color: '#B19625', marginBottom: 10 }} />
            <div style={{ fontWeight: 600, fontSize: 14, color: isDark ? '#e9edef' : '#374151', marginBottom: 6 }}>No groups yet</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>Create a group to collaborate with your team</div>
            <Button onClick={() => setShowCreateGroup(true)} icon={<PlusOutlined />} style={{ borderRadius: 8, fontWeight: 600, fontSize: 13, background: 'linear-gradient(135deg, #B19625, #C4A840)', color: '#fff', border: 'none' }}>Create group</Button>
          </div>
        ) : filteredConvs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: '#999', fontSize: 13 }}>No conversations found</div>
        ) : filteredConvs.map(conv => (
          <ConversationItem key={conv.id} conv={conv} isActive={conv.id === activeId && (!isMobile || showChat)} onClick={() => handleSelectConv(conv.id)} isDark={isDark} />
        ))}
      </div>
    </div>
  );

  /* ── RIGHT PANEL ── */
  const chatBg = isDark ? '#0b141a' : '#eae6df';
  const rightPanel = (
    <div style={{ flex: 1, height: panelHeight, display: 'flex', flexDirection: 'column', background: chatBg, position: 'relative', overflow: 'hidden' }}>
      {/* Chat Header */}
      <div style={{ flexShrink: 0, zIndex: 2, background: isDark ? '#202c33' : '#f0f2f5', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px 0 16px' }}>
          {isMobile && <ArrowLeftOutlined style={{ fontSize: 17, color: isDark ? '#aaa' : '#555', marginRight: 2, cursor: 'pointer' }} onClick={() => setShowChat(false)} />}

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar size={36} style={{ background: activeConv?.color || '#B19625', fontWeight: 700, fontSize: activeConv?.initials?.length > 1 ? 12 : 15, color: '#fff' }}>
              {activeConv?.initials || '?'}
            </Avatar>
            {activeConv?.online && !isGroup && (
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#52C41A', border: `2px solid ${isDark ? '#202c33' : '#f0f2f5'}` }} />
            )}
          </div>

          {/* Name + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: isDark ? '#e9edef' : '#1f1f1f', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeConv?.name || ''}
            </div>
            <div style={{ fontSize: 11, color: isGroup ? '#9ca3af' : (activeConv?.online ? '#52C41A' : '#9ca3af') }}>
              {isGroup ? `${memberCount} member${memberCount !== 1 ? 's' : ''}` : (activeConv?.online ? 'Online' : 'Offline')}
            </div>
          </div>

          {/* Right icons — search expands inline */}
          {showChatSearch ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, maxWidth: 320 }}>
              <Input
                ref={chatSearchRef}
                prefix={<SearchOutlined style={{ color: '#9ca3af', fontSize: 13 }} />}
                placeholder="Search messages..."
                value={chatSearchText}
                onChange={e => setChatSearchText(e.target.value)}
                style={{ borderRadius: 20, fontSize: 13, height: 34, background: isDark ? '#2a3942' : '#fff', border: `1px solid ${isDark ? '#3a4a52' : '#d1d5db'}` }}
              />
              <CloseOutlined
                onClick={() => { setShowChatSearch(false); setChatSearchText(''); }}
                style={{ fontSize: 14, color: isDark ? '#8696a0' : '#666', cursor: 'pointer', flexShrink: 0 }}
              />
              <SettingOutlined
                onClick={e => { e.stopPropagation(); isGroup ? setShowGroupSettings(true) : setShowChatSettings(true); }}
                style={{ fontSize: 17, color: isDark ? '#8696a0' : '#555', cursor: 'pointer', flexShrink: 0 }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <SearchOutlined
                onClick={e => { e.stopPropagation(); setShowChatSearch(true); }}
                style={{ fontSize: 17, color: isDark ? '#8696a0' : '#555', cursor: 'pointer' }}
              />
              <SettingOutlined
                onClick={e => { e.stopPropagation(); isGroup ? setShowGroupSettings(true) : setShowChatSettings(true); }}
                style={{ fontSize: 17, color: isDark ? '#8696a0' : '#555', cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', backgroundImage: 'url(/whatsapp.jpg)', backgroundRepeat: 'repeat', backgroundPosition: 'center' }}
        onClick={() => setShowAttach(false)}
      >
        {displayMessages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} isDark={isDark} userInitials={userInitials} userColor={userColor} />
        ))}
        {chatSearchText && displayMessages.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <span style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: '#6b7280' }}>
              No messages match "{chatSearchText}"
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Menu */}
      {showAttach && <AttachmentMenu isDark={isDark} />}

      {/* Input Bar */}
      <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: isDark ? '#202c33' : '#f0f2f5', borderTop: `1px solid ${borderColor}`, flexShrink: 0, zIndex: 2, position: 'relative' }}>
        <div onClick={e => { e.stopPropagation(); setShowAttach(v => !v); }}
          style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: showAttach ? '#B19625' : (isDark ? '#8696a0' : '#888'), fontSize: 18 }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? '#2a3942' : '#e0e0e0'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <PaperClipOutlined />
        </div>
        <Input ref={inputRef} value={inputText} onChange={e => setInputText(e.target.value)} onPressEnter={handleSend} placeholder="Type a message..."
          style={{ flex: 1, borderRadius: 24, fontSize: 13.5, height: 40, background: isDark ? '#2a3942' : '#ffffff', border: `1px solid ${isDark ? '#3a4a52' : 'transparent'}`, paddingLeft: 16, paddingRight: 16 }}
        />
        <div onClick={handleSend}
          style={{ width: 38, height: 38, borderRadius: '50%', background: inputText.trim() ? 'linear-gradient(135deg, #B19625, #C4A840)' : (isDark ? '#2a3942' : '#e0e0e0'), display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputText.trim() ? 'pointer' : 'default', color: inputText.trim() ? '#fff' : (isDark ? '#8696a0' : '#aaa'), fontSize: 16, transition: 'all 0.2s', flexShrink: 0 }}
        >
          {inputText.trim() ? <SendOutlined /> : <AudioOutlined />}
        </div>
      </div>
    </div>
  );

  const emptyState = (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#0b141a' : '#f0f2f5' }}>
      <div style={{ textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>Select a conversation</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Choose from your existing conversations</div>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ margin: negMargin, display: 'flex', height: panelHeight, overflow: 'hidden' }} onClick={() => setShowAttach(false)}>
        {isMobile ? (showChat ? rightPanel : leftPanel) : (<>{leftPanel}{activeId ? rightPanel : emptyState}</>)}
      </div>

      <CreateGroupDrawer open={showCreateGroup} onClose={() => setShowCreateGroup(false)} onCreateGroup={handleCreateGroup} isDark={isDark} />
      <ChatSettingsDrawer open={showChatSettings} onClose={() => setShowChatSettings(false)} isDark={isDark} />
      <GroupSettingsDrawer
        open={showGroupSettings}
        onClose={() => setShowGroupSettings(false)}
        conversation={activeConv}
        onUpdateGroup={handleUpdateGroup}
        onDeleteGroup={handleDeleteGroup}
        isDark={isDark}
      />
    </>
  );
};

export default MessagesPage;
