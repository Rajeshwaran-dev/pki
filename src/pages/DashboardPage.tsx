import React from 'react';
import { Row, Col, Card, Statistic, Typography, Progress } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  DollarOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';

const CHART_COLORS = ['#B19625', '#D4B96E', '#1677FF', '#52C41A', '#FAAD14', '#FF4D4F'];

const DashboardPage: React.FC = () => {
  const projects = useAppSelector(s => s.projects.projects);
  const clients = useAppSelector(s => s.clients.clients);
  const tasks = useAppSelector(s => s.tasks.tasks);

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  const stats = [
    { title: 'Total Projects', value: projects.length, icon: <ProjectOutlined />, color: '#B19625' },
    { title: 'Active Clients', value: clients.length, icon: <TeamOutlined />, color: '#1677FF' },
    { title: 'Tasks Completed', value: completedTasks, icon: <CheckSquareOutlined />, color: '#52C41A', suffix: `/ ${tasks.length}` },
    { title: 'Total Budget', value: totalBudget, icon: <DollarOutlined />, color: '#722ED1', prefix: '₹', formatter: true },
  ];

  const stageData = ['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(stage => ({
    name: stage,
    count: projects.filter(p => p.stage === stage).length,
  }));

  const pieData = stageData.filter(d => d.count > 0);
  const recentProjects = projects.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card
              className="dashboard-stat-card"
              style={{ borderRadius: 12, border: 'none' }}
              styles={{ body: { padding: '20px 24px' } }}
              hoverable
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${stat.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <Typography.Text type="success" style={{ fontSize: 12 }}>
                  <ArrowUpOutlined /> 12%
                </Typography.Text>
              </div>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                formatter={stat.formatter ? (v) => `${(Number(v) / 100000).toFixed(1)}L` : undefined}
                valueStyle={{ fontSize: 24, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Projects by Stage" style={{ borderRadius: 12, border: 'none' }} className="chart-card">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <RTooltip />
                <Bar dataKey="count" fill="#B19625" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Stage Distribution" style={{ borderRadius: 12, border: 'none' }} className="chart-card">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                </Pie>
                <RTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Recent Projects" style={{ borderRadius: 12, border: 'none' }} styles={{ body: { padding: '0 24px 16px' } }}>
            {recentProjects.map(p => (
              <div key={p.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                <div>
                  <Typography.Text strong>{p.projectName}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>{p.clientName}</Typography.Text>
                </div>
                <StatusTag value={p.stage} />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Project Stages" style={{ borderRadius: 12, border: 'none' }}>
            {['Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'].map(stage => {
              const count = projects.filter(p => p.stage === stage).length;
              const pct = projects.length ? Math.round((count / projects.length) * 100) : 0;
              return (
                <div key={stage} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <Typography.Text style={{ fontSize: 13 }}>{stage}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>{count}</Typography.Text>
                  </div>
                  <Progress percent={pct} showInfo={false} strokeColor="#B19625" size="small" />
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
