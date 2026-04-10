import { Typography, Button, Row, Col } from 'antd';
import {
  BankOutlined, AppstoreOutlined, DatabaseOutlined,
  ThunderboltOutlined, EditOutlined, UploadOutlined,
  ShopOutlined, EnvironmentOutlined, AccountBookOutlined, PictureOutlined
} from '@ant-design/icons';
import PageHeader from '@/components/shared/PageHeader';
import { useAppSelector } from '@/store';

const { Text, Title } = Typography;

export default function OrganisationSettings() {
  const theme = useAppSelector(s => s.ui.theme);
  const isDark = theme === 'dark';

  const primaryColor = isDark ? '#5ab5e8' : '#D69F6D';
  const sectionBg = isDark ? '#081b2f' : '#f8fafd';
  const sectionBorder = isDark ? '#1a4d72' : '#e8f0fb';

  const InfoField = ({ label, value, icon }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        {icon && <span style={{ fontSize: 12, opacity: 0.7 }}>{icon}</span>}
        <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</Text>
      </div>
      <div style={{
        padding: '12px 16px', borderRadius: 10,
        background: isDark ? '#0d3554' : '#fff',
        border: `1px solid ${sectionBorder}`,
        fontSize: 13, fontWeight: 600,
        color: isDark ? '#e0e8f0' : '#1f1f1f',
        boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        {value || <Text type="secondary" style={{ fontStyle: 'italic', fontWeight: 400 }}>Not set</Text>}
      </div>
    </div>
  );

  const Section = ({ title, icon, children }) => (
    <div style={{
      background: sectionBg, border: `1px solid ${sectionBorder}`,
      borderRadius: 16, padding: 24, marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>{title}</Title>
        </div>
        <Button
          icon={<EditOutlined />}
          style={{ borderRadius: 8, fontWeight: 600, border: `1px solid ${primaryColor}`, color: primaryColor, background: 'transparent' }}
        >
          Edit
        </Button>
      </div>
      {children}
    </div>
  );

  return (
    <div>
      <PageHeader title="Organisation Settings" />

      <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
        <Row gutter={20}>
          <Col xs={24} lg={16}>
            <Section title="Company Information" icon={<ShopOutlined style={{ fontSize: 24, color: primaryColor }} />}>
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <InfoField label="Legal Company Name" value="PERSPECTIVE KITCHENS AND INTERIORS PVT LTD" icon={<BankOutlined />} />
                </Col>
                <Col xs={24} md={12}>
                  <InfoField label="Studio Name" value="PERSPECTIVE KITCHENS AND INTERIORS PVT LTD" icon={<AppstoreOutlined />} />
                </Col>
                <Col xs={24} md={12}>
                  <InfoField label="GST Number" value="33AAOCP2032L1ZD" icon={<ThunderboltOutlined />} />
                </Col>
                <Col xs={24} md={12}>
                  <InfoField label="PAN Number" value="AAOCP2032L" icon={<DatabaseOutlined />} />
                </Col>
              </Row>
            </Section>

            <Section title="Company Address" icon={<EnvironmentOutlined style={{ fontSize: 24, color: primaryColor }} />}>
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <InfoField label="Address Line 1" value="No 691/13, NGGO's Colony" />
                </Col>
                <Col xs={24} md={12}>
                  <InfoField label="Address Line 2" value="Bagalur Road" />
                </Col>
                <Col xs={24} md={8}>
                  <InfoField label="State" value="Tamil Nadu" />
                </Col>
                <Col xs={24} md={8}>
                  <InfoField label="City" value="Hosur" />
                </Col>
                <Col xs={24} md={8}>
                  <InfoField label="Pincode" value="635109" />
                </Col>
              </Row>
            </Section>

            <Section title="Bank Details" icon={<AccountBookOutlined style={{ fontSize: 24, color: primaryColor }} />}>
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <InfoField label="Bank Name" value="" />
                </Col>
                <Col xs={24} md={12}>
                  <InfoField label="Account Number" value="" />
                </Col>
                <Col xs={24} md={12}>
                  <InfoField label="IFSC Code" value="" />
                </Col>
                <Col xs={24} md={12}>
                  <InfoField label="Branch" value="" />
                </Col>
              </Row>
            </Section>
          </Col>

          <Col xs={24} lg={8}>
            <div style={{
              background: sectionBg, border: `1px solid ${sectionBorder}`,
              borderRadius: 16, padding: 24,
              position: 'sticky', top: 20, textAlign: 'center',
            }}>
              <Title level={5} style={{ marginBottom: 20, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center' }}><PictureOutlined style={{ fontSize: 24, color: primaryColor }} /></span> Company Logo
              </Title>
              <div style={{
                margin: '0 auto 20px', width: 160, height: 160, borderRadius: 24,
                background: isDark ? '#0d3554' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px dashed ${primaryColor}`,
                boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: 100, height: 100, borderRadius: 20,
                  background: primaryColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 900, fontSize: 28,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }}>
                  PK&I
                </div>
              </div>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                style={{ width: '100%', height: 40, borderRadius: 10, background: primaryColor, border: 'none', fontWeight: 600 }}
              >
                Upload New Logo
              </Button>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 12 }}>
                Recommended size: 512×512px. Max 2MB.
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
