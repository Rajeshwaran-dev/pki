import { useState } from 'react';
import { Button, Card, Modal, Space, Table, Tag, Typography, message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';

const { Text } = Typography;

export default function AttendanceGeofence() {
  const navigate = useNavigate();
  const [branches] = useState([
    {
      id: 'br-001',
      name: 'Askeva',
      badge: 'Head Office',
      code: 'ASKE-001',
      address: 'Muneeshwara nagar 321 ESI Ring road, Hosur...',
      status: 'Enabled',
      locations: '3 zones',
      defaultRadius: '100m',
    },
    {
      id: 'br-002',
      name: 'Geniebox',
      badge: '',
      code: 'GENI-001',
      address: '2nd FLOOR, SP Plaza, 3PC, 18B, Mogappair We...',
      status: 'Enabled',
      locations: '2 zones',
      defaultRadius: '100m',
    },
    {
      id: 'br-003',
      name: 'Madurai Branch',
      badge: '',
      code: 'MADU',
      address: 'abc, Madurai, TN',
      status: 'Enabled',
      locations: 'Lat: 9.946965  Lng: 78.098092',
      defaultRadius: '200m',
    },
    {
      id: 'br-004',
      name: 'Test',
      badge: '',
      code: 'TEST-005',
      address: 'test, test, test',
      status: 'Enabled',
      locations: '2 zones',
      defaultRadius: '200m',
    },
  ]);

  const openConfigure = (record) => {
    Modal.info({
      title: `Configure Geofence — ${record.name}`,
      content: (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Branch details</div>
          <div><b>Code:</b> {record.code}</div>
          <div><b>Default radius:</b> {record.defaultRadius}</div>
          <div style={{ marginTop: 10, color: '#666' }}>
            Map + zone editing can be connected later. This screen is UI-only for now.
          </div>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: 'Branch Name',
      dataIndex: 'name',
      render: (_v, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            ⛭
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{r.name}</div>
            {r.badge ? <Tag style={{ marginTop: 4, borderRadius: 8 }}>{r.badge}</Tag> : null}
          </div>
        </div>
      ),
    },
    {
      title: 'Branch Code',
      dataIndex: 'code',
      width: 120,
      render: v => <Tag style={{ borderRadius: 8, background: '#f5f5f5' }}>{v}</Tag>,
    },
    { title: 'Address', dataIndex: 'address' },
    {
      title: 'Geofence Status',
      dataIndex: 'status',
      width: 140,
      render: v => <Tag color="gold" style={{ borderRadius: 999 }}>{v}</Tag>,
    },
    { title: 'Location(s)', dataIndex: 'locations', width: 150 },
    { title: 'Default radius', dataIndex: 'defaultRadius', width: 130 },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_v, r) => (
        <Button icon={<SettingOutlined />} onClick={() => openConfigure(r)}>
          Configure
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance Geofence Settings"
        backTo="/settings/attendance"
      />

      <Card className="crm-card" styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={branches}
          pagination={false}
        />
      </Card>
    </div>
  );
}

