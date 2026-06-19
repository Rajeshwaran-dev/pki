import { useState, useMemo } from 'react';
import { Row, Col, Card, Select, Table, Tag, Progress, Avatar } from 'antd';
import {
  DollarCircleOutlined, BankOutlined, ArrowUpOutlined,
  ProjectOutlined, LineChartOutlined, UserOutlined
} from '@ant-design/icons';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';
import useIsMobile from '@/hooks/useIsMobile';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const LIGHT_PALETTE = ['#D69F6D', '#C07230', '#7A4218', '#4F312A', '#B87C4A', '#E8C49A'];
const DARK_PALETTE  = ['#5AB5E8', '#3A8FC4', '#7ED3F0', '#1A6499', '#2A7DB5', '#A8D8F0'];

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: isDark ? '#0d3554' : '#fff',
      border: `1px solid ${isDark ? '#1a4d72' : '#f0f0f0'}`,
      borderRadius: 10, padding: '10px 14px',
      boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 14 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <Card
    className="crm-card"
    styles={{ body: { padding: '20px' } }}
    style={{ height: '100%', position: 'relative', overflow: 'hidden' }}
    hoverable
  >
    <div style={{
      position: 'absolute', top: -20, right: -20,
      width: 100, height: 100, borderRadius: '50%',
      background: `${color}11`, zIndex: 0
    }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: `${color}18`, borderRadius: 20,
            padding: '4px 10px', fontSize: 13, color, fontWeight: 600,
          }}>
            <ArrowUpOutlined style={{ fontSize: 12 }} /> {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-soft)', marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{subtitle}</div>}
    </div>
  </Card>
);

