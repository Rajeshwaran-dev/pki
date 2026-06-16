import React, { useState } from 'react';
import {
  Input, Button, Table, Space, Typography, Upload, Select,
  Modal, Form, Row, Col, Checkbox, Tabs, Divider, Tooltip, InputNumber
} from 'antd';
import {
  PlusOutlined, UploadOutlined, SettingOutlined, SearchOutlined,
  DeleteOutlined, EditOutlined, AudioOutlined,
  BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined,
  AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined,
  OrderedListOutlined, UnorderedListOutlined, LinkOutlined,
  PictureOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import { useAppSelector } from '@/store';

const { Title, Text } = Typography;

const QuoteBuilder = ({ onGenerate, initialData, isReadOnly }) => {
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const panelBg = isDark ? '#0d3554' : '#ffffff';
  const panelBorder = isDark ? '#1a4d72' : '#f0f0f0';

  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState(initialData?.items || []);
  const [title, setTitle] = useState(initialData?.title || '');
  
  const [isSelectItemsOpen, setIsSelectItemsOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [editForm] = Form.useForm();

  // Mock catalogue for Select Items
  const catalogue = [
    { id: 1, name: 'Accessories', make: 'Standard', type: 'Item' },
    { id: 2, name: 'Island Counter', make: 'Standard', type: 'Item' },
    { id: 3, name: 'Display Unit', make: 'Standard', type: 'Item' },
    { id: 4, name: 'Kitchen Base Unit', make: 'Standard', type: 'Item' },
    { id: 5, name: '16mm BWP Plywood', make: 'Standard', type: 'Material' },
  ];

  React.useEffect(() => {
    if (initialData) {
      setItems(initialData.items || []);
      setTitle(initialData.title || '');
    } else {
      setItems([]);
      setTitle('');
    }
  }, [initialData]);

  let columns = [
    { title: 'Sr.No.', dataIndex: 'srNo', width: 70 },
    { title: 'Item', dataIndex: 'name' },
    { title: 'Section', dataIndex: 'section' },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Qty', dataIndex: 'qty', width: 80 },
    { title: 'UOM', dataIndex: 'uom', width: 90 },
    { title: 'Rate', dataIndex: 'rate', width: 100 },
    { title: 'Discount %', dataIndex: 'discount', width: 110 },
    { title: 'GST', dataIndex: 'gst', width: 90 },
    { title: 'Amount', dataIndex: 'amount', width: 100 },
    { title: 'Remarks', dataIndex: 'remarks' },
  ];

  if (!isReadOnly) {
    columns.push({
      title: 'Actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined style={{ color: primaryColor }} />} onClick={() => handleEditClick(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteItem(record.id)} />
        </Space>
      ),
    });
  }

  const handleEditClick = (record) => {
    editForm.setFieldsValue(record);
    setIsEditItemOpen(true);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleCreateItemSubmit = () => {
    editForm.validateFields().then(values => {
      const newItem = {
        id: Date.now(),
        srNo: items.length + 1,
        name: values.name,
        qty: 1,
        uom: values.uom || 'Nos',
        rate: values.rates?.[0]?.clientRate || 0,
        discount: 0,
        gst: values.gst || '18%',
        amount: values.rates?.[0]?.clientRate || 0,
        ...values
      };
      setItems([...items, newItem]);
      setIsEditItemOpen(false);
      editForm.resetFields();
    });
  };

  const subTotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const gstTotal = subTotal * 0.18; // simplified
  const total = subTotal + gstTotal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 300 }}>
          <div style={{ fontSize: 13, marginBottom: 4, color: isDark ? '#a8b0ba' : '#666' }}>Title</div>
          <Input placeholder="Quote Title" value={title} onChange={e => setTitle(e.target.value)} disabled={isReadOnly} />
        </div>
        <Button type="text" icon={<SettingOutlined style={{ fontSize: 20, color: isDark ? '#a8b0ba' : '#666' }} />} disabled={isReadOnly} />
      </div>

      <div style={{ background: panelBg, borderRadius: 12, border: `1px solid ${panelBorder}`, overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${panelBorder}`, padding: '0 16px' }}>
          <div
            style={{
              padding: '16px 24px',
              cursor: 'pointer',
              fontWeight: activeTab === 'items' ? 600 : 400,
              color: activeTab === 'items' ? primaryColor : (isDark ? '#8a9ab0' : '#666'),
              borderBottom: activeTab === 'items' ? `2px solid ${primaryColor}` : '2px solid transparent',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('items')}
          >
            Items
          </div>
          <div
            style={{
              padding: '16px 24px',
              cursor: 'pointer',
              fontWeight: activeTab === 'summary' ? 600 : 400,
              color: activeTab === 'summary' ? primaryColor : (isDark ? '#8a9ab0' : '#666'),
              borderBottom: activeTab === 'summary' ? `2px solid ${primaryColor}` : '2px solid transparent',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveTab('summary')}
          >
            Section Summary
          </div>
        </div>

        {/* Content */}
        {activeTab === 'items' && (
          <div style={{ padding: 16 }}>
            <Table
              dataSource={items}
              columns={columns}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'Please add items' }}
              style={{ marginBottom: 16 }}
              scroll={{ x: 'max-content' }}
            />
            
            {!isReadOnly && (
              <Space style={{ marginBottom: 32 }}>
                <Button type="primary" style={{ background: '#141414', borderColor: '#141414' }} icon={<PlusOutlined />} onClick={() => setIsSelectItemsOpen(true)}>
                  Add Items
                </Button>
                <Button onClick={() => { editForm.resetFields(); setIsEditItemOpen(true); }} icon={<PlusOutlined />}>
                  Create Item
                </Button>
              </Space>
            )}

            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col span={12}>
                <div style={{ fontSize: 13, marginBottom: 8, color: isDark ? '#a8b0ba' : '#666' }}>Select Files</div>
                <div style={{ fontSize: 13, marginBottom: 8, color: isDark ? '#666' : '#999' }}>No files selected</div>
                {!isReadOnly && (
                  <Upload showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                )}
              </Col>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', fontSize: 15 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                    <span style={{ color: isDark ? '#a8b0ba' : '#666' }}>Sub Total:</span>
                    <span style={{ fontWeight: 600 }}>₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                    <span style={{ color: isDark ? '#a8b0ba' : '#666' }}>GST:</span>
                    <span style={{ fontWeight: 600 }}>₹{gstTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                    <span style={{ fontWeight: 600 }}>Total:</span>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>₹{total.toFixed(2)}</span>
                  </div>
                  {!isReadOnly && <Button type="link" icon={<PlusOutlined />} style={{ padding: 0, color: '#333', fontWeight: 600 }}>Add Charges</Button>}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>

      <div style={{ width: 300 }}>
        <div style={{ fontSize: 13, marginBottom: 4, color: isDark ? '#a8b0ba' : '#666' }}>Terms and conditions</div>
        <Select placeholder="Select" style={{ width: '100%' }} disabled={isReadOnly} />
      </div>

      <div>
        <div style={{ fontSize: 13, marginBottom: 4, color: isDark ? '#a8b0ba' : '#666' }}>Remarks</div>
        <div style={{ 
          border: `1px solid ${panelBorder}`, 
          borderRadius: 12, 
          background: panelBg,
          padding: 12,
          position: 'relative'
        }}>
          {/* Mock Toolbar */}
          <Space style={{ marginBottom: 12, borderBottom: `1px solid ${panelBorder}`, paddingBottom: 8, width: '100%', flexWrap: 'wrap' }}>
            <Tooltip title="Bold"><Button type="text" size="small" icon={<BoldOutlined />} /></Tooltip>
            <Tooltip title="Italic"><Button type="text" size="small" icon={<ItalicOutlined />} /></Tooltip>
            <Tooltip title="Underline"><Button type="text" size="small" icon={<UnderlineOutlined />} /></Tooltip>
            <Tooltip title="Strikethrough"><Button type="text" size="small" icon={<StrikethroughOutlined />} /></Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Align Left"><Button type="text" size="small" icon={<AlignLeftOutlined />} /></Tooltip>
            <Tooltip title="Align Center"><Button type="text" size="small" icon={<AlignCenterOutlined />} /></Tooltip>
            <Tooltip title="Align Right"><Button type="text" size="small" icon={<AlignRightOutlined />} /></Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Ordered List"><Button type="text" size="small" icon={<OrderedListOutlined />} /></Tooltip>
            <Tooltip title="Unordered List"><Button type="text" size="small" icon={<UnorderedListOutlined />} /></Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Link"><Button type="text" size="small" icon={<LinkOutlined />} /></Tooltip>
            <Tooltip title="Image"><Button type="text" size="small" icon={<PictureOutlined />} /></Tooltip>
          </Space>
          <Input.TextArea 
            bordered={false} 
            placeholder="Type your remarks here..." 
            autoSize={{ minRows: 4 }} 
            style={{ resize: 'none', padding: 0 }}
            disabled={isReadOnly}
          />
          {/* Audio Button */}
          <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button 
              shape="circle" 
              icon={<AudioOutlined style={{ fontSize: 20, color: '#fff' }} />} 
              style={{ background: '#a0856c', border: 'none', width: 44, height: 44, boxShadow: '0 4px 12px rgba(160,133,108,0.4)' }}
              disabled={isReadOnly}
            />
            <span style={{ fontSize: 11, color: '#888', marginTop: 4 }}>00:00</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}>
        {!isReadOnly && !initialData && (
          <Button type="primary" size="large" onClick={() => onGenerate?.({ title, items }, 'generate')} style={{ background: primaryColor, border: 'none', borderRadius: 8, fontWeight: 600 }}>
            Generate Quote
          </Button>
        )}
        {!isReadOnly && initialData && (
          <>
            <Button size="large" onClick={() => onGenerate?.({ title, items }, 'draft')} style={{ borderColor: primaryColor, color: primaryColor, borderRadius: 8, fontWeight: 600 }}>
              Save as Draft
            </Button>
            <Button type="primary" size="large" onClick={() => onGenerate?.({ title, items }, 'approval')} style={{ background: primaryColor, border: 'none', borderRadius: 8, fontWeight: 600 }}>
              Send for Approval
            </Button>
          </>
        )}
      </div>

      {/* Select Items Modal */}
      <Modal
        title="Select Items"
        open={isSelectItemsOpen}
        onCancel={() => setIsSelectItemsOpen(false)}
        width={800}
        okText="Submit"
        okButtonProps={{ style: { background: '#141414', borderColor: '#141414' } }}
        onOk={() => {
          // Dummy functionality: just add first item for demo
          setItems([...items, { id: Date.now(), srNo: items.length + 1, name: catalogue[0].name, qty: 1, uom: 'Nos', rate: 100, discount: 0, gst: '18%', amount: 100 }]);
          setIsSelectItemsOpen(false);
        }}
        centered
        className="crm-modal"
      >
        <div style={{ border: `1px solid ${panelBorder}`, borderRadius: 8, overflow: 'hidden' }}>
          <Table
            dataSource={catalogue}
            rowSelection={{ type: 'checkbox' }}
            rowKey="id"
            pagination={false}
            columns={[
              { 
                title: <Input placeholder="Item" prefix={<SearchOutlined />} size="small" />, 
                dataIndex: 'name',
                render: (v) => <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, background: isDark ? '#1a334a' : '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PictureOutlined style={{ color: '#aaa' }} />
                  </div>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              },
              { title: <Input placeholder="Make" prefix={<SearchOutlined />} size="small" />, dataIndex: 'make', width: 120 },
              { 
                title: <Input placeholder="Type" prefix={<SearchOutlined />} size="small" />, 
                dataIndex: 'type', 
                width: 120,
                render: (v) => <span style={{ background: isDark ? '#1a334a' : '#f0f0f0', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{v}</span>
              },
              { title: <Input placeholder="Tag" prefix={<SearchOutlined />} size="small" />, dataIndex: 'tag', width: 100 },
            ]}
          />
        </div>
      </Modal>

      {/* Create/Edit Item Modal */}
      <Modal
        title="Edit Item"
        open={isEditItemOpen}
        onCancel={() => setIsEditItemOpen(false)}
        width={600}
        okText="Submit"
        okButtonProps={{ style: { background: '#141414', borderColor: '#141414' } }}
        onOk={handleCreateItemSubmit}
        centered
        className="crm-modal"
      >
        <Form form={editForm} layout="vertical" className="crm-form-shell">
          <Form.Item name="name" label="Name *" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Unit Of Measurement *">
                <div style={{ display: 'flex', gap: 8 }}>
                  <Form.Item name="uom" noStyle rules={[{ required: true }]}>
                    <Select options={[{value:'Nos', label:'Nos'}, {value:'Sqft', label:'Sqft'}]} style={{ flex: 1 }} />
                  </Form.Item>
                  <Button type="primary" style={{ background: '#141414' }} icon={<PlusOutlined />}>UOM</Button>
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gst" label="GST *">
                <Select options={[{value:'18%', label:'18%'}, {value:'12%', label:'12%'}]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tag">
                <div style={{ display: 'flex', gap: 8 }}>
                  <Form.Item name="tag" noStyle>
                    <Select style={{ flex: 1 }} />
                  </Form.Item>
                  <Button type="primary" style={{ background: '#141414' }} icon={<PlusOutlined />}>Tag</Button>
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Type *">
                <Select options={[{value:'Item', label:'Item'}, {value:'Material', label:'Material'}]} defaultValue="Item" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Rates</div>
            <Form.List name="rates" initialValue={[{ make: 'Standard', clientRate: 0, purchaseRate: 0 }]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Row gutter={12} key={key} style={{ marginBottom: 8, alignItems: 'center' }}>
                      <Col span={8}>
                        <div style={{ fontSize: 13, marginBottom: 4, color: isDark ? '#a8b0ba' : '#666' }}>{index === 0 ? 'Make Name *' : 'Make Name'}</div>
                        <Form.Item {...restField} name={[name, 'make']} noStyle>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <div style={{ fontSize: 13, marginBottom: 4, color: isDark ? '#a8b0ba' : '#666' }}>Client Rate</div>
                        <Form.Item {...restField} name={[name, 'clientRate']} noStyle>
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <div style={{ fontSize: 13, marginBottom: 4, color: isDark ? '#a8b0ba' : '#666' }}>Purchase Rate</div>
                        <Form.Item {...restField} name={[name, 'purchaseRate']} noStyle>
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      {index > 0 && (
                        <Col span={2}>
                          <div style={{ marginTop: 22 }}>
                            <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                          </div>
                        </Col>
                      )}
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                    Add Rate
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          <Form.Item label="Image">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Upload showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
              <span style={{ fontSize: 13, color: '#888' }}>No file selected</span>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuoteBuilder;
