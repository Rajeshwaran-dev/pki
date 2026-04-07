import { useState } from 'react';
import dayjs from 'dayjs';
import {
  Button, Modal, Drawer, Form, Input, Select, DatePicker, TimePicker, Space, Typography,
  Card, Tag, Avatar, Row, Col, message, Segmented, Dropdown,
} from 'antd';
import {
  PlusOutlined, UnorderedListOutlined, AppstoreOutlined,
  ClockCircleOutlined, UserOutlined, MessageOutlined,
  CheckSquareOutlined, OrderedListOutlined, FileTextOutlined, ArrowLeftOutlined, MoreOutlined,
} from '@ant-design/icons';
import {
  DndContext, closestCorners, DragOverlay,
  PointerSensor, useSensor, useSensors,
  useDroppable, rectIntersection,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppSelector, useAppDispatch } from '@/store';
import { addTask, updateTask, removeTask, moveTask, setViewMode } from '@/store/slices/taskSlice';
import { taskStatuses, priorities } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';
import useIsMobile from '@/hooks/useIsMobile';

const statusColors = {
  'Created': '#1677FF',
  'In Progress': '#0ea5e9',
  'Completed': '#52C41A',
  'Approved': '#52C41A',
  'On Hold': '#FAAD14',
  'Rejected': '#FF4D4F',
  'Discarded': '#FF4D4F',
};

const getMoreMenuItems = (type) => (
  type === 'task'
    ? [
        { key: 'start', label: 'Start' },
        { key: 'hold', label: 'Hold' },
        { key: 'discard', label: 'Discard' },
        { key: 'complete', label: 'Complete' },
        { key: 'subtask', label: 'Add Subtask' },
        { key: 'edit', label: 'Edit' },
        { key: 'delete', label: 'Delete' },
      ]
    : [
        { key: 'view', label: 'View Details' },
        { key: 'edit', label: 'Edit' },
        { key: 'approve', label: 'Approve' },
        { key: 'delete', label: 'Delete' },
      ]
);

const mockRequests = [
  { id: 'r1', title: 'Request for payment', clientName: 'Kamalesh', projectName: 'DR.KAMALESH', projectCode: 'P-103', assignee: 'Anantha Narayana', createdDate: '07 Apr, 10:47 AM', dueDate: '08 Apr, 00:00 AM', status: 'Approved' },
  { id: 'r2', title: 'Payment from client', clientName: 'Kamalesh', projectName: 'DR.KAMALESH', projectCode: 'P-103', assignee: 'Madhu Loganathan', createdDate: '03 Apr, 15:24 PM', dueDate: '04 Apr, 00:00 AM', status: 'Approved' },
  { id: 'r3', title: 'Petty Cash', clientName: 'Ananth', projectName: 'SRIDHAR', projectCode: 'P-102', assignee: 'Anantha Narayana', createdDate: '01 Apr, 11:53 AM', dueDate: '02 Apr, 00:00 AM', status: 'Approved' },
];

const requestStatuses = ['Created', 'Approved', 'Rejected', 'On Hold', 'Discarded'];
const darkPanelBg = '#0d3554';
const darkSurfaceBg = '#0a2235';
const darkBorder = '#1a4d72';

