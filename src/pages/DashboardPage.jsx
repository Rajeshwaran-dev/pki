import { Row, Col, Card, Progress, Tag, Avatar, Space } from 'antd';
import {
  ProjectOutlined, TeamOutlined, CheckSquareOutlined, DollarOutlined,
  ArrowUpOutlined, FireOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';

// Light: warm buff/brown palette  |  Dark: cool blue palette
const LIGHT_COLORS = ['#D69F6D', '#B87C4A', '#7A4218', '#4F312A', '#C07230', '#E8C49A'];
const DARK_COLORS  = ['#5AB5E8', '#3A8FC4', '#7ED3F0', '#1A6499', '#2A7DB5', '#A8D8F0'];

const StatCard = ({ title, value, icon, color, trend, prefix, suffix, formatter }) => {
  const displayValue = formatter ? `${(Number(value) / 100000).toFixed(1)}L` : value;
  return (
    <Card
      className="stat-card crm-card"
      styles={{ body: { padding: '12px 14px' } }}
      style={{ height: '100%' }}
      hoverable
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color,
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
          {prefix}{displayValue}{suffix}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#999' }}>{title}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 2,
          background: `${color}18`, borderRadius: 20,
          padding: '1px 7px', fontSize: 14, color, fontWeight: 600,
        }}>
          <ArrowUpOutlined style={{ fontSize: 12 }} /> {trend || '12%'}
        </span>
      </div>
    </Card>
  );
};

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
        <div key={i} style={{ color: p.color, fontSize: 15 }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const projects = useAppSelector(s => s.projects.projects);
  const clients  = useAppSelector(s => s.clients.clients);
  const tasks    = useAppSelector(s => s.tasks.tasks);
  const theme    = useAppSelector(s => s.ui.theme);
  const isDark   = theme === 'dark';

  const CHART_COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;

  const totalBudget    = projects.reduce((s, p) => s + p.budget, 0);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks   = tasks.filter(t => t.status !== 'Completed').length;
  const activeProjects = projects.filter(p => p.stage !== 'Completed').length;

  const primaryColor  = isDark ? '#5AB5E8' : '#D69F6D';
  const secondColor   = isDark ? '#7ED3F0' : '#7A4218';
  const accentColor   = isDark ? '#3A8FC4' : '#C07230';
  const positiveColor = isDark ? '#5AB5E8' : '#7A4218';

  const stats = [
    { title: 'Total Projects',  value: projects.length,  icon: <ProjectOutlined />,      color: primaryColor, trend: '8%' },
    { title: 'Active Projects', value: activeProjects,   icon: <FireOutlined />,          color: accentColor,  trend: '5%' },
    { title: 'Active Clients',  value: clients.length,   icon: <TeamOutlined />,          color: primaryColor, trend: '15%' },
    { title: 'Tasks Completed', value: completedTasks,   icon: <CheckSquareOutlined />,   color: positiveColor, suffix: `/ ${tasks.length}`, trend: '24%' },
    { title: 'Pending Tasks',   value: pendingTasks,     icon: <ClockCircleOutlined />,   color: isDark ? '#FF6B6B' : '#FF4D4F', trend: '3%' },
    { title: 'Total Portfolio', value: totalBudget,      icon: <DollarOutlined />,        color: secondColor, prefix: '₹', formatter: true, trend: '18%' },
  ];

  const stageData = ['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(stage => ({
    name: stage,
    count: projects.filter(p => p.stage === stage).length,
  }));

  const stageColors = isDark
    ? { Sales: '#5AB5E8', Designing: '#3A8FC4', Execution: '#7ED3F0', Snags: '#2A7DB5', Handover: '#A8D8F0', Completed: '#1A6499' }
    : { Sales: '#D69F6D', Designing: '#C07230', Execution: '#7A4218', Snags: '#B87C4A', Handover: '#E8C49A', Completed: '#4F312A' };

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

  return (
    <div>
      <PageHeader title="Dashboard" />

      {/* Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24, alignItems: 'stretch' }}>
        {stats.map((stat, i) => (
          <Col xs={12} sm={8} xl={4} key={i}>
            <div style={{ animationDelay: `${i * 0.08}s` }} className="animate-fade-in-up">
              <StatCard {...stat} />
            </div>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24, alignItems: 'stretch' }}>
        {/* Area Trend */}
        <Col xs={24} lg={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            className="crm-card chart-card animate-fade-in-up anim-delay-300"
            style={{ flex: 1 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Activity Trend</span>
                <Tag
                  style={{
                    borderRadius: 8,
                    background: `${primaryColor}18`,
                    border: `1px solid ${primaryColor}40`,
                    color: primaryColor,
                    fontWeight: 500,
                  }}
                >
                  Last 6 months
                </Tag>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={primaryColor} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={secondColor} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={secondColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a2a' : '#f0f0f0'} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Area
                  type="monotone" dataKey="projects" name="Projects"
                  stroke={primaryColor} strokeWidth={2.5} fill="url(#projGrad)"
                  dot={{ fill: primaryColor, r: 4 }}
                />
                <Area
                  type="monotone" dataKey="tasks" name="Tasks"
                  stroke={secondColor} strokeWidth={2.5} fill="url(#taskGrad)"
                  dot={{ fill: secondColor, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            className="crm-card chart-card animate-fade-in-up anim-delay-400"
            title={<span style={{ fontWeight: 700 }}>Stage Distribution</span>}
            style={{ flex: 1 }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  innerRadius={48}
                  paddingAngle={4}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={stageColors[entry.name] || CHART_COLORS[idx % CHART_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 14 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section */}
      <Row gutter={[16, 16]} style={{ alignItems: 'stretch' }}>
        {/* Left Column */}
        <Col xs={24} lg={12} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Projects by Stage Bar */}
          <Card
            className="crm-card chart-card animate-fade-in-up anim-delay-400"
            title={<span style={{ fontWeight: 700 }}>Projects by Stage</span>}
            style={{ flex: 1 }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stageData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1a3a52' : '#f0f0f0'} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Bar dataKey="count" name="Count" radius={[8, 8, 0, 0]}>
                  {stageData.map((entry, idx) => (
                    <Cell key={idx} fill={stageColors[entry.name] || CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Stage Progress */}
          <Card
            className="crm-card animate-fade-in-up anim-delay-500"
            title={<span style={{ fontWeight: 700 }}>Stage Progress</span>}
            style={{ flex: 1 }}
          >
            {stageData.map(({ name, count }) => {
              const pct = projects.length ? Math.round((count / projects.length) * 100) : 0;
              const color = stageColors[name];
              return (
                <div key={name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{name}</span>
                    <span style={{ fontSize: 15, color, fontWeight: 600 }}>
                      {count} project{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Progress
                    percent={pct}
                    showInfo={false}
                    strokeColor={{ '0%': color, '100%': color + 'cc' }}
                    trailColor={isDark ? '#1a3a52' : '#f0f0f0'}
                    strokeLinecap="round"
                    size="small"
                  />
                </div>
              );
            })}
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={12} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Recent Projects */}
          <Card
            className="crm-card animate-fade-in-up anim-delay-500"
            title={<span style={{ fontWeight: 700 }}>Recent Projects</span>}
            style={{ flex: 1 }}
            styles={{ body: { padding: '0 20px 16px' } }}
          >
            {recentProjects.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < recentProjects.length - 1
                    ? `1px solid ${isDark ? '#1a3a52' : '#f5f5f5'}` : 'none',
                  animation: `fadeInUp 0.4s ease-out ${0.1 * i}s both`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar
                    size={36}
                    style={{
                      background: `${CHART_COLORS[i % CHART_COLORS.length]}28`,
                      color: CHART_COLORS[i % CHART_COLORS.length],
                      fontWeight: 700, fontSize: 15, flexShrink: 0,
                    }}
                  >
                    {p.clientName.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={{ fontSize: 15, color: '#999' }}>{p.clientName} · {p.city}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusTag value={p.stage} />
                  <div style={{ fontSize: 15, color: '#999', marginTop: 4 }}>
                    ₹{(p.budget / 100000).toFixed(1)}L
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* High-Priority Tasks */}
          <Card
            className="crm-card animate-fade-in-up anim-delay-500"
            style={{ flex: 1 }}
            title={<span style={{ fontWeight: 700 }}>Priority Tasks</span>}
          >
            {urgentTasks.map((task, i) => (
              <div
                key={task.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < urgentTasks.length - 1
                    ? `1px solid ${isDark ? '#1a3a52' : '#f5f5f5'}` : 'none',
                }}
              >
                <div style={{
                  width: 4, height: 40, borderRadius: 4,
                  background: task.priority === 'Urgent'
                    ? (isDark ? '#1A6499' : '#4F312A')
                    : (isDark ? '#3A8FC4' : '#7A4218'),
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 15,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: 15, color: '#999' }}>
                    {task.projectName} · <span style={{ color: primaryColor }}>{task.assignee}</span>
                  </div>
                </div>
                <Space size={6} direction="vertical" style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                  <StatusTag value={task.priority} type="priority" />
                  <span style={{ fontSize: 14, color: '#bbb' }}>
                    <ClockCircleOutlined style={{ marginRight: 3 }} />{task.dueDate}
                  </span>
                </Space>
              </div>
            ))}
            {urgentTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#999' }}>
                No high-priority tasks
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
