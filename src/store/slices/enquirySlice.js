import { createSlice } from '@reduxjs/toolkit';

const generateFollowUps = (count) => {
  const statuses = ['Warm', 'Hot', 'Cold'];
  const followStatuses = ['Contacted', 'Not Reachable', 'Call Back', 'Meeting Fixed'];
  const agents = ['Sales Person 1', 'Webinar Demo-Admin', 'Sales Person 2'];
  const remarks = ['Call again to confirm', 'Call Back', 'Interested, send proposal', 'Meeting scheduled'];
  const result = [];
  for (let i = count; i >= 1; i--) {
    result.push({
      id: i,
      date: `Feb ${5 + i}, 2026`,
      prospectStatus: statuses[i % 3],
      followUpStatus: i === 1 ? '—' : followStatuses[i % 4],
      nextFollowUp: `Feb ${6 + i}, 2026 - ${10 + (i % 3)}:00 ${i % 2 === 0 ? 'AM' : 'PM'}`,
      followUpBy: agents[i % 3],
      remarks: remarks[i % 4],
      number: count - i + 1,
    });
  }
  return result;
};

export const STAFF_MEMBERS = [
  { id: 1, name: 'Arjun M.', avatar: 'AM' },
  { id: 2, name: 'Kavya S.', avatar: 'KS' },
  { id: 3, name: 'Rohan K.', avatar: 'RK' },
  { id: 4, name: 'Deepak R.', avatar: 'DR' },
  { id: 5, name: 'Sales Person 1', avatar: 'S1' },
];

