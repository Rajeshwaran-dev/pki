import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker, Space, Typography, Card, Tag, Avatar, message, Segmented } from 'antd';
import {
  PlusOutlined, UnorderedListOutlined, AppstoreOutlined,
  ClockCircleOutlined, UserOutlined, MessageOutlined,
  OrderedListOutlined, FileTextOutlined,
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
    <div style={{
      minWidth: 280, maxWidth: 320, flex: '1 0 280px', borderRadius: 12, padding: 12,
      background: 'hsl(var(--muted) / 0.5)', height: 'fit-content', minHeight: 300,
      borderTop: `3px solid ${statusColors[status] || '#ccc'}`,
    }}>
      <div className="flex items-center justify-between mb-3 px-1">
        <Space>
          <Typography.Text strong style={{ fontSize: 13 }}>{status}</Typography.Text>
        </Space>
        <Tag style={{ borderRadius: 8, fontSize: 11 }}>{tasks.length}</Tag>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {tasks.length === 0 && (
        <div className="text-center py-8"><Typography.Text type="secondary" style={{ fontSize: 12 }}>No tasks</Typography.Text></div>
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

/* ========== Main Page ========== */
const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, viewMode } = useAppSelector(s => s.tasks);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
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
      <PageHeader
        title="Tasks"
        actions={
          <>
            <Segmented
              value={viewMode}
              onChange={val => dispatch(setViewMode(val as 'board' | 'list'))}
              options={[
                { value: 'board', icon: <AppstoreOutlined /> },
                { value: 'list', icon: <UnorderedListOutlined /> },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>Add Task</Button>
          </>
        }
      />

      {/* Tab buttons like reference */}
      <div className="flex items-center gap-2 mb-5">
        {[
          { key: 'tasks' as const, label: 'All Tasks', icon: <OrderedListOutlined /> },
          { key: 'requests' as const, label: `All Requests (${mockRequests.length})`, icon: <FileTextOutlined /> },
        ].map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="settings-pill-tab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                borderRadius: 24,
                border: isActive ? '2px solid #B19625' : '1px solid hsl(var(--border))',
                background: isActive ? '#B1962510' : 'transparent',
                color: isActive ? '#B19625' : 'inherit',
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'tasks' && (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
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

      {activeTab === 'requests' && (
        <div className="animate-fade-in" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
          {requestStatuses.map(status => {
            const items = requestsByStatus(status);
            return (
              <div
                key={status}
                style={{
                  minWidth: 280, maxWidth: 320, flex: '1 0 280px', borderRadius: 12, padding: 12,
                  background: 'hsl(var(--muted) / 0.5)', height: 'fit-content', minHeight: 300,
                  borderTop: `3px solid ${statusColors[status] || '#ccc'}`,
                }}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <Typography.Text strong style={{ fontSize: 13 }}>{status}</Typography.Text>
                  <Tag style={{ borderRadius: 8, fontSize: 11 }}>{items.length}</Tag>
                </div>
                {items.map(req => <RequestCard key={req.id} request={req} />)}
                {items.length === 0 && (
                  <div className="text-center py-8"><Typography.Text type="secondary" style={{ fontSize: 12 }}>No tasks</Typography.Text></div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
