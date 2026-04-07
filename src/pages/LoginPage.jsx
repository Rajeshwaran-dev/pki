import { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, message } from 'antd';
import { LockOutlined, MailOutlined, StarOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: <ThunderboltOutlined />, text: 'Real-time project tracking' },
  { icon: <SafetyOutlined />, text: 'Secure client management' },
  { icon: <StarOutlined />, text: 'Smart task automation' },
];

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (values.email === 'superadmin@gmail.com' && values.password === '123456') {
        dispatch(login(values));
        message.success('Welcome back! Loading your workspace…');
        navigate('/');
      } else {
        message.error('Invalid credentials. Try superadmin@gmail.com / 123456');
      }
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa',
          padding: '32px 24px',
        }}
      >
        <div
          className="animate-scale-in"
          style={{
            width: '100%',
            maxWidth: 420,
            background: '#ffffff',
            borderRadius: 20,
            padding: '44px 40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          }}
        >
          {/* Mobile logo */}
          <div className="hide-desktop" style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: '#D69F6D',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 12,
            }}>P</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Perspective Studio</div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <Typography.Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Welcome back
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 14 }}>
              Sign in to your workspace
            </Typography.Text>
          </div>

          <Form layout="vertical" onFinish={handleLogin} autoComplete="off" size="large">
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 500, fontSize: 13 }}>Email address</span>}
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#ccc' }} />}
                placeholder="you@company.com"
                style={{ borderRadius: 10, height: 48 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 500, fontSize: 13 }}>Password</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#ccc' }} />}
                placeholder="••••••••"
                style={{ borderRadius: 10, height: 48 }}
              />
            </Form.Item>

            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
              <Checkbox style={{ fontSize: 13 }}>Remember me</Checkbox>
              <Button type="link" style={{ padding: 0, fontSize: 13, color: '#D69F6D' }}>
                Forgot password?
              </Button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 50,
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                background: '#D69F6D',
                border: 'none',
                boxShadow: '0 6px 20px rgba(214,159,109,0.4)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