/* ── Task Card (Kanban) ── */
const TaskCard = ({ task, overlay, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (overlay) {
    return (
      <Card
        size="small"
        hoverable
        style={{
          borderRadius: 12, marginBottom: 10, cursor: 'grabbing',
          borderLeft: `3px solid ${statusColors[task.status] || '#ccc'}`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          transform: 'scale(1.05)',
          zIndex: 1000,
        }}
        styles={{ body: { padding: '12px 14px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{task.title}</div>
          <Tag color={statusColors[task.status] || '#ccc'} style={{ borderRadius: 10, fontSize: 10 }}>
            {task.status}
          </Tag>
        </div>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 10 }}>{task.projectName} · {task.clientName}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StatusTag value={task.priority} type="priority" />
          <Space size={8}>
            <span style={{ fontSize: 11, color: '#bbb' }}>
              <ClockCircleOutlined /> {task.dueDate}{task.dueTime ? ` • ${task.dueTime}` : ''}
            </span>
            <Avatar size={20} style={{ background: '#D69F6D', fontSize: 10 }}>{task.assignee?.charAt(0) || 'A'}</Avatar>
          </Space>
        </div>
      </Card>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        hoverable
        style={{
          borderRadius: 12, marginBottom: 10, cursor: isDragging ? 'grabbing' : 'grab',
          borderLeft: `3px solid ${statusColors[task.status] || '#ccc'}`,
          opacity: isDragging ? 0.5 : 1,
        }}
        styles={{ body: { padding: '12px 14px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{task.title}</div>
          <Tag color={statusColors[task.status] || '#ccc'} style={{ borderRadius: 10, fontSize: 10 }}>
            {task.status}
          </Tag>
        </div>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 10 }}>{task.projectName} · {task.clientName}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StatusTag value={task.priority} type="priority" />
          <Space size={8}>
            <span style={{ fontSize: 11, color: '#bbb' }}>
              <ClockCircleOutlined /> {task.dueDate}{task.dueTime ? ` • ${task.dueTime}` : ''}
            </span>
            <Avatar size={20} style={{ background: '#D69F6D', fontSize: 10 }}>{task.assignee?.charAt(0) || 'A'}</Avatar>
          </Space>
        </div>
        {onEdit && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
            <Button type="text" size="small" onClick={e => { e.stopPropagation(); onEdit(task); }}>
              Edit
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

/* ── Kanban Column ── */
const KanbanColumn = ({ status, tasks, children, isDark }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const taskIds = tasks.map(t => t.id);
  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{
        minWidth: 260, flex: '1 0 260px', borderRadius: 14, padding: 14,
        background: isOver ? (isDark ? '#133d5e' : '#e8f4fd') : (isDark ? darkSurfaceBg : '#f9f9f9'), minHeight: 200,
        border: isDark ? `1px solid ${darkBorder}` : 'none',
        borderTop: `3px solid ${statusColors[status] || '#ccc'}`,
        transition: 'background 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 2px' }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>{status}</span>
        <span style={{
          background: `${statusColors[status]}20`, color: statusColors[status],
          borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '2px 8px',
        }}>
          {tasks.length}
        </span>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#999', fontSize: 12 }}>
          Drop tasks here
        </div>
      )}
    </div>
  );
};

/* ── Request Card ── */
const RequestCard = ({ request, overlay, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: request.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (overlay) {
    return (
      <Card size="small" hoverable style={{ borderRadius: 12, marginBottom: 10, cursor: 'grabbing', boxShadow: '0 12px 32px rgba(0,0,0,0.2)', transform: 'scale(1.05)', zIndex: 1000 }} styles={{ body: { padding: '14px 16px' } }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{request.title}</div>
        <a style={{ color: '#1677FF', fontSize: 12, fontWeight: 500 }}>{request.projectName}</a>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}> ({request.projectCode})</Typography.Text>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginTop: 12 }}>
          {[['Client', request.clientName], ['Assignee', request.assignee], ['Created', request.createdDate], ['Due', request.dueDate]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: '#bbb' }}>{label}</div>
              <div style={{ fontSize: 12 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10, paddingTop: 8, borderTop: '1px solid #f5f5f5' }}>
          <Space size={8}>
            <span style={{ fontSize: 11, color: '#bbb' }}><ClockCircleOutlined /> 00:00:00</span>
            <Tag color={statusColors[request.status]} style={{ borderRadius: 10, fontSize: 10 }}>{request.status}</Tag>
          </Space>
          {onEdit && (
            <Button type="text" size="small" onClick={e => { e.stopPropagation(); onEdit(request); }}>
              Edit
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card size="small" hoverable style={{ borderRadius: 12, marginBottom: 10, cursor: isDragging ? 'grabbing' : 'grab', opacity: isDragging ? 0.5 : 1 }} styles={{ body: { padding: '14px 16px' } }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{request.title}</div>
        <a style={{ color: '#1677FF', fontSize: 12, fontWeight: 500 }}>{request.projectName}</a>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}> ({request.projectCode})</Typography.Text>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginTop: 12 }}>
          {[['Client', request.clientName], ['Assignee', request.assignee], ['Created', request.createdDate], ['Due', request.dueDate]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: '#bbb' }}>{label}</div>
              <div style={{ fontSize: 12 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10, paddingTop: 8, borderTop: '1px solid #f5f5f5' }}>
          <Space size={8}>
            <span style={{ fontSize: 11, color: '#bbb' }}><ClockCircleOutlined /> 00:00:00</span>
            <Tag color={statusColors[request.status]} style={{ borderRadius: 10, fontSize: 10 }}>{request.status}</Tag>
          </Space>
          {onEdit && (
            <Button type="text" size="small" onClick={e => { e.stopPropagation(); onEdit(request); }}>
              Edit
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

/* ── Detail Panel (shared for task and request) ── */
const DetailPanel = ({ item, type = 'task', onClose, onEdit, showBack, isDark }) => (
  <div>
    <Card style={{ borderRadius: 14, border: isDark ? `1px solid ${darkBorder}` : 'none', marginBottom: 16, background: isDark ? darkPanelBg : undefined }} styles={{ body: { padding: '20px 24px' } }}>
      {showBack && (
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onClose} style={{ marginBottom: 10, padding: 0, color: isDark ? '#5ab5e8' : '#D69F6D' }}>
          Back to list
        </Button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Space size={8} wrap>
            <Typography.Title level={5} style={{ margin: 0 }}>{item.title}</Typography.Title>
            <Tag style={{ borderRadius: 10 }}>{type === 'task' ? item.type : 'Request'}</Tag>
          </Space>
          <div style={{ marginTop: 4 }}>
            <a style={{ color: '#1677FF', fontSize: 13 }}>{item.projectName}</a>
            {item.projectCode && <Typography.Text type="secondary" style={{ fontSize: 12 }}> ({item.projectCode})</Typography.Text>}
          </div>
        </div>
        <Space wrap>
          {type === 'task' && (
            <Button type="default" icon={<PlusOutlined />} ghost style={{ borderRadius: 8 }} onClick={() => onEdit?.(item)}>
              Edit
            </Button>
          )}
          <Dropdown
            menu={{ items: getMoreMenuItems(type), onClick: ({ key }) => handleMoreAction(key, item, type) }}
            trigger={['click']}
          >
            <Button type="default" icon={<MoreOutlined />} ghost style={{ borderRadius: 8 }} />
          </Dropdown>
          <Button type="primary" icon={<CheckSquareOutlined />} ghost style={{ borderRadius: 8 }}>
            {type === 'task' ? 'Mark Completed' : 'Approve'}
          </Button>
          <Tag color={statusColors[item.status]} style={{ borderRadius: 10 }}>{item.status}</Tag>
        </Space>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px', padding: '16px 0', borderTop: `1px solid ${isDark ? darkBorder : '#f5f5f5'}`, borderBottom: `1px solid ${isDark ? darkBorder : '#f5f5f5'}` }}>
        {[
          ['Stage', <Tag color={statusColors[item.status]} style={{ borderRadius: 10 }}>{item.status}</Tag>],
          ['Assignee', item.assignee],
          ['Due Date', item.dueDate],
          ['Time Spent', '00:00:00'],
        ].map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 11, color: '#bbb', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px', padding: '16px 0' }}>
        {[
          ['Client Name', item.clientName],
          ['Created', item.createdDate],
          ['Created By', 'Admin'],
          [type === 'task' ? 'Completed' : 'Project', type === 'task' ? (item.status === 'Completed' ? item.dueDate : 'N/A') : item.projectName],
        ].map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 11, color: '#bbb', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{val}</div>
          </div>
        ))}
      </div>

      {item.description && (
        <div style={{ marginTop: 8, padding: '12px 16px', background: isDark ? darkSurfaceBg : '#fafafa', borderRadius: 10, border: isDark ? `1px solid ${darkBorder}` : 'none' }}>
          <div style={{ fontSize: 11, color: '#bbb', marginBottom: 4 }}>Description</div>
          <div style={{ fontSize: 13 }}>{item.description}</div>
        </div>
      )}
    </Card>

    <Card style={{ borderRadius: 14, border: isDark ? `1px solid ${darkBorder}` : 'none', background: isDark ? darkPanelBg : undefined }} styles={{ body: { padding: '20px 24px' } }}>
      <Typography.Title level={5} style={{ margin: '0 0 14px' }}>
        Comments (0)
        <Button type="link" size="small" style={{ fontSize: 12, color: '#1677FF', marginLeft: 8 }}>Hide</Button>
      </Typography.Title>
      <Input.TextArea rows={2} placeholder="Add a comment…" style={{ borderRadius: 10, marginBottom: 16 }} />
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <MessageOutlined style={{ fontSize: 36, color: '#e0e0e0' }} />
        <div style={{ marginTop: 8, color: '#bbb', fontSize: 13 }}>No comments yet</div>
      </div>
    </Card>
  </div>
);

/* ── List Item Card ── */
const ListItemCard = ({ item, type = 'task', isSelected, isDark, onClick, onEdit, onMore }) => (
  <Card
    size="small"
    hoverable
    onClick={onClick}
    style={{
      borderRadius: 12, marginBottom: 8, cursor: 'pointer',
      borderLeft: `3px solid ${statusColors[item.status] || '#ccc'}`,
      background: isSelected ? (isDark ? 'rgba(90,181,232,0.12)' : 'rgba(214,159,109,0.12)') : undefined,
      outline: isSelected ? `2px solid ${isDark ? '#5ab5e8' : '#D69F6D'}` : 'none',
      transition: 'all 0.2s ease',
    }}
    styles={{ body: { padding: '12px 14px' } }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontWeight: 600, fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.title}
      </span>
      <Tag color={statusColors[item.status]} style={{ borderRadius: 10, fontSize: 10, marginLeft: 8, flexShrink: 0 }}>{item.status}</Tag>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 11, color: '#999' }}>
        <UserOutlined style={{ marginRight: 4 }} />{item.assignee}
      </span>
      <span style={{ fontSize: 11, color: '#bbb' }}>
        <ClockCircleOutlined style={{ marginRight: 3 }} />{item.dueDate}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
      <a style={{ color: '#1677FF', fontSize: 11 }}>{item.projectName}</a>
      <Space size={8}>
        <Dropdown
          menu={{ items: getMoreMenuItems(type), onClick: ({ key }) => onMore?.(key, item) }}
          trigger={['click']}
        >
          <Button type="text" size="small" icon={<MoreOutlined />} onClick={e => e.stopPropagation()} />
        </Dropdown>
        {onEdit && (
          <Button type="text" size="small" onClick={e => { e.stopPropagation(); onEdit(item); }}>
            Edit
          </Button>
        )}
      </Space>
    </div>
  </Card>
);

/* ── Main Page ── */
const TasksPage = () => {
  const dispatch = useAppDispatch();
  const { tasks, viewMode } = useAppSelector(s => s.tasks);
  const projects = useAppSelector(s => s.projects.projects);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [requests, setRequests] = useState(mockRequests);
  const [activeRequest, setActiveRequest] = useState(null);
  const [form] = Form.useForm();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event) => {
    if (activeTab === 'tasks') {
      const task = tasks.find(t => t.id === event.active.id);
      if (task) setActiveTask(task);
    } else {
      const request = requests.find(r => r.id === event.active.id);
      if (request) setActiveRequest(request);
    }
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    setActiveRequest(null);
    const { active, over } = event;
    if (!over) return;

    if (activeTab === 'tasks') {
      const activeTaskData = tasks.find(t => t.id === active.id);
      if (!activeTaskData) return;

      const overTaskData = tasks.find(t => t.id === over.id);
      if (overTaskData && activeTaskData.status !== overTaskData.status) {
        dispatch(moveTask({ taskId: activeTaskData.id, newStatus: overTaskData.status }));
        return;
      }

      const overStatus = taskStatuses.includes(over.id) ? over.id : null;
      if (overStatus && activeTaskData.status !== overStatus) {
        dispatch(moveTask({ taskId: activeTaskData.id, newStatus: overStatus }));
      }
    } else {
      const activeRequestData = requests.find(r => r.id === active.id);
      if (!activeRequestData) return;

      const overRequestData = requests.find(r => r.id === over.id);
      if (overRequestData && activeRequestData.status !== overRequestData.status) {
        setRequests(prev => prev.map(r => r.id === activeRequestData.id ? { ...r, status: overRequestData.status } : r));
        return;
      }

      const overStatus = requestStatuses.includes(over.id) ? over.id : null;
      if (overStatus && activeRequestData.status !== overStatus) {
        setRequests(prev => prev.map(r => r.id === activeRequestData.id ? { ...r, status: overStatus } : r));
      }
    }
  };

  const resetModal = () => {
    setModalOpen(false);
    setEditingTask(null);
    form.resetFields();
  };

  const resetRequestModal = () => {
    setRequestModalOpen(false);
    setEditingRequest(null);
    form.resetFields();
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setRequestModalOpen(false);
    setModalOpen(true);
    form.setFieldsValue({
      title: task.title,
      type: task.type,
      priority: task.priority,
      status: task.status,
      projectName: task.projectName,
      clientName: task.clientName,
      assignee: task.assignee,
      cc: task.cc,
      dueDate: task.dueDate ? dayjs(task.dueDate, 'YYYY-MM-DD') : null,
      dueTime: task.dueTime ? dayjs(task.dueTime, 'hh:mm A') : null,
      description: task.description,
    });
  };

  const openEditRequestModal = (request) => {
    setEditingRequest(request);
    setModalOpen(false);
    setRequestModalOpen(true);
    form.setFieldsValue({
      title: request.title,
      type: request.type,
      priority: request.priority,
      status: request.status,
      projectName: request.projectName,
      clientName: request.clientName,
      assignee: request.assignee,
      cc: request.cc,
      dueDate: request.dueDate ? dayjs(request.dueDate, 'YYYY-MM-DD') : null,
      dueTime: request.dueTime ? dayjs(request.dueTime, 'hh:mm A') : null,
      description: request.description,
    });
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const payload = {
        id: editingTask ? editingTask.id : Date.now().toString(),
        createdDate: editingTask ? editingTask.createdDate : new Date().toISOString().split('T')[0],
        title: values.title,
        type: values.type,
        priority: values.priority,
        status: values.status || 'Created',
        projectName: values.projectName,
        clientName: values.clientName || '',
        assignee: values.assignee,
        cc: values.cc || '',
        dueDate: values.dueDate?.format('YYYY-MM-DD') || '',
        dueTime: values.dueTime?.format('hh:mm A') || '',
        description: values.description || '',
      };

      if (editingTask) {
        dispatch(updateTask(payload));
        message.success('Task updated!');
      } else {
        dispatch(addTask(payload));
        message.success('Task created!');
      }

      resetModal();
    });
  };

  const handleSaveRequest = () => {
    form.validateFields().then(values => {
      const payload = {
        id: editingRequest ? editingRequest.id : Date.now().toString(),
        createdDate: editingRequest ? editingRequest.createdDate : new Date().toISOString().split('T')[0],
        title: values.title,
        type: values.type,
        priority: values.priority,
        status: values.status || 'Created',
        projectName: values.projectName,
        clientName: values.clientName || '',
        assignee: values.assignee,
        cc: values.cc || '',
        dueDate: values.dueDate?.format('YYYY-MM-DD') || '',
        dueTime: values.dueTime?.format('hh:mm A') || '',
        description: values.description || '',
      };

      if (editingRequest) {
        setRequests(prev => prev.map(r => r.id === payload.id ? payload : r));
        message.success('Request updated!');
      } else {
        setRequests(prev => [payload, ...prev]);
        message.success('Request created!');
      }

      resetRequestModal();
    });
  };

  const requestsByStatus = (status) => requests.filter(r => r.status === status);

  const handleMoreAction = (action, item, type) => {
    if (type === 'task') {
      if (action === 'edit') {
        openEditTaskModal(item);
        return;
      }
      if (action === 'complete') {
        const payload = { ...item, status: 'Completed' };
        dispatch(updateTask(payload));
        if (selectedTask?.id === item.id) setSelectedTask(payload);
        message.success('Task marked complete');
        return;
      }
      if (action === 'start') {
        const payload = { ...item, status: 'In Progress' };
        dispatch(updateTask(payload));
        if (selectedTask?.id === item.id) setSelectedTask(payload);
        message.success('Task started');
        return;
      }
      if (action === 'hold') {
        const payload = { ...item, status: 'On Hold' };
        dispatch(updateTask(payload));
        if (selectedTask?.id === item.id) setSelectedTask(payload);
        message.success('Task put on hold');
        return;
      }
      if (action === 'discard') {
        const payload = { ...item, status: 'Discarded' };
        dispatch(updateTask(payload));
        if (selectedTask?.id === item.id) setSelectedTask(payload);
        message.success('Task discarded');
        return;
      }
      if (action === 'subtask') {
        message.info('Add Subtask selected — implement subtask flow later');
        return;
      }
      if (action === 'delete') {
        dispatch(removeTask(item.id));
        if (selectedTask?.id === item.id) setSelectedTask(null);
        message.success('Task deleted');
        return;
      }
      setSelectedTask(item);
      return;
    }

    if (action === 'edit') {
      openEditRequestModal(item);
      return;
    }
    if (action === 'approve') {
      setRequests(prev => prev.map(r => r.id === item.id ? { ...r, status: 'Approved' } : r));
      if (selectedRequest?.id === item.id) setSelectedRequest(prev => prev ? { ...prev, status: 'Approved' } : prev);
      message.success('Request approved');
      return;
    }
    if (action === 'delete') {
      setRequests(prev => prev.filter(r => r.id !== item.id));
      if (selectedRequest?.id === item.id) setSelectedRequest(null);
      message.success('Request deleted');
      return;
    }
    setSelectedRequest(item);
  };

  return (
    <div>
      <PageHeader
        title="Tasks & Requests"
        subtitle={`${tasks.length} tasks · ${requests.length} requests`}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Segmented
              value={viewMode}
              onChange={val => dispatch(setViewMode(val))}
              options={[
                { value: 'board', icon: <AppstoreOutlined /> },
                { value: 'list', icon: <UnorderedListOutlined /> },
              ]}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                if (activeTab === 'tasks') {
                  setEditingTask(null);
                  setModalOpen(true);
                } else {
                  setEditingRequest(null);
                  setRequestModalOpen(true);
                }
              }}
              style={{ background: primaryColor, border: 'none' }}
            >
              {!isMobile && (activeTab === 'tasks' ? 'Add Task' : 'Add Request')}
            </Button>
          </div>
        }
      />

      {/* Tab Bar */}
      <div style={{ background: isDark ? darkPanelBg : 'white', borderRadius: 14, padding: '12px 16px', marginBottom: 16, boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)', border: isDark ? `1px solid ${darkBorder}` : 'none' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {[
            { key: 'tasks', label: `All Tasks (${tasks.length})`, icon: <OrderedListOutlined /> },
            { key: 'requests', label: `All Requests (${requests.length})`, icon: <FileTextOutlined /> },
          ].map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedTask(null); setSelectedRequest(null); }}
                className="settings-pill-tab"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 24,
                  border: isActive ? `2px solid ${primaryColor}` : '2px solid transparent',
                  background: isActive ? (isDark ? 'rgba(90,181,232,0.18)' : 'rgba(214,159,109,0.12)') : (isDark ? darkSurfaceBg : '#f7f7f7'),
                  color: isActive ? primaryColor : (isDark ? '#a8b0ba' : '#666'),
                  fontWeight: isActive ? 700 : 400,
                  fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks Board */}
      {activeTab === 'tasks' && viewMode === 'board' && (
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, WebkitOverflowScrolling: 'touch' }}>
            {taskStatuses.map(status => {
              const filtered = tasks.filter(t => t.status === status);
              return (
                <KanbanColumn key={status} status={status} tasks={filtered} isDark={isDark}>
                  {filtered.map(task => <TaskCard key={task.id} task={task} onEdit={openEditTaskModal} />)}
                </KanbanColumn>
              );
            })}
          </div>
          <DragOverlay>{activeTask ? <TaskCard task={activeTask} overlay /> : null}</DragOverlay>
        </DndContext>
      )}

      {/* Tasks List */}
      {activeTab === 'tasks' && viewMode === 'list' && (
        <div className="animate-fade-in">
          {!isMobile ? (
            <div style={{ display: 'flex', background: isDark ? darkPanelBg : 'white', borderRadius: 14, boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', minHeight: 500, maxHeight: 'calc(100vh - 240px)', border: isDark ? `1px solid ${darkBorder}` : 'none' }}>
              <div style={{ width: selectedTask ? '37%' : '100%', minWidth: 280, overflowY: 'auto', padding: '16px 12px', transition: 'width 0.3s ease', borderRight: selectedTask ? `1px solid ${isDark ? darkBorder : '#f0f0f0'}` : 'none' }}>
                <Input prefix={<UserOutlined />} placeholder="Search tasks…" allowClear style={{ marginBottom: 12, borderRadius: 10 }} />
                {tasks.map(task => (
                  <ListItemCard
                    key={task.id}
                    item={task}
                    type="task"
                    isSelected={selectedTask?.id === task.id}
                    isDark={isDark}
                    onClick={() => setSelectedTask(task)}
                    onEdit={openEditTaskModal}
                    onMore={(action, item) => handleMoreAction(action, item, 'task')}
                  />
                ))}
              </div>
              {selectedTask && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  <DetailPanel item={selectedTask} type="task" onClose={() => setSelectedTask(null)} onEdit={openEditTaskModal} showBack isDark={isDark} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <Input prefix={<UserOutlined />} placeholder="Search tasks…" allowClear style={{ marginBottom: 12, borderRadius: 10 }} />
              {tasks.map(task => (
                <ListItemCard
                  key={task.id}
                  item={task}
                  type="task"
                  isSelected={false}
                  isDark={isDark}
                  onClick={() => setSelectedTask(task)}
                  onEdit={openEditTaskModal}
                  onMore={(action, item) => handleMoreAction(action, item, 'task')}
                />
              ))}
              <Drawer title={selectedTask?.title} open={!!selectedTask} onClose={() => setSelectedTask(null)} placement="bottom" styles={{ body: { padding: 12 }, wrapper: { height: '90%' } }}>
                {selectedTask && <DetailPanel item={selectedTask} type="task" onClose={() => setSelectedTask(null)} onEdit={openEditTaskModal} showBack isDark={isDark} />}
              </Drawer>
            </div>
          )}
        </div>
      )}

      {/* Requests Board */}
      {activeTab === 'requests' && viewMode === 'board' && (
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="animate-fade-in" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
            {requestStatuses.map(status => {
              const items = requestsByStatus(status);
              return (
                <KanbanColumn key={status} status={status} tasks={items} isDark={isDark}>
                  <SortableContext items={items.map(r => r.id)} strategy={verticalListSortingStrategy}>
                    {items.map(req => <RequestCard key={req.id} request={req} onEdit={openEditRequestModal} />)}
                  </SortableContext>
                </KanbanColumn>
              );
            })}
          </div>
          <DragOverlay>{activeRequest ? <RequestCard request={activeRequest} overlay /> : null}</DragOverlay>
        </DndContext>
      )}

      {/* Requests List */}
      {activeTab === 'requests' && viewMode === 'list' && (
        <div className="animate-fade-in">
          {!isMobile ? (
            <div style={{ display: 'flex', background: isDark ? darkPanelBg : 'white', borderRadius: 14, boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', minHeight: 500, maxHeight: 'calc(100vh - 240px)', border: isDark ? `1px solid ${darkBorder}` : 'none' }}>
              <div style={{ width: selectedRequest ? '37%' : '100%', minWidth: 280, overflowY: 'auto', padding: '16px 12px', transition: 'width 0.3s ease', borderRight: selectedRequest ? `1px solid ${isDark ? darkBorder : '#f0f0f0'}` : 'none' }}>
                <Input prefix={<UserOutlined />} placeholder="Search requests…" allowClear style={{ marginBottom: 12, borderRadius: 10 }} />
                {requests.map(req => (
                  <ListItemCard
                    key={req.id}
                    item={req}
                    type="request"
                    isSelected={selectedRequest?.id === req.id}
                    isDark={isDark}
                    onClick={() => setSelectedRequest(req)}
                    onEdit={openEditRequestModal}
                    onMore={(action, item) => handleMoreAction(action, item, 'request')}
                  />
                ))}
              </div>
              {selectedRequest && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  <DetailPanel item={selectedRequest} type="request" onClose={() => setSelectedRequest(null)} onEdit={openEditRequestModal} showBack isDark={isDark} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <Input prefix={<UserOutlined />} placeholder="Search requests…" allowClear style={{ marginBottom: 12, borderRadius: 10 }} />
              {requests.map(req => (
                <ListItemCard
                  key={req.id}
                  item={req}
                  type="request"
                  isSelected={false}
                  isDark={isDark}
                  onClick={() => setSelectedRequest(req)}
                  onEdit={openEditRequestModal}
                  onMore={(action, item) => handleMoreAction(action, item, 'request')}
                />
              ))}
              <Drawer title={selectedRequest?.title} open={!!selectedRequest} onClose={() => setSelectedRequest(null)} placement="bottom" styles={{ body: { padding: 12 }, wrapper: { height: '90%' } }}>
                {selectedRequest && <DetailPanel item={selectedRequest} type="request" onClose={() => setSelectedRequest(null)} onEdit={openEditRequestModal} showBack isDark={isDark} />}
              </Drawer>
            </div>
          )}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>{editingTask ? 'Edit Task' : 'New Task'}</span>}
        open={modalOpen}
        onCancel={resetModal}
        onOk={handleSave}
        okText={editingTask ? 'Update Task' : 'Submit'}
        okButtonProps={{ style: { background: '#0B2B44', border: 'none' } }}
        width={isMobile ? '95%' : 620}
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Type is required' }]}> 
                <Select placeholder="Select type" options={['Design', 'Site Visit', 'Meeting', 'Procurement', 'Review', 'Finance'].map(t => ({ value: t, label: t }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Priority is required' }]}> 
                <Select placeholder="Select priority" options={priorities.map(p => ({ value: p, label: p }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="projectName" label="Project" rules={[{ required: true, message: 'Project is required' }]}> 
                <Select placeholder="Select project" options={projects.map(p => ({ value: p.projectName, label: p.projectName }))} showSearch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}> 
                <Input placeholder="Task title" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="Assigned To" rules={[{ required: true, message: 'Assignee is required' }]}> 
                <Input placeholder="Assignee name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cc" label="CC">
                <Input placeholder="CC email or name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Due date is required' }]}> 
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dueTime" label="Due Time" rules={[{ required: true, message: 'Due time is required' }]}> 
                <TimePicker style={{ width: '100%' }} format="hh:mm A" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}> 
                <Select placeholder="Select status" options={taskStatuses.map(s => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="clientName" label="Client"> 
                <Input placeholder="Client name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Task description…" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<span style={{ fontWeight: 700 }}>{editingRequest ? 'Edit Request' : 'New Request'}</span>}
        open={requestModalOpen}
        onCancel={resetRequestModal}
        onOk={handleSaveRequest}
        okText={editingRequest ? 'Update Request' : 'Submit'}
        okButtonProps={{ style: { background: '#0B2B44', border: 'none' } }}
        width={isMobile ? '95%' : 620}
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Type is required' }]}> 
                <Select placeholder="Select type" options={['Request', 'Payment', 'Approval', 'Followup', 'Issue'].map(t => ({ value: t, label: t }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}> 
                <Select placeholder="Select status" options={requestStatuses.map(s => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="projectName" label="Project" rules={[{ required: true, message: 'Project is required' }]}> 
                <Select placeholder="Select project" options={projects.map(p => ({ value: p.projectName, label: p.projectName }))} showSearch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}> 
                <Input placeholder="Request title" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="Assigned To" rules={[{ required: true, message: 'Assignee is required' }]}> 
                <Input placeholder="Assignee name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cc" label="CC">
                <Input placeholder="CC email or name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Due date is required' }]}> 
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dueTime" label="Due Time" rules={[{ required: true, message: 'Due time is required' }]}> 
                <TimePicker style={{ width: '100%' }} format="hh:mm A" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="clientName" label="Client"> 
                <Input placeholder="Client name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Priority">
                <Select placeholder="Select priority" options={priorities.map(p => ({ value: p, label: p }))} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Request description…" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TasksPage;
