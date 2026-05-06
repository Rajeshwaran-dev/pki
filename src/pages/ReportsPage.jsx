import { useState, useMemo } from 'react';
import { Row, Col, Card, Table, Tabs, Select, Button, Space, Progress, Avatar, Tag } from 'antd';
import {
  ProjectOutlined, TeamOutlined, CheckSquareOutlined, DollarOutlined,
  ArrowUpOutlined, ExportOutlined, FilterOutlined, BarChartOutlined,
  FireOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';

// Theme-derived palettes — no multi-colors
const LIGHT_PALETTE = ['#D69F6D', '#C07230', '#7A4218', '#4F312A', '#B87C4A', '#E8C49A'];
const DARK_PALETTE  = ['#5AB5E8', '#3A8FC4', '#7ED3F0', '#1A6499', '#2A7DB5', '#A8D8F0'];

const LIGHT_STAGE_COLORS = { Sales: '#D69F6D', Designing: '#C07230', Execution: '#7A4218', Snags: '#B87C4A', Handover: '#E8C49A', Completed: '#4F312A' };
const DARK_STAGE_COLORS  = { Sales: '#5AB5E8', Designing: '#3A8FC4', Execution: '#7ED3F0', Snags: '#2A7DB5', Handover: '#A8D8F0', Completed: '#1A6499' };

const LIGHT_STATUS_COLORS = { Created: '#D69F6D', 'In Progress': '#C07230', Completed: '#4F312A', 'On Hold': '#B87C4A', Discarded: '#aaa' };
const DARK_STATUS_COLORS  = { Created: '#5AB5E8', 'In Progress': '#3A8FC4', Completed: '#7ED3F0', 'On Hold': '#2A7DB5', Discarded: '#666' };

const LIGHT_PRIORITY_COLORS = { Low: '#D69F6D', Medium: '#C07230', High: '#7A4218', Urgent: '#4F312A' };
const DARK_PRIORITY_COLORS  = { Low: '#A8D8F0', Medium: '#5AB5E8', High: '#3A8FC4', Urgent: '#1A6499' };

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

const ReportStatCard = ({ title, value, icon, color, trend, prefix, suffix, formatter }) => {
  const displayValue = formatter ? `${(Number(value) / 100000).toFixed(1)}L` : value;
  return (
    <Card
      className="stat-card crm-card"
      styles={{ body: { padding: '12px 14px' } }}
      style={{ height: '100%' }}
      hoverable
    >
      {/* Row 1: icon left, value right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color,
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
          {prefix}{displayValue}{suffix}
        </div>
      </div>
      {/* Row 2: title left, trend right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#999' }}>{title}</span>
        {trend && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            background: `${color}18`, borderRadius: 20,
            padding: '1px 7px', fontSize: 14, color, fontWeight: 600,
          }}>
            <ArrowUpOutlined style={{ fontSize: 12 }} /> {trend}
          </span>
        )}
      </div>
    </Card>
  );
};

/* ── Export CSV helper ── */
const exportCSV = (rows, columns, filename) => {
  const headers = columns.map(c => c.title).join(',');
  const body = rows.map(row =>
    columns.map(c => {
      const val = c.dataIndex ? row[c.dataIndex] : '';
      return `"${String(val ?? '').replace(/"/g, '""')}"`;
    }).join(',')
  ).join('\n');
  const blob = new Blob([`${headers}\n${body}`], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
};

/* ════════════════════════════════════════════
   PROJECTS REPORT TAB
════════════════════════════════════════════ */
const ProjectsReport = ({ projects, isDark }) => {
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const [stageFilter, setStageFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');

  const cities = ['All', ...new Set(projects.map(p => p.city))];
  const stages = ['All', 'Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'];

  const filtered = useMemo(() => projects.filter(p => {
    return (stageFilter === 'All' || p.stage === stageFilter) &&
           (cityFilter === 'All' || p.city === cityFilter);
  }), [projects, stageFilter, cityFilter]);

  const stageData = ['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(s => ({
    name: s,
    count: projects.filter(p => p.stage === s).length,
  }));

  const cityData = [...new Set(projects.map(p => p.city))].map(city => ({
    name: city,
    count: projects.filter(p => p.city === city).length,
    budget: projects.filter(p => p.city === city).reduce((s, p) => s + p.budget, 0),
  }));

  const columns = [
    { title: 'Code', dataIndex: 'projectCode', key: 'code', width: 100, render: v => <span style={{ fontWeight: 600, color: primaryColor }}>{v}</span> },
    { title: 'Project', dataIndex: 'projectName', key: 'name', render: (v, r) => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{v}</div>
        <div style={{ fontSize: 14, color: '#999' }}>{r.city}, {r.state}</div>
      </div>
    )},
    { title: 'Client', dataIndex: 'clientName', key: 'client' },
    { title: 'Stage', dataIndex: 'stage', key: 'stage', render: v => <StatusTag value={v} /> },
    { title: 'Budget', dataIndex: 'budget', key: 'budget', render: v => <span style={{ fontWeight: 600 }}>₹{(v / 100000).toFixed(1)}L</span>, sorter: (a, b) => a.budget - b.budget },
    { title: 'Date', dataIndex: 'createdDate', key: 'date', sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate) },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card className="crm-card chart-card" title={<span style={{ fontWeight: 700 }}>Projects by Stage</span>}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stageData} barSize={34}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a2a' : '#f0f0f0'} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Bar dataKey="count" name="Projects" radius={[8, 8, 0, 0]}>
                  {stageData.map((entry, idx) => <Cell key={idx} fill={(isDark ? DARK_STAGE_COLORS : LIGHT_STAGE_COLORS)[entry.name] || (isDark ? DARK_PALETTE : LIGHT_PALETTE)[idx % 6]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="crm-card chart-card" title={<span style={{ fontWeight: 700 }}>Projects by City</span>}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={cityData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={44} paddingAngle={4}>
                  {cityData.map((_, idx) => <Cell key={idx} fill={(isDark ? DARK_PALETTE : LIGHT_PALETTE)[idx % 6]} stroke="none" />)}
                </Pie>
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 14 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card
        className="crm-card"
        title={<span style={{ fontWeight: 700 }}>Project Details ({filtered.length})</span>}
        extra={
          <Space size={8}>
            <Select value={stageFilter} onChange={setStageFilter} size="small" style={{ width: 130 }}
              options={stages.map(s => ({ value: s, label: s }))} prefix={<FilterOutlined />} />
            <Select value={cityFilter} onChange={setCityFilter} size="small" style={{ width: 130 }}
              options={cities.map(c => ({ value: c, label: c }))} />
            <Button size="small" icon={<ExportOutlined />} onClick={() => exportCSV(filtered, columns.filter(c => c.dataIndex), 'projects-report')}
              style={{ borderColor: primaryColor, color: primaryColor }}>
              Export
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `${t} projects` }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════
   TASKS REPORT TAB
════════════════════════════════════════════ */
const TasksReport = ({ tasks, isDark }) => {
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const statuses = ['All', 'Created', 'In Progress', 'Completed', 'On Hold', 'Discarded'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  const filtered = useMemo(() => tasks.filter(t => {
    return (statusFilter === 'All' || t.status === statusFilter) &&
           (priorityFilter === 'All' || t.priority === priorityFilter);
  }), [tasks, statusFilter, priorityFilter]);

  const statusData = ['Created', 'In Progress', 'Completed', 'On Hold', 'Discarded'].map(s => ({
    name: s, count: tasks.filter(t => t.status === s).length,
  }));

  const priorityData = ['Low', 'Medium', 'High', 'Urgent'].map(p => ({
    name: p, count: tasks.filter(t => t.priority === p).length,
  }));

  const typeData = [...new Set(tasks.map(t => t.type))].map(type => ({
    name: type, count: tasks.filter(t => t.type === type).length,
  }));

  const assigneeData = [...new Set(tasks.map(t => t.assignee))].map(a => ({
    name: a,
    total: tasks.filter(t => t.assignee === a).length,
    completed: tasks.filter(t => t.assignee === a && t.status === 'Completed').length,
  }));

  const statusColors = isDark ? DARK_STATUS_COLORS : LIGHT_STATUS_COLORS;
  const priorityColors = isDark ? DARK_PRIORITY_COLORS : LIGHT_PRIORITY_COLORS;

  const columns = [
    { title: 'Task', dataIndex: 'title', key: 'title', render: (v, r) => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{v}</div>
        <div style={{ fontSize: 14, color: '#999' }}>{r.type}</div>
      </div>
    )},
    { title: 'Project', dataIndex: 'projectName', key: 'project' },
    { title: 'Assignee', dataIndex: 'assignee', key: 'assignee', render: v => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Avatar size={22} style={{ background: `${primaryColor}20`, color: primaryColor, fontSize: 12, fontWeight: 700 }}>
          {v.charAt(0)}
        </Avatar>
        <span style={{ fontSize: 14 }}>{v}</span>
      </div>
    )},
    { title: 'Status', dataIndex: 'status', key: 'status', render: v => (
      <Tag style={{ borderRadius: 6, fontWeight: 600, fontSize: 14, padding: '2px 8px' }} color={statusColors[v] || '#888'}>{v}</Tag>
    )},
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: v => <StatusTag value={v} type="priority" /> },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'due', sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate) },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="crm-card chart-card" title={<span style={{ fontWeight: 700 }}>By Status</span>}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} barSize={28} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a2a' : '#f0f0f0'} horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} width={72} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Bar dataKey="count" name="Tasks" radius={[0, 6, 6, 0]}>
                  {statusData.map((d, idx) => <Cell key={idx} fill={statusColors[d.name] || '#888'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="crm-card chart-card" title={<span style={{ fontWeight: 700 }}>By Priority</span>}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={priorityData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={36} paddingAngle={4}>
                  {priorityData.map((d, idx) => <Cell key={idx} fill={priorityColors[d.name]} stroke="none" />)}
                </Pie>
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 14 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="crm-card" title={<span style={{ fontWeight: 700 }}>Assignee Performance</span>} styles={{ body: { padding: '12px 16px' } }}>
            {assigneeData.map(a => {
              const pct = a.total ? Math.round((a.completed / a.total) * 100) : 0;
              return (
                <div key={a.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</span>
                    <span style={{ fontSize: 14, color: '#52C41A', fontWeight: 600 }}>{a.completed}/{a.total}</span>
                  </div>
                  <Progress percent={pct} size="small" showInfo={false}
                    strokeColor={{ '0%': primaryColor, '100%': isDark ? '#1e5c8a' : '#D69F6D' }} trailColor={isDark ? '#2a2a2a' : '#f0f0f0'} strokeLinecap="round" />
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>

      <Card
        className="crm-card"
        title={<span style={{ fontWeight: 700 }}>Task Details ({filtered.length})</span>}
        extra={
          <Space size={8}>
            <Select value={statusFilter} onChange={setStatusFilter} size="small" style={{ width: 130 }}
              options={statuses.map(s => ({ value: s, label: s }))} />
            <Select value={priorityFilter} onChange={setPriorityFilter} size="small" style={{ width: 110 }}
              options={priorities.map(p => ({ value: p, label: p }))} />
            <Button size="small" icon={<ExportOutlined />} onClick={() => exportCSV(filtered, columns.filter(c => c.dataIndex), 'tasks-report')}
              style={{ borderColor: primaryColor, color: primaryColor }}>
              Export
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `${t} tasks` }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════
   FINANCIAL REPORT TAB
════════════════════════════════════════════ */
const FinancialReport = ({ projects, isDark }) => {
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const accentColor = isDark ? '#3A8FC4' : '#C07230';
  const deepColor   = isDark ? '#1A6499' : '#4F312A';
  const CHART_COLORS = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const avgBudget = projects.length ? totalBudget / projects.length : 0;
  const maxProject = projects.reduce((a, b) => (b.budget > a.budget ? b : a), projects[0] || {});

  const budgetByStage = ['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(s => ({
    name: s,
    budget: projects.filter(p => p.stage === s).reduce((a, p) => a + p.budget, 0) / 100000,
    count: projects.filter(p => p.stage === s).length,
  }));

  const budgetByCity = [...new Set(projects.map(p => p.city))].map(city => ({
    name: city,
    budget: projects.filter(p => p.city === city).reduce((a, p) => a + p.budget, 0) / 100000,
  })).sort((a, b) => b.budget - a.budget);

  const columns = [
    { title: 'Project', dataIndex: 'projectName', key: 'name', render: (v, r) => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{v}</div>
        <div style={{ fontSize: 14, color: '#999' }}>{r.projectCode}</div>
      </div>
    )},
    { title: 'Client', dataIndex: 'clientName', key: 'client' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Stage', dataIndex: 'stage', key: 'stage', render: v => <StatusTag value={v} /> },
    { title: 'Budget', dataIndex: 'budget', key: 'budget',
      render: v => <span style={{ fontWeight: 700, color: primaryColor }}>₹{(v / 100000).toFixed(1)}L</span>,
      sorter: (a, b) => a.budget - b.budget, defaultSortOrder: 'descend',
    },
    { title: 'Share', dataIndex: 'budget', key: 'share', render: v => {
      const pct = totalBudget ? Math.round((v / totalBudget) * 100) : 0;
      return <Progress percent={pct} size="small" showInfo={false}
        strokeColor={{ '0%': primaryColor, '100%': isDark ? '#1e5c8a' : '#D69F6D' }} trailColor={isDark ? '#2a2a2a' : '#f0f0f0'} strokeLinecap="round" style={{ width: 80 }} />;
    }},
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24, alignItems: 'stretch' }}>
        <Col xs={24} sm={8}>
          <ReportStatCard title="Total Portfolio" value={`₹${(totalBudget / 100000).toFixed(1)}L`} icon={<DollarOutlined />} color={deepColor} />
        </Col>
        <Col xs={24} sm={8}>
          <ReportStatCard title="Avg. Project Budget" value={`₹${(avgBudget / 100000).toFixed(1)}L`} icon={<BarChartOutlined />} color={primaryColor} />
        </Col>
        <Col xs={24} sm={8}>
          <ReportStatCard title="Largest Project" value={maxProject?.projectName || '-'} icon={<ProjectOutlined />} color={accentColor} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card className="crm-card chart-card" title={<span style={{ fontWeight: 700 }}>Budget by Stage (₹ Lakhs)</span>}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={budgetByStage} barSize={34}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a2a' : '#f0f0f0'} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} formatter={(v) => [`₹${v.toFixed(1)}L`]} />
                <Bar dataKey="budget" name="Budget (L)" radius={[8, 8, 0, 0]}>
                  {budgetByStage.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="crm-card chart-card" title={<span style={{ fontWeight: 700 }}>Budget by City (₹ Lakhs)</span>}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={budgetByCity} barSize={28} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2a2a2a' : '#f0f0f0'} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 13 }} axisLine={false} tickLine={false} width={70} />
                <RTooltip content={<CustomTooltip isDark={isDark} />} />
                <Bar dataKey="budget" name="Budget (L)" radius={[0, 6, 6, 0]}>
                  {budgetByCity.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card
        className="crm-card"
        title={<span style={{ fontWeight: 700 }}>Budget Breakdown</span>}
        extra={
          <Button size="small" icon={<ExportOutlined />} onClick={() => exportCSV(projects, columns.filter(c => c.dataIndex), 'financial-report')}
            style={{ borderColor: primaryColor, color: primaryColor }}>
            Export
          </Button>
        }
      >
        <Table
          dataSource={projects}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `${t} projects` }}
          scroll={{ x: 600 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                <span style={{ fontWeight: 700 }}>Total</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <span style={{ fontWeight: 700, color: primaryColor }}>₹{(totalBudget / 100000).toFixed(1)}L</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN REPORTS PAGE
════════════════════════════════════════════ */
const ReportsPage = () => {
  const projects = useAppSelector(s => s.projects.projects);
  const clients = useAppSelector(s => s.clients.clients);
  const tasks = useAppSelector(s => s.tasks.tasks);
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
  const activeProjects = projects.filter(p => p.stage !== 'Completed').length;
  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';

  const accentColor = isDark ? '#3A8FC4' : '#C07230';
  const deepColor   = isDark ? '#1A6499' : '#4F312A';
  const summaryStats = [
    { title: 'Total Projects',  value: projects.length, icon: <ProjectOutlined />,    color: primaryColor, trend: '8%' },
    { title: 'Active Projects', value: activeProjects,  icon: <FireOutlined />,        color: accentColor,  trend: '5%' },
    { title: 'Total Clients',   value: clients.length,  icon: <TeamOutlined />,        color: primaryColor, trend: '15%' },
    { title: 'Tasks Completed', value: completedTasks,  icon: <CheckSquareOutlined />, color: deepColor, suffix: `/ ${tasks.length}`, trend: '24%' },
    { title: 'Pending Tasks',   value: pendingTasks,    icon: <ClockCircleOutlined />, color: accentColor,  trend: '3%' },
    { title: 'Total Portfolio', value: totalBudget,     icon: <DollarOutlined />,      color: deepColor, prefix: '₹', formatter: true, trend: '18%' },
  ];

  const tabItems = [
    {
      key: 'projects',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ProjectOutlined /> Projects
        </span>
      ),
      children: <ProjectsReport projects={projects} isDark={isDark} />,
    },
    {
      key: 'tasks',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CheckSquareOutlined /> Tasks
        </span>
      ),
      children: <TasksReport tasks={tasks} isDark={isDark} />,
    },
    {
      key: 'financial',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <DollarOutlined /> Financial
        </span>
      ),
      children: <FinancialReport projects={projects} isDark={isDark} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle={`${projects.length} projects · ${clients.length} clients · ${tasks.length} tasks`}
      />

      {/* Summary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24, alignItems: 'stretch' }}>
        {summaryStats.map((stat, i) => (
          <Col xs={12} sm={8} xl={4} key={i}>
            <div style={{ animationDelay: `${i * 0.08}s` }} className="animate-fade-in-up">
              <ReportStatCard {...stat} />
            </div>
          </Col>
        ))}
      </Row>

      {/* Tabs */}
      <Card
        className="crm-card animate-fade-in-up anim-delay-300"
        styles={{ body: { padding: '0 20px 20px' } }}
      >
        <Tabs
          defaultActiveKey="projects"
          items={tabItems}
          style={{ marginTop: 4 }}
          tabBarStyle={{ fontWeight: 600 }}
        />
      </Card>
    </div>
  );
};

export default ReportsPage;
