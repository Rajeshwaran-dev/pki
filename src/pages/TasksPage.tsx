import React, { useState } from 'react';
import { Button, Modal, Drawer, Form, Input, Select, DatePicker, Space, Typography, Card, Tag, Avatar, message, Segmented, Table } from 'antd';
import {
  PlusOutlined, UnorderedListOutlined, AppstoreOutlined,
  ClockCircleOutlined, UserOutlined, MessageOutlined, CheckSquareOutlined,
  OrderedListOutlined, FileTextOutlined, ArrowLeftOutlined,
} from '@ant-design/icons';
import {
  DndContext, closestCorners, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppSelector, useAppDispatch } from '@/store';
import { addTask, moveTask, setViewMode } from '@/store/slices/taskSlice';
import { Task, TaskStatus, taskStatuses, priorities } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';
import useIsMobile from '@/hooks/useIsMobile';

const statusColors: Record<string, string> = {
  'Created': '#1677FF',
  'In Progress': '#B19625',
  'Completed': '#52C41A',
  'Approved': '#52C41A',
  'On Hold': '#FAAD14',
  'Rejected': '#FF4D4F',
  'Discarded': '#FF4D4F',
};

/* ========== Request Types ========== */
interface Request {
  id: string;
  title: string;
  clientName: string;
  projectName: string;
  projectCode: string;
  assignee: string;
  createdDate: string;
  dueDate: string;
  status: 'Created' | 'Approved' | 'Rejected' | 'On Hold' | 'Discarded';
}

const requestStatuses = ['Created', 'Approved', 'Rejected', 'On Hold', 'Discarded'] as const;

const mockRequests: Request[] = [
  { id: 'r1', title: 'Request for payment', clientName: 'Kamalesh', projectName: 'DR.KAMALESH', projectCode: 'P-103', assignee: 'Anantha Narayana', createdDate: '07 Apr, 10:47 AM', dueDate: '08 Apr, 00:00 AM', status: 'Approved' },
  { id: 'r2', title: 'Payment from client', clientName: 'Kamalesh', projectName: 'DR.KAMALESH', projectCode: 'P-103', assignee: 'Madhu Loganathan', createdDate: '03 Apr, 15:24 PM', dueDate: '04 Apr, 00:00 AM', status: 'Approved' },
  { id: 'r3', title: 'Petty Cash', clientName: 'Ananth', projectName: 'SRIDHAR', projectCode: 'P-102', assignee: 'Anantha Narayana', createdDate: '01 Apr, 11:53 AM', dueDate: '02 Apr, 00:00 AM', status: 'Approved' },
];

/* ========== Task Card ========== */
const TaskCard: React.FC<{ task: Task; overlay?: boolean }> = ({ task, overlay }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        style={{
          borderRadius: 10, marginBottom: 10, cursor: 'grab',
          borderLeft: `3px solid ${statusColors[task.status]}`,
          ...(overlay ? { boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transform: 'rotate(2deg)' } : {}),
        }}
        hoverable
        styles={{ body: { padding: '12px 14px' } }}
      >
        <Typography.Text strong style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>{task.title}</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>{task.projectName} • {task.clientName}</Typography.Text>
        <div className="flex items-center justify-between">
          <StatusTag value={task.priority} type="priority" />
          <Space size={8}>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}><ClockCircleOutlined /> {task.dueDate}</Typography.Text>
            <Avatar size={20} style={{ backgroundColor: '#B19625', fontSize: 10 }}>{task.assignee.charAt(0)}</Avatar>
          </Space>
        </div>
      </Card>
    </div>
  );
};

