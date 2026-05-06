import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Row, Col, Statistic, Table, Tag, Space, Button,
  Tabs, Input, Select, Progress, Tooltip, Avatar,
  Modal, Form, InputNumber, DatePicker, Drawer, Descriptions,
  Typography, Divider, message, Popconfirm, Rate, Badge,
} from 'antd';
import {
  AppstoreOutlined, AlertOutlined, PlusOutlined,
  SearchOutlined, SwapOutlined, ShoppingOutlined,
  DollarOutlined, DropboxOutlined, ShopOutlined,
  TeamOutlined, ArrowUpOutlined, ArrowDownOutlined,
  HistoryOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, TagOutlined, FileTextOutlined,
  InboxOutlined, CheckCircleOutlined, CloseCircleOutlined,
  AimOutlined, BarcodeOutlined, BlockOutlined,
  CaretUpOutlined, CaretDownOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

// ─── Mock Data ──────────────────────────────────────────────────────────────

const CATEGORIES = ['Plywood', 'MDF & Board', 'Laminates', 'Acrylic & Veneer', 'Hardware', 'Handles & Knobs', 'Tools'];
const UNITS = ['sheet', 'pcs', 'pair', 'sqft', 'roll', 'box', 'set', 'meter', 'kg'];
const WAREHOUSES = ['Material Yard', 'Site Store - Mumbai', 'Site Store - Pune', 'Office Store'];

const initItems = [
  { key: '1',  id: 'INV-001', name: 'BWP Plywood 18mm (8x4ft)',          sku: 'PLY-BWP-18',  category: 'Plywood',         brand: 'CenturyPly', unit: 'sheet', quantity: 120, minStock: 30,  maxStock: 300, costPrice: 1800,  sellingPrice: 2100,  supplier: 'CenturyPly India Ltd',    location: 'Material Yard',        status: 'In Stock',    description: 'Boiling Water Proof plywood — fully waterproof & termite-resistant. Best for kitchen sink area & lower cabinets. Strong screw holding for hinges.', barcode: '100010001001', lastUpdated: '2024-04-07', tags: ['plywood', 'bwp', 'waterproof', 'kitchen'] },
  { key: '2',  id: 'INV-002', name: 'BWR/Commercial Plywood 18mm (8x4ft)', sku: 'PLY-BWR-18', category: 'Plywood',         brand: 'Greenply',   unit: 'sheet', quantity: 80,  minStock: 20,  maxStock: 200, costPrice: 1200,  sellingPrice: 1450,  supplier: 'Greenply Industries',     location: 'Material Yard',        status: 'In Stock',    description: 'Boiling Water Resistant commercial plywood. Slightly lower cost than BWP. Ideal for TV unit & upper cabinets.', barcode: '100020002002', lastUpdated: '2024-04-06', tags: ['plywood', 'bwr', 'commercial', 'tv unit'] },
  { key: '3',  id: 'INV-003', name: 'MDF Sheet 18mm (8x4ft)',             sku: 'MDF-STD-18',  category: 'MDF & Board',     brand: 'Greenply',   unit: 'sheet', quantity: 45,  minStock: 15,  maxStock: 100, costPrice: 900,   sellingPrice: 1100,  supplier: 'Greenply Industries',     location: 'Material Yard',        status: 'In Stock',    description: 'Medium Density Fibreboard — ultra-smooth finish perfect for paint & routed designs. Best for TV unit shutters. Not suitable for wet kitchen zones.', barcode: '100030003003', lastUpdated: '2024-04-05', tags: ['mdf', 'smooth', 'shutters', 'tv unit'] },
  { key: '4',  id: 'INV-004', name: 'Block Board 25mm (8x4ft)',           sku: 'BLK-BRD-25',  category: 'MDF & Board',     brand: 'CenturyPly', unit: 'sheet', quantity: 8,   minStock: 10,  maxStock: 60,  costPrice: 1100,  sellingPrice: 1350,  supplier: 'CenturyPly India Ltd',    location: 'Material Yard',        status: 'Low Stock',   description: 'Block board with solid wood core — prevents bending in long shutter doors. Ideal for tall TV panels & wardrobes.', barcode: '100040004004', lastUpdated: '2024-04-03', tags: ['block board', 'shutter', 'anti-warp', 'wardrobe'] },
  { key: '5',  id: 'INV-005', name: 'Matte Laminate Sheet (8x4ft)',       sku: 'LAM-MAT-001', category: 'Laminates',        brand: 'Merino',     unit: 'sheet', quantity: 200, minStock: 50,  maxStock: 500, costPrice: 450,   sellingPrice: 550,   supplier: 'Merino Industries',       location: 'Site Store - Mumbai',  status: 'In Stock',    description: 'Matte finish laminate sheet — most popular budget-friendly finish for kitchen & TV units. Easy maintenance, durable surface.', barcode: '100050005005', lastUpdated: '2024-04-01', tags: ['laminate', 'matte', 'finish', 'kitchen'] },
  { key: '6',  id: 'INV-006', name: 'Gloss Laminate Sheet (8x4ft)',       sku: 'LAM-GLS-001', category: 'Laminates',        brand: 'Merino',     unit: 'sheet', quantity: 140, minStock: 40,  maxStock: 400, costPrice: 500,   sellingPrice: 620,   supplier: 'Merino Industries',       location: 'Site Store - Mumbai',  status: 'In Stock',    description: 'High gloss laminate sheet for kitchen shutters & TV units. Reflective finish with easy-wipe surface.', barcode: '100060006006', lastUpdated: '2024-04-07', tags: ['laminate', 'gloss', 'finish', 'kitchen'] },
  { key: '7',  id: 'INV-007', name: 'Acrylic Sheet High Gloss (8x4ft)',   sku: 'ACR-GLO-001', category: 'Acrylic & Veneer', brand: 'Rehau',      unit: 'sheet', quantity: 35,  minStock: 10,  maxStock: 100, costPrice: 2500,  sellingPrice: 3200,  supplier: 'Rehau India Pvt Ltd',     location: 'Site Store - Mumbai',  status: 'In Stock',    description: 'Premium high-gloss acrylic finish for modern kitchen & TV units. Mirror-like reflective surface — luxury appearance.', barcode: '100070007007', lastUpdated: '2024-04-04', tags: ['acrylic', 'glossy', 'premium', 'modern'] },
  { key: '8',  id: 'INV-008', name: 'Teak Veneer Sheet (8x4ft)',          sku: 'VNR-TEK-001', category: 'Acrylic & Veneer', brand: 'Greenply',   unit: 'sheet', quantity: 0,   minStock: 5,   maxStock: 50,  costPrice: 1800,  sellingPrice: 2300,  supplier: 'Greenply Industries',     location: 'Material Yard',        status: 'Out of Stock', description: 'Natural teak wood veneer sheet — premium natural wood look for hall TV unit & living room interiors.', barcode: '100080008008', lastUpdated: '2024-04-02', tags: ['veneer', 'teak', 'natural wood', 'tv unit'] },
  { key: '9',  id: 'INV-009', name: 'Soft-Close Hinge (Hettich)',         sku: 'HNG-SFT-001', category: 'Hardware',         brand: 'Hettich',    unit: 'pair',  quantity: 250, minStock: 100, maxStock: 1000, costPrice: 85,   sellingPrice: 110,   supplier: 'Hettich India Pvt Ltd',   location: 'Office Store',         status: 'In Stock',    description: 'Hettich soft-close concealed hinge for kitchen & wardrobe shutters. Smooth silent closing mechanism.', barcode: '100090009009', lastUpdated: '2024-04-05', tags: ['hinge', 'soft-close', 'hettich', 'hardware'] },
  { key: '10', id: 'INV-010', name: 'Soft-Close Drawer Channel 18" (Ebco)', sku: 'CHN-SFT-018', category: 'Hardware',      brand: 'Ebco',       unit: 'pair',  quantity: 40,  minStock: 50,  maxStock: 300, costPrice: 450,   sellingPrice: 580,   supplier: 'Ebco Hardware',           location: 'Office Store',         status: 'Low Stock',   description: 'Ebco 18-inch soft-close under-mount drawer channel. Essential for smooth-closing modular kitchen drawers.', barcode: '100100010010', lastUpdated: '2024-04-06', tags: ['drawer', 'channel', 'soft-close', 'ebco'] },
  { key: '11', id: 'INV-011', name: 'Profile Handle Aluminium 4ft',       sku: 'HDL-PRF-4FT', category: 'Handles & Knobs', brand: 'Plantex',    unit: 'pcs',   quantity: 75,  minStock: 30,  maxStock: 200, costPrice: 580,   sellingPrice: 699,   supplier: 'Ebco Hardware',           location: 'Office Store',         status: 'In Stock',    description: 'Plantex aluminium profile handle (4ft) — handle-less look fixed on shutter edge. Ideal for sleek modern modular kitchens.', barcode: '100110011011', lastUpdated: '2024-04-07', tags: ['profile handle', 'aluminium', 'modern kitchen', 'handleless'] },
  { key: '12', id: 'INV-012', name: 'Pull Handle Aluminium Bar 128mm',    sku: 'HDL-PUL-128', category: 'Handles & Knobs', brand: 'Harmonus',   unit: 'pcs',   quantity: 150, minStock: 50,  maxStock: 500, costPrice: 145,   sellingPrice: 180,   supplier: 'Ebco Hardware',           location: 'Office Store',         status: 'In Stock',    description: 'Harmonus glossy aluminium pull handle (128mm) for kitchen cabinets & drawers. Durable & modern bar style.', barcode: '100120012012', lastUpdated: '2024-04-05', tags: ['pull handle', 'aluminium', 'cabinet', 'drawer'] },
  { key: '13', id: 'INV-013', name: 'Wooden Cabinet Knob',                sku: 'KNB-WOD-001', category: 'Handles & Knobs', brand: 'Generic',    unit: 'pcs',   quantity: 85,  minStock: 40,  maxStock: 300, costPrice: 90,    sellingPrice: 112,   supplier: 'Ebco Hardware',           location: 'Office Store',         status: 'In Stock',    description: 'Classic natural wooden cabinet knob — ideal for TV units and traditional interior aesthetics.', barcode: '100130013013', lastUpdated: '2024-04-03', tags: ['knob', 'wood', 'tv unit', 'classic'] },
];

const initSuppliers = [
  { key: '1', id: 'SUP-001', name: 'CenturyPly India Ltd',   contact: 'Rahul Mehta',   phone: '+91 98765 43210', email: 'orders@centuryply.in',  gst: '27ABCDE1234F1Z5', city: 'Mumbai',    state: 'Maharashtra', paymentTerms: 'Net 30',  rating: 5, categories: ['Plywood'],                          status: 'Active',   totalOrders: 18, totalValue: 3240000 },
  { key: '2', id: 'SUP-002', name: 'Greenply Industries',    contact: 'Anita Sharma',  phone: '+91 87654 32109', email: 'sales@greenply.com',    gst: '19GHIJK5678L2Z4', city: 'Kolkata',   state: 'West Bengal', paymentTerms: 'Net 45',  rating: 4, categories: ['Plywood', 'MDF & Board', 'Acrylic & Veneer'], status: 'Active', totalOrders: 14, totalValue: 1890000 },
  { key: '3', id: 'SUP-003', name: 'Merino Industries',      contact: 'Sanjay Patel',  phone: '+91 76543 21098', email: 'orders@merino.in',      gst: '24MNOPQ9012R3Z3', city: 'Ahmedabad', state: 'Gujarat',     paymentTerms: 'Advance', rating: 4, categories: ['Laminates'],                        status: 'Active',   totalOrders: 22, totalValue: 990000  },
  { key: '4', id: 'SUP-004', name: 'Hettich India Pvt Ltd', contact: 'Ravi Kumar',    phone: '+91 65432 10987', email: 'info@hettich.in',       gst: '29STUVW3456X4Z2', city: 'Bangalore', state: 'Karnataka',   paymentTerms: 'Net 30',  rating: 5, categories: ['Hardware'],                         status: 'Active',   totalOrders: 10, totalValue: 255000  },
  { key: '5', id: 'SUP-005', name: 'Ebco Hardware',          contact: 'Priya Nair',    phone: '+91 54321 09876', email: 'sales@ebco.in',         gst: '27YZABC7890D5Z1', city: 'Mumbai',    state: 'Maharashtra', paymentTerms: 'Net 15',  rating: 4, categories: ['Hardware', 'Handles & Knobs'],      status: 'Active',   totalOrders: 16, totalValue: 420000  },
  { key: '6', id: 'SUP-006', name: 'Rehau India Pvt Ltd',   contact: 'Neha Joshi',    phone: '+91 43210 98765', email: 'info@rehau.in',         gst: '27DEFGH5678I6Z2', city: 'Pune',      state: 'Maharashtra', paymentTerms: 'Net 30',  rating: 4, categories: ['Acrylic & Veneer'],                status: 'Active',   totalOrders: 7,  totalValue: 525000  },
];

const initOrders = [
  { key: '1', poNumber: 'PO-2024-001', supplier: 'CenturyPly India Ltd',   items: 2, totalAmount: 216000, status: 'Delivered',  orderDate: '2024-03-01', expectedDate: '2024-03-15', deliveredDate: '2024-03-13', createdBy: 'Admin',   notes: 'BWP & Block Board bulk stock for Luxury Villa project' },
  { key: '2', poNumber: 'PO-2024-002', supplier: 'Greenply Industries',    items: 3, totalAmount: 117000, status: 'In Transit', orderDate: '2024-04-01', expectedDate: '2024-04-12', deliveredDate: null,         createdBy: 'Manager', notes: 'MDF & Teak Veneer restock for ongoing projects' },
  { key: '3', poNumber: 'PO-2024-003', supplier: 'Merino Industries',      items: 4, totalAmount: 94600,  status: 'Pending',    orderDate: '2024-04-07', expectedDate: '2024-04-18', deliveredDate: null,         createdBy: 'Admin',   notes: 'Laminate (matte & gloss) restock for Penthouse Design' },
  { key: '4', poNumber: 'PO-2024-004', supplier: 'Hettich India Pvt Ltd',  items: 1, totalAmount: 21250,  status: 'Delivered',  orderDate: '2024-02-20', expectedDate: '2024-03-05', deliveredDate: '2024-03-04', createdBy: 'Admin',   notes: 'Soft-close hinge bulk order for modular kitchen projects' },
  { key: '5', poNumber: 'PO-2024-005', supplier: 'Ebco Hardware',          items: 3, totalAmount: 56000,  status: 'Cancelled',  orderDate: '2024-01-15', expectedDate: '2024-01-30', deliveredDate: null,         createdBy: 'Admin',   notes: 'Drawer channels & handles — cancelled due to project delay' },
];

const initCategories = [
  { key: '1', name: 'Plywood',         description: 'BWP & BWR/Commercial plywood sheets for cabinets & panels',    items: 2, reorderLevel: 20,  defaultUnit: 'sheet', status: 'Active' },
  { key: '2', name: 'MDF & Board',     description: 'MDF sheets & block board for shutters and TV panels',           items: 2, reorderLevel: 10,  defaultUnit: 'sheet', status: 'Active' },
  { key: '3', name: 'Laminates',       description: 'Matte & gloss laminate sheets for surface finishing',           items: 2, reorderLevel: 40,  defaultUnit: 'sheet', status: 'Active' },
  { key: '4', name: 'Acrylic & Veneer', description: 'High-gloss acrylic sheets & natural wood veneer finishes',    items: 2, reorderLevel: 5,   defaultUnit: 'sheet', status: 'Active' },
  { key: '5', name: 'Hardware',        description: 'Soft-close hinges, drawer channels & fitting hardware',         items: 2, reorderLevel: 50,  defaultUnit: 'pair',  status: 'Active' },
  { key: '6', name: 'Handles & Knobs', description: 'Profile handles, pull handles & cabinet knobs',                items: 3, reorderLevel: 30,  defaultUnit: 'pcs',   status: 'Active' },
  { key: '7', name: 'Tools',           description: 'Carpentry hand tools and power tools for site work',            items: 0, reorderLevel: 5,   defaultUnit: 'pcs',   status: 'Active' },
];

const initMovements = [
  { key: '1', date: '2024-04-07 10:30', product: 'BWP Plywood 18mm (8x4ft)',         sku: 'PLY-BWP-18',  category: 'Plywood',         type: 'Stock In',   quantity: 60,  balanceBefore: 60,  balanceAfter: 120, reference: 'PO-2024-001', notes: 'Received from CenturyPly for Luxury Villa project',      user: 'Admin'   },
  { key: '2', date: '2024-04-07 14:15', product: 'Matte Laminate Sheet (8x4ft)',      sku: 'LAM-MAT-001', category: 'Laminates',        type: 'Stock Out',  quantity: -20, balanceBefore: 220, balanceAfter: 200, reference: 'REQ-041',     notes: 'Issued for Penthouse Design kitchen shutters',            user: 'Manager' },
  { key: '3', date: '2024-04-06 11:00', product: 'Soft-Close Hinge (Hettich)',        sku: 'HNG-SFT-001', category: 'Hardware',         type: 'Adjustment', quantity: -5,  balanceBefore: 255, balanceAfter: 250, reference: 'ADJ-007',     notes: 'Physical count correction after site audit',              user: 'Admin'   },
  { key: '4', date: '2024-04-05 09:45', product: 'Pull Handle Aluminium Bar 128mm',   sku: 'HDL-PUL-128', category: 'Handles & Knobs',  type: 'Stock In',   quantity: 100, balanceBefore: 50,  balanceAfter: 150, reference: 'PO-2024-003', notes: 'New stock received from Ebco Hardware',                   user: 'Admin'   },
  { key: '5', date: '2024-04-04 16:30', product: 'MDF Sheet 18mm (8x4ft)',            sku: 'MDF-STD-18',  category: 'MDF & Board',      type: 'Stock Out',  quantity: -15, balanceBefore: 60,  balanceAfter: 45,  reference: 'REQ-039',     notes: 'Issued for Office Renovation TV unit shutters',           user: 'Manager' },
  { key: '6', date: '2024-04-03 13:00', product: 'Teak Veneer Sheet (8x4ft)',         sku: 'VNR-TEK-001', category: 'Acrylic & Veneer', type: 'Transfer',   quantity: -5,  balanceBefore: 5,   balanceAfter: 0,   reference: 'TRF-003',     notes: 'Transferred to Site Store - Mumbai for Farmhouse project', user: 'Admin'  },
];

// ─── Status Config ───────────────────────────────────────────────────────────

const itemStatusConfig = {
  'In Stock': { color: 'success', icon: <CheckCircleOutlined /> },
  'Low Stock': { color: 'warning', icon: <AlertOutlined /> },
  'Out of Stock': { color: 'error', icon: <CloseCircleOutlined /> },
};

const movementTypeConfig = {
  'Stock In': { color: '#52C41A', bgColor: 'rgba(82,196,26,0.1)', icon: <ArrowUpOutlined /> },
  'Stock Out': { color: '#FF4D4F', bgColor: 'rgba(255,77,79,0.1)', icon: <ArrowDownOutlined /> },
  'Adjustment': { color: '#FAAD14', bgColor: 'rgba(250,173,20,0.1)', icon: <SwapOutlined /> },
  'Transfer': { color: '#1677FF', bgColor: 'rgba(22,119,255,0.1)', icon: <BlockOutlined /> },
  'Return': { color: '#9254DE', bgColor: 'rgba(146,84,222,0.1)', icon: <CaretUpOutlined /> },
};

const poStatusConfig = {
  'Pending': { color: 'processing' },
  'In Transit': { color: 'warning' },
  'Delivered': { color: 'success' },
  'Cancelled': { color: 'error' },
};

// ─── Main Component ──────────────────────────────────────────────────────────

const InventoryPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';

  // ── Data State ──
  const [items, setItems] = useState(initItems);
  const [suppliers, setSuppliers] = useState(initSuppliers);
  const [orders, setOrders] = useState(initOrders);
  const [categories, setCategories] = useState(initCategories);
  const [movements, setMovements] = useState(initMovements);

  // ── UI State ──
  const [activeTab, setActiveTab] = useState(tab || 'overview');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [movTypeFilter, setMovTypeFilter] = useState('all');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [poStatusFilter, setPoStatusFilter] = useState('all');

  // ── Modal / Drawer State ──
  const [itemModal, setItemModal] = useState({ open: false, mode: 'add', record: null });
  const [viewDrawer, setViewDrawer] = useState({ open: false, record: null });
  const [movModal, setMovModal] = useState(false);
  const [supplierModal, setSupplierModal] = useState({ open: false, record: null });
  const [orderModal, setOrderModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState({ open: false, record: null });

  // ── Forms ──
  const [itemForm] = Form.useForm();
  const [movForm] = Form.useForm();
  const [supplierForm] = Form.useForm();
  const [orderForm] = Form.useForm();
  const [categoryForm] = Form.useForm();

  useEffect(() => { if (tab) setActiveTab(tab); }, [tab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/inventory/${key}`);
  };

  // ── Theme colors ──
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const cardBg = isDark ? '#0b2338' : '#ffffff';
  const borderColor = isDark ? '#1a4d72' : '#f0f0f0';
  const textSecondary = isDark ? '#a8b0ba' : '#666';
  const rowBg = isDark ? '#031726' : '#fafafa';
  const inputBg = isDark ? '#0b2338' : '#ffffff';

  // ── Stats ──
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.costPrice, 0);
  const lowCount = items.filter(i => i.status === 'Low Stock').length;
  const outCount = items.filter(i => i.status === 'Out of Stock').length;

  const stats = [
    { title: 'Total Items', value: items.length, suffix: 'SKUs', icon: <AppstoreOutlined />, color: '#1677FF' },
    { title: 'Low Stock Alerts', value: lowCount, icon: <AlertOutlined />, color: '#FAAD14' },
    { title: 'Out of Stock', value: outCount, icon: <ShoppingOutlined />, color: '#FF4D4F' },
    { title: 'Inventory Value', value: `₹${(totalValue / 100000).toFixed(1)}L`, icon: <DollarOutlined />, color: '#52C41A', noFormat: true },
  ];

  // ─── Filtered Data ───────────────────────────────────────────────────────

  const filteredItems = items.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = !q || i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.brand?.toLowerCase().includes(q);
    const matchCat = categoryFilter === 'all' || i.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const filteredMovements = movements.filter(m => {
    return movTypeFilter === 'all' || m.type === movTypeFilter;
  });

  const filteredSuppliers = suppliers.filter(s =>
    !supplierSearch || s.name.toLowerCase().includes(supplierSearch.toLowerCase()) || s.contact.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    poStatusFilter === 'all' || o.status === poStatusFilter
  );

  // ─── Item CRUD ───────────────────────────────────────────────────────────

  const openAddItem = () => {
    itemForm.resetFields();
    setItemModal({ open: true, mode: 'add', record: null });
  };

  const openEditItem = (record) => {
    itemForm.setFieldsValue({ ...record, tags: record.tags?.join(', ') });
    setItemModal({ open: true, mode: 'edit', record });
  };

  const handleSaveItem = async () => {
    try {
      const values = await itemForm.validateFields();
      const tagsArr = values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      if (itemModal.mode === 'add') {
        const newItem = {
          ...values,
          key: String(Date.now()),
          id: `INV-${String(items.length + 1).padStart(3, '0')}`,
          tags: tagsArr,
          lastUpdated: dayjs().format('YYYY-MM-DD'),
          status: values.quantity === 0 ? 'Out of Stock' : values.quantity <= values.minStock ? 'Low Stock' : 'In Stock',
        };
        setItems(prev => [...prev, newItem]);
        message.success('Item added successfully');
      } else {
        const updated = {
          ...itemModal.record,
          ...values,
          tags: tagsArr,
          lastUpdated: dayjs().format('YYYY-MM-DD'),
          status: values.quantity === 0 ? 'Out of Stock' : values.quantity <= values.minStock ? 'Low Stock' : 'In Stock',
        };
        setItems(prev => prev.map(i => i.key === itemModal.record.key ? updated : i));
        message.success('Item updated successfully');
      }
      setItemModal({ open: false, mode: 'add', record: null });
    } catch { /* validation error */ }
  };

  const deleteItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
    message.success('Item removed');
  };

  // ─── Movement CRUD ───────────────────────────────────────────────────────

  const handleSaveMovement = async () => {
    try {
      const values = await movForm.validateFields();
      const item = items.find(i => i.sku === values.sku);
      const qtyChange = values.type === 'Stock Out' ? -Math.abs(values.quantity) : Math.abs(values.quantity);
      const newMov = {
        key: String(Date.now()),
        date: dayjs().format('YYYY-MM-DD HH:mm'),
        product: item?.name || values.sku,
        sku: values.sku,
        category: item?.category || '',
        type: values.type,
        quantity: qtyChange,
        balanceBefore: item?.quantity || 0,
        balanceAfter: (item?.quantity || 0) + qtyChange,
        reference: values.reference || '-',
        notes: values.notes || '',
        user: 'Admin',
      };
      setMovements(prev => [newMov, ...prev]);
      if (item) {
        setItems(prev => prev.map(i => {
          if (i.sku !== values.sku) return i;
          const newQty = i.quantity + qtyChange;
          return {
            ...i,
            quantity: Math.max(0, newQty),
            status: newQty <= 0 ? 'Out of Stock' : newQty <= i.minStock ? 'Low Stock' : 'In Stock',
            lastUpdated: dayjs().format('YYYY-MM-DD'),
          };
        }));
      }
      movForm.resetFields();
      setMovModal(false);
      message.success('Stock movement recorded');
    } catch { /* validation error */ }
  };

  // ─── Supplier CRUD ───────────────────────────────────────────────────────

  const handleSaveSupplier = async () => {
    try {
      const values = await supplierForm.validateFields();
      if (supplierModal.record) {
        setSuppliers(prev => prev.map(s => s.key === supplierModal.record.key ? { ...s, ...values } : s));
        message.success('Supplier updated');
      } else {
        setSuppliers(prev => [...prev, {
          ...values,
          key: String(Date.now()),
          id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
          totalOrders: 0, totalValue: 0,
        }]);
        message.success('Supplier added');
      }
      setSupplierModal({ open: false, record: null });
    } catch { /* validation error */ }
  };

  // ─── Order CRUD ──────────────────────────────────────────────────────────

  const handleSaveOrder = async () => {
    try {
      const values = await orderForm.validateFields();
      const newPO = {
        key: String(Date.now()),
        poNumber: `PO-${dayjs().year()}-${String(orders.length + 1).padStart(3, '0')}`,
        supplier: values.supplier,
        items: values.items || 0,
        totalAmount: values.totalAmount || 0,
        status: 'Pending',
        orderDate: dayjs().format('YYYY-MM-DD'),
        expectedDate: values.expectedDate?.format('YYYY-MM-DD') || '',
        deliveredDate: null,
        createdBy: 'Admin',
        notes: values.notes || '',
      };
      setOrders(prev => [...prev, newPO]);
      orderForm.resetFields();
      setOrderModal(false);
      message.success('Purchase order created');
    } catch { /* validation error */ }
  };

  // ─── Category CRUD ───────────────────────────────────────────────────────

  const handleSaveCategory = async () => {
    try {
      const values = await categoryForm.validateFields();
      if (categoryModal.record) {
        setCategories(prev => prev.map(c => c.key === categoryModal.record.key ? { ...c, ...values } : c));
        message.success('Category updated');
      } else {
        setCategories(prev => [...prev, {
          ...values,
          key: String(Date.now()),
          items: 0,
          status: 'Active',
        }]);
        message.success('Category added');
      }
      setCategoryModal({ open: false, record: null });
    } catch { /* validation error */ }
  };

  // ─── Table Columns ───────────────────────────────────────────────────────

  const itemColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (text, r) => (
        <Space>
          <Avatar shape="square" size={40} icon={<DropboxOutlined />}
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: primaryColor, fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{text}</div>
            <div style={{ fontSize: 14, color: textSecondary }}>SKU: {r.sku} · {r.brand}</div>
          </div>
        </Space>
      ),
    },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 120 },
    {
      title: 'Stock Level',
      key: 'stock',
      width: 180,
      render: (_, r) => {
        const pct = r.maxStock ? Math.round((r.quantity / r.maxStock) * 100) : 0;
        const color = r.status === 'In Stock' ? '#52C41A' : r.status === 'Low Stock' ? '#FAAD14' : '#FF4D4F';
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontWeight: 700 }}>{r.quantity} {r.unit}</span>
              <span style={{ fontSize: 13, color: textSecondary }}>min: {r.minStock}</span>
            </div>
            <Progress percent={pct} showInfo={false} strokeColor={color} size="small" />
          </div>
        );
      },
    },
    {
      title: 'Unit Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 120,
      render: (v) => <Text strong>₹{v.toLocaleString('en-IN')}</Text>,
    },
    {
      title: 'Value',
      key: 'value',
      width: 120,
      render: (_, r) => <Text type="secondary">₹{(r.quantity * r.costPrice).toLocaleString('en-IN')}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s) => {
        const cfg = itemStatusConfig[s] || {};
        return <Tag icon={cfg.icon} color={cfg.color}>{s}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="View Detail">
            <Button type="text" size="small" icon={<EyeOutlined />}
              onClick={() => setViewDrawer({ open: true, record: r })} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />}
              onClick={() => openEditItem(r)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Remove this item?" okText="Yes" cancelText="No" onConfirm={() => deleteItem(r.key)}>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const movementColumns = [
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (d) => <Text style={{ fontSize: 14 }}>{d}</Text>,
    },
    {
      title: 'Product',
      key: 'product',
      width: 200,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{r.product}</div>
          <div style={{ fontSize: 14, color: textSecondary }}>SKU: {r.sku}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type) => {
        const cfg = movementTypeConfig[type] || {};
        return (
          <Tag style={{ color: cfg.color, background: cfg.bgColor, border: `1px solid ${cfg.color}30`, fontWeight: 600 }}>
            <Space size={4}>{cfg.icon}<span>{type}</span></Space>
          </Tag>
        );
      },
    },
    {
      title: 'Qty Change',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 110,
      render: (q) => (
        <Text strong style={{ color: q > 0 ? '#52C41A' : q < 0 ? '#FF4D4F' : '#FAAD14', fontSize: 18 }}>
          {q > 0 ? `+${q}` : q}
        </Text>
      ),
    },
    {
      title: 'Balance',
      key: 'balance',
      width: 140,
      render: (_, r) => (
        <Text style={{ fontSize: 16 }}>
          <span style={{ color: textSecondary }}>{r.balanceBefore}</span>
          <span style={{ margin: '0 4px', color: textSecondary }}>→</span>
          <span style={{ fontWeight: 700 }}>{r.balanceAfter}</span>
        </Text>
      ),
    },
    { title: 'Reference', dataIndex: 'reference', key: 'reference', width: 120, render: (v) => <Text code style={{ fontSize: 15 }}>{v}</Text> },
    { title: 'Notes', dataIndex: 'notes', key: 'notes', ellipsis: true },
    { title: 'User', dataIndex: 'user', key: 'user', width: 90 },
  ];

  const supplierColumns = [
    {
      title: 'Supplier',
      key: 'supplier',
      width: 240,
      render: (_, r) => (
        <Space>
          <Avatar size={38} style={{ background: primaryColor, fontWeight: 700, fontSize: 18 }}>
            {r.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 15, color: textSecondary }}>{r.contact}</div>
          </div>
        </Space>
      ),
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 150 },
    { title: 'City', dataIndex: 'city', key: 'city', width: 110 },
    { title: 'Payment Terms', dataIndex: 'paymentTerms', key: 'paymentTerms', width: 130 },
    { title: 'Orders', dataIndex: 'totalOrders', key: 'totalOrders', width: 90, render: v => <Badge count={v} style={{ background: primaryColor }} showZero /> },
    { title: 'Total Value', dataIndex: 'totalValue', key: 'totalValue', width: 130, render: v => `₹${v.toLocaleString('en-IN')}` },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 130,
      render: v => <Rate disabled defaultValue={v} style={{ fontSize: 14 }} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: v => <Tag color={v === 'Active' ? 'success' : 'default'}>{v}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />}
              onClick={() => { supplierForm.setFieldsValue(r); setSupplierModal({ open: true, record: r }); }} />
          </Tooltip>
          <Popconfirm title="Remove supplier?" onConfirm={() => { setSuppliers(prev => prev.filter(s => s.key !== r.key)); message.success('Supplier removed'); }}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const orderColumns = [
    { title: 'PO Number', dataIndex: 'poNumber', key: 'poNumber', width: 140, render: v => <Text code>{v}</Text> },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', width: 200 },
    { title: 'Items', dataIndex: 'items', key: 'items', width: 70 },
    { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount', width: 140, render: v => <Text strong>₹{v.toLocaleString('en-IN')}</Text> },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate', width: 120 },
    { title: 'Expected', dataIndex: 'expectedDate', key: 'expectedDate', width: 120 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s) => <Badge status={poStatusConfig[s]?.color || 'default'} text={s} />,
    },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy', width: 110 },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="Update Status">
            <Select
              size="small"
              value={r.status}
              style={{ width: 100 }}
              options={['Pending', 'In Transit', 'Delivered', 'Cancelled'].map(s => ({ value: s, label: s }))}
              onChange={val => setOrders(prev => prev.map(o => o.key === r.key ? { ...o, status: val, deliveredDate: val === 'Delivered' ? dayjs().format('YYYY-MM-DD') : o.deliveredDate } : o))}
            />
          </Tooltip>
          <Popconfirm title="Delete this PO?" onConfirm={() => { setOrders(prev => prev.filter(o => o.key !== r.key)); message.success('PO deleted'); }}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: 'Category',
      key: 'cat',
      width: 220,
      render: (_, r) => (
        <Space>
          <Avatar shape="square" size={34} icon={<TagOutlined />}
            style={{ background: isDark ? 'rgba(255,255,255,0.07)' : '#f5f5f5', color: primaryColor }} />
          <div>
            <div style={{ fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 13, color: textSecondary }}>{r.description}</div>
          </div>
        </Space>
      ),
    },
    { title: 'Items', dataIndex: 'items', key: 'items', width: 80, render: v => <Badge count={v} showZero style={{ background: primaryColor }} /> },
    { title: 'Reorder Level', dataIndex: 'reorderLevel', key: 'reorderLevel', width: 130, render: v => `${v} units` },
    { title: 'Default Unit', dataIndex: 'defaultUnit', key: 'defaultUnit', width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: v => <Tag color={v === 'Active' ? 'success' : 'default'}>{v}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      render: (_, r) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />}
            onClick={() => { categoryForm.setFieldsValue(r); setCategoryModal({ open: true, record: r }); }} />
          <Popconfirm title="Delete category?" onConfirm={() => { setCategories(prev => prev.filter(c => c.key !== r.key)); message.success('Category deleted'); }}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ─── Tab Items ───────────────────────────────────────────────────────────

  const tabItems = [
    {
      key: 'overview',
      label: <span><ShoppingOutlined /> Product Inventory</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <Space wrap>
              <Input
                prefix={<SearchOutlined style={{ color: textSecondary }} />}
                placeholder="Search name, SKU, brand..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                allowClear
                style={{ width: 280, borderRadius: 8 }}
              />
              <Select value={categoryFilter} onChange={setCategoryFilter} style={{ width: 150 }}>
                <Select.Option value="all">All Categories</Select.Option>
                {CATEGORIES.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
              </Select>
              <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="In Stock">In Stock</Select.Option>
                <Select.Option value="Low Stock">Low Stock</Select.Option>
                <Select.Option value="Out of Stock">Out of Stock</Select.Option>
              </Select>
            </Space>
            <Space>
              <Button
                icon={<SwapOutlined />}
                onClick={() => { movForm.resetFields(); setMovModal(true); }}
              >
                Stock Adjustment
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: primaryColor, border: 'none' }}
                onClick={openAddItem}
              >
                Add Item
              </Button>
            </Space>
          </div>
          <Table
            columns={itemColumns}
            dataSource={filteredItems}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 1000 }}
            rowClassName={() => ''}
            size="middle"
          />
        </div>
      ),
    },
    {
      key: 'movements',
      label: <span><HistoryOutlined /> Stock Movements</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <Space>
              <Select value={movTypeFilter} onChange={setMovTypeFilter} style={{ width: 160 }}>
                <Select.Option value="all">All Types</Select.Option>
                {Object.keys(movementTypeConfig).map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
              </Select>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: primaryColor, border: 'none' }}
              onClick={() => { movForm.resetFields(); setMovModal(true); }}
            >
              Add Movement
            </Button>
          </div>
          <Table
            columns={movementColumns}
            dataSource={filteredMovements}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
            size="middle"
          />
        </div>
      ),
    },
    {
      key: 'suppliers',
      label: <span><ShopOutlined /> Suppliers</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <Input
              prefix={<SearchOutlined style={{ color: textSecondary }} />}
              placeholder="Search supplier..."
              value={supplierSearch}
              onChange={e => setSupplierSearch(e.target.value)}
              allowClear
              style={{ width: 260, borderRadius: 8 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: primaryColor, border: 'none' }}
              onClick={() => { supplierForm.resetFields(); setSupplierModal({ open: true, record: null }); }}
            >
              Add Supplier
            </Button>
          </div>
          <Table
            columns={supplierColumns}
            dataSource={filteredSuppliers}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1100 }}
            size="middle"
          />
        </div>
      ),
    },
    {
      key: 'orders',
      label: <span><FileTextOutlined /> Purchase Orders</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <Select value={poStatusFilter} onChange={setPoStatusFilter} style={{ width: 160 }}>
              <Select.Option value="all">All Status</Select.Option>
              {['Pending', 'In Transit', 'Delivered', 'Cancelled'].map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: primaryColor, border: 'none' }}
              onClick={() => { orderForm.resetFields(); setOrderModal(true); }}
            >
              Create Purchase Order
            </Button>
          </div>
          <Table
            columns={orderColumns}
            dataSource={filteredOrders}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1050 }}
            size="middle"
          />
        </div>
      ),
    },
    {
      key: 'categories',
      label: <span><TagOutlined /> Categories</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: primaryColor, border: 'none' }}
              onClick={() => { categoryForm.resetFields(); setCategoryModal({ open: true, record: null }); }}
            >
              Add Category
            </Button>
          </div>
          <Table
            columns={categoryColumns}
            dataSource={categories}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 700 }}
            size="middle"
          />
        </div>
      ),
    },
  ];

  // ─── Common Modal style ──────────────────────────────────────────────────
  const modalStyles = {
    content: { background: cardBg, padding: 0 },
    header: { background: cardBg, borderBottom: `1px solid ${borderColor}`, padding: '16px 24px', margin: 0 },
    body: { padding: '24px', maxHeight: '70vh', overflowY: 'auto' },
    footer: { background: cardBg, borderTop: `1px solid ${borderColor}`, padding: '12px 24px', margin: 0 },
    mask: { backdropFilter: 'blur(2px)' },
  };

  const formLabelStyle = { color: isDark ? '#cdd5de' : '#333', fontWeight: 500 };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '0 0 24px' }}>
      <PageHeader
        title="Inventory Tracking"
        subtitle="Manage stocks, track movements and supplier orders"
        actions={
          <Space>
            <Button icon={<SwapOutlined />} onClick={() => { movForm.resetFields(); setMovModal(true); }}>
              Stock Adjustment
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: primaryColor, border: 'none' }}
              onClick={openAddItem}
            >
              Add New Item
            </Button>
          </Space>
        }
      />

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card style={{ borderRadius: 12, background: cardBg, border: `1px solid ${borderColor}` }}>
              <Statistic
                title={<span style={{ color: textSecondary, fontSize: 15 }}>{item.title}</span>}
                value={item.noFormat ? undefined : item.value}
                formatter={item.noFormat ? () => <span style={{ color: isDark ? '#f0f0f0' : '#1f1f1f', fontWeight: 700, fontSize: 22 }}>{item.value}</span> : undefined}
                suffix={item.suffix}
                prefix={<span style={{ color: item.color, marginRight: 8, fontSize: 20 }}>{item.icon}</span>}
                valueStyle={{ color: isDark ? '#f0f0f0' : '#1f1f1f', fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Card */}
      <Card
        style={{ borderRadius: 14, background: cardBg, border: `1px solid ${borderColor}` }}
        styles={{ body: { padding: '8px 24px 24px' } }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          type="line"
          size="middle"
        />
      </Card>

      {/* ─── Add / Edit Item Modal ──────────────────────────────────────── */}
      <Modal
        title={
          <Space>
            <DropboxOutlined style={{ color: primaryColor }} />
            <span>{itemModal.mode === 'add' ? 'Add New Item' : 'Edit Item'}</span>
          </Space>
        }
        open={itemModal.open}
        onOk={handleSaveItem}
        onCancel={() => setItemModal({ open: false, mode: 'add', record: null })}
        width={720}
        okText={itemModal.mode === 'add' ? 'Add Item' : 'Save Changes'}
        okButtonProps={{ style: { background: primaryColor, border: 'none' } }}
        styles={modalStyles}
        destroyOnClose
      >
        <Form form={itemForm} layout="vertical" size="middle">
          <Divider orientation="left" orientationMargin={0} style={{ color: textSecondary, fontSize: 14, borderColor }}>
            Basic Information
          </Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Product Name</span>} name="name" rules={[{ required: true, message: 'Enter product name' }]}>
                <Input placeholder="e.g. MacBook Pro M2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>SKU</span>} name="sku" rules={[{ required: true, message: 'Enter SKU' }]}>
                <Input placeholder="e.g. LAP-MBP-001" prefix={<BarcodeOutlined style={{ color: textSecondary }} />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Category</span>} name="category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  {CATEGORIES.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Brand / Model</span>} name="brand">
                <Input placeholder="e.g. Apple" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Unit of Measure</span>} name="unit" rules={[{ required: true }]}>
                <Select placeholder="Select unit">
                  {UNITS.map(u => <Select.Option key={u} value={u}>{u}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" orientationMargin={0} style={{ color: textSecondary, fontSize: 14, borderColor }}>
            Stock Details
          </Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Opening Quantity</span>} name="quantity" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Min Stock (Alert Level)</span>} name="minStock" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="5" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Max Stock</span>} name="maxStock">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="100" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Storage Location</span>} name="location">
                <Select placeholder="Select location">
                  {WAREHOUSES.map(w => <Select.Option key={w} value={w}>{w}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label={<span style={formLabelStyle}>Barcode / Serial</span>} name="barcode">
                <Input placeholder="Barcode or serial number" prefix={<AimOutlined style={{ color: textSecondary }} />} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" orientationMargin={0} style={{ color: textSecondary, fontSize: 14, borderColor }}>
            Pricing & Supplier
          </Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Cost Price (₹)</span>} name="costPrice" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" formatter={v => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v?.replace(/₹\s?|(,*)/g, '')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Selling Price (₹)</span>} name="sellingPrice">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" formatter={v => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v?.replace(/₹\s?|(,*)/g, '')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={formLabelStyle}>Supplier</span>} name="supplier">
                <Select placeholder="Select supplier" allowClear showSearch>
                  {suppliers.map(s => <Select.Option key={s.key} value={s.name}>{s.name}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" orientationMargin={0} style={{ color: textSecondary, fontSize: 14, borderColor }}>
            Additional Details
          </Divider>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={<span style={formLabelStyle}>Description</span>} name="description">
                <TextArea rows={2} placeholder="Product description..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span style={formLabelStyle}>Tags</span>} name="tags" extra={<Text style={{ fontSize: 13, color: textSecondary }}>Comma-separated: laptop, apple, premium</Text>}>
                <Input placeholder="laptop, apple, premium" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* ─── View Item Drawer ──────────────────────────────────────────── */}
      <Drawer
        title={
          <Space>
            <DropboxOutlined style={{ color: primaryColor }} />
            <span style={{ fontWeight: 700 }}>{viewDrawer.record?.name}</span>
            {viewDrawer.record && <Tag color={itemStatusConfig[viewDrawer.record.status]?.color}>{viewDrawer.record.status}</Tag>}
          </Space>
        }
        open={viewDrawer.open}
        onClose={() => setViewDrawer({ open: false, record: null })}
        width={540}
        styles={{ body: { background: cardBg, padding: 24 }, header: { background: cardBg, borderBottom: `1px solid ${borderColor}` }, wrapper: { background: cardBg } }}
        extra={
          <Button size="small" icon={<EditOutlined />} onClick={() => { openEditItem(viewDrawer.record); setViewDrawer({ open: false, record: null }); }}>
            Edit
          </Button>
        }
      >
        {viewDrawer.record && (() => {
          const r = viewDrawer.record;
          const pct = r.maxStock ? Math.round((r.quantity / r.maxStock) * 100) : 0;
          const statusColor = r.status === 'In Stock' ? '#52C41A' : r.status === 'Low Stock' ? '#FAAD14' : '#FF4D4F';
          return (
            <>
              <Card style={{ background: isDark ? '#031726' : '#fafafa', border: `1px solid ${borderColor}`, borderRadius: 10, marginBottom: 20 }}>
                <Row gutter={16} align="middle">
                  <Col>
                    <Avatar shape="square" size={60} icon={<DropboxOutlined />}
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f0', color: primaryColor, fontSize: 28 }} />
                  </Col>
                  <Col flex={1}>
                    <Title level={5} style={{ margin: 0 }}>{r.name}</Title>
                    <Text style={{ color: textSecondary, fontSize: 14 }}>SKU: {r.sku} · {r.brand}</Text><br />
                    <Space wrap style={{ marginTop: 6 }}>
                      {r.tags?.map(t => <Tag key={t} style={{ fontSize: 13 }}>{t}</Tag>)}
                    </Space>
                  </Col>
                </Row>
              </Card>

              <Row gutter={12} style={{ marginBottom: 20 }}>
                {[
                  { label: 'In Stock', value: `${r.quantity} ${r.unit}`, color: statusColor },
                  { label: 'Cost Price', value: `₹${r.costPrice?.toLocaleString('en-IN')}`, color: primaryColor },
                  { label: 'Total Value', value: `₹${(r.quantity * r.costPrice)?.toLocaleString('en-IN')}`, color: '#1677FF' },
                ].map((s, i) => (
                  <Col span={8} key={i}>
                    <Card size="small" style={{ background: isDark ? '#031726' : '#fafafa', border: `1px solid ${borderColor}`, borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 13, color: textSecondary }}>{s.label}</div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 14, color: textSecondary }}>Stock Level</Text>
                  <Text style={{ fontSize: 14 }}>{r.quantity} / {r.maxStock} {r.unit}</Text>
                </div>
                <Progress percent={pct} strokeColor={statusColor} size={[null, 8]} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text style={{ fontSize: 13, color: textSecondary }}>Min: {r.minStock} {r.unit}</Text>
                  <Text style={{ fontSize: 13, color: textSecondary }}>Max: {r.maxStock} {r.unit}</Text>
                </div>
              </div>

              <Divider style={{ borderColor, margin: '16px 0' }} />

              <Descriptions column={2} size="small" labelStyle={{ color: textSecondary, fontWeight: 500 }} contentStyle={{ fontWeight: 500 }}>
                <Descriptions.Item label="Category">{r.category}</Descriptions.Item>
                <Descriptions.Item label="Unit">{r.unit}</Descriptions.Item>
                <Descriptions.Item label="Supplier">{r.supplier || '—'}</Descriptions.Item>
                <Descriptions.Item label="Location">{r.location || '—'}</Descriptions.Item>
                <Descriptions.Item label="Selling Price">₹{r.sellingPrice?.toLocaleString('en-IN') || '—'}</Descriptions.Item>
                <Descriptions.Item label="Barcode">{r.barcode || '—'}</Descriptions.Item>
                <Descriptions.Item label="Last Updated" span={2}>{r.lastUpdated}</Descriptions.Item>
                {r.description && <Descriptions.Item label="Description" span={2}>{r.description}</Descriptions.Item>}
              </Descriptions>

              <Divider style={{ borderColor, margin: '16px 0' }} />
              <Text style={{ fontWeight: 600, color: textSecondary, fontSize: 14 }}>RECENT MOVEMENTS</Text>
              <div style={{ marginTop: 10 }}>
                {movements.filter(m => m.sku === r.sku).slice(0, 4).map(m => (
                  <div key={m.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: 8, background: isDark ? '#031726' : '#f9f9f9', marginBottom: 6 }}>
                    <Space size={8}>
                      <span style={{ color: movementTypeConfig[m.type]?.color }}>{movementTypeConfig[m.type]?.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{m.type}</div>
                        <div style={{ fontSize: 13, color: textSecondary }}>{m.date}</div>
                      </div>
                    </Space>
                    <Text strong style={{ color: m.quantity > 0 ? '#52C41A' : '#FF4D4F' }}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </Text>
                  </div>
                ))}
                {movements.filter(m => m.sku === r.sku).length === 0 && (
                  <Text style={{ color: textSecondary, fontSize: 14 }}>No movements recorded yet.</Text>
                )}
              </div>
            </>
          );
        })()}
      </Drawer>

      {/* ─── Stock Movement Modal ──────────────────────────────────────── */}
      <Modal
        title={<Space><SwapOutlined style={{ color: primaryColor }} /><span>Record Stock Movement</span></Space>}
        open={movModal}
        onOk={handleSaveMovement}
        onCancel={() => setMovModal(false)}
        okText="Save Movement"
        okButtonProps={{ style: { background: primaryColor, border: 'none' } }}
        width={520}
        styles={modalStyles}
        destroyOnClose
      >
        <Form form={movForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Product (SKU)</span>} name="sku" rules={[{ required: true, message: 'Select product' }]}>
                <Select placeholder="Select product" showSearch>
                  {items.map(i => (
                    <Select.Option key={i.key} value={i.sku}>
                      <div style={{ fontSize: 14 }}>{i.name}</div>
                      <div style={{ fontSize: 14, color: textSecondary }}>{i.sku} · Stock: {i.quantity}</div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Movement Type</span>} name="type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  {Object.keys(movementTypeConfig).map(t => (
                    <Select.Option key={t} value={t}>
                      <Space size={6}>
                        <span style={{ color: movementTypeConfig[t].color }}>{movementTypeConfig[t].icon}</span>
                        {t}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Quantity</span>} name="quantity" rules={[{ required: true, type: 'number', min: 1 }]}>
                <InputNumber style={{ width: '100%' }} min={1} placeholder="Enter quantity" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Reference No.</span>} name="reference">
                <Input placeholder="e.g. PO-2024-005" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span style={formLabelStyle}>Notes</span>} name="notes">
                <TextArea rows={2} placeholder="Reason or additional notes..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* ─── Supplier Modal ────────────────────────────────────────────── */}
      <Modal
        title={<Space><TeamOutlined style={{ color: primaryColor }} /><span>{supplierModal.record ? 'Edit Supplier' : 'Add Supplier'}</span></Space>}
        open={supplierModal.open}
        onOk={handleSaveSupplier}
        onCancel={() => setSupplierModal({ open: false, record: null })}
        okText={supplierModal.record ? 'Save Changes' : 'Add Supplier'}
        okButtonProps={{ style: { background: primaryColor, border: 'none' } }}
        width={640}
        styles={modalStyles}
        destroyOnClose
      >
        <Form form={supplierForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Supplier Name</span>} name="name" rules={[{ required: true }]}>
                <Input placeholder="Company / supplier name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Contact Person</span>} name="contact">
                <Input placeholder="Full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Phone</span>} name="phone" rules={[{ required: true }]}>
                <Input placeholder="+91 00000 00000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Email</span>} name="email" rules={[{ type: 'email' }]}>
                <Input placeholder="email@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>GST Number</span>} name="gst">
                <Input placeholder="27XXXXX1234X1Z5" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Payment Terms</span>} name="paymentTerms">
                <Select placeholder="Select terms">
                  {['Advance', 'Net 7', 'Net 15', 'Net 30', 'Net 45', 'Net 60'].map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>City</span>} name="city">
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>State</span>} name="state">
                <Input placeholder="State" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Rating</span>} name="rating">
                <Rate />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Status</span>} name="status" initialValue="Active">
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* ─── Purchase Order Modal ──────────────────────────────────────── */}
      <Modal
        title={<Space><FileTextOutlined style={{ color: primaryColor }} /><span>Create Purchase Order</span></Space>}
        open={orderModal}
        onOk={handleSaveOrder}
        onCancel={() => setOrderModal(false)}
        okText="Create PO"
        okButtonProps={{ style: { background: primaryColor, border: 'none' } }}
        width={560}
        styles={modalStyles}
        destroyOnClose
      >
        <Form form={orderForm} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={<span style={formLabelStyle}>Supplier</span>} name="supplier" rules={[{ required: true }]}>
                <Select placeholder="Select supplier" showSearch>
                  {suppliers.filter(s => s.status === 'Active').map(s => (
                    <Select.Option key={s.key} value={s.name}>{s.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Number of Items</span>} name="items" rules={[{ required: true, type: 'number', min: 1 }]}>
                <InputNumber style={{ width: '100%' }} min={1} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Total Amount (₹)</span>} name="totalAmount" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="0.00"
                  formatter={v => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={v => v?.replace(/₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Expected Delivery</span>} name="expectedDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={d => d && d.isBefore(dayjs().startOf('day'))} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={<span style={formLabelStyle}>Notes</span>} name="notes">
                <TextArea rows={2} placeholder="Order details or special instructions..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* ─── Category Modal ────────────────────────────────────────────── */}
      <Modal
        title={<Space><TagOutlined style={{ color: primaryColor }} /><span>{categoryModal.record ? 'Edit Category' : 'Add Category'}</span></Space>}
        open={categoryModal.open}
        onOk={handleSaveCategory}
        onCancel={() => setCategoryModal({ open: false, record: null })}
        okText={categoryModal.record ? 'Save Changes' : 'Add Category'}
        okButtonProps={{ style: { background: primaryColor, border: 'none' } }}
        width={480}
        styles={modalStyles}
        destroyOnClose
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item label={<span style={formLabelStyle}>Category Name</span>} name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Electronics" />
          </Form.Item>
          <Form.Item label={<span style={formLabelStyle}>Description</span>} name="description">
            <TextArea rows={2} placeholder="Brief description of this category" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Default Unit</span>} name="defaultUnit" rules={[{ required: true }]}>
                <Select placeholder="Select unit">
                  {UNITS.map(u => <Select.Option key={u} value={u}>{u}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Reorder Level</span>} name="reorderLevel" rules={[{ type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={formLabelStyle}>Status</span>} name="status" initialValue="Active">
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
