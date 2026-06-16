import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateProject } from '@/store/slices/projectSlice';
import useIsMobile from '@/hooks/useIsMobile';
import QuoteBuilder from '@/components/quotes/QuoteBuilder';
import { Button, Avatar, Select, Space, Modal, Form, Input, Row, Col, Progress, Checkbox, message } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FilePdfOutlined,
  QuestionCircleOutlined,
  CommentOutlined,
  SnippetsOutlined,
  FlagOutlined,
  SendOutlined,
  TeamOutlined,
  PushpinOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ToolOutlined,
  DollarCircleOutlined,
  FileAddOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { ClipboardList, Folder, FileText, User, HardHat } from 'lucide-react';

const MOCK_FILES = {
  designFiles: [
    { id: 1, name: 'Drawing Final', date: 'Jan 8, 2026' },
    { id: 2, name: 'Floor Plan', date: 'Jan 8, 2026' },
    { id: 3, name: 'Unit Placement', date: 'Jan 8, 2026' },
    { id: 4, name: 'Floor Plan Final', date: 'Jan 8, 2026' },
  ],
  schedules: [
    { id: 1, name: 'Execution Schedule', date: 'Jan 8, 2026' },
    { id: 2, name: 'Design Schedule', date: 'Jan 8, 2026' },
  ],
  otherRecords: [
    { id: 1, name: 'Project Docket', date: 'Jan 8, 2026' },
    { id: 2, name: 'Builder Floor Plan', date: 'Dec 9, 2025' },
  ],
};

const SIDEBAR_TABS = [
  { key: 'Project Detail', label: 'Project Detail', icon: <ClipboardList size={19} /> },
  { key: 'Files', label: 'Files', icon: <Folder size={19} /> },
  { key: 'User Requirement', label: 'User Requirement', icon: <QuestionCircleOutlined /> },
  { key: 'Notes', label: 'Notes', icon: <CommentOutlined /> },
  { key: 'Quotes', label: 'Quotes', icon: <SnippetsOutlined /> },
  { key: 'Orders', label: 'Orders', icon: <FileText size={19} /> },
  { key: 'Tasks', label: 'Tasks', icon: <FlagOutlined /> },
  { key: 'Purchase Request', label: 'Purchase Request', icon: <ShoppingCartOutlined /> },
  { key: 'Inventory', label: 'Inventory', icon: <AppstoreOutlined /> },
  { key: 'Activities', label: 'Activities', icon: <ToolOutlined /> },
  { key: 'Financial', label: 'Financial', icon: <DollarCircleOutlined /> },
  { key: 'Raise Invoice', label: 'Raise Invoice', icon: <FileAddOutlined /> },
];

const REQUIREMENT_QUESTIONS = [
  { key: 'modularKitchen', area: 'Kitchen Planning', question: 'Do you need a high-storage modular kitchen with tall pantry units?' },
  { key: 'falseCeiling', area: 'Ceiling Design', question: 'Would you like a false ceiling with layered lighting in key rooms?' },
  { key: 'wardrobeSystems', area: 'Bedroom Storage', question: 'Should we include sliding or soft-close wardrobe systems?' },
  { key: 'studyCorner', area: 'Work From Home', question: 'Do you want a compact study or work-from-home corner integrated into the layout?' },
  { key: 'poojaUnit', area: 'Custom Joinery', question: 'Would you like a dedicated pooja unit or display niche in the design?' },
];

const INITIAL_REQUIREMENT_ANSWERS = {
  modularKitchen: 'Yes',
  falseCeiling: 'Yes',
  wardrobeSystems: 'Yes',
  studyCorner: 'No',
  poojaUnit: 'Yes',
};

const INITIAL_PROJECT_NOTES = [
  {
    id: 1,
    title: 'Living room finish preference',
    body: 'Client prefers warm oak laminates and muted beige fabrics for the common areas.',
    category: 'Design',
    mark: 'Action Required',
    updated: 'Today, 11:20 AM',
    owner: 'Kavya S.',
    pinned: true,
  },
  {
    id: 2,
    title: 'Site access timing',
    body: 'Building access is open from 10 AM to 5 PM on weekdays only. Vendor visits need pre-approval.',
    category: 'Execution',
    mark: 'Reference',
    updated: 'Yesterday, 6:45 PM',
    owner: 'Arjun M.',
    pinned: false,
  },
  {
    id: 3,
    title: 'Budget revision discussion',
    body: 'Client agreed to review premium veneer upgrade after the revised quotation is shared.',
    category: 'Commercial',
    mark: 'Resolved',
    updated: 'May 11, 2026',
    owner: 'Super Admin',
    pinned: false,
  },
];

const QUOTE_LINE_ITEMS = [
  { id: 1, title: 'Modular kitchen package', scope: 'Base units, wall units, tall pantry and hardware', amount: 'Rs. 6,80,000' },
  { id: 2, title: 'Wardrobes and bedroom storage', scope: 'Sliding shutters, lofts and internal accessories', amount: 'Rs. 8,40,000' },
  { id: 3, title: 'Living and dining carpentry', scope: 'TV unit, crockery, shoe storage and foyer paneling', amount: 'Rs. 5,60,000' },
  { id: 4, title: 'Lighting and ceiling package', scope: 'False ceiling, profile lights and feature fixtures', amount: 'Rs. 3,90,000' },
];

const QUOTE_HISTORY = [
  { id: 'QT-2026-014', version: 'Rev 03', status: 'Sent to Client', updated: 'May 12, 2026', amount: 'Rs. 24,80,000' },
  { id: 'QT-2026-011', version: 'Rev 02', status: 'Internal Review', updated: 'May 8, 2026', amount: 'Rs. 24,10,000' },
  { id: 'QT-2026-008', version: 'Rev 01', status: 'Approved', updated: 'Apr 28, 2026', amount: 'Rs. 23,60,000' },
];

const INITIAL_QUOTES = [
  {
    id: 'QT-2026-014',
    quoteNo: 'QT-2026-014',
    version: 'Rev 03',
    validUntil: '2026-05-24',
    status: 'Draft',
    amount: 2480000,
    summary: 'Complete interior scope for kitchen, bedrooms, living spaces and ceiling package with modular storage, premium hardware and final installation.',
    lineItems: QUOTE_LINE_ITEMS,
    updated: 'May 12, 2026',
  },
  {
    id: 'QT-2026-011',
    quoteNo: 'QT-2026-011',
    version: 'Rev 02',
    validUntil: '2026-05-18',
    status: 'Internal Review',
    amount: 2410000,
    summary: 'Revised carpentry, wardrobes, and lighting proposal aligned with updated client discussion.',
    lineItems: QUOTE_LINE_ITEMS.slice(0, 3),
    updated: 'May 8, 2026',
  },
  {
    id: 'QT-2026-008',
    quoteNo: 'QT-2026-008',
    version: 'Rev 01',
    validUntil: '2026-05-06',
    status: 'Approved',
    amount: 2360000,
    summary: 'Initial approved quotation covering modular kitchen, wardrobes, and common area furniture.',
    lineItems: QUOTE_LINE_ITEMS.slice(0, 2),
    updated: 'Apr 28, 2026',
  },
];

const ORDER_HISTORY = [
  { id: 'ORD-736-004', stage: 'Production Ready', date: 'Jan 8, 2026', amount: 'Rs. 9,46,886' },
  { id: 'ORD-736-003', stage: 'Procurement', date: 'Jan 6, 2026', amount: 'Rs. 9,21,523' },
  { id: 'ORD-736-002', stage: 'Design Freeze', date: 'Dec 28, 2025', amount: 'Rs. 10,06,513' },
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-736-004',
    orderNo: 'ORD-736-004',
    linkedQuote: 'QT-2026-014',
    executionStart: '2026-05-27',
    installationTarget: '2026-06-18',
    status: 'Production Ready',
    amount: 946886,
    commercialNotes: 'Advance received, site readiness pending final measurement sign-off, premium hardware to be procured after approval.',
    updated: '2026-05-14',
  },
  {
    id: 'ORD-736-003',
    orderNo: 'ORD-736-003',
    linkedQuote: 'QT-2026-011',
    executionStart: '2026-05-18',
    installationTarget: '2026-06-02',
    status: 'Procurement',
    amount: 921523,
    commercialNotes: 'Vendor booking in progress for lighting and specialty hardware.',
    updated: '2026-05-10',
  },
  {
    id: 'ORD-736-002',
    orderNo: 'ORD-736-002',
    linkedQuote: 'QT-2026-008',
    executionStart: '2026-05-12',
    installationTarget: '2026-05-28',
    status: 'Design Freeze',
    amount: 1006513,
    commercialNotes: 'Scope locked for factory release and execution planning.',
    updated: '2026-05-03',
  },
];

const OUT_OF_STOCK_PRODUCTS = [
  { id: 'inv-001', name: 'Soft Close Hinges', sku: 'HINGE-SC-204', available: 0, reorderLevel: 40, suggestedQty: 60, vendor: 'Ebco', unit: 'pcs' },
  { id: 'inv-002', name: 'Profile LED Strip 3000K', sku: 'LED-PR-3000', available: 3, reorderLevel: 20, suggestedQty: 30, vendor: 'Philips', unit: 'rolls' },
  { id: 'inv-003', name: 'Walnut Veneer Sheet', sku: 'VEN-WAL-09', available: 1, reorderLevel: 12, suggestedQty: 18, vendor: 'Century', unit: 'sheets' },
];

const INITIAL_PURCHASE_REQUESTS = [
  { id: 'PR-2026-041', product: 'Soft Close Hinges', sku: 'HINGE-SC-204', qty: '60 pcs', requestedBy: 'Rohan K.', priority: 'High', expectedBy: '2026-05-20', status: 'In Review' },
  { id: 'PR-2026-038', product: 'Walnut Veneer Sheet', sku: 'VEN-WAL-09', qty: '18 sheets', requestedBy: 'Kavya S.', priority: 'High', expectedBy: '2026-05-18', status: 'Raised' },
  { id: 'PR-2026-033', product: 'Profile LED Strip 3000K', sku: 'LED-PR-3000', qty: '24 rolls', requestedBy: 'Deepak R.', priority: 'Medium', expectedBy: '2026-05-15', status: 'Ordered' },
];

const FACTORY_INVENTORY = [
  { id: 1, product: 'BWP Plywood 19mm', category: 'Boards', sku: 'PLY-BWP-19', available: 42, reserved: 18, reorderLevel: 20, location: 'Rack A-03', status: 'In Stock' },
  { id: 2, product: 'Soft Close Hinges', category: 'Hardware', sku: 'HINGE-SC-204', available: 0, reserved: 24, reorderLevel: 40, location: 'Hardware Bin 02', status: 'Out of Stock' },
  { id: 3, product: 'Profile LED Strip 3000K', category: 'Lighting', sku: 'LED-PR-3000', available: 3, reserved: 8, reorderLevel: 20, location: 'Electrical Shelf 04', status: 'Low Stock' },
  { id: 4, product: 'Walnut Veneer Sheet', category: 'Finish', sku: 'VEN-WAL-09', available: 1, reserved: 10, reorderLevel: 12, location: 'Veneer Rack 01', status: 'Low Stock' },
  { id: 5, product: 'Aluminium Profile Handle', category: 'Hardware', sku: 'AL-HDL-122', available: 56, reserved: 14, reorderLevel: 25, location: 'Hardware Bin 08', status: 'In Stock' },
];

const ACTIVITY_WORK_OPTIONS = [
  { value: 'ORD-736-004 / Modular kitchen fabrication', orderId: 'ORD-736-004', area: 'Modular Kitchen' },
  { value: 'ORD-736-004 / Master wardrobe shutter fitting', orderId: 'ORD-736-004', area: 'Master Bedroom' },
  { value: 'ORD-736-003 / False ceiling lighting prep', orderId: 'ORD-736-003', area: 'Living Room' },
  { value: 'ORD-736-002 / Site measurement closure', orderId: 'ORD-736-002', area: 'Site Coordination' },
];

const ACTIVITY_TEAM_OPTIONS = ['Factory Team A', 'Installation Crew 2', 'Electrical Partner', 'Site Supervisor'];

