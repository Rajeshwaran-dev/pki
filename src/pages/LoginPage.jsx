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
      {/* ── Left Brand Panel ── */}
      <div
        className="hide-mobile"
        style={{
          flex: '0 0 48%',
          background: 'linear-gradient(145deg, #1a1410 0%, #2d2010 40%, #1f1a0e 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 52px',
        }}
      >
        {/* Blobs */}
        <div className="login-blob" style={{ width: 350, height: 350, background: 'rgba(177,150,37,0.18)', top: -80, left: -80, animationDelay: '0s' }} />
        <div className="login-blob" style={{ width: 250, height: 250, background: 'rgba(212,185,110,0.12)', bottom: 100, right: -60, animationDelay: '2s' }} />
        <div className="login-blob" style={{ width: 180, height: 180, background: 'rgba(177,150,37,0.08)', top: '45%', left: '50%', animationDelay: '4s' }} />

        {/* Top: Logo */}
        <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #B19625, #D4B96E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 22,
              boxShadow: '0 8px 24px rgba(177,150,37,0.5)',
            }}>
              P
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, lineHeight: 1.2 }}>Perspective</div>
              <div style={{ color: '#B19625', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px' }}>Interiour CRM</div>
            </div>
          </div>
        </div>

        {/* Center: Hero Content */}
        <div className="animate-fade-in-up anim-delay-200" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(177,150,37,0.15)', borderRadius: 30,
            padding: '6px 16px', marginBottom: 24,
            border: '1px solid rgba(177,150,37,0.25)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#52C41A' }} />
            <span style={{ color: '#D4B96E', fontSize: 12, fontWeight: 500 }}>Trusted by 200+ Interior Studios</span>
          </div>

          <Typography.Title style={{ color: '#ffffff', margin: '0 0 16px', fontSize: 38, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
            Manage Projects<br />
            <span className="gradient-text" style={{ background: 'linear-gradient(90deg, #B19625, #E8D080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Like a Pro
            </span>
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7 }}>
            Your complete interior design CRM — projects, clients, tasks, and finances all in one beautiful workspace.
          </Typography.Text>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 36 }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.3 + i * 0.1}s`, display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(177,150,37,0.2)', border: '1px solid rgba(177,150,37,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D4B96E', fontSize: 16,
                }}>
                  {f.icon}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Testimonial */}
        <div
          className="animate-fade-in-up anim-delay-400"
          style={{
            position: 'relative', zIndex: 1,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '20px 24px',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 28, lineHeight: 1, marginBottom: 10 }}>"</div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, margin: '0 0 14px' }}>
            Perspective CRM transformed how we manage our studio. Projects are delivered on time, every time.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #B19625, #D4B96E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>A</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Ananya Das</div>
              <div style={{ color: '#B19625', fontSize: 11 }}>Principal Designer, Kolkata</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ── */}
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
              background: 'linear-gradient(135deg, #B19625, #D4B96E)',
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
              <Button type="link" style={{ padding: 0, fontSize: 13, color: '#B19625' }}>
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
                background: 'linear-gradient(135deg, #B19625, #C4A840)',
                border: 'none',
                boxShadow: '0 6px 20px rgba(177,150,37,0.4)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Form>

          <div
            style={{
              marginTop: 24,
              padding: '12px 16px',
              background: '#faf8f3',
              borderRadius: 10,
              border: '1px solid rgba(177,150,37,0.2)',
              textAlign: 'center',
            }}
          >
            <Typography.Text style={{ fontSize: 12, color: '#B19625', fontWeight: 500 }}>
              Demo: superadmin@gmail.com · 123456
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
