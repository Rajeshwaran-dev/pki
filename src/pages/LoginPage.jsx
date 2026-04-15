import { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9f5f0',
        fontFamily: "'Poppins', sans-serif",
        padding: '24px',
      }}
    >
      {/* Card */}
      <div
        className="animate-scale-in"
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#ffffff',
          borderRadius: 24,
          padding: '48px 44px',
          boxShadow: '0 24px 64px rgba(79,49,42,0.12)',
        }}
      >
        {/* Logo mark */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #4F312A 0%, #D69F6D 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 24,
              marginBottom: 14,
              boxShadow: '0 8px 20px rgba(79,49,42,0.28)',
            }}
          >
            P
          </div>
          <div>
            <Typography.Title
              level={3}
              style={{
                margin: 0,
                fontWeight: 700,
                letterSpacing: '-0.4px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Welcome back
            </Typography.Title>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 14, fontFamily: "'Poppins', sans-serif" }}
            >
              Sign in to your workspace
            </Typography.Text>
          </div>
        </div>

        <Form layout="vertical" onFinish={handleLogin} autoComplete="off" size="large">
          <Form.Item
            name="email"
            label={
              <span style={{ fontWeight: 500, fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>
                Email address
              </span>
            }
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#ccc' }} />}
              placeholder="you@company.com"
              style={{ borderRadius: 10, height: 48, fontFamily: "'Poppins', sans-serif" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span style={{ fontWeight: 500, fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>
                Password
              </span>
            }
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#ccc' }} />}
              placeholder="••••••••"
              style={{ borderRadius: 10, height: 48, fontFamily: "'Poppins', sans-serif" }}
            />
          </Form.Item>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 28,
            }}
          >
            <Checkbox style={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>
              Remember me
            </Checkbox>
            <Button
              type="link"
              style={{
                padding: 0,
                fontSize: 13,
                color: '#D69F6D',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{
              height: 52,
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 15,
              background: 'linear-gradient(135deg, #4F312A 0%, #C07230 60%, #D69F6D 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(79,49,42,0.32)',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.3px',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