const mockEnquiries = [
  {
    id: 'ENQ-2026-030',
    enquiryDate: '2026-02-08',
    name: 'Mr. Suresh',
    phone: '+91 73586 23475',
    email: 'suresh@gmail.com',
    projectType: 'Residential',
    source: 'Instagram',
    assignedTo: 'Arjun M.',
    occupation: 'IT',
    address: 'BAFANA NIWAS, AUND HINEWADI WAKAD CHOWK, PERUNGUDI, Chennai, Tamil Nadu, India, 560016',
    remarks: '',
    siteStatus: 'Under Construction',
    projectSubtype: 'Individual Villa',
    siteLocation: 'Hyderabad',
    siteSize: '3BHK',
    siteAddress: 'BAFANA NIWAS, AUND HINEWADI WAKAD CHOWK, Chennai, Tamil Nadu, India, 560016',
    gstNo: '',
    files: {
      site: [
        { id: 1, name: 'Site Picture 1', date: 'Feb 11, 2026', type: 'image' },
        { id: 2, name: 'Site Picture 2', date: 'Feb 11, 2026', type: 'image' },
        { id: 3, name: 'Site Picture 3', date: 'Feb 11, 2026', type: 'image' },
        { id: 4, name: 'Site Picture 4', date: 'Feb 11, 2026', type: 'image' },
      ],
      design: [
        { id: 5, name: 'Builder Floor Plan', date: 'Feb 11, 2026', type: 'pdf' },
        { id: 6, name: 'Builder Floor Plan revised version', date: 'Feb 11, 2026', type: 'pdf' },
      ],
      other: [
        { id: 7, name: 'Requirement', date: 'Feb 11, 2026', type: 'pdf' },
      ],
    },
    followUps: [
      {
        id: 8,
        date: 'Feb 25, 2026',
        prospectStatus: 'Warm',
        followUpStatus: '—',
        nextFollowUp: 'Feb 25, 2026 - 12:00 PM',
        followUpBy: 'Sales Person 1',
        remarks: 'Call again to confirm',
        number: 8,
      },
      {
        id: 7,
        date: 'Feb 17, 2026',
        prospectStatus: 'Hot',
        followUpStatus: 'Contacted',
        nextFollowUp: 'Feb 18, 2026 - 10:00 AM',
        followUpBy: 'Webinar Demo-Admin',
        remarks: 'Call Back',
        number: 7,
      },
      {
        id: 6,
        date: 'Feb 10, 2026',
        prospectStatus: 'Warm',
        followUpStatus: 'Contacted',
        nextFollowUp: 'Feb 12, 2026 - 10:00 AM',
        followUpBy: 'Webinar Demo-Admin',
        remarks: 'Call Back',
        number: 6,
      },
    ],
    proposals: [],
    convertedToClient: false,
    clientData: null,
  },
  {
    id: 'ENQ-2026-029',
    enquiryDate: '2026-02-07',
    name: 'Mr. Ramesh',
    phone: '+91 98765 98034',
    email: 'ramesh@gmail.com',
    projectType: 'Residential',
    source: 'Google',
    assignedTo: 'Kavya S.',
    occupation: 'Business',
    address: 'No. 12, Anna Nagar, Chennai, Tamil Nadu, India, 600040',
    remarks: '',
    siteStatus: 'Ready to Start',
    projectSubtype: 'Apartment',
    siteLocation: 'Chennai',
    siteSize: '2BHK',
    siteAddress: 'No. 12, Anna Nagar, Chennai, Tamil Nadu, India, 600040',
    gstNo: '',
    files: { site: [], design: [], other: [] },
    followUps: generateFollowUps(3),
    proposals: [],
  },
  {
    id: 'ENQ-2026-028',
    enquiryDate: '2026-02-06',
    name: 'Mr. Jack',
    phone: '+91 98765 42310',
    email: 'jack@gmail.com',
    projectType: 'Residential',
    source: 'Facebook',
    occupation: 'Engineer',
    address: '45, MG Road, Bangalore, Karnataka, India, 560001',
    remarks: 'Urgent requirement',
    siteStatus: 'Planning Stage',
    projectSubtype: 'Villa',
    siteLocation: 'Bangalore',
    siteSize: '4BHK',
    siteAddress: '45, MG Road, Bangalore, Karnataka, India, 560001',
    gstNo: 'GSTIN29AABCU9603R1ZN',
    files: { site: [], design: [], other: [] },
    followUps: generateFollowUps(2),
    proposals: [],
  },
  {
    id: 'ENQ-2026-027',
    enquiryDate: '2026-02-03',
    name: 'Mr. Rahul',
    phone: '+91 734 568 9723',
    email: 'rahul@gmail.com',
    projectType: 'Renovation',
    source: 'Instagram',
    occupation: 'Doctor',
    address: '7, Nehru Place, New Delhi, India, 110019',
    remarks: '',
    siteStatus: 'Under Construction',
    projectSubtype: 'Independent House',
    siteLocation: 'Delhi',
    siteSize: '3BHK',
    siteAddress: '7, Nehru Place, New Delhi, India, 110019',
    gstNo: '',
    files: { site: [], design: [], other: [] },
    followUps: generateFollowUps(4),
    proposals: [],
  },
  {
    id: 'ENQ-2026-026',
    enquiryDate: '2026-02-03',
    name: 'Mr. Ajmal',
    phone: '+91 2345 623 459',
    email: 'ajmal@gmail.com',
    projectType: 'Residential',
    source: 'Google',
    occupation: 'Lawyer',
    address: '22, Brigade Road, Bangalore, Karnataka, India, 560025',
    remarks: '',
    siteStatus: 'Ready to Start',
    projectSubtype: 'Penthouse',
    siteLocation: 'Bangalore',
    siteSize: '5BHK',
    siteAddress: '22, Brigade Road, Bangalore, Karnataka, India, 560025',
    gstNo: '',
    files: { site: [], design: [], other: [] },
    followUps: generateFollowUps(2),
    proposals: [],
  },
  {
    id: 'ENQ-2026-025',
    enquiryDate: '2026-02-02',
    name: 'Mr. Sundar',
    phone: '+91 89259 32143',
    email: 'sundar@gmail.com',
    projectType: 'Residential',
    source: 'Facebook',
    occupation: 'Architect',
    address: '3, Boat Club Road, Pune, Maharashtra, India, 411001',
    remarks: 'Looking for modern design',
    siteStatus: 'Planning Stage',
    projectSubtype: 'Row House',
    siteLocation: 'Pune',
    siteSize: '3BHK',
    siteAddress: '3, Boat Club Road, Pune, Maharashtra, India, 411001',
    gstNo: '',
    files: { site: [], design: [], other: [] },
    followUps: generateFollowUps(3),
    proposals: [],
  },
  {
    id: 'ENQ-2026-024',
    enquiryDate: '2026-01-27',
    name: 'Mr. Albert',
    phone: '+91 88790 04567',
    email: 'alberts@gmail.com',
    projectType: 'Residential',
    source: 'Facebook',
    occupation: 'Businessman',
    address: '10, Park Street, Kolkata, West Bengal, India, 700016',
    remarks: '',
    siteStatus: 'Under Construction',
    projectSubtype: 'Duplex',
    siteLocation: 'Kolkata',
    siteSize: '4BHK',
    siteAddress: '10, Park Street, Kolkata, West Bengal, India, 700016',
    gstNo: '',
    files: { site: [], design: [], other: [] },
    followUps: generateFollowUps(2),
    proposals: [],
  },
  {
    id: 'ENQ-2026-023',
    enquiryDate: '2026-01-05',
    name: 'Mr. Janesh',
    phone: '+91 88099 01201',
    email: 'jane@gmail.com',
    projectType: 'Residential',
    source: 'Advertisement',
    occupation: 'Consultant',
    address: '15, MRC Nagar, Chennai, Tamil Nadu, India, 600028',
    remarks: '',
    siteStatus: 'Ready to Start',
    projectSubtype: 'Apartment',
    siteLocation: 'Chennai',
    siteSize: '2BHK',
    siteAddress: '15, MRC Nagar, Chennai, Tamil Nadu, India, 600028',
    gstNo: '',
    files: { site: [], design: [], other: [] },
    followUps: generateFollowUps(1),
    proposals: [],
  },
  {
    id: 'ENQ-2026-022',
    enquiryDate: '2026-01-02',
    name: 'Ms. Priya',
    phone: '+91 99887 65432',
    email: 'priya@gmail.com',
    projectType: 'Commercial',
    source: 'Referral',
    occupation: 'CA',
    address: '8, T Nagar, Chennai, Tamil Nadu, India, 600017',
    remarks: 'Office renovation needed',
    siteStatus: 'Planning Stage',
    projectSubtype: 'Office Space',
    siteLocation: 'Chennai',
    siteSize: '1500 sqft',
    siteAddress: '8, T Nagar, Chennai, Tamil Nadu, India, 600017',
    gstNo: 'GSTIN33AABCP9603R1ZM',
    files: { site: [], design: [], other: [] },
    followUps: generateFollowUps(5),
    proposals: [],
  },
];

