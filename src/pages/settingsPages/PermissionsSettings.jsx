import { useState } from 'react';
import { Table, Button, Tag, Switch, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';
import { useAppSelector } from '@/store';

const roles = [
  { key: 'superAdmin', label: 'Super Admin' },
  { key: 'admin',      label: 'Admin'       },
  { key: 'designer',   label: 'Designer'    },
  { key: 'siteManager',label: 'Site Manager'},
  { key: 'accountant', label: 'Accountant'  },
  { key: 'viewer',     label: 'Viewer'      },
];

const initialModules = [
  { key: 'dashboard',  module: 'Dashboard',  superAdmin: true, admin: true,  designer: true,  siteManager: true,  accountant: true,  viewer: true  },
  { key: 'enquiry',    module: 'Enquiry',     superAdmin: true, admin: true,  designer: true,  siteManager: false, accountant: false, viewer: false },
  { key: 'clients',    module: 'Clients',     superAdmin: true, admin: true,  designer: true,  siteManager: true,  accountant: false, viewer: true  },
  { key: 'projects',   module: 'Projects',    superAdmin: true, admin: true,  designer: true,  siteManager: true,  accountant: false, viewer: true  },
  { key: 'tasks',      module: 'Tasks',       superAdmin: true, admin: true,  designer: true,  siteManager: true,  accountant: false, viewer: true  },
  { key: 'reports',    module: 'Reports',     superAdmin: true, admin: true,  designer: false, siteManager: false, accountant: true,  viewer: false },
  { key: 'chat',       module: 'Chat',        superAdmin: true, admin: true,  designer: true,  siteManager: true,  accountant: true,  viewer: false },
  { key: 'attendance', module: 'Attendance',  superAdmin: true, admin: true,  designer: false, siteManager: false, accountant: true,  viewer: false },
  { key: 'payroll',    module: 'Payroll',     superAdmin: true, admin: true,  designer: false, siteManager: false, accountant: true,  viewer: false },
  { key: 'inventory',  module: 'Inventory',   superAdmin: true, admin: true,  designer: true,  siteManager: true,  accountant: false, viewer: false },
  { key: 'settings',   module: 'Settings',    superAdmin: true, admin: false, designer: false, siteManager: false, accountant: false, viewer: false },
];

export default function PermissionsSettings() {
  const [perms, setPerms] = useState(initialModules);
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';

  const primaryColor  = isDark ? '#5ab5e8'  : '#D69F6D';
  const sectionBg     = isDark ? '#081b2f'  : '#f8fafd';
  const sectionBorder = isDark ? '#1a4d72'  : '#e8f0fb';
  const cardBg        = isDark ? '#0d3554'  : '#ffffff';

  const toggle = (moduleKey, roleKey) => {
    if (roleKey === 'superAdmin') return;
    setPerms(prev => prev.map(m =>
      m.key === moduleKey ? { ...m, [roleKey]: !m[roleKey] } : m
    ));
  };

  const columns = [
    {
      title: 'Module', dataIndex: 'module', width: 140,
      render: v => <span style={{ fontWeight: 600, fontSize: 15 }}>{v}</span>,
    },
    ...roles.map(r => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <Tag style={{
            background: `${primaryColor}18`, color: primaryColor,
            border: `1px solid ${primaryColor}40`,
            borderRadius: 6, fontSize: 14, fontWeight: 600,
          }}>
            {r.label}
          </Tag>
        </div>
      ),
      dataIndex: r.key,
      width: 120,
      align: 'center',
      render: (val, record) => {
        if (r.key === 'superAdmin') {
          return <Tag style={{ background: `${primaryColor}18`, color: primaryColor, border: `1px solid ${primaryColor}40`, borderRadius: 6, fontSize: 14 }}>Always</Tag>;
        }
        return (
          <Switch size="small" checked={val} onChange={() => toggle(record.key, r.key)} />
        );
      },
    })),
  ];

  return (
    <div>
      <PageHeader title="Permissions" />

      <div className="animate-fade-in">
        {/* Info bar */}
        <div style={{
          background: sectionBg,
          border: `1px solid ${sectionBorder}`,
          borderRadius: 12,
          padding: '12px 18px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 14, color: isDark ? '#a8b0ba' : '#666' }}>
            Configure which roles can access each module. Super Admin always has full access.
          </span>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => message.success('Permissions saved successfully')}
            style={{ background: primaryColor, border: 'none', borderRadius: 8, flexShrink: 0, marginLeft: 16 }}
          >
            Save Changes
          </Button>
        </div>

        {/* Table card */}
        <div style={{
          background: cardBg,
          borderRadius: 14,
          boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          border: `1px solid ${sectionBorder}`,
        }}>
          <Table
            size="small"
            pagination={false}
            dataSource={perms}
            columns={columns}
            scroll={{ x: 800 }}
          />
        </div>
      </div>
    </div>
  );
}
