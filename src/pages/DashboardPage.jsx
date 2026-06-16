import { useState } from 'react';
import { Row, Col, Card, Progress, Tag, Avatar, Space, Tabs, DatePicker, Table, Select, Input, Button } from 'antd';
import {
  ProjectOutlined, TeamOutlined, CheckSquareOutlined, DollarOutlined,
  ArrowUpOutlined, FireOutlined, ClockCircleOutlined, RiseOutlined,
  PieChartOutlined, BarChartOutlined, CalendarOutlined, FileTextOutlined,
  SearchOutlined, EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, PieChart, Pie, Cell, Legend, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';

const StatCard = ({ title, value, icon, color, trend, prefix, suffix, formatter, isDark }) => {
  const displayValue = formatter ? `${(Number(value) / 100000).toFixed(1)}L` : value;
  const isPositive = parseInt(trend) > 0;
  
  return (
    <Card
      className="stat-card"
      style={{ 
        height: '100%',
        borderRadius: '16px',
        border: isDark ? '1px solid rgba(214, 159, 109, 0.15)' : '1px solid rgba(214, 159, 109, 0.08)',
        background: isDark ? 'linear-gradient(135deg, #0b2338 0%, #0d3554 100%)' : 'linear-gradient(135deg, #ffffff 0%, #faf8f5 100%)',
        boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.2)' : '0 4px 16px rgba(214, 159, 109, 0.02)',
        transition: 'all 0.25s ease',
      }}
      hoverable
      styles={{ body: { padding: '16px 20px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '12px',
          background: isDark ? 'rgba(214, 159, 109, 0.15)' : 'rgba(214, 159, 109, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: '#D69F6D',
        }}>
          {icon}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: isDark ? '#f2f5f8' : '#4F312A', lineHeight: 1.2 }}>
            {prefix}{displayValue}{suffix}
          </div>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: isDark ? 'rgba(214, 159, 109, 0.15)' : 'rgba(214, 159, 109, 0.08)',
            borderRadius: 20, padding: '1px 8px', marginTop: 4,
            fontSize: 11, color: '#D69F6D', fontWeight: 600,
          }}>
            <ArrowUpOutlined style={{ fontSize: 9, transform: isPositive ? 'none' : 'rotate(180deg)' }} />
            {trend || '12%'}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 16, color: isDark ? '#a8b0ba' : '#888', fontWeight: 500, marginTop: 4 }}>
        {title}
      </div>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: isDark ? 'rgba(11, 35, 56, 0.96)' : 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: '12px',
      padding: '10px 14px',
      boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 8px 24px rgba(214, 159, 109, 0.06)',
      border: isDark ? '1px solid rgba(214, 159, 109, 0.2)' : '1px solid rgba(214, 159, 109, 0.12)',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: isDark ? '#f2f5f8' : '#4F312A', fontSize: 12 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: p.color }} />
            <span style={{ color: isDark ? '#a8b0ba' : '#888', fontWeight: 500 }}>{p.name}:</span>
            <strong style={{ color: isDark ? '#f2f5f8' : '#4F312A', marginLeft: 'auto' }}>{p.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom SVG shape for Projects by Stage Bar Chart
const RenderCustomBar = (props) => {
  const { fill, x, y, width, height, isDark } = props;
  const radius = 6;
  // If height is negligible, don't draw inner fill
  const innerHeight = Math.max(0, height - 6);
  
  return (
    <g>
      {/* Sleek outer glass cylinder track */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={isDark ? "rgba(214, 159, 109, 0.05)" : "rgba(214, 159, 109, 0.02)"}
        stroke={isDark ? "rgba(214, 159, 109, 0.2)" : "rgba(214, 159, 109, 0.12)"}
        strokeWidth={1}
      />
      {/* Core glowing solid bar inside */}
      {height > 4 && (
        <rect
          x={x + 3}
          y={y + 3}
          width={width - 6}
          height={innerHeight}
          rx={radius - 2}
          ry={radius - 2}
          fill={fill}
        />
      )}
    </g>
  );
};

const DashboardPage = () => {
  const projects = useAppSelector(s => s.projects.projects);
  const clients  = useAppSelector(s => s.clients.clients);
  const tasks    = useAppSelector(s => s.tasks.tasks);
  const theme    = useAppSelector(s => s.ui.theme);
  const isDark   = theme === 'dark';

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('1');
  const [activePieIndex, setActivePieIndex] = useState(null);
  const [activeBarIndex, setActiveBarIndex] = useState(null);

  // Quote Filters State
  const [quoteProjectFilter, setQuoteProjectFilter] = useState(null);
  const [quoteSearchFilter, setQuoteSearchFilter] = useState('');
  const [quoteDateFilter, setQuoteDateFilter] = useState(null);

  const totalBudget    = projects.reduce((s, p) => s + p.budget, 0);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks   = tasks.filter(t => t.status !== 'Completed').length;
  const activeProjects = projects.filter(p => p.stage !== 'Completed').length;

  const primaryColor   = '#D69F6D';

  const stats = [
    { title: 'Total Projects',  value: projects.length,  icon: <ProjectOutlined />,      color: primaryColor, trend: '8%' },
    { title: 'Active Projects', value: activeProjects,   icon: <FireOutlined />,          color: primaryColor, trend: '5%' },
    { title: 'Active Clients',  value: clients.length,   icon: <TeamOutlined />,          color: primaryColor, trend: '15%' },
    { title: 'Tasks Completed', value: completedTasks,   icon: <CheckSquareOutlined />,   color: primaryColor, suffix: `/ ${tasks.length}`, trend: '24%' },
    { title: 'Pending Tasks',   value: pendingTasks,     icon: <ClockCircleOutlined />,   color: 'rgba(214, 159, 109, 0.65)', trend: '3%' },
    { title: 'Total Portfolio', value: totalBudget,      icon: <DollarOutlined />,        color: primaryColor, prefix: '₹', formatter: true, trend: '18%' },
  ];

  const stageData = ['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(stage => ({
    name: stage,
    count: projects.filter(p => p.stage === stage).length,
  }));

  const stageColors = {
    Sales: '#D69F6D',       // Primary brand gold
    Designing: '#C79261',   // Deeper warm gold
    Execution: '#B37D4D',   // Elegant bronze-gold
    Snags: '#E5C49F',       // Soft light buff-gold
    Handover: '#F2DFCC',    // Extremely soft buff
    Completed: '#7A4C23',   // Rich golden-chocolate brown
  };

  const pieData = stageData.filter(d => d.count > 0);
  const recentProjects = projects.slice(0, 5);

  const trendData = [
    { month: 'Jan', projects: 3, tasks: 12 },
    { month: 'Feb', projects: 5, tasks: 18 },
    { month: 'Mar', projects: 4, tasks: 15 },
    { month: 'Apr', projects: 8, tasks: 24 },
    { month: 'May', projects: 6, tasks: 20 },
    { month: 'Jun', projects: 9, tasks: 28 },
  ];

  const urgentTasks = tasks.filter(t => t.priority === 'Urgent' || t.priority === 'High').slice(0, 4);

  const chartStyle = {
    background: isDark ? 'linear-gradient(135deg, #0b2338 0%, #0d3554 100%)' : 'linear-gradient(135deg, #ffffff 0%, #fefefc 100%)',
    borderRadius: '20px',
    border: isDark ? '1px solid rgba(214, 159, 109, 0.15)' : '1px solid rgba(214, 159, 109, 0.1)',
    boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(214, 159, 109, 0.02)',
    overflow: 'hidden',
    transition: 'all 0.25s ease',
  };

  const textPrimary = isDark ? '#f2f5f8' : '#4F312A';
  const textSecondary = isDark ? '#a8b0ba' : '#888';
  const borderLight = isDark ? 'rgba(214, 159, 109, 0.15)' : 'rgba(214, 159, 109, 0.06)';
  const iconBg = isDark ? 'rgba(214, 159, 109, 0.15)' : 'rgba(214, 159, 109, 0.08)';

  const quoteListings = [
    { id: '1', projectId: 'PRJ-771', quoteNo: 'QT-PRJ-01', client: 'Mr. Suresh', status: 'Approved', amount: 7500000, paymentReceived: 2500000, date: '2026-06-16' },
    { id: '2', projectId: 'PRJ-772', quoteNo: 'QT-PRJ-02', client: 'Rahul Sharma', status: 'Pending', amount: 4800000, paymentReceived: 0, date: '2026-05-14' },
    { id: '3', projectId: 'PRJ-773', quoteNo: 'QT-PRJ-03', client: 'Priya Patel', status: 'Approved', amount: 6500000, paymentReceived: 3000000, date: '2026-04-10' },
    { id: '4', projectId: 'PRJ-774', quoteNo: 'QT-PRJ-04', client: 'Amit Singh', status: 'Approved', amount: 3800000, paymentReceived: 1800000, date: '2026-03-20' },
    { id: '5', projectId: 'PRJ-775', quoteNo: 'QT-PRJ-05', client: 'Neha Gupta', status: 'Pending', amount: 5200000, paymentReceived: 0, date: '2026-02-05' },
    { id: '6', projectId: 'PRJ-776', quoteNo: 'QT-PRJ-06', client: 'Vikram Verma', status: 'Approved', amount: 4500000, paymentReceived: 1500000, date: '2026-01-28' },
  ];

  const filteredQuotes = quoteListings.filter(q => {
    let match = true;
    if (quoteProjectFilter && q.projectId !== quoteProjectFilter) match = false;
    if (quoteSearchFilter) {
      const lowerSearch = quoteSearchFilter.toLowerCase();
      if (!q.quoteNo.toLowerCase().includes(lowerSearch) && !q.client.toLowerCase().includes(lowerSearch)) {
        match = false;
      }
    }
    if (quoteDateFilter && quoteDateFilter[0] && quoteDateFilter[1]) {
      const qDate = new Date(q.date);
      const start = quoteDateFilter[0].toDate();
      const end = quoteDateFilter[1].toDate();
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      if (qDate < start || qDate > end) match = false;
    }
    return match;
  });

  const approvedQuotesTotal = filteredQuotes.filter(q => q.status === 'Approved').reduce((s, q) => s + q.amount, 0);
  const paymentsReceivedTotal = filteredQuotes.reduce((s, q) => s + (q.paymentReceived || 0), 0);
  const pendingPaymentsTotal = filteredQuotes.reduce((s, q) => s + (q.amount - (q.paymentReceived || 0)), 0);

  const quoteStats = [
    { title: 'Approved Quotes Total',  value: approvedQuotesTotal,  icon: <ProjectOutlined />,      color: primaryColor, prefix: '₹', formatter: true, trend: '12%' },
    { title: 'Payments Received',      value: paymentsReceivedTotal,  icon: <CheckSquareOutlined />,  color: primaryColor, prefix: '₹', formatter: true, trend: '5%' },
    { title: 'Pending Payments',       value: pendingPaymentsTotal,  icon: <ClockCircleOutlined />,  color: 'rgba(214, 159, 109, 0.65)', prefix: '₹', formatter: true, trend: '2%' },
  ];

  const chartDataMap = {};
  filteredQuotes.forEach(q => {
    const d = new Date(q.date);
    const month = d.toLocaleString('default', { month: 'short' });
    if (!chartDataMap[month]) chartDataMap[month] = 0;
    chartDataMap[month] += q.amount / 100000;
  });

  const quoteChartData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({
    month: m,
    amount: chartDataMap[m] ? Number(chartDataMap[m].toFixed(1)) : 0
  }));

  const quoteColumns = [
    { title: 'Quote No', dataIndex: 'quoteNo', key: 'quoteNo', render: t => <span style={{ fontWeight: 600, color: textPrimary }}>{t}</span> },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: s => <Tag color={s === 'Approved' ? 'success' : 'warning'}>{s}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: v => <span style={{ fontWeight: 700 }}>₹{(v/100000).toFixed(1)}L</span> },
    { 
      title: 'Action', 
      key: 'action', 
      align: 'right',
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined style={{ color: primaryColor }} />} 
          onClick={() => navigate(`/projects/${record.projectId}`)} 
        />
      )
    }
  ];

  const OverviewTab = (
    <div className="animate-fade-in">
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <Col xs={12} sm={8} xl={4} key={i}>
            <StatCard {...stat} isDark={isDark} />
          </Col>
        ))}
      </Row>

      {/* Charts Row - Premium Creative Recharts Redesign */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Activity Overview: Glass Wave Area & Dashed Line */}
        <Col xs={24} lg={12}>
          <Card
            style={chartStyle}
            styles={{ body: { padding: '0' } }}
          >
            <div style={{ 
              padding: '16px 20px 12px 20px',
              borderBottom: `1px solid ${borderLight}`,
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RiseOutlined style={{ fontSize: 14, color: '#D69F6D' }} />
                    </div>
                    Activity Overview
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: textSecondary }}>Monthly performance & volume track</p>
                </div>
                <Tag style={{
                  borderRadius: '20px',
                  background: isDark ? 'rgba(214, 159, 109, 0.15)' : 'rgba(214, 159, 109, 0.06)',
                  border: 'none',
                  color: '#D69F6D',
                  padding: '2px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  <CalendarOutlined style={{ marginRight: 4 }} /> Last 6 months
                </Tag>
              </div>
            </div>
            
            <div style={{ padding: '0 20px 16px 12px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendData} margin={{ top: 8, right: 10, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="creativeGoldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D69F6D" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#D69F6D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={borderLight} vertical={true} horizontal={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: textSecondary, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: textSecondary, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <RTooltip content={<CustomTooltip isDark={isDark} />} />
                  <Area
                    type="monotone"
                    dataKey="projects"
                    name="Projects"
                    stroke="#D69F6D"
                    strokeWidth={3}
                    fill="url(#creativeGoldGrad)"
                    dot={{ fill: '#D69F6D', r: 3, stroke: isDark ? '#0b2338' : '#fff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#D69F6D', stroke: isDark ? '#0b2338' : '#fff', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    name="Tasks"
                    stroke="rgba(214, 159, 109, 0.55)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="none"
                    dot={{ fill: 'rgba(214, 159, 109, 0.55)', r: 3, stroke: isDark ? '#0b2338' : '#fff', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: 'rgba(214, 159, 109, 0.55)', stroke: isDark ? '#0b2338' : '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D69F6D' }}></div>
                  <span style={{ fontSize: 11, color: textSecondary, fontWeight: 500 }}>Projects</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(214, 159, 109, 0.55)', border: '1px dashed #D69F6D' }}></div>
                  <span style={{ fontSize: 11, color: textSecondary, fontWeight: 500 }}>Tasks</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Project Distribution Card - Asymmetrical Pulsing Donut */}
        <Col xs={24} lg={12}>
          <Card
            style={chartStyle}
            styles={{ body: { padding: '0' } }}
          >
            <div style={{ 
              padding: '16px 20px 12px 20px',
              borderBottom: `1px solid ${borderLight}`,
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChartOutlined style={{ fontSize: 14, color: '#D69F6D' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary }}>Project Distribution</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: textSecondary }}>Breakdown by active stage flow</p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '0 20px 20px 20px', position: 'relative' }}>
              <Row align="middle">
                <Col xs={24} sm={12}>
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%" cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        cornerRadius={4}
                        onMouseEnter={(_, index) => setActivePieIndex(index)}
                        onMouseLeave={() => setActivePieIndex(null)}
                      >
                        {pieData.map((entry, idx) => {
                          const isSelected = idx === activePieIndex;
                          return (
                            <Cell
                              key={idx}
                              fill={stageColors[entry.name]}
                              stroke={isDark ? '#0b2338' : '#fff'}
                              strokeWidth={isSelected ? 2 : 0}
                              style={{
                                opacity: activePieIndex === null || isSelected ? 1 : 0.6,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                              }}
                            />
                          );
                        })}
                      </Pie>
                      <RTooltip content={<CustomTooltip isDark={isDark} />} />
                      
                      {/* Interactive Center Console text overlay */}
                      <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '10px', fill: textSecondary, fontWeight: 600 }}>
                        {activePieIndex !== null ? pieData[activePieIndex]?.name : 'Total Projects'}
                      </text>
                      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '20px', fill: textPrimary, fontWeight: 800 }}>
                        {activePieIndex !== null ? pieData[activePieIndex]?.count : projects.length}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
                
                {/* Beautiful custom-styled sidebar legend */}
                <Col xs={24} sm={12}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 12px', paddingLeft: 10 }}>
                    {pieData.map((entry, idx) => {
                      const isSelected = idx === activePieIndex;
                      const pct = projects.length ? Math.round((entry.count / projects.length) * 100) : 0;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setActivePieIndex(idx)}
                          onMouseLeave={() => setActivePieIndex(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            opacity: activePieIndex === null || isSelected ? 1 : 0.5,
                            transition: 'opacity 0.2s ease',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: stageColors[entry.name], flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {entry.name}
                            </div>
                            <div style={{ fontSize: 10, color: textSecondary }}>{entry.count} ({pct}%)</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section */}
      <Row gutter={[20, 20]}>
        {/* Left Column */}
        <Col xs={24} lg={12}>
          <Row gutter={[0, 20]} style={{ flexDirection: 'column' }}>
            {/* Projects by Stage Card - Glass Cylinder Bar Chart */}
            <Col>
              <Card
                style={chartStyle}
                styles={{ body: { padding: '0' } }}
              >
                <div style={{ 
                  padding: '16px 20px 12px 20px',
                  borderBottom: `1px solid ${borderLight}`,
                  marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '8px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChartOutlined style={{ fontSize: 14, color: '#D69F6D' }} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary }}>Projects by Stage</h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: 12, color: textSecondary }}>Glass-cylinder custom stage columns</p>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '0 20px 12px 4px' }}>
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart
                      data={stageData}
                      barSize={20}
                      margin={{ top: 8, right: 10, left: -24, bottom: 0 }}
                      onMouseMove={(state) => {
                        if (state && state.activeTooltipIndex !== undefined) {
                          setActiveBarIndex(state.activeTooltipIndex);
                        } else {
                          setActiveBarIndex(null);
                        }
                      }}
                      onMouseLeave={() => setActiveBarIndex(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={borderLight} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: textSecondary, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: textSecondary, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <RTooltip content={<CustomTooltip isDark={isDark} />} cursor={false} />
                      <Bar
                        dataKey="count"
                        name="Projects"
                        shape={<RenderCustomBar isDark={isDark} />}
                      >
                        {stageData.map((entry, idx) => {
                          const isSelected = idx === activeBarIndex;
                          const baseColor = stageColors[entry.name] || '#D69F6D';
                          return (
                            <Cell
                              key={idx}
                              fill={baseColor}
                              style={{
                                opacity: activeBarIndex === null || isSelected ? 1 : 0.65,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer',
                              }}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            {/* Stage Progress Card */}
            <Col>
              <Card
                style={{ ...chartStyle, background: isDark ? 'linear-gradient(135deg, #0b2338 0%, #0d3554 100%)' : 'linear-gradient(135deg, #ffffff 0%, #FAF8F5 100%)' }}
                styles={{ body: { padding: '20px' } }}
              >
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary }}>Stage Completion Tracker</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: textSecondary }}>Progress across all project phases</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {stageData.map(({ name, count }) => {
                    const pct = projects.length ? Math.round((count / projects.length) * 100) : 0;
                    const color = stageColors[name];
                    return (
                      <div key={name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>{name}</span>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 700, color }}>{count}</span>
                            <span style={{ fontSize: 12, color: textSecondary, marginLeft: 4 }}>/ {projects.length}</span>
                          </div>
                        </div>
                        <Progress
                          percent={pct}
                          showInfo={false}
                          strokeColor={color}
                          trailColor={iconBg}
                          strokeLinecap="round"
                          size="small"
                          style={{ margin: 0 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={12}>
          <Row gutter={[0, 20]} style={{ flexDirection: 'column' }}>
            {/* Recent Projects Card */}
            <Col>
              <Card
                style={chartStyle}
                styles={{ body: { padding: '0 16px 12px' } }}
              >
                <div style={{ 
                  padding: '16px 16px 10px 16px',
                  borderBottom: `1px solid ${borderLight}`,
                  marginBottom: 10,
                }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary }}>Recent Projects</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: textSecondary }}>Latest updates from your portfolio</p>
                </div>
                <div style={{ padding: '0 4px' }}>
                  {recentProjects.map((p, i) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 0',
                        borderBottom: i < recentProjects.length - 1 ? `1px solid ${borderLight}` : 'none',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar
                          size={32}
                          style={{
                            background: isDark ? 'rgba(214, 159, 109, 0.15)' : 'rgba(214, 159, 109, 0.1)',
                            color: '#D69F6D',
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {p.clientName?.charAt(0) || 'P'}
                        </Avatar>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>{p.clientName || 'Client'}</div>
                          <div style={{ fontSize: 11, color: textSecondary }}>{p.city || 'Location'} • {p.stage || 'Stage'}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>
                          ₹{(p.budget / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            {/* Priority Tasks Card */}
            <Col>
              <Card
                style={chartStyle}
                styles={{ body: { padding: '20px' } }}
              >
                <div style={{ 
                  paddingBottom: 10,
                  borderBottom: `1px solid ${borderLight}`,
                  marginBottom: 10,
                }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary }}>Priority Tasks</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: textSecondary }}>Urgent & high priority action items</p>
                </div>
                <div>
                  {urgentTasks.map((task, i) => (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 0',
                        borderBottom: i < urgentTasks.length - 1 ? `1px solid ${borderLight}` : 'none',
                      }}
                    >
                      <div style={{
                        width: 4, height: 32, borderRadius: 3,
                        background: task.priority === 'Urgent' ? '#D69F6D' : isDark ? 'rgba(214, 159, 109, 0.4)' : 'rgba(214, 159, 109, 0.65)',
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600, fontSize: 13, color: textPrimary,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: 11, color: textSecondary, marginTop: 1 }}>
                          {task.projectName} • <span style={{ color: '#D69F6D' }}>{task.assignee}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <Tag style={{
                          background: task.priority === 'Urgent' ? (isDark ? 'rgba(214, 159, 109, 0.2)' : 'rgba(214, 159, 109, 0.12)') : (isDark ? 'rgba(214, 159, 109, 0.1)' : 'rgba(214, 159, 109, 0.06)'),
                          border: 'none',
                          color: '#D69F6D',
                          borderRadius: '20px',
                          padding: '1px 8px',
                          fontSize: 10,
                          marginBottom: 2,
                          fontWeight: 600,
                        }}>
                          {task.priority}
                        </Tag>
                        <div style={{ fontSize: 10, color: textSecondary }}>
                          <ClockCircleOutlined style={{ marginRight: 3 }} />{task.dueDate}
                        </div>
                      </div>
                    </div>
                  ))}
                  {urgentTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px 20px', color: textSecondary }}>
                      No high-priority tasks to display
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );

  const QuotesTab = (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 16 }}>
        <Select
          placeholder="Select Project"
          style={{ width: 180 }}
          allowClear
          value={quoteProjectFilter}
          onChange={setQuoteProjectFilter}
          options={[
            { value: 'PRJ-771', label: 'Mr. Suresh (PRJ-771)' },
            { value: 'PRJ-772', label: 'Rahul Sharma (PRJ-772)' },
            { value: 'PRJ-773', label: 'Priya Patel (PRJ-773)' },
          ]}
        />
        <Input
          placeholder="Search quote or project..."
          prefix={<SearchOutlined style={{ color: textSecondary }} />}
          allowClear
          value={quoteSearchFilter}
          onChange={e => setQuoteSearchFilter(e.target.value)}
          style={{ width: 220, borderRadius: 8, background: isDark ? '#0d3554' : '#fff', borderColor: borderLight }}
        />
        <DatePicker.RangePicker 
          style={{ borderRadius: 8, background: isDark ? '#0d3554' : '#fff', borderColor: borderLight }} 
          value={quoteDateFilter}
          onChange={setQuoteDateFilter}
        />
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {quoteStats.map((stat, i) => (
          <Col xs={24} sm={8} key={i}>
            <StatCard {...stat} isDark={isDark} />
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card style={chartStyle} styles={{ body: { padding: '20px' } }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: textPrimary }}>Quotations Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quoteChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={borderLight} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: textSecondary }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textSecondary }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="amount" name="Amount (Lakhs)" fill={primaryColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card style={chartStyle} styles={{ body: { padding: '0' } }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderLight}` }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary }}>Recent Quotations</h3>
        </div>
        <div style={{ padding: '20px' }}>
          <Table
            dataSource={filteredQuotes}
            columns={quoteColumns}
            pagination={false}
            rowKey="id"
            className={isDark ? "dark-table" : ""}
          />
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ background: isDark ? '#061626' : '', minHeight: '100vh', paddingBottom: 40, transition: 'background 0.25s ease' }}>
      <PageHeader title="Dashboard" />
      <div style={{ padding: '0 0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 24, fontWeight: 600 }}
          items={[
            { key: '1', label: 'Overview', children: OverviewTab },
            { key: '2', label: 'Project Quotations', children: QuotesTab }
          ]}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