/* ========== Kanban Column ========== */
const KanbanColumn: React.FC<{ status: string; tasks: { id: string }[]; children: React.ReactNode }> = ({ status, tasks, children }) => {
  const taskIds = tasks.map(t => t.id);
  return (
    <div className="kanban-column" style={{
      minWidth: 260, flex: '1 0 260px', borderRadius: 12, padding: 12,
      background: 'hsl(var(--muted) / 0.5)', height: 'fit-content', minHeight: 200,
      borderTop: `3px solid ${statusColors[status] || '#ccc'}`,
    }}>
      <div className="flex items-center justify-between mb-3 px-1">
        <Typography.Text strong style={{ fontSize: 13 }}>{status}</Typography.Text>
        <Tag style={{ borderRadius: 8, fontSize: 11 }}>{tasks.length}</Tag>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {tasks.length === 0 && (
        <div className="text-center py-6"><Typography.Text type="secondary" style={{ fontSize: 12 }}>No tasks</Typography.Text></div>
      )}
    </div>
  );
};

/* ========== Request Card ========== */
const RequestCard: React.FC<{ request: Request }> = ({ request }) => (
  <Card
    size="small"
    style={{ borderRadius: 10, marginBottom: 10 }}
    hoverable
    styles={{ body: { padding: '14px 16px' } }}
  >
    <Typography.Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>{request.title}</Typography.Text>
    <a style={{ color: 'hsl(var(--info))', fontSize: 12, fontWeight: 500 }}>{request.projectName}</a>
    <Typography.Text type="secondary" style={{ fontSize: 11 }}> ({request.projectCode})</Typography.Text>

    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
      <div>
        <Typography.Text type="secondary" style={{ fontSize: 10 }}>Client</Typography.Text>
        <div style={{ fontSize: 12 }}><UserOutlined style={{ fontSize: 10, marginRight: 4 }} />{request.clientName}</div>
      </div>
      <div>
        <Typography.Text type="secondary" style={{ fontSize: 10 }}>Assignee</Typography.Text>
        <div style={{ fontSize: 12 }}><UserOutlined style={{ fontSize: 10, marginRight: 4 }} />{request.assignee}</div>
      </div>
      <div className="mt-1">
        <Typography.Text type="secondary" style={{ fontSize: 10 }}>Created date</Typography.Text>
        <div style={{ fontSize: 11 }}>{request.createdDate}</div>
      </div>
      <div className="mt-1">
        <Typography.Text type="secondary" style={{ fontSize: 10 }}>Due date</Typography.Text>
        <div style={{ fontSize: 11 }}>{request.dueDate}</div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid hsl(var(--border))' }}>
      <Typography.Text type="secondary" style={{ fontSize: 11 }}><ClockCircleOutlined /> 00:00:00</Typography.Text>
      <MessageOutlined style={{ color: 'hsl(var(--muted-foreground))', fontSize: 14 }} />
    </div>
  </Card>
);

