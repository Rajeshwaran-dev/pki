import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker, Space, Typography, Card, Tag, Avatar, message, Segmented } from 'antd';
import {
  PlusOutlined, UnorderedListOutlined, AppstoreOutlined,
  ClockCircleOutlined, UserOutlined,
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

const statusColors: Record<TaskStatus, string> = {
  'Created': '#1677FF',
  'In Progress': '#B19625',
  'Completed': '#52C41A',
  'On Hold': '#FAAD14',
  'Discarded': '#FF4D4F',
};

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
          borderRadius: 10,
          marginBottom: 10,
          cursor: 'grab',
          borderLeft: `3px solid ${statusColors[task.status]}`,
          ...(overlay ? { boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transform: 'rotate(2deg)' } : {}),
        }}
        hoverable
        bodyStyle={{ padding: '12px 14px' }}
      >
        <Typography.Text strong style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
          {task.title}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
          {task.projectName} • {task.clientName}
        </Typography.Text>
        <div className="flex items-center justify-between">
          <StatusTag value={task.priority} type="priority" />
          <Space size={8}>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              <ClockCircleOutlined /> {task.dueDate}
            </Typography.Text>
            <Avatar size={20} style={{ backgroundColor: '#B19625', fontSize: 10 }}>
              {task.assignee.charAt(0)}
            </Avatar>
          </Space>
        </div>
      </Card>
    </div>
  );
};

const KanbanColumn: React.FC<{ status: TaskStatus; tasks: Task[] }> = ({ status, tasks }) => {
  const taskIds = tasks.map(t => t.id);
  return (
    <div
      style={{
        minWidth: 280,
        maxWidth: 320,
        flex: '1 0 280px',
        borderRadius: 12,
        padding: 12,
        background: 'hsl(var(--muted) / 0.5)',
        height: 'fit-content',
        minHeight: 300,
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <Space>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[status] }} />
          <Typography.Text strong style={{ fontSize: 13 }}>{status}</Typography.Text>
        </Space>
        <Tag style={{ borderRadius: 8, fontSize: 11 }}>{tasks.length}</Tag>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
      {tasks.length === 0 && (
        <div className="text-center py-8">
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>No tasks</Typography.Text>
        </div>
      )}
    </div>
  );
};

const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, viewMode } = useAppSelector(s => s.tasks);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
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

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} tasks`}
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
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Add Task
            </Button>
          </>
        }
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 16,
          }}
        >
          {taskStatuses.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter(t => t.status === status)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>

      <Modal
        title="Add Task"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleAdd}
        okText="Create Task"
        width={isMobile ? '95%' : 560}
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Task title" />
          </Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select placeholder="Type" options={['Design', 'Site Visit', 'Meeting', 'Procurement', 'Review', 'Finance'].map(t => ({ value: t, label: t }))} />
            </Form.Item>
            <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
              <Select placeholder="Priority" options={priorities.map(p => ({ value: p, label: p }))} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="projectName" label="Project">
              <Input placeholder="Project name" />
            </Form.Item>
            <Form.Item name="clientName" label="Client">
              <Input placeholder="Client name" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="assignee" label="Assign To">
              <Input placeholder="Assignee name" />
            </Form.Item>
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Task description..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TasksPage;