const FinancialPage = () => {
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  
  const projects = useAppSelector(s => s.projects.projects);
  const clients = useAppSelector(s => s.clients.clients);

  const [selectedClientId, setSelectedClientId] = useState('ALL');

  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const CHART_COLORS = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  const activeProjects = useMemo(() => {
    if (selectedClientId === 'ALL') return projects;
    return projects.filter(p => p.clientId === selectedClientId || p.clientName === clients.find(c => c.id === selectedClientId)?.clientName);
  }, [projects, clients, selectedClientId]);

  // Mock financial calculation
  const totalValue = activeProjects.reduce((sum, p) => sum + (p.budget || 2500000), 0);
  const totalReceived = activeProjects.reduce((sum, p) => sum + (p.amountReceived !== undefined ? p.amountReceived : (p.budget ? p.budget * 0.4 : 1000000)), 0);
  const totalOutstanding = totalValue - totalReceived;

  const stageData = ['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(stage => {
    const stageProjects = activeProjects.filter(p => p.stage === stage);
    return {
      name: stage,
      value: stageProjects.reduce((sum, p) => sum + (p.budget || 2500000), 0) / 100000, // In Lakhs
      count: stageProjects.length
    };
  }).filter(d => d.value > 0);

  const clientOptions = [
    { value: 'ALL', label: 'All Clients (Overall)' },
    ...clients.map(c => ({ value: c.id, label: c.clientName }))
  ];

  const recentPayments = activeProjects.slice(0, 5).map((p, idx) => ({
    id: `TXN-${Date.now() - idx * 100000}`,
    date: new Date(Date.now() - idx * 86400000 * 3).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    project: p.projectName,
    client: p.clientName,
    amount: p.amountReceived ? p.amountReceived * 0.5 : (p.budget || 2500000) * 0.1,
    milestone: ['Booking Amount', 'Design Advance', '50% Material Advance'][idx % 3],
    status: 'Received'
  }));

  const paymentColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120, render: v => <span style={{ color: 'var(--text-soft)' }}>{v}</span> },
    { title: 'Project & Client', key: 'project', render: (_, r) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{r.project}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.client}</div>
      </div>
    )},
    { title: 'Milestone', dataIndex: 'milestone', key: 'milestone' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right', render: v => <span style={{ fontWeight: 700, fontSize: 15 }}>₹{(v).toLocaleString('en-IN')}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', align: 'right', render: v => <Tag color="success" style={{ borderRadius: 6, fontWeight: 600 }}>{v}</Tag> },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 24, gap: 16 }}>
        <PageHeader 
          title="Financial Module" 
          subtitle={selectedClientId === 'ALL' ? 'Overall portfolio financial summary' : `Financial summary for ${clientOptions.find(c => c.value === selectedClientId)?.label}`} 
          style={{ marginBottom: 0 }}
        />
        <Select
          size="large"
          value={selectedClientId}
          onChange={setSelectedClientId}
          options={clientOptions}
          style={{ width: isMobile ? '100%' : 280 }}
          dropdownStyle={{ borderRadius: 12 }}
          optionRender={(option) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
              <Avatar size="small" icon={option.data.value === 'ALL' ? <BankOutlined /> : <UserOutlined />} style={{ background: option.data.value === 'ALL' ? 'var(--primary)' : 'var(--surface)', color: option.data.value === 'ALL' ? '#fff' : 'var(--text)', border: '1px solid var(--border)' }} />
              <span style={{ fontWeight: option.data.value === 'ALL' ? 700 : 500 }}>{option.data.label}</span>
            </div>
          )}
        />
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24, alignItems: 'stretch' }}>
        <Col xs={24} md={8}>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', height: '100%' }}>
            <StatCard 
              title="Total Contract Value" 
              value={`₹${(totalValue / 100000).toFixed(2)}L`} 
              icon={<BankOutlined />} 
              color={isDark ? '#5ab5e8' : '#D69F6D'} 
              subtitle={`${activeProjects.length} Active Projects`}
              trend="12%"
            />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', height: '100%' }}>
            <StatCard 
              title="Amount Received" 
              value={`₹${(totalReceived / 100000).toFixed(2)}L`} 
              icon={<DollarCircleOutlined />} 
              color="#52c41a" 
              subtitle={`${Math.round((totalReceived / totalValue) * 100 || 0)}% of total value`}
            />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', height: '100%' }}>
            <StatCard 
              title="Outstanding Balance" 
              value={`₹${(totalOutstanding / 100000).toFixed(2)}L`} 
              icon={<LineChartOutlined />} 
              color="#faad14" 
              subtitle={`${Math.round((totalOutstanding / totalValue) * 100 || 0)}% pending collection`}
            />
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card className="crm-card chart-card animate-fade-in-up" style={{ animationDelay: '0.4s' }} title={<span style={{ fontWeight: 700 }}>Value by Project Stage (₹ Lakhs)</span>}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stageData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a2a' : '#f0f0f0'} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-soft)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-soft)' }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" name="Value (L)" radius={[6, 6, 0, 0]}>
                  {stageData.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="crm-card chart-card animate-fade-in-up" style={{ animationDelay: '0.5s' }} title={<span style={{ fontWeight: 700 }}>Collection Status</span>}>
            <div style={{ display: 'flex', flexDirection: 'column', height: 280, justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Overall Collection</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: primaryColor }}>{Math.round((totalReceived / totalValue) * 100 || 0)}%</span>
              </div>
              <Progress 
                percent={Math.round((totalReceived / totalValue) * 100 || 0)} 
                showInfo={false} 
                strokeColor={{ '0%': primaryColor, '100%': '#52c41a' }} 
                trailColor={isDark ? '#1a2b3c' : '#f0f0f0'} 
                strokeWidth={16} 
                style={{ marginBottom: 32 }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 12 }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>Collected</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>₹{(totalReceived / 100000).toFixed(2)}L</div>
                </div>
                <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 12 }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>Pending</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#faad14' }}>₹{(totalOutstanding / 100000).toFixed(2)}L</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="crm-card animate-fade-in-up" style={{ animationDelay: '0.6s' }} title={<span style={{ fontWeight: 700 }}>Recent Transactions</span>}>
        <Table
          dataSource={recentPayments}
          columns={paymentColumns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
};

export default FinancialPage;
