import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: Route not found:', location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
      <div className="animate-scale-in" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{
          fontSize: 100, fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #B19625, #D4B96E)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>
          404
        </div>
        <Typography.Title level={3} style={{ margin: '0 0 8px', fontWeight: 700 }}>
          Page Not Found
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 16 }}>
          The page you're looking for doesn't exist.
        </Typography.Text>
        <div style={{ marginTop: 32 }}>
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #B19625, #C4A840)',
              border: 'none', borderRadius: 12,
              height: 48, padding: '0 32px',
              fontWeight: 600, fontSize: 15,
            }}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