const INITIAL_PROJECT_ACTIVITIES = [
  { id: 'ACT-001', workItem: 'ORD-736-004 / Modular kitchen fabrication', orderId: 'ORD-736-004', area: 'Modular Kitchen', owner: 'Factory Team A', startDate: '2026-05-16', estimatedDays: 8, completionDate: '2026-05-24', status: 'In Progress' },
  { id: 'ACT-002', workItem: 'ORD-736-003 / False ceiling lighting prep', orderId: 'ORD-736-003', area: 'Living Room', owner: 'Electrical Partner', startDate: '2026-05-12', estimatedDays: 4, completionDate: '2026-05-16', status: 'Completed' },
  { id: 'ACT-003', workItem: 'ORD-736-004 / Master wardrobe shutter fitting', orderId: 'ORD-736-004', area: 'Master Bedroom', owner: 'Installation Crew 2', startDate: '2026-05-19', estimatedDays: 5, completionDate: '2026-05-24', status: 'Planned' },
];

const PROJECT_FINANCIALS = {
  approvedAmount: 2480000,
  paidAmount: 1725000,
  balanceAmount: 755000,
  nextDueAmount: 420000,
  paymentProgress: 70,
};

const PAYMENT_HISTORY = [
  { id: 'PAY-001', date: '2026-04-28', milestone: 'Booking Advance', mode: 'Bank Transfer', amount: 500000, status: 'Received', note: 'Initial confirmation payment' },
  { id: 'PAY-002', date: '2026-05-04', milestone: 'Design Freeze', mode: 'Cheque', amount: 725000, status: 'Received', note: 'Approved after design sign-off' },
  { id: 'PAY-003', date: '2026-05-10', milestone: 'Production Advance', mode: 'UPI', amount: 500000, status: 'Received', note: 'Cleared before factory release' },
  { id: 'PAY-004', date: '2026-05-22', milestone: 'Installation Advance', mode: 'Pending', amount: 420000, status: 'Scheduled', note: 'Due before on-site execution' },
];

const INITIAL_INVOICES = [
  {
    id: 'INV-PRJ-001-001',
    invoiceNo: 'INV-PRJ-001-001',
    invoiceDate: '2026-05-14',
    dueDate: '2026-05-21',
    invoiceType: 'Tax Invoice',
    status: 'Draft',
    subTotal: 640000,
    gstAmount: 115200,
    totalAmount: 755200,
    billToName: 'Rahul Sharma',
    billToEmail: 'rahul@example.com',
    billToPhone: '98765 43210',
    notes: 'Installation stage advance invoice.',
  },
  {
    id: 'INV-PRJ-001-000',
    invoiceNo: 'INV-PRJ-001-000',
    invoiceDate: '2026-05-02',
    dueDate: '2026-05-09',
    invoiceType: 'Proforma Invoice',
    status: 'Sent',
    subTotal: 500000,
    gstAmount: 90000,
    totalAmount: 590000,
    billToName: 'Rahul Sharma',
    billToEmail: 'rahul@example.com',
    billToPhone: '98765 43210',
    notes: 'Production advance invoice.',
  },
];

