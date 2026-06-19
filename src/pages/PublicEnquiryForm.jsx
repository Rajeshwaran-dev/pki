import { useState, useRef } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, AutoComplete, Spin, Result, Tooltip } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { addEnquiry } from '@/store/slices/enquirySlice';
import useLiveLocation from '@/hooks/useLiveLocation';
import dayjs from 'dayjs';

const PROJECT_TYPES = ['Residential', 'Commercial', 'Renovation', 'Interior'];
const SITE_STATUSES = ['Planning Stage', 'Ready to Start', 'Under Construction'];
const PROJECT_SUBTYPES = ['Apartment', 'Villa', 'Individual Villa', 'Duplex', 'Penthouse', 'Row House', 'Office Space', 'Independent House'];
const OCCUPATIONS = ['IT', 'Business', 'Engineer', 'Doctor', 'Lawyer', 'Architect', 'Businessman', 'Consultant', 'CA', 'Professional'];

const PublicEnquiryForm = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);
  const enquiries = useAppSelector(s => s.enquiry.enquiries);

  const searchTimeoutRef = useRef(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const { fetchingLiveLocation, fetchLiveLocation } = useLiveLocation();

  const handleLocationSearch = (value) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!value) {
      setLocationOptions([]);
      return;
    }
    setFetchingLocation(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=10&countrycodes=in`);
        const data = await res.json();
        const options = data.map(item => ({
          value: item.display_name,
          label: item.display_name,
        }));
        setLocationOptions(options);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setFetchingLocation(false);
      }
    }, 600);
  };

  const onFinish = (values) => {
    const newId = `ENQ-${new Date().getFullYear()}-${String(enquiries.length + 1).padStart(3, '0')}`;
    dispatch(addEnquiry({
      id: newId,
      enquiryDate: dayjs().format('YYYY-MM-DD'),
      name: values.name,
      phone: `+91 ${values.phone}`,
      email: values.email || '',
      projectType: values.projectType || 'Residential',
      source: 'Website', // Default to website for public form
      occupation: values.occupation || '',
      address: values.address || '',
      location: values.location || '',
      remarks: values.remarks || '',
      siteStatus: values.siteStatus || 'Planning Stage',
      projectSubtype: values.projectSubtype || 'Apartment',
      siteLocation: values.siteLocation || '',
      siteSize: values.siteSize || '',
      siteAddress: values.siteAddress || '',
      gstNo: values.gstNo || '',
      assignedTo: null,
      files: { site: [], design: [], other: [] },
      followUps: [],
      proposals: [],
    }));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa', padding: 20 }}>
        <div style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: 500, width: '100%' }}>
          <Result
            status="success"
            title="Thank You for Reaching Out!"
            subTitle="Your enquiry has been successfully submitted. Our team will contact you shortly."
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ background: '#D69F6D', padding: '30px 40px', color: '#fff', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Perspective Kitchen</h1>
          <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: 16 }}>Please fill out your details to complete the enquiry process.</p>
        </div>
        
        <div style={{ padding: '40px' }}>
          <Form form={form} layout="vertical" onFinish={onFinish} size="large" className="crm-form-shell">
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>Primary Information</h3>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="e.g. Mr. Suresh" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Phone is required' }]}>
                    <Input addonBefore="+91" placeholder="73586 23475" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Enter valid email' }]}>
                    <Input placeholder="email@example.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="occupation" label="Occupation">
                    <Select placeholder="Select occupation" options={OCCUPATIONS.map(o => ({ value: o, label: o }))} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="address" label="Address">
                <Input.TextArea rows={2} placeholder="Full address" />
              </Form.Item>
              <Form.Item name="location" label="Location (Area / Street)">
                <AutoComplete
                  options={locationOptions}
                  onSearch={handleLocationSearch}
                  placeholder="Type to search location... e.g. Anna Nagar"
                  notFoundContent={fetchingLocation ? <Spin size="small" /> : null}
                >
                  <Input addonAfter={<Tooltip title="Fetch Live Location">{fetchingLiveLocation ? <Spin size="small" /> : <AimOutlined style={{ cursor: 'pointer', color: '#D69F6D' }} onClick={() => fetchLiveLocation(form, 'location')} />}</Tooltip>} />
                </AutoComplete>
              </Form.Item>
            </div>

            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>Project Details</h3>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="projectType" label="Project Type">
                    <Select placeholder="Select type" options={PROJECT_TYPES.map(t => ({ value: t, label: t }))} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="projectSubtype" label="Project Subtype">
                    <Select placeholder="Select subtype" options={PROJECT_SUBTYPES.map(t => ({ value: t, label: t }))} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="siteStatus" label="Site Status">
                    <Select placeholder="Select status" options={SITE_STATUSES.map(s => ({ value: s, label: s }))} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="siteLocation" label="Site Location">
                    <Input placeholder="e.g. Hyderabad" addonAfter={<Tooltip title="Fetch Live Location">{fetchingLiveLocation ? <Spin size="small" /> : <AimOutlined style={{ cursor: 'pointer', color: '#D69F6D' }} onClick={() => fetchLiveLocation(form, 'siteLocation')} />}</Tooltip>} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="siteSize" label="Site Size">
                    <Input placeholder="e.g. 3BHK, 1500 sqft" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="gstNo" label="GST No">
                    <Input placeholder="GST Number" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>Additional Notes</h3>
              <Form.Item name="remarks">
                <Input.TextArea rows={4} placeholder="Any specific requirements or details you'd like to share..." />
              </Form.Item>
            </div>

            <Form.Item style={{ margin: 0 }}>
              <Button type="primary" htmlType="submit" size="large" block style={{ height: 48, fontSize: 16, fontWeight: 600, background: '#D69F6D', border: 'none', borderRadius: 8 }}>
                Submit Enquiry
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PublicEnquiryForm;
