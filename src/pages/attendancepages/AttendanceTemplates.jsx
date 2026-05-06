import { useMemo, useState } from 'react';
import { Button, Card, Col, Form, Input, Modal, Row, Space, Switch, Tag, Typography, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { useAppSelector } from '@/store';
import useIsMobile from '@/hooks/useIsMobile';

const { Text } = Typography;

const initialTemplates = [
  {
    id: 'tpl-std',
    name: 'Temp',
    description: '',
    isActive: true,
    settings: {
      requireGeolocation: false,
      requireSelfie: false,
      allowAttendanceOnHolidays: false,
      allowAttendanceOnWeeklyOff: false,
      lateEntryAllowed: true,
      earlyExitAllowed: true,
      overtimeAllowed: true,
    },
    assignedStaffCount: 2,
    createdBy: 'Boomi',
  },
  {
    id: 'tpl-field',
    name: 'Standard Template',
    description: '',
    isActive: true,
    settings: {
      requireGeolocation: true,
      requireSelfie: true,
      allowAttendanceOnHolidays: true,
      allowAttendanceOnWeeklyOff: true,
      lateEntryAllowed: true,
      earlyExitAllowed: true,
      overtimeAllowed: true,
    },
    assignedStaffCount: 36,
    createdBy: 'Boomi',
  },
];

export default function AttendanceTemplates() {
  const navigate = useNavigate();
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isDark = theme === 'dark';
  const borderColor = isDark ? '#1a4d72' : 'rgba(0,0,0,0.06)';
  const tileBg = isDark ? '#0d3554' : 'rgba(255,255,255,0.6)';
  const [templates, setTemplates] = useState(initialTemplates);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const editingTemplate = useMemo(
    () => templates.find(t => t.id === editingId) || null,
    [templates, editingId]
  );

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      name: '',
      description: '',
      isActive: true,
      settings: {
        requireGeolocation: false,
        requireSelfie: false,
        allowAttendanceOnHolidays: false,
        allowAttendanceOnWeeklyOff: false,
        lateEntryAllowed: true,
        earlyExitAllowed: true,
        overtimeAllowed: true,
      },
    });
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      isActive: record.isActive,
      settings: { ...record.settings },
    });
    setOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete attendance template?',
      content: 'This will remove the template.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => {
        setTemplates(prev => prev.filter(t => t.id !== record.id));
        message.success('Template deleted');
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const next = {
        id: editingId || `tpl-${Date.now()}`,
        name: values.name?.trim(),
        description: values.description || '',
        isActive: !!values.isActive,
        settings: values.settings,
        assignedStaffCount: editingTemplate?.assignedStaffCount ?? 0,
        createdBy: editingTemplate?.createdBy ?? 'Admin',
      };

      if (!next.name) {
        message.error('Template name is required');
        return;
      }

      setTemplates(prev => {
        if (editingId) return prev.map(t => (t.id === editingId ? next : t));
        return [next, ...prev];
      });
      setOpen(false);
      setEditingId(null);
      message.success(editingId ? 'Template updated' : 'Template created');
    } catch {
      // antd will show field errors
    }
  };

  return (
    <div>
      <PageHeader
        title="Attendance Templates"
        backTo="/settings/attendance"
        subtitle="Configure attendance modes, attendance on holidays, and more"
        actions={[
          <Button key="new" type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Template
          </Button>,
        ]}
      />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card className="crm-card">
            <div style={{ display: 'grid', gap: 12 }}>
              {templates.map((t) => (
                <div
                  key={t.id}
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: 12,
                    padding: 14,
                    background: tileBg,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'stretch' : 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{t.name}</div>
                      {t.isActive ? (
                        <Tag color="success" style={{ borderRadius: 999 }}>Active</Tag>
                      ) : (
                        <Tag style={{ borderRadius: 999 }}>Inactive</Tag>
                      )}
                    </div>

                    <div style={{ marginTop: 6, fontSize: 14 }}>
                      <Text type="secondary">
                        Created By: {t.createdBy || '—'} |{' '}
                        <a onClick={() => navigate(`/attendance/templates/${t.id}/staff`)}>
                          Assigned Staff: {t.assignedStaffCount || 0} Staffs
                        </a>
                      </Text>
                    </div>

                    <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {t.settings?.requireGeolocation && <Tag style={{ borderRadius: 999 }}>Geolocation</Tag>}
                      {t.settings?.requireSelfie && <Tag style={{ borderRadius: 999 }}>Selfie</Tag>}
                      {t.settings?.allowAttendanceOnHolidays && <Tag style={{ borderRadius: 999 }}>Holidays</Tag>}
                      {t.settings?.allowAttendanceOnWeeklyOff && <Tag style={{ borderRadius: 999 }}>Weekly Off</Tag>}
                    </div>
                  </div>

                  <Space style={{ width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                    <Button icon={<EditOutlined />} onClick={() => openEdit(t)}>
                      Edit
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(t)} />
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingId ? 'Edit Attendance Template' : 'Create Attendance Template'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSave}
        okText={editingId ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Template name" rules={[{ required: true, message: 'Enter a template name' }]}>
            <Input placeholder="e.g., Standard Attendance" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Optional description" />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <div style={{ marginTop: 8, marginBottom: 6, fontWeight: 700 }}>Requirements</div>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item name={['settings', 'requireGeolocation']} valuePropName="checked">
                <Switch /> <span style={{ marginLeft: 8 }}>Require geolocation</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['settings', 'requireSelfie']} valuePropName="checked">
                <Switch /> <span style={{ marginLeft: 8 }}>Require selfie</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['settings', 'allowAttendanceOnHolidays']} valuePropName="checked">
                <Switch /> <span style={{ marginLeft: 8 }}>Allow on holidays</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['settings', 'allowAttendanceOnWeeklyOff']} valuePropName="checked">
                <Switch /> <span style={{ marginLeft: 8 }}>Allow on weekly off</span>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: 8, marginBottom: 6, fontWeight: 700 }}>Rules</div>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item name={['settings', 'lateEntryAllowed']} valuePropName="checked">
                <Switch /> <span style={{ marginLeft: 8 }}>Allow late entry</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['settings', 'earlyExitAllowed']} valuePropName="checked">
                <Switch /> <span style={{ marginLeft: 8 }}>Allow early exit</span>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={['settings', 'overtimeAllowed']} valuePropName="checked">
                <Switch /> <span style={{ marginLeft: 8 }}>Allow overtime</span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