const PROJECT_TEAM = ['Kavya S.', 'Arjun M.', 'Rohan K.', 'Deepak R.'];
const TASK_TYPES = ['Design', 'Site Visit', 'BOQ', 'Procurement', 'Client Meeting'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High'];
const TASK_STATUSES = ['Todo', 'In Progress', 'Complete'];
const NOTE_CATEGORIES = ['Design', 'Execution', 'Commercial', 'Client Follow-up'];
const NOTE_MARKS = ['Action Required', 'Reference', 'Resolved'];
const QUOTE_STATUSES = ['Draft', 'Internal Review', 'Sent to Client', 'Follow-up', 'Approved'];
const REQUEST_STATUSES = ['Raised', 'In Review', 'Ordered'];
const ORDER_STATUSES = ['Draft', 'Procurement', 'Production Ready', 'Delivered'];
const ACTIVITY_STATUSES = ['Planned', 'In Progress', 'Completed'];
const INVOICE_STATUSES = ['Draft', 'Sent', 'Paid', 'Cancelled'];
const INVOICE_TYPES = ['Tax Invoice', 'Proforma Invoice'];

const subStages = {
  Sales: ['Initial Discussion', 'Site Visit', 'Proposal Sent', 'Negotiation'],
  Designing: ['BOQ Discussion', 'Concept Design', 'Design Approval', 'Working Drawing'],
  Execution: ['Material Procurement', 'Civil Work', 'Carpentry', 'Finishing'],
  Snags: ['Snag List', 'Rectification', 'Final Check'],
  Handover: ['Final Walkthrough', 'Handover Done'],
  Completed: ['Feedback', 'Closed'],
};

const BADGE_STYLES = {
  accent: { bg: 'rgba(214,159,109,0.14)', color: '#a7662f', border: 'rgba(214,159,109,0.28)' },
  success: { bg: 'rgba(34,197,94,0.14)', color: '#15803d', border: 'rgba(34,197,94,0.28)' },
  warning: { bg: 'rgba(245,158,11,0.15)', color: '#b45309', border: 'rgba(245,158,11,0.28)' },
  info: { bg: 'rgba(59,130,246,0.14)', color: '#1d4ed8', border: 'rgba(59,130,246,0.24)' },
  neutral: { bg: 'rgba(107,114,128,0.14)', color: '#4b5563', border: 'rgba(107,114,128,0.24)' },
};

const BadgePill = ({ label, tone = 'neutral' }) => {
  const style = BADGE_STYLES[tone] || BADGE_STYLES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
};

const DataTable = ({ columns, rows, emptyText = 'No records found' }) => {
  const tableMinWidth = Math.max(640, columns.length * 120);

  return (
    <div style={{ overflowX: 'auto', width: '100%', minWidth: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: tableMinWidth }}>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                style={{
                  textAlign: column.align || 'left',
                  padding: '12px 14px',
                  background: 'var(--primary-soft)',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 700,
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '22px 14px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map(column => (
                  <td
                    key={column.key}
                    style={{
                      padding: '14px',
                      borderBottom: rowIndex < rows.length - 1 ? '1px solid var(--border-soft)' : 'none',
                      verticalAlign: 'top',
                      color: 'var(--text)',
                      fontSize: 14,
                      textAlign: column.align || 'left',
                      wordBreak: 'break-word',
                    }}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const createSeedTasks = (project) => [
  {
    id: `task-${project?.id || 'seed'}-1`,
    title: 'Finalize mood board and material palette',
    assignee: 'Kavya S.',
    dueDate: '2026-05-18',
    status: 'In Progress',
    priority: 'High',
    type: 'Design',
  },
  {
    id: `task-${project?.id || 'seed'}-2`,
    title: 'Schedule detailed site measurement visit',
    assignee: 'Arjun M.',
    dueDate: '2026-05-19',
    status: 'Todo',
    priority: 'Medium',
    type: 'Site Visit',
  },
  {
    id: `task-${project?.id || 'seed'}-3`,
    title: 'Prepare revised BOQ for client review',
    assignee: 'Rohan K.',
    dueDate: '2026-05-22',
    status: 'Complete',
    priority: 'High',
    type: 'BOQ',
  },
];

const getNoteTone = (mark) => {
  if (mark === 'Action Required') return 'warning';
  if (mark === 'Resolved') return 'success';
  return 'info';
};

const getQuoteTone = (status) => {
  if (status === 'Approved') return 'success';
  if (status === 'Sent to Client') return 'accent';
  if (status === 'Internal Review') return 'info';
  return 'neutral';
};

const getOrderTone = (stage) => {
  if (stage === 'Production Ready') return 'success';
  if (stage === 'Procurement') return 'accent';
  return 'info';
};

const getTaskTone = (status) => {
  if (status === 'Complete' || status === 'Completed') return 'success';
  if (status === 'In Progress') return 'info';
  return 'neutral';
};

const getRequestTone = (status) => {
  if (status === 'Ordered') return 'success';
  if (status === 'In Review') return 'accent';
  return 'warning';
};

const getInventoryTone = (status) => {
  if (status === 'In Stock') return 'success';
  if (status === 'Low Stock') return 'warning';
  return 'neutral';
};

const getActivityTone = (status) => {
  if (status === 'Completed') return 'success';
  if (status === 'In Progress') return 'info';
  return 'accent';
};

const getPaymentTone = (status) => {
  if (status === 'Received') return 'success';
  if (status === 'Scheduled') return 'warning';
  return 'neutral';
};

const getInvoiceTone = (status) => {
  if (status === 'Paid') return 'success';
  if (status === 'Sent') return 'accent';
  if (status === 'Cancelled') return 'neutral';
  return 'info';
};

const getPriorityTone = (priority) => {
  if (priority === 'High') return 'warning';
  if (priority === 'Medium') return 'accent';
  return 'neutral';
};

const splitPhone = (value) => {
  const text = String(value || '').trim();
  if (text.startsWith('+91')) return { phoneCode: '+91', phoneNumber: text.replace(/^\+91\s*/, '') };
  return { phoneCode: '+91', phoneNumber: text };
};

const formatDisplayDate = (value) => {
  if (!value) return '';
  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
};

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const InfoRow = ({ label, value, isDark }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ fontSize: 14, color: isDark ? '#6a7f95' : '#aaa', fontWeight: 500, marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 16, color: isDark ? '#e0e8f0' : '#1f1f1f', fontWeight: 500 }}>{value || '-'}</div>
  </div>
);

const PdfFileRow = ({ file }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 10,
      border: '1px solid #f0f0f0',
      background: '#fafafa',
      marginBottom: 8,
    }}
  >
    <FilePdfOutlined style={{ color: '#ef4444', fontSize: 26, flexShrink: 0 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontWeight: 600,
          fontSize: 15,
          color: '#1f1f1f',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {file.name}
      </div>
      <div style={{ fontSize: 14, color: '#9ca3af', marginTop: 2 }}>{file.date}</div>
    </div>
    <DeleteOutlined style={{ color: '#ef4444', fontSize: 16, cursor: 'pointer', flexShrink: 0 }} />
    <DownloadOutlined style={{ color: '#D69F6D', fontSize: 16, cursor: 'pointer', flexShrink: 0 }} />
  </div>
);

const FileColumn = ({ title, files }) => (
  <div style={{ flex: 1, minWidth: 240 }}>
    <div
      style={{
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 3, background: 'var(--primary)' }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px 10px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16, color: '#1f1f1f' }}>{title}</span>
        <Button
          type="text"
          icon={<PlusOutlined />}
          size="small"
          style={{ border: '1px solid #e5e7eb', borderRadius: 6, width: 26, height: 26, padding: 0 }}
        />
      </div>
      <div style={{ padding: '10px 10px 6px' }}>
        {files.map(file => <PdfFileRow key={file.id} file={file} />)}
        {files.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', fontSize: 15 }}>No files</div>
        )}
      </div>
    </div>
  </div>
);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(s => s.projects.projects);
  const theme = useAppSelector(s => s.ui.theme);
  const isMobile = useIsMobile();
  const isCompact = useIsMobile(1240);
  const isLayoutCompact = useIsMobile(1280);
  const isFinancialCompact = useIsMobile(1650);
  const isDark = theme === 'dark';
  const project = projects.find(item => item.id === id) || projects[0];

  const [activeTab, setActiveTab] = useState('Project Detail');
  const [mainStage, setMainStage] = useState(project?.stage || 'Designing');
  const [subStage, setSubStage] = useState((subStages[project?.stage] || subStages.Designing)[0]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [quotes, setQuotes] = useState(() => {
    if (project?.approvedQuote) {
      const q = project.approvedQuote;
      return [{
        id: q.id,
        quoteNo: q.id,
        version: q.version,
        validUntil: q.date,
        status: 'Approved',
        amount: Number(String(q.amount).replace(/[^0-9.-]+/g, "")),
        summary: q.notes || 'Converted from Enquiry',
        lineItems: q.items?.map((item, idx) => ({
          id: idx,
          title: item.category || 'Item',
          scope: item.item || '',
          amount: `₹${Number(item.amount).toLocaleString('en-IN')}`,
        })) || [],
        updated: q.date,
      }];
    }
    return INITIAL_QUOTES;
  });
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [expandedQuoteId, setExpandedQuoteId] = useState(() => project?.approvedQuote?.id || INITIAL_QUOTES[0]?.id || null);
  const [noteModal, setNoteModal] = useState({ open: false, mode: 'create', record: null });
  const [quoteModal, setQuoteModal] = useState({ open: false, mode: 'create', record: null });
  const [orderModal, setOrderModal] = useState({ open: false, mode: 'create', record: null });
  const [taskModal, setTaskModal] = useState({ open: false, mode: 'create', record: null });
  const [purchaseRequestModal, setPurchaseRequestModal] = useState({ open: false, mode: 'create', record: null });
  const [activityModal, setActivityModal] = useState({ open: false, mode: 'create', record: null });
  const [invoiceModal, setInvoiceModal] = useState({ open: false, mode: 'create', record: null });
  const [invoiceSameAddress, setInvoiceSameAddress] = useState(false);
  const [noteForm] = Form.useForm();
  const [quoteForm] = Form.useForm();
  const [orderForm] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [purchaseRequestForm] = Form.useForm();
  const [activityForm] = Form.useForm();
  const [invoiceForm] = Form.useForm();
  const watchedInvoiceSubTotal = Number(Form.useWatch('subTotal', invoiceForm) || 0);
  const watchedInvoiceGst = Number(Form.useWatch('gstAmount', invoiceForm) || 0);
  const watchedInvoiceTotal = watchedInvoiceSubTotal + watchedInvoiceGst;
  const [requirementAnswers, setRequirementAnswers] = useState(INITIAL_REQUIREMENT_ANSWERS);
  const [notes, setNotes] = useState(INITIAL_PROJECT_NOTES);
  const [noteDraft, setNoteDraft] = useState({
    title: '',
    body: '',
    category: 'Design',
    mark: 'Action Required',
  });
  const [taskDraft, setTaskDraft] = useState({
    title: '',
    assignee: PROJECT_TEAM[0],
    dueDate: '2026-05-20',
    priority: 'Medium',
    type: TASK_TYPES[0],
  });
  const [projectTasks, setProjectTasks] = useState(() => createSeedTasks(project));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [otherInput, setOtherInput] = useState('');
  const [purchaseRequestDraft, setPurchaseRequestDraft] = useState({
    productId: OUT_OF_STOCK_PRODUCTS[0].id,
    quantity: String(OUT_OF_STOCK_PRODUCTS[0].suggestedQty),
    priority: 'High',
    neededBy: '2026-05-20',
    reason: 'Required for active order execution',
  });
  const [purchaseRequests, setPurchaseRequests] = useState(INITIAL_PURCHASE_REQUESTS);
  const [projectActivities, setProjectActivities] = useState(INITIAL_PROJECT_ACTIVITIES);

  if (!project) return <div style={{ padding: 40 }}>Project not found</div>;

  const css = {
    '--bg': isDark ? '#031726' : '#f4f5f7',
    '--surface': isDark ? '#0d3554' : '#ffffff',
    '--border': isDark ? '#1a4d72' : '#e5e7eb',
    '--border-soft': isDark ? '#0d3050' : '#f0f0f0',
    '--text': isDark ? '#f3f4f6' : '#1f1f1f',
    '--text-muted': isDark ? '#c7cad1' : '#6b7280',
    '--text-soft': isDark ? '#8696a0' : '#9ca3af',
    '--primary': isDark ? '#5ab5e8' : '#D69F6D',
    '--primary-soft': isDark ? 'rgba(90,181,232,0.15)' : 'rgba(214,159,109,0.1)',
    '--shadow': isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.07)',
  };

  const card = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    boxShadow: 'var(--shadow)',
  };

  const softCard = {
    background: isDark ? '#081b2f' : '#f8fafc',
    border: `1px solid ${isDark ? '#1a4d72' : '#e7edf4'}`,
    borderRadius: 12,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginBottom: 6,
  };

  const primaryButtonStyle = {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
  };

  const secondaryButtonStyle = {
    borderRadius: 8,
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontWeight: 600,
  };

  const summaryGridColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
  const compactSummaryGridColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
  const detailSummaryGridColumns = 'repeat(auto-fit, minmax(160px, 1fr))';

  const actionIconButtonStyle = {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none',
  };

  const renderTableActionButtons = ({ onView, onEdit, onDelete }) => (
    <Space wrap size={[6, 6]}>
      <Button
        size="small"
        icon={<EyeOutlined />}
        onClick={onView}
        title="View"
        aria-label="View"
        style={{ ...actionIconButtonStyle, color: '#2563eb' }}
      />
      <Button
        size="small"
        icon={<EditOutlined />}
        onClick={onEdit}
        title="Edit"
        aria-label="Edit"
        style={{ ...actionIconButtonStyle, color: 'var(--primary)' }}
      />
      <Button
        size="small"
        icon={<DeleteOutlined />}
        onClick={onDelete}
        title="Delete"
        aria-label="Delete"
        danger
        style={{ ...actionIconButtonStyle, color: '#ef4444' }}
      />
    </Space>
  );

  const openEditModal = () => {
    const { phoneCode, phoneNumber } = splitPhone(project.phone);
    editForm.setFieldsValue({
      projectName: project.projectName,
      stage: mainStage,
      subStage,
      clientName: project.clientName,
      email: project.email || '',
      phoneCode,
      phoneNumber,
      budget: project.budget || '',
      description: project.description || '',
      address1: project.address1 || '',
      address2: project.address2 || '',
      city: project.city || '',
      state: project.state || '',
      location: project.location || '',
      pincode: project.pincode || '',
      legalName: project.legalName || '',
      gst: project.gst || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveProject = () => {
    editForm.validateFields().then(values => {
      dispatch(updateProject({
        ...project,
        ...values,
        stage: values.stage || mainStage,
        phone: `${values.phoneCode || '+91'} ${values.phoneNumber || ''}`.trim(),
        budget: Number(values.budget || 0),
      }));
      setMainStage(values.stage || mainStage);
      setSubStage(values.subStage || subStage);
      setEditModalOpen(false);
    });
  };

  const quoteStages = QUOTE_STATUSES;
  const latestQuote = quotes[0] || null;
  const currentQuoteStatus = latestQuote?.status || 'Draft';
  const quoteStageIndex = Math.max(0, quoteStages.indexOf(currentQuoteStatus));
  const answeredCount = Object.values(requirementAnswers).filter(Boolean).length;
  const yesCount = Object.values(requirementAnswers).filter(answer => answer === 'Yes').length;
  const noCount = Object.values(requirementAnswers).filter(answer => answer === 'No').length;
  const actionNotes = notes.filter(note => note.mark === 'Action Required').length;
  const resolvedNotes = notes.filter(note => note.mark === 'Resolved').length;
  const completedTasks = projectTasks.filter(task => task.status === 'Complete' || task.status === 'Completed').length;
  const inProgressTasks = projectTasks.filter(task => task.status === 'In Progress').length;
  const completionPercent = projectTasks.length ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
  const selectedPurchaseProduct = OUT_OF_STOCK_PRODUCTS.find(item => item.id === purchaseRequestDraft.productId) || OUT_OF_STOCK_PRODUCTS[0];
  const pendingRequests = purchaseRequests.filter(item => item.status !== 'Ordered').length;
  const lowStockItems = FACTORY_INVENTORY.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = FACTORY_INVENTORY.filter(item => item.status === 'Out of Stock').length;
  const inStockItems = FACTORY_INVENTORY.filter(item => item.status === 'In Stock').length;
  const completedActivities = projectActivities.filter(item => item.status === 'Completed').length;
  const liveActivities = projectActivities.filter(item => item.status === 'In Progress').length;
  const plannedActivities = projectActivities.filter(item => item.status === 'Planned').length;
  const activityProgressPercent = projectActivities.length ? Math.round((completedActivities / projectActivities.length) * 100) : 0;
  const amountReceived = PAYMENT_HISTORY
    .filter(item => item.status === 'Received')
    .reduce((sum, item) => sum + item.amount, 0);
  const scheduledAmount = PAYMENT_HISTORY
    .filter(item => item.status === 'Scheduled')
    .reduce((sum, item) => sum + item.amount, 0);
  const approvedAmount = PROJECT_FINANCIALS.approvedAmount;
  const paymentProgress = approvedAmount ? Math.min(100, Math.round((amountReceived / approvedAmount) * 100)) : 0;
  const totalInvoiced = invoices.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  const openInvoiceValue = invoices
    .filter(item => item.status !== 'Paid' && item.status !== 'Cancelled')
    .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  const balanceOutstanding = Math.max(approvedAmount - amountReceived, 0);
  const draftInvoices = invoices.filter(item => item.status === 'Draft').length;
  const sentInvoices = invoices.filter(item => item.status === 'Sent').length;
  const paidInvoices = invoices.filter(item => item.status === 'Paid').length;
  const nextInvoiceDue = [...invoices]
    .filter(item => item.status !== 'Paid' && item.status !== 'Cancelled')
    .sort((first, second) => String(first.dueDate || '').localeCompare(String(second.dueDate || '')))[0] || null;

  const handleRequirementAnswer = (key, value) => {
    setRequirementAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleOtherSubmit = (key) => {
    if (otherInput.trim()) {
      handleRequirementAnswer(key, otherInput.trim());
      setOtherInput('');
    }
  };

  const handleAddNote = () => {
    if (!noteDraft.title.trim() && !noteDraft.body.trim()) return;
    setNotes(prev => ([
      {
        id: Date.now(),
        title: noteDraft.title.trim() || 'Client note',
        body: noteDraft.body.trim() || 'Internal note added for this project.',
        category: noteDraft.category,
        mark: noteDraft.mark,
        updated: 'Just now',
        owner: 'Super Admin',
        pinned: noteDraft.mark === 'Action Required',
      },
      ...prev,
    ]));
    setNoteDraft(prev => ({ ...prev, title: '', body: '' }));
  };

  const handleToggleNotePin = (noteId) => {
    setNotes(prev => prev.map(note => (
      note.id === noteId ? { ...note, pinned: !note.pinned } : note
    )));
  };

  const handleToggleNoteMark = (noteId) => {
    setNotes(prev => prev.map(note => {
      if (note.id !== noteId) return note;
      return {
        ...note,
        mark: note.mark === 'Resolved' ? 'Action Required' : 'Resolved',
        updated: 'Just now',
      };
    }));
  };

  const handleAddTask = () => {
    if (!taskDraft.title.trim()) return;
    setProjectTasks(prev => ([
      {
        id: `task-${Date.now()}`,
        title: taskDraft.title.trim(),
        assignee: taskDraft.assignee,
        dueDate: taskDraft.dueDate,
        status: 'Created',
        priority: taskDraft.priority,
        type: taskDraft.type,
      },
      ...prev,
    ]));
    setTaskDraft(prev => ({ ...prev, title: '' }));
  };

  const handleToggleTaskStatus = (taskId) => {
    setProjectTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        status: task.status === 'Completed' ? 'In Progress' : 'Completed',
      };
    }));
  };

  const handleAdvanceActivityStatus = (activityId) => {
    setProjectActivities(prev => prev.map(item => {
      if (item.id !== activityId) return item;
      const nextStatus = item.status === 'Planned'
        ? 'In Progress'
        : item.status === 'In Progress'
          ? 'Completed'
          : 'Planned';
      return { ...item, status: nextStatus };
    }));
  };

  const confirmDeleteRecord = (title, onOk) => {
    Modal.confirm({
      title,
      content: 'This action will remove the record from the current mock list.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk,
    });
  };

  const openNoteCrudModal = (mode, record = null) => {
    setNoteModal({ open: true, mode, record });
    noteForm.setFieldsValue(record || {
      title: '',
      category: NOTE_CATEGORIES[0],
      mark: NOTE_MARKS[0],
      owner: 'Super Admin',
      body: '',
      pinned: false,
    });
  };

  const submitNoteModal = () => {
    noteForm.validateFields().then(values => {
      const payload = {
        ...values,
        owner: values.owner || 'Super Admin',
        updated: 'Just now',
      };

      if (noteModal.mode === 'edit' && noteModal.record) {
        setNotes(prev => prev.map(item => (
          item.id === noteModal.record.id ? { ...item, ...payload } : item
        )));
      } else {
        setNotes(prev => ([{ id: `note-${Date.now()}`, ...payload }, ...prev]));
      }

      setNoteModal({ open: false, mode: 'create', record: null });
      noteForm.resetFields();
    });
  };

  const openQuoteCrudModal = (mode, record = null) => {
    setQuoteModal({ open: true, mode, record });
    quoteForm.setFieldsValue(record || {
      quoteNo: `QT-${project.projectCode}-${String(quotes.length + 1).padStart(2, '0')}`,
      version: `Rev ${String(quotes.length + 1).padStart(2, '0')}`,
      validUntil: '2026-05-30',
      status: 'Draft',
      amount: latestQuote?.amount || 2480000,
      summary: latestQuote?.summary || '',
    });
  };

  const submitQuoteModal = () => {
    quoteForm.validateFields().then(values => {
      const payload = {
        ...values,
        amount: Number(values.amount || 0),
        updated: 'Just now',
        lineItems: quoteModal.record?.lineItems || QUOTE_LINE_ITEMS,
      };

      if (quoteModal.mode === 'edit' && quoteModal.record) {
        setQuotes(prev => prev.map(item => (
          item.id === quoteModal.record.id ? { ...item, ...payload } : item
        )));
      } else {
        const nextRecord = { id: values.quoteNo || `quote-${Date.now()}`, ...payload };
        setQuotes(prev => [nextRecord, ...prev]);
        setExpandedQuoteId(nextRecord.id);
      }

      setQuoteModal({ open: false, mode: 'create', record: null });
      quoteForm.resetFields();
    });
  };

  const openOrderCrudModal = (mode, record = null) => {
    setOrderModal({ open: true, mode, record });
    orderForm.setFieldsValue(record || {
      orderNo: `ORD-${project.projectCode}-${String(orders.length + 1).padStart(2, '0')}`,
      linkedQuote: latestQuote?.quoteNo || '',
      executionStart: '2026-05-27',
      installationTarget: '2026-06-18',
      status: ORDER_STATUSES[0],
      amount: 0,
      commercialNotes: '',
    });
  };

  const submitOrderModal = () => {
    orderForm.validateFields().then(values => {
      const payload = {
        ...values,
        amount: Number(values.amount || 0),
        updated: 'Just now',
      };

      if (orderModal.mode === 'edit' && orderModal.record) {
        setOrders(prev => prev.map(item => (
          item.id === orderModal.record.id ? { ...item, ...payload } : item
        )));
      } else {
        setOrders(prev => ([{ id: values.orderNo || `order-${Date.now()}`, ...payload }, ...prev]));
      }

      setOrderModal({ open: false, mode: 'create', record: null });
      orderForm.resetFields();
    });
  };

  const openTaskCrudModal = (mode, record = null) => {
    setTaskModal({ open: true, mode, record });
    taskForm.setFieldsValue(record || {
      title: '',
      assignee: PROJECT_TEAM[0],
      dueDate: '2026-05-20',
      status: TASK_STATUSES[0],
      priority: TASK_PRIORITIES[1],
      type: TASK_TYPES[0],
    });
  };

  const submitTaskModal = () => {
    taskForm.validateFields().then(values => {
      const payload = { ...values };

      if (taskModal.mode === 'edit' && taskModal.record) {
        setProjectTasks(prev => prev.map(item => (
          item.id === taskModal.record.id ? { ...item, ...payload } : item
        )));
      } else {
        setProjectTasks(prev => ([{ id: `task-${Date.now()}`, ...payload }, ...prev]));
      }

      setTaskModal({ open: false, mode: 'create', record: null });
      taskForm.resetFields();
    });
  };

  const openPurchaseRequestCrudModal = (mode, record = null) => {
    setPurchaseRequestModal({ open: true, mode, record });
    const matchedProduct = record ? OUT_OF_STOCK_PRODUCTS.find(item => item.sku === record.sku) : selectedPurchaseProduct;
    purchaseRequestForm.setFieldsValue(record ? {
      productId: matchedProduct?.id || OUT_OF_STOCK_PRODUCTS[0].id,
      quantity: String(record.qty).split(' ')[0],
      requestedBy: record.requestedBy,
      priority: record.priority,
      expectedBy: record.expectedBy,
      status: record.status,
      reason: record.reason || 'Required for project execution',
    } : {
      productId: selectedPurchaseProduct.id,
      quantity: String(selectedPurchaseProduct.suggestedQty),
      requestedBy: 'Super Admin',
      priority: 'High',
      expectedBy: '2026-05-20',
      status: 'Raised',
      reason: 'Required for active order execution',
    });
  };

  const submitPurchaseRequestModal = () => {
    purchaseRequestForm.validateFields().then(values => {
      const product = OUT_OF_STOCK_PRODUCTS.find(item => item.id === values.productId);
      if (!product) return;

      const payload = {
        product: product.name,
        sku: product.sku,
        qty: `${values.quantity} ${product.unit}`,
        requestedBy: values.requestedBy,
        priority: values.priority,
        expectedBy: values.expectedBy,
        status: values.status,
        reason: values.reason,
      };

      if (purchaseRequestModal.mode === 'edit' && purchaseRequestModal.record) {
        setPurchaseRequests(prev => prev.map(item => (
          item.id === purchaseRequestModal.record.id ? { ...item, ...payload } : item
        )));
      } else {
        setPurchaseRequests(prev => ([{ id: `PR-${Date.now()}`, ...payload }, ...prev]));
      }

      setPurchaseRequestModal({ open: false, mode: 'create', record: null });
      purchaseRequestForm.resetFields();
    });
  };

  const openActivityCrudModal = (mode, record = null) => {
    setActivityModal({ open: true, mode, record });
    activityForm.setFieldsValue(record || {
      workItem: ACTIVITY_WORK_OPTIONS[0].value,
      owner: ACTIVITY_TEAM_OPTIONS[0],
      startDate: '2026-05-18',
      estimatedDays: 5,
      completionDate: '2026-05-23',
      status: ACTIVITY_STATUSES[0],
    });
  };

  const submitActivityModal = () => {
    activityForm.validateFields().then(values => {
      const activityMeta = ACTIVITY_WORK_OPTIONS.find(item => item.value === values.workItem);
      const payload = {
        ...values,
        orderId: activityMeta?.orderId || 'ORD-NEW',
        area: activityMeta?.area || 'Project Work',
        estimatedDays: Number(values.estimatedDays || 0),
      };

      if (activityModal.mode === 'edit' && activityModal.record) {
        setProjectActivities(prev => prev.map(item => (
          item.id === activityModal.record.id ? { ...item, ...payload } : item
        )));
      } else {
        setProjectActivities(prev => ([{ id: `ACT-${Date.now()}`, ...payload }, ...prev]));
      }

      setActivityModal({ open: false, mode: 'create', record: null });
      activityForm.resetFields();
    });
  };

  const openInvoiceCrudModal = (mode, record = null) => {
    const sameAddressRecord = Boolean(
      record
      && record.billToName === record.shipToName
      && record.billToEmail === record.shipToEmail
      && record.billToPhone === record.shipToPhone
      && record.billToGst === record.shipToGst
      && record.billToAddress === record.shipToAddress
    );

    setInvoiceModal({ open: true, mode, record });
    setInvoiceSameAddress(sameAddressRecord);
    invoiceForm.setFieldsValue(record || {
      invoiceNo: `INV-${project.projectCode}-${String(invoices.length + 1).padStart(3, '0')}`,
      invoiceDate: '2026-05-14',
      dueDate: '2026-05-21',
      invoiceType: INVOICE_TYPES[0],
      status: 'Draft',
      subTotal: 640000,
      gstAmount: 115200,
      billToName: project.clientName || '',
      billToEmail: project.email || '',
      billToPhone: splitPhone(project.phone).phoneNumber || '',
      billToGst: project.gst || '',
      billToAddress: project.address1 || '',
      shipToName: '',
      shipToEmail: '',
      shipToPhone: '',
      shipToGst: '',
      shipToAddress: '',
      notes: '',
    });
  };

  const handleInvoiceSameAddressToggle = (checked) => {
    setInvoiceSameAddress(checked);
    if (!checked) return;

    const values = invoiceForm.getFieldsValue();
    invoiceForm.setFieldsValue({
      shipToName: values.billToName,
      shipToEmail: values.billToEmail,
      shipToPhone: values.billToPhone,
      shipToGst: values.billToGst,
      shipToAddress: values.billToAddress,
    });
  };

  const submitInvoiceModal = () => {
    invoiceForm.validateFields().then(values => {
      const payload = {
        ...values,
        subTotal: Number(values.subTotal || 0),
        gstAmount: Number(values.gstAmount || 0),
      };
      payload.totalAmount = payload.subTotal + payload.gstAmount;

      if (invoiceModal.mode === 'edit' && invoiceModal.record) {
        setInvoices(prev => prev.map(item => (
          item.id === invoiceModal.record.id ? { ...item, ...payload } : item
        )));
      } else {
        setInvoices(prev => ([{ id: values.invoiceNo || `invoice-${Date.now()}`, ...payload }, ...prev]));
      }

      setInvoiceModal({ open: false, mode: 'create', record: null });
      invoiceForm.resetFields();
    });
  };

  const renderProjectDetail = () => {
    const sectionBox = {
      background: isDark ? '#081b2f' : '#f8fafd',
      border: `1px solid ${isDark ? '#1a4d72' : '#e8f0fb'}`,
      borderRadius: 12,
      padding: '16px 20px',
      flex: 1,
      minWidth: 0,
    };
    const sectionTitleColor = isDark ? '#5ab5e8' : '#D69F6D';

    return (
      <div style={{ display: 'flex', gap: 16, flexWrap: isCompact ? 'wrap' : 'nowrap' }}>
        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <User size={18} color={sectionTitleColor} />
            <span style={{ fontWeight: 700, fontSize: 16, color: sectionTitleColor }}>Client Details</span>
          </div>
          <InfoRow label="Client Name" value={project.clientName} isDark={isDark} />
          <InfoRow label="Email" value={project.email} isDark={isDark} />
          <InfoRow label="Phone" value={project.phone} isDark={isDark} />
          <InfoRow label="Address Line 1" value={project.address1} isDark={isDark} />
          <InfoRow label="Address Line 2" value={project.address2} isDark={isDark} />
          <InfoRow label="City" value={project.city} isDark={isDark} />
          <InfoRow label="State" value={project.state} isDark={isDark} />
          <InfoRow label="Pincode" value={project.pincode} isDark={isDark} />
        </div>

        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <HardHat size={18} color={sectionTitleColor} />
            <span style={{ fontWeight: 700, fontSize: 16, color: sectionTitleColor }}>Project Information</span>
          </div>
          <InfoRow label="Project Code" value={project.projectCode} isDark={isDark} />
          <InfoRow label="Project Name" value={project.projectName} isDark={isDark} />
          <InfoRow label="Budget" value={formatMoney(project.budget)} isDark={isDark} />
          <InfoRow label="Stage" value={mainStage} isDark={isDark} />
          <InfoRow label="Sub Stage" value={subStage} isDark={isDark} />
          <InfoRow label="Legal Name" value={project.legalName} isDark={isDark} />
          <InfoRow label="GST Number" value={project.gst} isDark={isDark} />
          <InfoRow label="Description" value={project.description} isDark={isDark} />
        </div>
      </div>
    );
  };

