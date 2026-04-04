import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values: { email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      if (values.email === 'superadmin@gmail.com' && values.password === '123456') {
        dispatch(login(values));
        message.success('Welcome back, Super Admin!');
        navigate('/');
      } else {
        message.error('Invalid email or password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fafafa 0%, #f0ece3 100%)',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 40,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #B19625, #D4B96E)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 24,
              marginBottom: 16,
            }}
          >
            P
          </div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            Welcome Back
          </Typography.Title>
          <Typography.Text type="secondary">Sign in to Perspective Studio</Typography.Text>
        </div>

        <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
          <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
            <Input
              prefix={<MailOutlined style={{ color: '#bbb' }} />}
              placeholder="Email address"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bbb' }} />}
              placeholder="Password"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ borderRadius: 10, height: 48, fontWeight: 600, fontSize: 15 }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Demo: superadmin@gmail.com / 123456
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