// Generate remaining enquiries to fill up to 30
for (let i = 21; i >= 1; i--) {
  const sources = ['Instagram', 'Google', 'Facebook', 'Referral', 'Advertisement', 'Website'];
  const types = ['Residential', 'Commercial', 'Renovation', 'Interior'];
  const names = ['Mr. Kumar', 'Ms. Lakshmi', 'Mr. Rajan', 'Ms. Divya', 'Mr. Arun', 'Mr. Vijay', 'Ms. Kavitha', 'Mr. Siva'];
  const cities = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];
  mockEnquiries.push({
    id: `ENQ-2026-0${i < 10 ? '0' + i : i}`,
    enquiryDate: `2026-01-${i < 10 ? '0' + i : i}`,
    name: names[i % names.length],
    phone: `+91 ${Math.floor(70000 + Math.random() * 29999)} ${Math.floor(10000 + Math.random() * 89999)}`,
    email: `user${i}@gmail.com`,
    projectType: types[i % types.length],
    source: sources[i % sources.length],
    occupation: 'Professional',
    address: `${i}, Sample Street, ${cities[i % cities.length]}, India`,
    remarks: '',
    siteStatus: 'Planning Stage',
    projectSubtype: 'Apartment',
    siteLocation: cities[i % cities.length],
    siteSize: '2BHK',
    siteAddress: `${i}, Sample Street, ${cities[i % cities.length]}, India`,
    gstNo: '',
    files: { site: [], design: [], other: [] },
    followUps: [],
    proposals: [],
    convertedToClient: false,
    clientData: null,
  });
}

const enquirySlice = createSlice({
  name: 'enquiry',
  initialState: {
    enquiries: mockEnquiries,
  },
  reducers: {
    addEnquiry: (state, action) => {
      state.enquiries.unshift(action.payload);
    },
    updateEnquiry: (state, action) => {
      const idx = state.enquiries.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state.enquiries[idx] = action.payload;
    },
    deleteEnquiry: (state, action) => {
      state.enquiries = state.enquiries.filter(e => e.id !== action.payload);
    },
    addFollowUp: (state, action) => {
      const { enquiryId, followUp } = action.payload;
      const enq = state.enquiries.find(e => e.id === enquiryId);
      if (enq) enq.followUps.unshift(followUp);
    },
    addProposal: (state, action) => {
      const { enquiryId, proposal } = action.payload;
      const enq = state.enquiries.find(e => e.id === enquiryId);
      if (enq) enq.proposals.unshift(proposal);
    },
    updateProposal: (state, action) => {
      const { enquiryId, proposal } = action.payload;
      const enq = state.enquiries.find(e => e.id === enquiryId);
      if (enq) {
        const idx = enq.proposals.findIndex(p => p.id === proposal.id);
        if (idx !== -1) enq.proposals[idx] = proposal;
      }
    },
    deleteProposal: (state, action) => {
      const { enquiryId, proposalId } = action.payload;
      const enq = state.enquiries.find(e => e.id === enquiryId);
      if (enq) enq.proposals = enq.proposals.filter(p => p.id !== proposalId);
    },
    addFile: (state, action) => {
      const { enquiryId, fileType, file } = action.payload;
      const enq = state.enquiries.find(e => e.id === enquiryId);
      if (enq && enq.files[fileType]) enq.files[fileType].push(file);
    },
    deleteFile: (state, action) => {
      const { enquiryId, fileType, fileId } = action.payload;
      const enq = state.enquiries.find(e => e.id === enquiryId);
      if (enq && enq.files[fileType]) {
        enq.files[fileType] = enq.files[fileType].filter(f => f.id !== fileId);
      }
    },
    assignEnquiry: (state, action) => {
      const { enquiryId, personName } = action.payload;
      const enq = state.enquiries.find(e => e.id === enquiryId);
      if (enq) enq.assignedTo = personName;
    },
    convertToClient: (state, action) => {
      const { enquiryId, clientData } = action.payload;
      const enq = state.enquiries.find(e => e.id === enquiryId);
      if (enq) {
        enq.convertedToClient = true;
        enq.clientData = clientData;
      }
    },
  },
});

export const {
  addEnquiry, updateEnquiry, deleteEnquiry,
  addFollowUp, addProposal, updateProposal, deleteProposal,
  addFile, deleteFile, assignEnquiry, convertToClient,
} = enquirySlice.actions;

export default enquirySlice.reducer;