const renderFiles = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
      <FileColumn title="Design Files" files={MOCK_FILES.designFiles} />
      <FileColumn title="Schedules" files={MOCK_FILES.schedules} />
      <FileColumn title="Other Records" files={MOCK_FILES.otherRecords} />
    </div>
  );

  const renderUserRequirement = () => {
    const isFinished = currentQuestionIndex >= REQUIREMENT_QUESTIONS.length;
    const currentQuestion = REQUIREMENT_QUESTIONS[currentQuestionIndex];
    const answeredCount = Object.values(requirementAnswers).filter(Boolean).length;

    if (isFinished) {
      return (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Requirement Summary</div>
            <Button onClick={() => setCurrentQuestionIndex(0)} icon={<ArrowLeftOutlined />}>Re-take Survey</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1.5fr) minmax(280px, 0.85fr)', gap: 16, alignItems: 'start' }}>
            <div style={{ ...card, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)', marginBottom: 14 }}>Answers</div>
              <div style={{ display: 'grid', gap: 12 }}>
                {REQUIREMENT_QUESTIONS.map((item, index) => (
                  <div key={item.key} style={{ ...softCard, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-soft)', fontWeight: 600 }}>QUESTION {index + 1}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>{item.question}</div>
                    </div>
                    <BadgePill label={requirementAnswers[item.key]} tone={requirementAnswers[item.key] === 'Yes' ? 'success' : requirementAnswers[item.key] === 'No' ? 'neutral' : 'accent'} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ ...card, padding: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 14 }}>Response Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: compactSummaryGridColumns, gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Yes', value: yesCount },
                    { label: 'No', value: noCount },
                    { label: 'Others', value: Object.values(requirementAnswers).filter(v => v !== 'Yes' && v !== 'No' && v).length },
                  ].map(item => (
                    <div key={item.label} style={{ ...softCard, padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <Progress percent={100} strokeColor="#D69F6D" showInfo={false} />
              </div>

              <div style={{ ...card, padding: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 12 }}>Design Signals</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {REQUIREMENT_QUESTIONS.filter(item => requirementAnswers[item.key] && requirementAnswers[item.key] !== 'No').map(item => (
                    <div key={item.key} style={{ ...softCard, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <CheckOutlined style={{ color: '#15803d' }} />
                        <span style={{ fontWeight: 700, color: 'var(--text)' }}>{item.area}</span>
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{requirementAnswers[item.key]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{ ...card, padding: 24, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Question {currentQuestionIndex + 1} of {REQUIREMENT_QUESTIONS.length}
              </div>
              <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--text)', marginTop: 8 }}>{currentQuestion.question}</div>
              <div style={{ fontSize: 16, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>{currentQuestion.area}</div>
            </div>
            <Progress
              type="circle"
              percent={Math.round((answeredCount / REQUIREMENT_QUESTIONS.length) * 100)}
              size={60}
              strokeColor="var(--primary)"
              format={() => `${currentQuestionIndex + 1}/${REQUIREMENT_QUESTIONS.length}`}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
              {['Yes', 'No', 'Other'].map(option => {
                const isSelected = requirementAnswers[currentQuestion.key] === option || (option === 'Other' && requirementAnswers[currentQuestion.key] && requirementAnswers[currentQuestion.key] !== 'Yes' && requirementAnswers[currentQuestion.key] !== 'No');
                const btnStyle = {
                  padding: '16px 24px',
                  borderRadius: 12,
                  fontSize: 17,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--primary-soft)' : 'var(--surface)',
                  color: isSelected ? 'var(--primary)' : 'var(--text)',
                };
                return (
                  <div
                    key={option}
                    style={btnStyle}
                    onClick={() => {
                      if (option === 'Other') {
                        handleRequirementAnswer(currentQuestion.key, 'Other');
                      } else {
                        handleRequirementAnswer(currentQuestion.key, option);
                      }
                    }}
                  >
                    {option}
                  </div>
                );
              })}
            </div>

            {requirementAnswers[currentQuestion.key] === 'Other' && (
              <div style={{ marginTop: 10 }}>
                <div style={{ ...labelStyle, fontSize: 14 }}>Specify Details (Press Enter to Save)</div>
                <Input
                  autoFocus
                  placeholder="Type your answer here..."
                  value={otherInput}
                  onChange={(e) => setOtherInput(e.target.value)}
                  onPressEnter={() => handleOtherSubmit(currentQuestion.key)}
                  size="large"
                  style={{ borderRadius: 10, height: 48 }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, borderTop: '1px solid var(--border-soft)', paddingTop: 20 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              style={secondaryButtonStyle}
              size="large"
            >
              Previous
            </Button>
            <Space>
               <Button
                onClick={() => setCurrentQuestionIndex(REQUIREMENT_QUESTIONS.length)}
                style={secondaryButtonStyle}
                size="large"
              >
                Skip to Results
              </Button>
              <Button
                type="primary"
                disabled={!requirementAnswers[currentQuestion.key] || (requirementAnswers[currentQuestion.key] === 'Other' && !otherInput.trim())}
                onClick={() => {
                  if (requirementAnswers[currentQuestion.key] === 'Other') {
                    handleRequirementAnswer(currentQuestion.key, otherInput.trim());
                    setOtherInput('');
                  }
                  setCurrentQuestionIndex(prev => prev + 1);
                }}
                style={primaryButtonStyle}
                size="large"
              >
                Next Question
              </Button>
            </Space>
          </div>
        </div>
      </div>
    );
  };

  const renderNotes = () => {
    const noteColumns = [
      {
        key: 'title',
        title: 'Title',
        render: (record) => (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{record.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{record.body}</div>
          </div>
        ),
      },
      { key: 'category', title: 'Category' },
      { key: 'mark', title: 'Mark', render: (record) => <BadgePill label={record.mark} tone={getNoteTone(record.mark)} /> },
      { key: 'owner', title: 'Owner' },
      {
        key: 'updated',
        title: 'Updated',
        render: (record) => (
          <div>
            <div>{record.updated}</div>
            {record.pinned && <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>Pinned</div>}
          </div>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (record) => (
          renderTableActionButtons({
            onView: () => openNoteCrudModal('view', record),
            onEdit: () => openNoteCrudModal('edit', record),
            onDelete: () => confirmDeleteRecord('Delete Note', () => setNotes(prev => prev.filter(item => item.id !== record.id))),
          })
        ),
      },
    ];

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: summaryGridColumns, gap: 12 }}>
          {[
            { label: 'Total Notes', value: notes.length },
            { label: 'Action Items', value: actionNotes },
            { label: 'Resolved', value: resolvedNotes },
            { label: 'Pinned', value: notes.filter(item => item.pinned).length },
          ].map(item => (
            <div key={item.label} style={{ ...card, padding: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Client Notes</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                Capture and manage client-facing project notes with proper actions.
              </div>
            </div>
            <Button icon={<PlusOutlined />} onClick={() => openNoteCrudModal('create')} style={primaryButtonStyle}>
              Add Note
            </Button>
          </div>

          <DataTable columns={noteColumns} rows={notes} emptyText="No notes added yet." />
        </div>

        <Modal
          title={noteModal.mode === 'create' ? 'Add Note' : noteModal.mode === 'edit' ? 'Edit Note' : 'View Note'}
          open={noteModal.open}
          styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
          onCancel={() => {
            setNoteModal({ open: false, mode: 'create', record: null });
            noteForm.resetFields();
          }}
          onOk={noteModal.mode === 'view' ? undefined : submitNoteModal}
          okText={noteModal.mode === 'edit' ? 'Update Note' : 'Add Note'}
          footer={noteModal.mode === 'view' ? [
            <Button key="close" onClick={() => {
              setNoteModal({ open: false, mode: 'create', record: null });
              noteForm.resetFields();
            }}>
              Close
            </Button>,
          ] : undefined}
          width={680}
        >
          <Form form={noteForm} layout="vertical" disabled={noteModal.mode === 'view'}>
            <Row gutter={12}>
              <Col xs={24} sm={14}>
                <Form.Item name="title" label="Note Title" rules={[{ required: true, message: 'Note title is required' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={10}>
                <Form.Item name="owner" label="Owner">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Category is required' }]}>
                  <Select options={NOTE_CATEGORIES.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="mark" label="Mark As" rules={[{ required: true, message: 'Mark is required' }]}>
                  <Select options={NOTE_MARKS.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="body" label="Note Details" rules={[{ required: true, message: 'Note details are required' }]}>
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item name="pinned" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Checkbox>Pin this note</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const renderQuotes = () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: summaryGridColumns, gap: 12 }}>
        {[
          { label: 'Current Estimate', value: formatMoney(latestQuote?.amount || 0) },
          { label: 'Active Revision', value: latestQuote?.version || '-' },
          { label: 'Client Status', value: currentQuoteStatus },
          { label: 'Quote Count', value: quotes.length },
        ].map(item => (
          <div key={item.label} style={{ ...card, padding: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Quotations</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              View quotations as expandable cards and open full details only when needed.
            </div>
          </div>
          {quotes.some(q => q.status === 'Approved') ? (
            <Button icon={<EditOutlined />} onClick={() => openQuoteCrudModal('edit', quotes.find(q => q.status === 'Approved'))} style={primaryButtonStyle}>
              Edit Quotation
            </Button>
          ) : (
            <Button icon={<PlusOutlined />} onClick={() => openQuoteCrudModal('create')} style={primaryButtonStyle}>
              Add Quotation
            </Button>
          )}
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {quotes.map(record => {
            const isExpanded = expandedQuoteId === record.id;
            return (
              <div key={record.id} style={{ ...softCard, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>{record.quoteNo}</div>
                      <BadgePill label={record.status} tone={getQuoteTone(record.status)} />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {record.version} / Valid until {formatDisplayDate(record.validUntil)} / Updated {record.updated}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
                      {record.summary}
                    </div>
                  </div>
                  <div style={{ display: 'grid', justifyItems: 'end', gap: 10 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{formatMoney(record.amount)}</div>
                    <Space wrap size={[6, 6]}>
                      <Button
                        size="small"
                        icon={isExpanded ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => setExpandedQuoteId(isExpanded ? null : record.id)}
                        title={isExpanded ? 'Hide Details' : 'Show Details'}
                        aria-label={isExpanded ? 'Hide Details' : 'Show Details'}
                        style={{ ...actionIconButtonStyle, color: '#2563eb' }}
                      />
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openQuoteCrudModal('edit', record)}
                        title="Edit Quote"
                        aria-label="Edit Quote"
                        style={{ ...actionIconButtonStyle, color: 'var(--primary)' }}
                      />
                      <Button
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const content = `
========================================
QUOTATION: ${record.quoteNo} (${record.version})
========================================
Status: ${record.status}
Valid Until: ${record.validUntil}
Total Amount: ${formatMoney(record.amount)}
Updated: ${record.updated}

Summary:
${record.summary}

Line Items:
${record.lineItems.map((item, idx) => `${idx + 1}. ${item.title}
   Scope: ${item.scope}
   Amount: ${item.amount}`).join('\n\n')}
========================================
Generated by Perspective Kitchens & Interiors
                          `;
                          const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${record.quoteNo}_${record.version}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                          message.success(`${record.quoteNo} downloaded successfully!`);
                        }}
                        title="Download Quote"
                        aria-label="Download Quote"
                        style={{ ...actionIconButtonStyle, color: '#10b981' }}
                      />
                      <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => confirmDeleteRecord('Delete Quotation', () => {
                          setQuotes(prev => prev.filter(item => item.id !== record.id));
                          if (expandedQuoteId === record.id) setExpandedQuoteId(null);
                        })}
                        title="Delete Quote"
                        aria-label="Delete Quote"
                        style={{ ...actionIconButtonStyle, color: '#ef4444' }}
                      />
                    </Space>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-soft)', display: 'grid', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1.5fr) 280px', gap: 16 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Line Item Preview</div>
                        <div style={{ display: 'grid', gap: 10 }}>
                          {record.lineItems.map((item, index) => (
                            <div key={`${record.id}-${index}`} style={{ ...softCard, padding: '12px 14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
                                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{item.scope}</div>
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.amount}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ ...softCard, padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Quote Journey</div>
                        <div style={{ display: 'grid', gap: 8 }}>
                          {quoteStages.map((stage, index) => {
                            const stageIndex = quoteStages.indexOf(record.status);
                            const active = index === stageIndex;
                            const done = index < stageIndex;
                            return (
                              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 999,
                                  background: active || done ? 'var(--primary)' : 'transparent',
                                  color: active || done ? '#fff' : 'var(--text-muted)',
                                  border: `1px solid ${active || done ? 'var(--primary)' : 'var(--border)'}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  fontSize: 12,
                                }}>
                                  {done ? <CheckOutlined /> : index + 1}
                                </div>
                                <div style={{ fontSize: 14, color: 'var(--text)' }}>{stage}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Modal
          title={quoteModal.mode === 'create' ? 'Add Quotation' : quoteModal.mode === 'edit' ? `Editing ${quoteModal.record?.version || ''} (${quoteModal.record?.quoteNo || ''})` : `Viewing ${quoteModal.record?.version || ''} (${quoteModal.record?.quoteNo || ''})`}
          open={quoteModal.open}
          onCancel={() => {
            setQuoteModal({ open: false, mode: 'create', record: null });
            quoteForm.resetFields();
          }}
          width={1000}
          footer={null}
          className="crm-modal"
          destroyOnClose
          centered
        >
          {quoteModal.open && (
            <QuoteBuilder 
              initialData={{ 
                title: quoteModal.record?.summary || '', 
                items: quoteModal.record?.lineItems?.map((item, idx) => ({
                  id: idx,
                  name: item.title,
                  category: item.title,
                  item: item.scope,
                  amount: item.amount ? Number(String(item.amount).replace(/[^0-9.-]+/g, "")) : 0,
                  qty: 1,
                  uom: 'Nos',
                  rate: item.amount ? Number(String(item.amount).replace(/[^0-9.-]+/g, "")) : 0,
                  discount: 0,
                  gst: '18%',
                })) || [] 
              }} 
              isReadOnly={quoteModal.mode === 'view'} 
              onGenerate={(data, actionType = 'generate') => {
                const subTotal = data.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
                const total = subTotal * 1.18;
                
                let nextVersion = quoteModal.record?.version || `Rev ${String(quotes.length + 1).padStart(2, '0')}`;
                if (quoteModal.mode === 'edit') {
                   const match = nextVersion.match(/Rev (\d+)/);
                   if (match) {
                     nextVersion = `Rev ${String(Number(match[1]) + 1).padStart(2, '0')}`;
                   } else {
                     nextVersion = `${nextVersion} (New)`;
                   }
                }

                let newStatus = 'Draft';
                if (actionType === 'approval') newStatus = 'Pending Approval';
                if (actionType === 'generate') newStatus = 'Draft';

                const payload = {
                  summary: data.title || 'New Quotation',
                  amount: total,
                  updated: 'Just now',
                  lineItems: data.items.map(i => ({
                    title: i.name || i.category || 'Item',
                    scope: i.item || '',
                    amount: `₹${Number(i.amount).toLocaleString('en-IN')}`
                  })),
                  version: nextVersion,
                  status: newStatus,
                  validUntil: quoteModal.record?.validUntil || '2026-05-30',
                  quoteNo: quoteModal.record?.quoteNo || `QT-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
                };

                const nextRecord = { id: payload.quoteNo, ...payload };
                setQuotes(prev => [nextRecord, ...prev]);
                setExpandedQuoteId(nextRecord.id);

                if (actionType === 'draft') {
                  message.success('Draft saved successfully');
                } else if (actionType === 'approval') {
                  message.success('Sent for approval');
                  const storedApprovals = JSON.parse(localStorage.getItem('quoteEditApprovals') || '[]');
                  const newRequest = {
                    id: Date.now(),
                    quoteId: nextRecord.id,
                    title: 'New Quotation Approval',
                    description: `User has submitted Quotation ${nextRecord.quoteNo} (${nextRecord.version}) for approval.`,
                    time: 'Just now',
                    status: 'pending'
                  };
                  localStorage.setItem('quoteEditApprovals', JSON.stringify([newRequest, ...storedApprovals]));
                } else {
                  message.success('Quotation generated');
                }

                setQuoteModal({ open: false, mode: 'create', record: null });
              }}
            />
          )}
        </Modal>
      </div>
    </div>
  );

  const renderOrders = () => {
    const orderColumns = [
      { key: 'orderNo', title: 'Order No' },
      { key: 'linkedQuote', title: 'Linked Quote' },
      { key: 'executionStart', title: 'Execution Start', render: (record) => formatDisplayDate(record.executionStart) },
      { key: 'installationTarget', title: 'Install Target', render: (record) => formatDisplayDate(record.installationTarget) },
      { key: 'amount', title: 'Amount', render: (record) => formatMoney(record.amount) },
      { key: 'status', title: 'Status', render: (record) => <BadgePill label={record.status} tone={getOrderTone(record.status)} /> },
      {
        key: 'actions',
        title: 'Actions',
        render: (record) => (
          renderTableActionButtons({
            onView: () => openOrderCrudModal('view', record),
            onEdit: () => openOrderCrudModal('edit', record),
            onDelete: () => confirmDeleteRecord('Delete Order', () => setOrders(prev => prev.filter(item => item.id !== record.id))),
          })
        ),
      },
    ];

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: summaryGridColumns, gap: 12 }}>
          {[
            { label: 'Approved Quote', value: latestQuote?.quoteNo || '-' },
            { label: 'Open Orders', value: orders.length },
            { label: 'Install Window', value: orders[0] ? formatDisplayDate(orders[0].installationTarget) : '-' },
            { label: 'Order Value', value: formatMoney(orders.reduce((sum, item) => sum + item.amount, 0)) },
          ].map(item => (
            <div key={item.label} style={{ ...card, padding: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Orders</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                Add project orders and manage them with view, edit, and delete actions.
              </div>
            </div>
            <Button icon={<PlusOutlined />} onClick={() => openOrderCrudModal('create')} style={primaryButtonStyle}>
              Add Order
            </Button>
          </div>

          <DataTable columns={orderColumns} rows={orders} emptyText="No orders created yet." />
        </div>

        <Modal
          title={orderModal.mode === 'create' ? 'Add Order' : orderModal.mode === 'edit' ? 'Edit Order' : 'Order Details'}
          open={orderModal.open}
          styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
          onCancel={() => {
            setOrderModal({ open: false, mode: 'create', record: null });
            orderForm.resetFields();
          }}
          onOk={orderModal.mode === 'view' ? undefined : submitOrderModal}
          okText={orderModal.mode === 'edit' ? 'Update Order' : 'Create Order'}
          footer={orderModal.mode === 'view' ? [
            <Button key="close" onClick={() => {
              setOrderModal({ open: false, mode: 'create', record: null });
              orderForm.resetFields();
            }}>
              Close
            </Button>,
          ] : undefined}
          width={720}
        >
          <Form form={orderForm} layout="vertical" disabled={orderModal.mode === 'view'}>
            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item name="orderNo" label="Order No" rules={[{ required: true, message: 'Order number is required' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="linkedQuote" label="Linked Quote" rules={[{ required: true, message: 'Linked quote is required' }]}>
                  <Select options={quotes.map(item => ({ value: item.quoteNo, label: `${item.quoteNo} / ${item.version}` }))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={24} sm={6}>
                <Form.Item name="executionStart" label="Execution Start" rules={[{ required: true, message: 'Execution start is required' }]}>
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item name="installationTarget" label="Installation Target" rules={[{ required: true, message: 'Installation target is required' }]}>
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                  <Select options={ORDER_STATUSES.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount is required' }]}>
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="commercialNotes" label="Commercial Notes">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const renderTasks = () => {
    const todoTasks = projectTasks.filter(item => item.status === 'Todo').length;
    const taskColumns = [
      {
        key: 'title',
        title: 'Task',
        render: (record) => (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{record.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{record.type}</div>
          </div>
        ),
      },
      { key: 'assignee', title: 'Assignee' },
      { key: 'dueDate', title: 'Due Date', render: (record) => formatDisplayDate(record.dueDate) },
      { key: 'priority', title: 'Priority', render: (record) => <BadgePill label={record.priority} tone={getPriorityTone(record.priority)} /> },
      { key: 'status', title: 'Status', render: (record) => <BadgePill label={record.status} tone={getTaskTone(record.status)} /> },
      {
        key: 'actions',
        title: 'Actions',
        render: (record) => (
          renderTableActionButtons({
            onView: () => openTaskCrudModal('view', record),
            onEdit: () => openTaskCrudModal('edit', record),
            onDelete: () => confirmDeleteRecord('Delete Task', () => setProjectTasks(prev => prev.filter(item => item.id !== record.id))),
          })
        ),
      },
    ];

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: summaryGridColumns, gap: 12 }}>
          {[
            { label: 'Total Tasks', value: projectTasks.length },
            { label: 'Todo', value: todoTasks },
            { label: 'In Progress', value: inProgressTasks },
            { label: 'Complete', value: completedTasks },
          ].map(item => (
            <div key={item.label} style={{ ...card, padding: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Project Tasks</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                Create project-specific tasks in a popup modal and manage their status cleanly.
              </div>
            </div>
            <Button icon={<PlusOutlined />} onClick={() => openTaskCrudModal('create')} style={primaryButtonStyle}>
              Add Task
            </Button>
          </div>

          <DataTable columns={taskColumns} rows={projectTasks} emptyText="No tasks added yet." />
        </div>

        <Modal
          title={taskModal.mode === 'create' ? 'Add Task' : taskModal.mode === 'edit' ? 'Edit Task' : 'Task Details'}
          open={taskModal.open}
          styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
          onCancel={() => {
            setTaskModal({ open: false, mode: 'create', record: null });
            taskForm.resetFields();
          }}
          onOk={taskModal.mode === 'view' ? undefined : submitTaskModal}
          okText={taskModal.mode === 'edit' ? 'Update Task' : 'Create Task'}
          footer={taskModal.mode === 'view' ? [
            <Button key="close" onClick={() => {
              setTaskModal({ open: false, mode: 'create', record: null });
              taskForm.resetFields();
            }}>
              Close
            </Button>,
          ] : undefined}
          width={700}
        >
          <Form form={taskForm} layout="vertical" disabled={taskModal.mode === 'view'}>
            <Form.Item name="title" label="Task Title" rules={[{ required: true, message: 'Task title is required' }]}>
              <Input />
            </Form.Item>
            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item name="assignee" label="Assignee" rules={[{ required: true, message: 'Assignee is required' }]}>
                  <Select options={PROJECT_TEAM.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="type" label="Task Type" rules={[{ required: true, message: 'Task type is required' }]}>
                  <Select options={TASK_TYPES.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={24} sm={8}>
                <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Due date is required' }]}>
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Priority is required' }]}>
                  <Select options={TASK_PRIORITIES.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                  <Select options={TASK_STATUSES.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  };

  const renderPurchaseRequest = () => {
    const purchaseRequestColumns = [
      {
        key: 'product',
        title: 'Product',
        render: (record) => (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{record.product}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{record.sku}</div>
          </div>
        ),
      },
      { key: 'qty', title: 'Requested Qty' },
      { key: 'requestedBy', title: 'Requested By' },
      { key: 'priority', title: 'Priority', render: (record) => <BadgePill label={record.priority} tone={getPriorityTone(record.priority)} /> },
      { key: 'expectedBy', title: 'Needed By', render: (record) => formatDisplayDate(record.expectedBy) },
      { key: 'status', title: 'Status', render: (record) => <BadgePill label={record.status} tone={getRequestTone(record.status)} /> },
      {
        key: 'reason',
        title: 'Reason',
        render: (record) => (
          <div style={{ maxWidth: 260, color: 'var(--text-muted)' }}>
            {record.reason || 'Required for active project execution'}
          </div>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (record) => (
          renderTableActionButtons({
            onView: () => openPurchaseRequestCrudModal('view', record),
            onEdit: () => openPurchaseRequestCrudModal('edit', record),
            onDelete: () => confirmDeleteRecord('Delete Purchase Request', () => setPurchaseRequests(prev => prev.filter(item => item.id !== record.id))),
          })
        ),
      },
    ];

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: detailSummaryGridColumns, gap: 12 }}>
          {[
            { label: 'Out of Stock Alerts', value: outOfStockItems },
            { label: 'Low Stock Items', value: lowStockItems },
            { label: 'Open Requests', value: pendingRequests },
          ].map(item => (
            <div key={item.label} style={{ ...card, padding: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '320px minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
          <div style={{ ...card, padding: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>Low Stock Watchlist</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 14 }}>
              Prefill a request from any critical inventory item and send it into the approval flow.
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {OUT_OF_STOCK_PRODUCTS.map(item => (
                <div key={item.id} style={{ ...softCard, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{item.sku} / {item.vendor}</div>
                    </div>
                    <BadgePill label={`${item.available} available`} tone={item.available === 0 ? 'neutral' : 'warning'} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                    Reorder at {item.reorderLevel} and suggested procurement is {item.suggestedQty} {item.unit}.
                  </div>
                  <Button
                    size="small"
                    onClick={() => {
                      setPurchaseRequestDraft(prev => ({
                        ...prev,
                        productId: item.id,
                        quantity: String(item.suggestedQty),
                        priority: item.available === 0 ? 'High' : prev.priority,
                      }));
                      openPurchaseRequestCrudModal('create');
                    }}
                    style={secondaryButtonStyle}
                  >
                    Raise Request
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Purchase Requests</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                  Track request status, quantities, and procurement intent in one clean register.
                </div>
              </div>
              <Button icon={<PlusOutlined />} onClick={() => openPurchaseRequestCrudModal('create')} style={primaryButtonStyle}>
                Create Request
              </Button>
            </div>

            <DataTable columns={purchaseRequestColumns} rows={purchaseRequests} emptyText="No purchase requests created yet." />
          </div>
        </div>

        <Modal
          title={
            purchaseRequestModal.mode === 'create'
              ? 'Create Purchase Request'
              : purchaseRequestModal.mode === 'edit'
                ? 'Edit Purchase Request'
                : 'Purchase Request Details'
          }
          open={purchaseRequestModal.open}
          styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
          onCancel={() => {
            setPurchaseRequestModal({ open: false, mode: 'create', record: null });
            purchaseRequestForm.resetFields();
          }}
          onOk={purchaseRequestModal.mode === 'view' ? undefined : submitPurchaseRequestModal}
          okText={purchaseRequestModal.mode === 'edit' ? 'Update Request' : 'Create Request'}
          footer={purchaseRequestModal.mode === 'view' ? [
            <Button
              key="close"
              onClick={() => {
                setPurchaseRequestModal({ open: false, mode: 'create', record: null });
                purchaseRequestForm.resetFields();
              }}
            >
              Close
            </Button>,
          ] : undefined}
          width={760}
        >
          <Form form={purchaseRequestForm} layout="vertical" disabled={purchaseRequestModal.mode === 'view'}>
            <Row gutter={12}>
              <Col xs={24} sm={14}>
                <Form.Item name="productId" label="Product" rules={[{ required: true, message: 'Product is required' }]}>
                  <Select
                    options={OUT_OF_STOCK_PRODUCTS.map(item => ({ value: item.id, label: `${item.name} / ${item.sku}` }))}
                    onChange={(value) => {
                      const item = OUT_OF_STOCK_PRODUCTS.find(product => product.id === value);
                      if (item) purchaseRequestForm.setFieldValue('quantity', String(item.suggestedQty));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={10}>
                <Form.Item name="quantity" label="Required Quantity" rules={[{ required: true, message: 'Quantity is required' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={24} sm={8}>
                <Form.Item name="requestedBy" label="Requested By" rules={[{ required: true, message: 'Requested by is required' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Priority is required' }]}>
                  <Select options={TASK_PRIORITIES.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                  <Select options={REQUEST_STATUSES.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="expectedBy" label="Needed By" rules={[{ required: true, message: 'Need-by date is required' }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="reason" label="Reason" rules={[{ required: true, message: 'Reason is required' }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const renderInventory = () => {
    const inventoryColumns = [
      {
        key: 'product',
        title: 'Product',
        render: (record) => (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{record.product}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {record.category} / {record.sku}
            </div>
          </div>
        ),
      },
      { key: 'available', title: 'Available Count' },
      { key: 'reserved', title: 'Reserved Count' },
      { key: 'reorderLevel', title: 'Reorder Level' },
      { key: 'location', title: 'Location' },
      { key: 'status', title: 'Stock Status', render: (record) => <BadgePill label={record.status} tone={getInventoryTone(record.status)} /> },
    ];

    return (
      <div style={{ ...card, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Inventory Count Listing</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              Current stock counts for project-linked factory products.
            </div>
          </div>
          <Button onClick={() => setActiveTab('Purchase Request')} style={secondaryButtonStyle}>
            Open Purchase Requests
          </Button>
        </div>

        <DataTable columns={inventoryColumns} rows={FACTORY_INVENTORY} emptyText="No inventory items tracked yet." />
      </div>
    );
  };

  const renderActivities = () => {
    const upcomingActivity = [...projectActivities]
      .sort((first, second) => String(first.startDate || '').localeCompare(String(second.startDate || '')))[0] || null;

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: summaryGridColumns, gap: 12 }}>
          {[
            { label: 'Total Activities', value: projectActivities.length },
            { label: 'Planned', value: plannedActivities },
            { label: 'In Progress', value: liveActivities },
            { label: 'Completed', value: completedActivities },
          ].map(item => (
            <div key={item.label} style={{ ...card, padding: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Activity Cards</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                View execution records as cards and manage them with dedicated actions.
              </div>
            </div>
            <Button icon={<PlusOutlined />} onClick={() => openActivityCrudModal('create')} style={primaryButtonStyle}>
              Add Activity
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {projectActivities.map(item => (
              <div key={item.id} style={{ ...softCard, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 16 }}>{item.workItem}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                      {item.orderId} / {item.area}
                    </div>
                  </div>
                  <BadgePill label={item.status} tone={getActivityTone(item.status)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Owner</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.owner}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Duration</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.estimatedDays} days</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Start Date</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{formatDisplayDate(item.startDate)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Completion Target</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{formatDisplayDate(item.completionDate)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <Space wrap size={[6, 6]}>
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => openActivityCrudModal('view', item)}
                      title="View Activity"
                      aria-label="View Activity"
                      style={{ ...actionIconButtonStyle, color: '#2563eb' }}
                    />
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => openActivityCrudModal('edit', item)}
                      title="Edit Activity"
                      aria-label="Edit Activity"
                      style={{ ...actionIconButtonStyle, color: 'var(--primary)' }}
                    />
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => confirmDeleteRecord('Delete Activity', () => setProjectActivities(prev => prev.filter(activity => activity.id !== item.id)))}
                      title="Delete Activity"
                      aria-label="Delete Activity"
                      style={{ ...actionIconButtonStyle, color: '#ef4444' }}
                    />
                  </Space>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal
          title={activityModal.mode === 'create' ? 'Create Activity' : activityModal.mode === 'edit' ? 'Edit Activity' : 'Activity Details'}
          open={activityModal.open}
          styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
          onCancel={() => {
            setActivityModal({ open: false, mode: 'create', record: null });
            activityForm.resetFields();
          }}
          onOk={activityModal.mode === 'view' ? undefined : submitActivityModal}
          okText={activityModal.mode === 'edit' ? 'Update Activity' : 'Create Activity'}
          footer={activityModal.mode === 'view' ? [
            <Button
              key="close"
              onClick={() => {
                setActivityModal({ open: false, mode: 'create', record: null });
                activityForm.resetFields();
              }}
            >
              Close
            </Button>,
          ] : undefined}
          width={760}
        >
          <Form form={activityForm} layout="vertical" disabled={activityModal.mode === 'view'}>
            <Form.Item name="workItem" label="Order Work" rules={[{ required: true, message: 'Order work is required' }]}>
              <Select options={ACTIVITY_WORK_OPTIONS.map(item => ({ value: item.value, label: item.value }))} />
            </Form.Item>
            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item name="owner" label="Assigned Team" rules={[{ required: true, message: 'Assigned team is required' }]}>
                  <Select options={ACTIVITY_TEAM_OPTIONS.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                  <Select options={ACTIVITY_STATUSES.map(value => ({ value, label: value }))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={24} sm={8}>
                <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="estimatedDays" label="Estimated Days" rules={[{ required: true, message: 'Estimated days are required' }]}>
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="completionDate" label="Completion Date" rules={[{ required: true, message: 'Completion date is required' }]}>
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  };

  const renderFinancial = () => {
    const transactionColumns = [
      {
        key: 'milestone',
        title: 'Transaction',
        render: (record) => (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{record.milestone}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{record.id}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{record.note}</div>
          </div>
        ),
      },
      { key: 'date', title: 'Date', render: (record) => formatDisplayDate(record.date) },
      { key: 'mode', title: 'Mode' },
      { key: 'status', title: 'Status', render: (record) => <BadgePill label={record.status} tone={getPaymentTone(record.status)} /> },
      { key: 'amount', title: 'Amount', align: 'right', render: (record) => <span style={{ fontWeight: 700 }}>{formatMoney(record.amount)}</span> },
    ];

    const openInvoices = draftInvoices + sentInvoices;

    const totalOrders = orders.reduce((sum, item) => sum + item.amount, 0);
    const labourCharges = 210000;
    const marginPercent = 25.0;
    const calculatedMarginAmount = approvedAmount * (marginPercent / 100);

    const clientInvoicesValue = totalInvoiced;
    const vendorInvoicesValue = 480000;
    const profitLossValue = clientInvoicesValue - vendorInvoicesValue;

    const paymentReceivedValue = amountReceived;
    const paymentDoneValue = 320000;
    const cashflowValue = paymentReceivedValue - paymentDoneValue;

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
          {/* Card 1: Approved & Margins */}
          <div style={{ ...card, padding: 18, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <CheckCircleOutlined style={{ color: '#22c55e', fontSize: 16, marginTop: 3 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Quotes Approved</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{formatMoney(approvedAmount)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <CheckCircleOutlined style={{ color: '#3b82f6', fontSize: 16, marginTop: 3 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Orders Approved</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{formatMoney(totalOrders)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <CheckCircleOutlined style={{ color: 'var(--primary)', fontSize: 16, marginTop: 3 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Labour Charges</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{formatMoney(labourCharges)}</div>
                </div>
              </div>
            </div>
            <div
              style={{
                background: isDark ? 'rgba(90,181,232,0.08)' : 'rgba(214,159,109,0.06)',
                border: '1px dashed var(--primary)',
                padding: '12px 14px',
                borderRadius: 8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: 100,
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                % Margin <InfoCircleOutlined style={{ fontSize: 11 }} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)' }}>{marginPercent.toFixed(1)}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 4 }}>{formatMoney(calculatedMarginAmount)}</div>
            </div>
          </div>

          {/* Card 2: Invoices & Profitability */}
          <div style={{ ...card, padding: 18, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <CheckCircleOutlined style={{ color: '#10b981', fontSize: 16, marginTop: 3 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Client Invoices</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{formatMoney(clientInvoicesValue)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <CheckCircleOutlined style={{ color: '#ef4444', fontSize: 16, marginTop: 3 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Vendor Invoices</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{formatMoney(vendorInvoicesValue)}</div>
                </div>
              </div>
            </div>
            <div
              style={{
                background: isDark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
                border: '1px dashed #22c55e',
                padding: '12px 14px',
                borderRadius: 8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: 100,
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                Profit/Loss <InfoCircleOutlined style={{ fontSize: 11 }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <ArrowUpOutlined /> {formatMoney(profitLossValue)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 4 }}>Net Positive</div>
            </div>
          </div>

          {/* Card 3: Payments & Cashflow */}
          <div style={{ ...card, padding: 18, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <ArrowUpOutlined style={{ color: '#22c55e', fontSize: 16, marginTop: 3 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Payment Received</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{formatMoney(paymentReceivedValue)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <ArrowDownOutlined style={{ color: '#ef4444', fontSize: 16, marginTop: 3 }} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Payment Done</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{formatMoney(paymentDoneValue)}</div>
                </div>
              </div>
            </div>
            <div
              style={{
                background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.06)',
                border: '1px dashed #3b82f6',
                padding: '12px 14px',
                borderRadius: 8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: 100,
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                Cashflow <InfoCircleOutlined style={{ fontSize: 11 }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <WalletOutlined /> {formatMoney(cashflowValue)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 4 }}>In-Hand Balance</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isFinancialCompact ? '1fr' : 'minmax(680px, 1.5fr) minmax(320px, 0.9fr)',
            gap: 16,
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
            <div
              style={{
                ...card,
                padding: 20,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(8,27,47,1) 0%, rgba(23,63,95,1) 100%)'
                  : 'linear-gradient(135deg, #f8ede2 0%, #ffffff 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Commercial Overview</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                    A cleaner transaction dashboard for collections, invoices, and current receivables.
                  </div>
                </div>
                <BadgePill label={`${paymentProgress}% realised`} tone="success" />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isFinancialCompact ? '1fr' : 'minmax(0, 1fr) minmax(220px, 0.65fr)',
                  gap: 16,
                  marginBottom: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Collected So Far</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)' }}>{formatMoney(amountReceived)}</div>
                </div>
                <div style={{ textAlign: isFinancialCompact ? 'left' : 'right' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Open Invoice Exposure</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{formatMoney(openInvoiceValue)}</div>
                </div>
              </div>

              <Progress percent={paymentProgress} strokeColor="#D69F6D" showInfo={false} style={{ marginBottom: 16 }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Collection Coverage', value: `${paymentProgress}%`, helper: 'Against approved commercial value' },
                  { label: 'Open Invoices', value: openInvoices, helper: `${draftInvoices} draft and ${sentInvoices} sent` },
                  {
                    label: 'Next Invoice Due',
                    value: nextInvoiceDue ? formatDisplayDate(nextInvoiceDue.dueDate) : '-',
                    helper: nextInvoiceDue ? nextInvoiceDue.invoiceNo : 'No pending invoice',
                  },
                ].map(item => (
                  <div key={item.label} style={{ ...softCard, padding: '14px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{item.value}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.helper}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Transaction Ledger</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                    A structured record of received and scheduled payment movements.
                  </div>
                </div>
                <BadgePill label={`${PAYMENT_HISTORY.length} entries`} tone="accent" />
              </div>

              <DataTable columns={transactionColumns} rows={PAYMENT_HISTORY} emptyText="No transactions recorded yet." />
            </div>
          </div>

          <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
            <div style={{ ...card, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 10 }}>Collections Health</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                {formatMoney(amountReceived)} collected against {formatMoney(approvedAmount)} approved.
              </div>
              <Progress percent={paymentProgress} strokeColor="#D69F6D" showInfo={false} style={{ marginBottom: 12 }} />
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ ...softCard, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Scheduled Collection</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{formatMoney(scheduledAmount || PROJECT_FINANCIALS.nextDueAmount)}</span>
                </div>
                <div style={{ ...softCard, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Outstanding Balance</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{formatMoney(balanceOutstanding)}</span>
                </div>
              </div>
            </div>

            <div style={{ ...card, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 12 }}>Invoice Position</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  { label: 'Draft Invoices', value: draftInvoices },
                  { label: 'Sent Invoices', value: sentInvoices },
                  { label: 'Paid Invoices', value: paidInvoices },
                  { label: 'Open Invoice Value', value: formatMoney(openInvoiceValue) },
                ].map(item => (
                  <div key={item.label} style={{ ...softCard, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 12 }}>Upcoming Collections</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {PAYMENT_HISTORY.filter(item => item.status === 'Scheduled').map(item => (
                  <div key={item.id} style={{ ...softCard, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.milestone}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{formatDisplayDate(item.date)} / {item.mode}</div>
                      </div>
                      <BadgePill label={item.status} tone={getPaymentTone(item.status)} />
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{formatMoney(item.amount)}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRaiseInvoice = () => {
    const invoiceColumns = [
      { key: 'invoiceNo', title: 'Invoice No' },
      { key: 'invoiceType', title: 'Type' },
      { key: 'invoiceDate', title: 'Invoice Date', render: (record) => formatDisplayDate(record.invoiceDate) },
      { key: 'dueDate', title: 'Due Date', render: (record) => formatDisplayDate(record.dueDate) },
      { key: 'billToName', title: 'Bill To' },
      { key: 'totalAmount', title: 'Amount', render: (record) => formatMoney(record.totalAmount) },
      { key: 'status', title: 'Status', render: (record) => <BadgePill label={record.status} tone={getInvoiceTone(record.status)} /> },
      {
        key: 'actions',
        title: 'Actions',
        render: (record) => (
          renderTableActionButtons({
            onView: () => openInvoiceCrudModal('view', record),
            onEdit: () => openInvoiceCrudModal('edit', record),
            onDelete: () => confirmDeleteRecord('Delete Invoice', () => setInvoices(prev => prev.filter(item => item.id !== record.id))),
          })
        ),
      },
    ];

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: summaryGridColumns, gap: 12 }}>
          {[
            { label: 'Total Invoices', value: invoices.length },
            { label: 'Draft', value: draftInvoices },
            { label: 'Sent', value: sentInvoices },
            { label: 'Paid', value: paidInvoices },
            { label: 'Open Receivables', value: formatMoney(openInvoiceValue) },
          ].map(item => (
            <div key={item.label} style={{ ...card, padding: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>Invoice Register</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                Create invoices in a popup modal and manage the register with view, edit, and delete actions.
              </div>
            </div>
            <Button icon={<PlusOutlined />} onClick={() => openInvoiceCrudModal('create')} style={primaryButtonStyle}>
              Create Invoice
            </Button>
          </div>

          <DataTable columns={invoiceColumns} rows={invoices} emptyText="No invoices raised yet." />
        </div>

        <Modal
          title={invoiceModal.mode === 'create' ? 'Create Invoice' : invoiceModal.mode === 'edit' ? 'Edit Invoice' : 'Invoice Details'}
          open={invoiceModal.open}
          styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
          onCancel={() => {
            setInvoiceModal({ open: false, mode: 'create', record: null });
            setInvoiceSameAddress(false);
            invoiceForm.resetFields();
          }}
          onOk={invoiceModal.mode === 'view' ? undefined : submitInvoiceModal}
          okText={invoiceModal.mode === 'edit' ? 'Update Invoice' : 'Create Invoice'}
          footer={invoiceModal.mode === 'view' ? [
            <Button
              key="close"
              onClick={() => {
                setInvoiceModal({ open: false, mode: 'create', record: null });
                setInvoiceSameAddress(false);
                invoiceForm.resetFields();
              }}
            >
              Close
            </Button>,
          ] : undefined}
          width={isCompact ? '96%' : 1080}
        >
          <Form
            form={invoiceForm}
            layout="vertical"
            disabled={invoiceModal.mode === 'view'}
            onValuesChange={(changedValues, allValues) => {
              if (!invoiceSameAddress) return;
              if (Object.keys(changedValues).some(key => key.startsWith('billTo'))) {
                invoiceForm.setFieldsValue({
                  shipToName: allValues.billToName,
                  shipToEmail: allValues.billToEmail,
                  shipToPhone: allValues.billToPhone,
                  shipToGst: allValues.billToGst,
                  shipToAddress: allValues.billToAddress,
                });
              }
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1.45fr) 320px', gap: 16 }}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ ...softCard, padding: '14px 16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: detailSummaryGridColumns, gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Project Name</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{project.projectName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Project Number</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{project.projectCode}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Client</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{project.clientName}</div>
                    </div>
                  </div>
                </div>

                <div style={{ ...softCard, padding: '16px 18px' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)', marginBottom: 14 }}>Bill To</div>
                  <Row gutter={12}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="billToName" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="billToEmail" label="Email">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="billToPhone" label="Phone" rules={[{ required: true, message: 'Phone is required' }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="billToGst" label="GST Number">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="billToAddress" label="Address">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </div>

                <div style={{ ...softCard, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>Ship To</div>
                    <Checkbox checked={invoiceSameAddress} onChange={(event) => handleInvoiceSameAddressToggle(event.target.checked)}>
                      Same as billing
                    </Checkbox>
                  </div>
                  <Row gutter={12}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="shipToName" label="Name">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="shipToEmail" label="Email">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="shipToPhone" label="Phone">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="shipToGst" label="GST Number">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="shipToAddress" label="Address">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </div>

                <div style={{ ...softCard, padding: '16px 18px' }}>
                  <Form.Item name="notes" label="Notes" style={{ marginBottom: 0 }}>
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ ...softCard, padding: '16px 18px' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 14 }}>Invoice Meta</div>
                  <Form.Item name="invoiceNo" label="Invoice Number" rules={[{ required: true, message: 'Invoice number is required' }]}>
                    <Input />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="invoiceDate" label="Invoice Date" rules={[{ required: true, message: 'Invoice date is required' }]}>
                        <Input type="date" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Due date is required' }]}>
                        <Input type="date" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="invoiceType" label="Invoice Type" rules={[{ required: true, message: 'Invoice type is required' }]}>
                    <Select options={INVOICE_TYPES.map(value => ({ value, label: value }))} />
                  </Form.Item>
                  <Form.Item name="status" label="Status" style={{ marginBottom: 0 }}>
                    <Select options={INVOICE_STATUSES.map(value => ({ value, label: value }))} />
                  </Form.Item>
                </div>

                <div style={{ ...softCard, padding: '16px 18px' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 14 }}>Amount Details</div>
                  <Form.Item name="subTotal" label="Sub Total" rules={[{ required: true, message: 'Sub total is required' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="gstAmount" label="GST Amount" rules={[{ required: true, message: 'GST amount is required' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <div style={{ background: '#1e3a5f', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Total Amount</span>
                    <span style={{ color: '#fff', fontWeight: 800 }}>{formatMoney(watchedInvoiceTotal)}</span>
                  </div>
                </div>

                <div style={{ ...softCard, padding: '16px 18px' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 10 }}>Bank Details & Payment Instructions</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                    Account Name: Perspective Kitchens & Interiors<br />
                    Account No: 12345678<br />
                    Bank Name: HDFC Bank
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Project Detail':
        return renderProjectDetail();
      case 'Files':
        return renderFiles();
      case 'User Requirement':
        return renderUserRequirement();
      case 'Notes':
        return renderNotes();
      case 'Quotes':
        return renderQuotes();
      case 'Orders':
        return renderOrders();
      case 'Tasks':
        return renderTasks();
      case 'Purchase Request':
        return renderPurchaseRequest();
      case 'Inventory':
        return renderInventory();
      case 'Activities':
        return renderActivities();
      case 'Financial':
        return renderFinancial();
      case 'Raise Invoice':
        return renderRaiseInvoice();
      default:
        return null;
    }
  };

  const initials = project.clientName?.charAt(0)?.toUpperCase() || 'P';

  return (
    <div style={{ ...css }}>
      <div style={{ marginBottom: 14, position: 'relative', zIndex: 1000 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/projects');
          }}
          style={{
            color: isDark ? '#8a9ab0' : '#666',
            fontWeight: 500,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          Back to Projects
        </Button>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={44}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{project.clientName}</div>
            <div style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>{project.projectCode}</div>
          </div>
        </div>

        <Space wrap size={8}>
          <Button icon={<EditOutlined />} onClick={openEditModal} style={primaryButtonStyle}>
            Edit Project
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Delete Project',
                content: `Are you sure you want to delete ${project.projectCode}?`,
                okText: 'Delete',
                okButtonProps: { danger: true },
                onOk: () => navigate('/projects'),
              });
            }}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Delete Project
          </Button>
        </Space>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
          flexDirection: isLayoutCompact ? 'column' : 'row',
        }}
      >
        <div
          style={{
            width: isLayoutCompact ? '100%' : 220,
            flexShrink: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '12px 10px',
            boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {isLayoutCompact ? (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {SIDEBAR_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                    fontWeight: activeTab === tab.key ? 600 : 500,
                    color: activeTab === tab.key ? '#fff' : (isDark ? '#8a9ab0' : '#666'),
                    background: activeTab === tab.key ? 'var(--primary)' : (isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f0'),
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            SIDEBAR_TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <div
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--primary)' : (isDark ? '#8a9ab0' : '#666'),
                    background: isActive
                      ? (isDark ? 'rgba(90,181,232,0.1)' : 'rgba(214,159,109,0.1)')
                      : 'transparent',
                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    marginBottom: 4,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                      e.currentTarget.style.color = isDark ? '#d8e8f8' : '#333';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = isDark ? '#8a9ab0' : '#666';
                    }
                  }}
                >
                  <span style={{ fontSize: 15 }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
              );
            })
          )}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: isMobile ? 14 : 20,
            boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
            minHeight: 400,
          }}
        >
          {renderContent()}
        </div>
      </div>

      <Modal
        className="crm-sheet-modal"
        title="Edit Project"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSaveProject}
        okText="Submit"
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'crm-primary-btn' }}
        width={isMobile ? '96%' : 860}
        centered
      >
        <Form form={editForm} layout="vertical" className="crm-form-shell">
          <Row gutter={14} style={{ marginBottom: 12 }}>
            <Col xs={24} sm={12}>
              <Form.Item name="stage" label="Main Stage" style={{ marginBottom: 0 }}>
                <Select
                  onChange={value => {
                    setMainStage(value);
                    editForm.setFieldValue('subStage', (subStages[value] || [])[0] || '');
                  }}
                  options={['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(value => ({ value, label: value }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="subStage" label="Sub Stage" style={{ marginBottom: 0 }}>
                <Select options={(subStages[mainStage] || []).map(value => ({ value, label: value }))} />
              </Form.Item>
            </Col>
          </Row>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Contact Details</div>
            <div className="crm-panel-card__body">
              <Row gutter={14}>
                <Col xs={24} sm={8}><Form.Item name="clientName" label="Name"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="email" label="Email"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 8 }}>Phone</div>
                  <Row gutter={8}>
                    <Col span={8}><Form.Item name="phoneCode" style={{ marginBottom: 0 }}><Select options={[{ value: '+91', label: '+91' }]} /></Form.Item></Col>
                    <Col span={16}><Form.Item name="phoneNumber" style={{ marginBottom: 0 }}><Input /></Form.Item></Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Project Details</div>
            <div className="crm-panel-card__body">
              <Row gutter={14}>
                <Col xs={24} sm={8}><Form.Item name="budget" label="Budget"><Input /></Form.Item></Col>
                <Col xs={24} sm={16}><Form.Item name="description" label="Description"><Input.TextArea rows={2} /></Form.Item></Col>
              </Row>
            </div>
          </div>

          <div className="crm-panel-card" style={{ marginBottom: 12 }}>
            <div className="crm-panel-card__head">Address Details</div>
            <div className="crm-panel-card__body">
              <Row gutter={14}>
                <Col xs={24} sm={8}><Form.Item name="address1" label="Address line 1"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="address2" label="Address line 2"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="state" label="State"><Select options={['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi'].map(value => ({ value, label: value }))} /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="city" label="City"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="pincode" label="Pincode"><Input /></Form.Item></Col>
                <Col xs={24} sm={8}><Form.Item name="location" label="Location"><Input /></Form.Item></Col>
              </Row>
            </div>
          </div>

          <div className="crm-panel-card">
            <div className="crm-panel-card__head">Other Details</div>
            <div className="crm-panel-card__body">
              <Row gutter={14}>
                <Col xs={24} sm={12}><Form.Item name="legalName" label="Legal Name"><Input /></Form.Item></Col>
                <Col xs={24} sm={12}><Form.Item name="gst" label="GST Number"><Input /></Form.Item></Col>
              </Row>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