/* ========== Task Detail Panel ========== */
const TaskDetailPanel: React.FC<{ task: Task; onClose?: () => void; showBack?: boolean }> = ({ task, onClose, showBack }) => (
  <div>
    <Card style={{ borderRadius: 12, border: 'none', marginBottom: 16 }} styles={{ body: { padding: '16px 20px' } }}>
      {showBack && (
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onClose} style={{ marginBottom: 8, padding: 0 }}>Back</Button>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <Space size={8} wrap>
            <Typography.Title level={5} style={{ margin: 0 }}>{task.title}</Typography.Title>
            <Tag style={{ borderRadius: 12 }}>{task.type}</Tag>
          </Space>
          <div className="mt-1">
            <a style={{ color: 'hsl(var(--info))', fontSize: 13 }}>{task.projectName}</a>
          </div>
        </div>
        <Space wrap>
          <Button type="primary" icon={<CheckSquareOutlined />} ghost style={{ borderRadius: 8 }} size="middle">Mark Completed</Button>
          {new Date(task.dueDate) < new Date() && <Tag color="error" style={{ borderRadius: 12 }}>Overdue</Tag>}
        </Space>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4" style={{ borderTop: '1px solid hsl(var(--border))', borderBottom: '1px solid hsl(var(--border))' }}>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>⚑ Stage</Typography.Text>
          <div className="mt-1"><Tag color={statusColors[task.status]} style={{ borderRadius: 12 }}>{task.status}</Tag></div>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>👤 Assignee</Typography.Text>
          <div className="mt-1" style={{ fontSize: 13 }}>{task.assignee}</div>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>📅 Due Date</Typography.Text>
          <div className="mt-1" style={{ fontSize: 13 }}>{task.dueDate}</div>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>⏱ Time Spent</Typography.Text>
          <div className="mt-1" style={{ fontSize: 13 }}>00:00:00</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>👤 Client Name</Typography.Text>
          <div className="mt-1" style={{ fontSize: 13 }}>{task.clientName}</div>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>📅 Created</Typography.Text>
          <div className="mt-1" style={{ fontSize: 13 }}>{task.createdDate}</div>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>👤 Created By</Typography.Text>
          <div className="mt-1" style={{ fontSize: 13 }}>Admin</div>
        </div>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>✅ Completed</Typography.Text>
          <div className="mt-1" style={{ fontSize: 13 }}>{task.status === 'Completed' ? task.dueDate : 'N/A'}</div>
        </div>
      </div>

      {task.description && (
        <div className="mt-2">
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>Description</Typography.Text>
          <div className="mt-1 p-3 rounded-lg" style={{ background: 'hsl(var(--muted))' }}>
            <Typography.Text>{task.description}</Typography.Text>
          </div>
        </div>
      )}
    </Card>

    <Card style={{ borderRadius: 12, border: 'none' }} styles={{ body: { padding: '16px 20px' } }}>
      <Typography.Title level={5} style={{ margin: 0, marginBottom: 12 }}>Comments (0) <a style={{ fontSize: 12, color: 'hsl(var(--info))', marginLeft: 8 }}>Hide</a></Typography.Title>
      <Input.TextArea rows={2} placeholder="Add a comment..." style={{ borderRadius: 8, marginBottom: 16 }} />
      <div className="text-center py-6">
        <MessageOutlined style={{ fontSize: 36, color: 'hsl(var(--muted-foreground))' }} />
        <div className="mt-2"><Typography.Text type="secondary">No comments have been made to this task yet</Typography.Text></div>
      </div>
    </Card>
  </div>
);

/* ========== List Task Card ========== */
const ListTaskCard: React.FC<{ task: Task; isSelected: boolean; onClick: () => void }> = ({ task, isSelected, onClick }) => (
  <Card
    size="small"
    hoverable
    onClick={onClick}
    style={{
      borderRadius: 10, marginBottom: 10, cursor: 'pointer',
      borderLeft: `3px solid ${statusColors[task.status]}`,
      background: isSelected ? 'hsl(var(--primary) / 0.08)' : undefined,
      borderColor: isSelected ? 'hsl(var(--primary))' : undefined,
      borderLeftColor: statusColors[task.status],
    }}
    styles={{ body: { padding: '12px 14px' } }}
  >
    <div className="flex items-center justify-between mb-1 gap-2">
      <Typography.Text strong style={{ fontSize: 13, flex: 1, minWidth: 0 }} ellipsis>{task.title}</Typography.Text>
      <Space size={4} className="flex-shrink-0">
        <Tag style={{ borderRadius: 12, fontSize: 10 }}>{task.type}</Tag>
        {new Date(task.dueDate) < new Date() && <Tag color="error" style={{ borderRadius: 12, fontSize: 10 }}>Overdue</Tag>}
      </Space>
    </div>
    <Tag color="blue" style={{ borderRadius: 12, fontSize: 10, marginBottom: 6 }}>{task.assignee}</Tag>
    <div className="flex items-center justify-between">
      <div>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>Due Date</Typography.Text>
        <div style={{ fontSize: 11 }}>{task.dueDate}</div>
      </div>
      <div className="text-right">
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>Completed On</Typography.Text>
        <div style={{ fontSize: 11 }}>{task.status === 'Completed' ? task.dueDate : 'N/A'}</div>
      </div>
    </div>
    <div className="flex items-center justify-between mt-2">
      <Typography.Text type="secondary" style={{ fontSize: 11 }}><ClockCircleOutlined /> 00:00:00</Typography.Text>
      <Tag color={statusColors[task.status]} style={{ borderRadius: 12, fontSize: 10 }}>{task.status}</Tag>
    </div>
    <a style={{ color: 'hsl(var(--info))', fontSize: 11, marginTop: 4, display: 'block' }}>{task.projectName}</a>
  </Card>
);

/* ========== Main Page ========== */
const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, viewMode } = useAppSelector(s => s.tasks);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'requests'>('tasks');
  const [form] = Form.useForm();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeTaskData = tasks.find(t => t.id === active.id);
    const overTaskData = tasks.find(t => t.id === over.id);
    if (!activeTaskData) return;
    if (overTaskData && activeTaskData.status !== overTaskData.status) {
      dispatch(moveTask({ taskId: activeTaskData.id, newStatus: overTaskData.status }));
    }
  };

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newTask: Task = {
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
        dueDate: values.dueDate?.format('YYYY-MM-DD') || '',
        status: 'Created',
        ...values,
      };
      dispatch(addTask(newTask));
      message.success('Task created successfully');
      setModalOpen(false);
      form.resetFields();
    });
  };

  const requestsByStatus = (status: string) => mockRequests.filter(r => r.status === status);

  return (
    <div>
      {/* Header row - responsive */}
      <PageHeader
        title="Tasks"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Segmented
              value={viewMode}
              onChange={val => dispatch(setViewMode(val as 'board' | 'list'))}
              options={[
                { value: 'board', icon: <AppstoreOutlined /> },
                { value: 'list', icon: <UnorderedListOutlined /> },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              {isMobile ? '' : 'Add Task'}
            </Button>
          </div>
        }
      />

      {/* Tab buttons - horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        {[
          { key: 'tasks' as const, label: 'All Tasks', icon: <OrderedListOutlined /> },
          { key: 'requests' as const, label: `All Requests (${mockRequests.length})`, icon: <FileTextOutlined /> },
        ].map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedTask(null); }}
              className="settings-pill-tab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 24,
                border: isActive ? '2px solid #B19625' : '1px solid hsl(var(--border))',
                background: isActive ? '#B1962510' : 'transparent',
                color: isActive ? '#B19625' : 'inherit',
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* ===== ALL TASKS - BOARD VIEW ===== */}
      {activeTab === 'tasks' && viewMode === 'board' && (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
            {taskStatuses.map(status => {
              const filtered = tasks.filter(t => t.status === status);
              return (
                <KanbanColumn key={status} status={status} tasks={filtered}>
                  {filtered.map(task => <TaskCard key={task.id} task={task} />)}
                </KanbanColumn>
              );
            })}
          </div>
          <DragOverlay>{activeTask ? <TaskCard task={activeTask} overlay /> : null}</DragOverlay>
        </DndContext>
      )}

      {/* ===== ALL TASKS - LIST VIEW ===== */}
      {activeTab === 'tasks' && viewMode === 'list' && (
        <>
          {/* Desktop: split panel */}
          {!isMobile ? (
            <div className="animate-fade-in flex gap-4" style={{ height: 'calc(100vh - 240px)' }}>
              <div style={{ width: selectedTask ? '35%' : '100%', minWidth: 300, overflowY: 'auto', transition: 'width 0.3s ease' }}>
                <Input prefix={<UserOutlined />} placeholder="Search tasks..." allowClear style={{ marginBottom: 12, borderRadius: 8 }} />
                {tasks.map(task => (
                  <ListTaskCard key={task.id} task={task} isSelected={selectedTask?.id === task.id} onClick={() => setSelectedTask(task)} />
                ))}
              </div>
              {selectedTask && (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <TaskDetailPanel task={selectedTask} />
                </div>
              )}
            </div>
          ) : (
            /* Mobile: full-width list, detail opens as Drawer */
            <div className="animate-fade-in">
              <Input prefix={<UserOutlined />} placeholder="Search tasks..." allowClear style={{ marginBottom: 12, borderRadius: 8 }} />
              {tasks.map(task => (
                <ListTaskCard key={task.id} task={task} isSelected={false} onClick={() => setSelectedTask(task)} />
              ))}
              <Drawer
                title={selectedTask?.title || 'Task Detail'}
                open={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                placement="bottom"
                height="90%"
                styles={{ body: { padding: '12px' } }}
              >
                {selectedTask && <TaskDetailPanel task={selectedTask} />}
              </Drawer>
            </div>
          )}
        </>
      )}

      {/* ===== ALL REQUESTS - BOARD VIEW ===== */}
      {activeTab === 'requests' && viewMode === 'board' && (
        <div className="animate-fade-in flex gap-3 overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {requestStatuses.map(status => {
            const items = requestsByStatus(status);
            return (
              <div
                key={status}
                style={{
                  minWidth: 260, flex: '1 0 260px', borderRadius: 12, padding: 12,
                  background: 'hsl(var(--muted) / 0.5)', height: 'fit-content', minHeight: 200,
                  borderTop: `3px solid ${statusColors[status] || '#ccc'}`,
                }}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <Typography.Text strong style={{ fontSize: 13 }}>{status}</Typography.Text>
                  <Tag style={{ borderRadius: 8, fontSize: 11 }}>{items.length}</Tag>
                </div>
                {items.map(req => <RequestCard key={req.id} request={req} />)}
                {items.length === 0 && (
                  <div className="text-center py-6"><Typography.Text type="secondary" style={{ fontSize: 12 }}>No tasks</Typography.Text></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== ALL REQUESTS - LIST VIEW ===== */}
      {activeTab === 'requests' && viewMode === 'list' && (
        <Card style={{ borderRadius: 12, border: 'none' }} className="animate-fade-in">
          <Table
            dataSource={mockRequests}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: !isMobile }}
            scroll={{ x: 700 }}
            size={isMobile ? 'small' : 'middle'}
            columns={[
              { title: 'Title', dataIndex: 'title', render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
              { title: 'Project', dataIndex: 'projectName', render: (v: string, r: Request) => <><a style={{ color: 'hsl(var(--info))' }}>{v}</a> <Typography.Text type="secondary">({r.projectCode})</Typography.Text></> },
              { title: 'Client', dataIndex: 'clientName' },
              { title: 'Assignee', dataIndex: 'assignee', render: (v: string) => <Space><Avatar size={20} style={{ backgroundColor: '#B19625', fontSize: 10 }}>{v.charAt(0)}</Avatar>{v}</Space> },
              { title: 'Status', dataIndex: 'status', render: (v: string) => <Tag color={statusColors[v]} style={{ borderRadius: 12 }}>{v}</Tag> },
              ...(!isMobile ? [
                { title: 'Created', dataIndex: 'createdDate' },
                { title: 'Due Date', dataIndex: 'dueDate' },
              ] : []),
            ]}
          />
        </Card>
      )}

      {/* ===== ADD TASK MODAL ===== */}
      <Modal title="Add Task" open={modalOpen} onCancel={() => { setModalOpen(false); form.resetFields(); }} onOk={handleAdd} okText="Create Task" width={isMobile ? '95%' : 560} centered>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input placeholder="Task title" /></Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select placeholder="Type" options={['Design', 'Site Visit', 'Meeting', 'Procurement', 'Review', 'Finance'].map(t => ({ value: t, label: t }))} />
            </Form.Item>
            <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
              <Select placeholder="Priority" options={priorities.map(p => ({ value: p, label: p }))} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="projectName" label="Project"><Input placeholder="Project name" /></Form.Item>
            <Form.Item name="clientName" label="Client"><Input placeholder="Client name" /></Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="assignee" label="Assign To"><Input placeholder="Assignee name" /></Form.Item>
            <Form.Item name="dueDate" label="Due Date"><DatePicker style={{ width: '100%' }} /></Form.Item>
          </div>
          <Form.Item name="description" label="Description"><Input.TextArea rows={3} placeholder="Task description..." /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TasksPage;
