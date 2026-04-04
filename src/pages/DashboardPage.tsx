import React from 'react';
import { Row, Col, Card, Statistic, Typography, Progress } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  DollarOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/store';
import PageHeader from '@/components/shared/PageHeader';
import StatusTag from '@/components/shared/StatusTag';

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

  const recentProjects = projects.slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's your overview." />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card
              className="dashboard-stat-card"
              style={{ borderRadius: 12, border: 'none' }}
              bodyStyle={{ padding: '20px 24px' }}
              hoverable
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: stat.color,
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

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Recent Projects" style={{ borderRadius: 12, border: 'none' }} bodyStyle={{ padding: '0 24px 16px' }}>
            {recentProjects.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid hsl(var(--border))' }}
              >
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
              const pct = Math.round((count / projects.length) * 100);
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
