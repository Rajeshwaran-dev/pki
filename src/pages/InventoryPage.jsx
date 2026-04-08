import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, Statistic, Table, Tag, Space, Button, 
  Tabs, Input, Select, Badge, Progress, Tooltip, Avatar
} from 'antd';
import { 
  AppstoreOutlined, AlertOutlined, PlusOutlined, 
  SearchOutlined, SettingOutlined, SwapOutlined,
  ShoppingOutlined, DollarOutlined, DropboxOutlined,
  ContainerOutlined, ShopOutlined, TeamOutlined,
  ArrowUpOutlined, ArrowDownOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';

const InventoryPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const [activeTab, setActiveTab] = useState(tab || 'overview');

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/inventory/${key}`);
  };

  // Multi-theme colors
  const cardBg = isDark ? '#0b2338' : '#ffffff';
  const borderColor = isDark ? '#1a4d72' : '#f0f0f0';
  const textSecondary = isDark ? '#a8b0ba' : '#666';

  const stats = [
    { title: 'Total Items', value: 1240, icon: <AppstoreOutlined />, color: '#1677FF' },
    { title: 'Low Stock Alerts', value: 12, icon: <AlertOutlined />, color: '#FAAD14' },
    { title: 'Out of Stock', value: 3, icon: <ShoppingOutlined />, color: '#FF4D4F' },
    { title: 'Inventory Value', value: '₹12.4L', icon: <DollarOutlined />, color: '#52C41A' },
  ];

  const inventoryData = [
    { key: '1', product: 'MacBook Pro M2', sku: 'LAP-MBP-001', category: 'Laptops', stock: 15, unit: 'pcs', price: '₹1,24,000', status: 'In Stock' },
    { key: '2', product: 'Dell UltraSharp Monitor', sku: 'MON-DLL-022', category: 'Electronics', stock: 5, unit: 'pcs', price: '₹45,000', status: 'Low Stock' },
    { key: '3', product: 'Logitech MX Master 3', sku: 'ACC-LOG-005', category: 'Accessories', stock: 25, unit: 'pcs', price: '₹8,500', status: 'In Stock' },
    { key: '4', product: 'Herman Miller Aeron', sku: 'FUR-HMN-010', category: 'Furniture', stock: 0, unit: 'pcs', price: '₹95,000', status: 'Out of Stock' },
    { key: '5', product: 'RJ45 Connectors (Pack)', sku: 'NET-CON-100', category: 'Networking', stock: 450, unit: 'units', price: '₹1.50', status: 'In Stock' },
  ];

  const columns = [
    {
      title: 'Product Details',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => (
        <Space>
          <Avatar shape="square" icon={<DropboxOutlined />} style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: primaryColor }} />
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: 11, color: textSecondary }}>SKU: {record.sku}</div>
          </div>
        </Space>
      ),
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { 
      title: 'Quantity', 
      dataIndex: 'stock', 
      key: 'stock',
      render: (stock, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{stock} {record.unit}</div>
          {stock < 10 && stock > 0 && <span style={{ fontSize: 10, color: '#FAAD14' }}>Low stock limit: 10</span>}
        </div>
      )
    },
    { title: 'Unit Price', dataIndex: 'price', key: 'price' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'Low Stock') color = 'warning';
        if (status === 'Out of Stock') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="link" size="small">Manage</Button>,
    },
  ];

  const movementData = [
    { key: '1', date: '2024-04-07 10:30 AM', product: 'MacBook Pro M2', type: 'Stock In', quantity: '+5', user: 'Admin' },
    { key: '2', date: '2024-04-07 02:15 PM', product: 'Logitech MX Master 3', type: 'Stock Out', quantity: '-2', user: 'Manager' },
    { key: '3', date: '2024-04-06 11:00 AM', product: 'Dell UltraSharp', type: 'Repaired', quantity: '0', user: 'Technician' },
  ];

  const movementColumns = [
    { title: 'Date & Time', dataIndex: 'date', key: 'date' },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => (
        <Space>
          {type === 'Stock In' ? <ArrowUpOutlined style={{ color: '#52C41A' }} /> : <ArrowDownOutlined style={{ color: '#FF4D4F' }} />}
          <span>{type}</span>
        </Space>
      )
    },
    { 
      title: 'Qty', 
      dataIndex: 'quantity', 
      key: 'quantity',
      render: (qty) => <span style={{ fontWeight: 700, color: qty.startsWith('+') ? '#52C41A' : (qty === '0' ? 'inherit' : '#FF4D4F') }}>{qty}</span>
    },
    { title: 'User', dataIndex: 'user', key: 'user' },
  ];

  return (
    <div style={{ padding: '0 0 24px' }}>
      <PageHeader 
        title="Inventory Tracking" 
        subtitle="Manage stocks, track movements and supplier orders"
        actions={
          <Space>
            <Button icon={<SwapOutlined />}>Stock Adjustment</Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: primaryColor, border: 'none' }}>
              Add New Item
            </Button>
          </Space>
        }
      />

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card style={{ borderRadius: 12, background: cardBg, border: `1px solid ${borderColor}` }}>
              <Statistic 
                title={<span style={{ color: textSecondary }}>{item.title}</span>}
                value={item.value}
                prefix={<span style={{ color: item.color, marginRight: 8 }}>{item.icon}</span>}
                valueStyle={{ color: isDark ? '#f0f0f0' : '#1f1f1f', fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Stock Management Body */}
      <Card 
        style={{ borderRadius: 14, background: cardBg, border: `1px solid ${borderColor}` }}
        styles={{ body: { padding: '8px 24px 24px' } }}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          items={[
            {
              key: 'overview',
              label: (<span><ShoppingOutlined /> Product Inventory</span>),
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <Space wrap>
                      <Input prefix={<SearchOutlined />} placeholder="Search products, SKU..." style={{ width: 300, borderRadius: 8 }} />
                      <Select defaultValue="all" style={{ width: 150, borderRadius: 8 }}>
                        <Select.Option value="all">Categories</Select.Option>
                        <Select.Option value="elec">Electronics</Select.Option>
                        <Select.Option value="furn">Furniture</Select.Option>
                      </Select>
                      <Select defaultValue="instock" style={{ width: 140, borderRadius: 8 }}>
                        <Select.Option value="all">All Status</Select.Option>
                        <Select.Option value="instock">In Stock</Select.Option>
                        <Select.Option value="low">Low Stock</Select.Option>
                        <Select.Option value="out">Out of Stock</Select.Option>
                      </Select>
                    </Space>
                    <Button icon={<SettingOutlined />}>Stock Policy</Button>
                  </div>
                  <Table 
                    columns={columns} 
                    dataSource={inventoryData} 
                    pagination={{ pageSize: 5 }} 
                    scroll={{ x: 'max-content' }}
                  />
                </div>
              ),
            },
            {
              key: 'movements',
              label: (<span><HistoryOutlined /> Stock Movements</span>),
              children: (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <Typography.Text type="secondary">View all inward and outward inventory transactions</Typography.Text>
                  </div>
                  <Table 
                    columns={movementColumns} 
                    dataSource={movementData} 
                    pagination={{ pageSize: 5 }} 
                    scroll={{ x: 'max-content' }}
                  />
                </div>
              ),
            },
            {
              key: 'suppliers',
              label: (<span><ShopOutlined /> Suppliers</span>),
              children: (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <TeamOutlined style={{ fontSize: 48, color: primaryColor, opacity: 0.5, marginBottom: 16 }} />
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Supplier Directory</div>
                  <div style={{ color: textSecondary, marginBottom: 24, maxWidth: 400, margin: '8px auto 24px' }}>
                    Manage your vendor contacts and track purchase orders with ease.
                  </div>
                  <Button type="primary" ghost style={{ borderRadius: 8, borderColor: primaryColor, color: primaryColor }}>View Suppliers</Button>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

// Exporting to avoid issues with multi-replace
import { Typography } from 'antd';
export default InventoryPage;
