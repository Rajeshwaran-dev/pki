import React, { useState, useMemo } from 'react';
import {
  Table, Button, Input, Modal, Form, Space, message, Divider, Typography,
} from 'antd';
import {
  PlusOutlined, ExportOutlined, EditOutlined, EyeOutlined, SearchOutlined,
  DeleteOutlined, MinusCircleOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { addClient } from '@/store/slices/clientSlice';
import { Client, indianStates } from '@/data/mockData';
import PageHeader from '@/components/shared/PageHeader';
import useIsMobile from '@/hooks/useIsMobile';
import { Select } from 'antd';

const ClientsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(s => s.clients.clients);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    if (!search) return clients;
    return clients.filter(c =>
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.legalName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  }, [clients, search]);

  const columns = [
    { title: 'Date', dataIndex: 'createdDate', width: 100, sorter: (a: Client, b: Client) => a.createdDate.localeCompare(b.createdDate) },
    { title: 'Legal Name', dataIndex: 'legalName', width: 200, ellipsis: true },
    { title: 'Client Name', dataIndex: 'clientName', width: 150 },
    { title: 'Phone', dataIndex: 'phone', width: 150 },
    { title: 'City', dataIndex: 'city', width: 120 },
    { title: 'State', dataIndex: 'state', width: 130 },
    {
      title: 'Actions', width: 100,
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newClient: Client = {
        id: Date.now().toString(),
        createdDate: new Date().toISOString().split('T')[0],
        ...values,
      };
      dispatch(addClient(newClient));
      message.success('Client added successfully');
      setModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${filtered.length} clients`}
        actions={
          <>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Add Client
            </Button>
          </>
        }
      />

      <div style={{
        background: 'var(--ant-color-bg-container, #fff)',
        borderRadius: 12,
        padding: isMobile ? 12 : 20,
      }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300, borderRadius: 8, marginBottom: 16 }}
          allowClear
        />

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: t => `${t} clients` }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </div>

      <Modal
        title="Add Client"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleAdd}
        okText="Add Client"
        width={isMobile ? '95%' : 640}
        centered
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16, maxHeight: '60vh', overflow: 'auto' }}>
          <Typography.Text strong style={{ fontSize: 14, color: '#C8A75D' }}>Primary Details</Typography.Text>
          <Divider style={{ margin: '8px 0 16px' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item name="clientName" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Client name" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
              <Input placeholder="Email" />
            </Form.Item>
          </div>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Phone number" />
          </Form.Item>

          <Typography.Text strong style={{ fontSize: 14, color: '#C8A75D' }}>Address</Typography.Text>
          <Divider style={{ margin: '8px 0 16px' }} />
          <Form.Item name="address1" label="Address Line 1">
            <Input placeholder="Address line 1" />
          </Form.Item>
          <Form.Item name="address2" label="Address Line 2">
            <Input placeholder="Address line 2" />
          </Form.Item>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
            <Form.Item name="state" label="State">
              <Select placeholder="State" options={indianStates.map(s => ({ value: s, label: s }))} />
            </Form.Item>
            <Form.Item name="city" label="City">
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item name="pincode" label="Pincode">
              <Input placeholder="Pincode" />
            </Form.Item>
          </div>

          <Typography.Text strong style={{ fontSize: 14, color: '#C8A75D' }}>Business Details</Typography.Text>
          <Divider style={{ margin: '8px 0 16px' }} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
            <Form.Item name="legalName" label="Legal Name" rules={[{ required: true }]}>
              <Input placeholder="Legal name" />
            </Form.Item>
            <Form.Item name="pan" label="PAN">
              <Input placeholder="PAN number" />
            </Form.Item>
            <Form.Item name="gst" label="GST">
              <Input placeholder="GST number" />
            </Form.Item>
          </div>

          <Typography.Text strong style={{ fontSize: 14, color: '#C8A75D' }}>Additional Contacts</Typography.Text>
          <Divider style={{ margin: '8px 0 16px' }} />
          <Form.List name="contacts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-4 gap-x-3 items-end">
                    <Form.Item {...rest} name={[name, 'name']} label="Name">
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item {...rest} name={[name, 'phone']} label="Phone">
                      <Input placeholder="Phone" />
                    </Form.Item>
                    <Form.Item {...rest} name={[name, 'email']} label="Email">
                      <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                    </Form.Item>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Contact
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientsPage;
