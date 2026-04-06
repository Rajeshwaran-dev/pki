import { Row, Col, Card, Statistic, Progress, Tag, Avatar, Space } from 'antd';
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

const CHART_COLORS = ['#B19625', '#1677FF', '#52C41A', '#722ED1', '#FAAD14', '#FF4D4F'];

const StatCard = ({ title, value, icon, color, trend, prefix, suffix, formatter }) => (
  <div style={{ height: '100%' }}>
    <Card
      className="stat-card crm-card"
      styles={{ body: { padding: '14px 16px' } }}
      style={{ height: '100%' }}
      hoverable
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${color}20, ${color}35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, color,
            boxShadow: `0 2px 8px ${color}20`,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: '#52C41A15', borderRadius: 20,
            padding: '2px 8px', fontSize: 11, color: '#52C41A', fontWeight: 600,
          }}
        >
          <ArrowUpOutlined style={{ fontSize: 9 }} /> {trend || '12%'}
        </div>
      </div>
      <Statistic
        title={<span style={{ fontSize: 12, fontWeight: 500 }}>{title}</span>}
        value={value}
        prefix={prefix}
        suffix={suffix}
        formatter={formatter ? (v) => `${(Number(v) / 100000).toFixed(1)}L` : undefined}
        valueStyle={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginTop: 4 }}
      />
      <div style={{ marginTop: 6, fontSize: 11, color: '#999' }}>
        <span style={{ color: '#52C41A' }}>↑ vs last month</span>
      </div>
    </Card>
  </div>
);

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: isDark ? '#1f1f1f' : '#fff', border: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`, borderRadius: 10, padding: '10px 14px', boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 13 }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const projects = useAppSelector(s => s.projects.projects);
  const clients = useAppSelector(s => s.clients.clients);
  const tasks = useAppSelector(s => s.tasks.tasks);
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  const stats = [
    { title: 'Total Projects', value: projects.length, icon: <ProjectOutlined />, color: '#B19625', trend: '8%' },
    { title: 'Active Clients', value: clients.length, icon: <TeamOutlined />, color: '#1677FF', trend: '15%' },
    { title: 'Tasks Completed', value: completedTasks, icon: <CheckSquareOutlined />, color: '#52C41A', suffix: `/ ${tasks.length}`, trend: '24%' },
    { title: 'Total Portfolio', value: totalBudget, icon: <DollarOutlined />, color: '#722ED1', prefix: '₹', formatter: true, trend: '18%' },
  ];

  const stageData = ['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(stage => ({
    name: stage,
    count: projects.filter(p => p.stage === stage).length,
  }));

  const pieData = stageData.filter(d => d.count > 0);
  const recentProjects = projects.slice(0, 5);

  // Monthly trend data (mock)
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
          <Col xs={24} sm={12} xl={6} key={i} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, animationDelay: `${i * 0.08}s` }} className="animate-fade-in-up">
              <StatCard {...stat} />
            </div>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24, alignItems: 'stretch' }}>
        {/* Area Trend */}
        <Col xs={24} lg={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            className="crm-card chart-card animate-fade-in-up anim-delay-300"
            style={{ flex: 1 }}
            title={
              <div className="flex items-center justify-between">
                <span style={{ fontWeight: 700 }}>Activity Trend</span>
                <Tag color="gold" style={{ borderRadius: 8 }}>Last 6 months</Tag>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B19625" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B19625" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1677FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Area type="monotone" dataKey="projects" name="Projects" stroke="#B19625" strokeWidth={2.5} fill="url(#goldGrad)" dot={{ fill: '#B19625', r: 4 }} />
                <Area type="monotone" dataKey="tasks" name="Tasks" stroke="#1677FF" strokeWidth={2.5} fill="url(#blueGrad)" dot={{ fill: '#1677FF', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={10} style={{ display: 'flex', flexDirection: 'column' }}>
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
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section: 2 columns, each with 2 stacked cards */}
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Bar dataKey="count" name="Count" radius={[8, 8, 0, 0]}>
                  {stageData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
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
              const colors = { Sales: '#1677FF', Designing: '#B19625', Execution: '#722ED1', Snags: '#FF4D4F', Handover: '#FAAD14', Completed: '#52C41A' };
              return (
                <div key={name} style={{ marginBottom: 14 }}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
                    <span style={{ fontSize: 12, color: colors[name], fontWeight: 600 }}>{count} project{count !== 1 ? 's' : ''}</span>
                  </div>
                  <Progress
                    percent={pct}
                    showInfo={false}
                    strokeColor={{ '0%': colors[name], '100%': colors[name] + 'cc' }}
                    trailColor="#f0f0f0"
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
                  borderBottom: i < recentProjects.length - 1 ? '1px solid #f5f5f5' : 'none',
                  animation: `fadeInUp 0.4s ease-out ${0.1 * i}s both`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar
                    size={36}
                    style={{ background: `${CHART_COLORS[i % CHART_COLORS.length]}20`, color: CHART_COLORS[i % CHART_COLORS.length], fontWeight: 700, fontSize: 14, flexShrink: 0 }}
                  >
                    {p.clientName.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.projectName}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>{p.clientName} · {p.city}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusTag value={p.stage} />
                  <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>₹{(p.budget / 100000).toFixed(1)}L</div>
                </div>
              </div>
            ))}
          </Card>

          {/* High-Priority Tasks */}
          <Card
            className="crm-card animate-fade-in-up anim-delay-500"
            style={{ flex: 1 }}
            title={
              <div className="flex items-center gap-2">
                <FireOutlined style={{ color: '#FF4D4F' }} />
                <span style={{ fontWeight: 700 }}>Priority Tasks</span>
              </div>
            }
          >
            {urgentTasks.map((task, i) => (
              <div
                key={task.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < urgentTasks.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}
              >
                <div style={{
                  width: 4, height: 40, borderRadius: 4,
                  background: task.priority === 'Urgent' ? '#FF4D4F' : '#FAAD14',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#999' }}>
                    {task.projectName} · <span style={{ color: '#B19625' }}>{task.assignee}</span>
                  </div>
                </div>
                <Space size={6} direction="vertical" style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                  <StatusTag value={task.priority} type="priority" />
                  <span style={{ fontSize: 10, color: '#bbb' }}>
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
