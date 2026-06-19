export const mockProjects = [
  { id: '1', createdDate: '2024-01-15', projectCode: 'PRJ-001', projectName: 'Luxury Villa Interior', clientId: '1', clientName: 'Rahul Sharma', budget: 2500000, amountReceived: 1000000, city: 'Mumbai', state: 'Maharashtra', stage: 'Designing', phone: '+91 98765 43210', email: 'rahul@example.com' },
  { id: '2', createdDate: '2024-01-20', projectCode: 'PRJ-002', projectName: 'Office Renovation', clientId: '2', clientName: 'Priya Patel', budget: 1800000, amountReceived: 720000, city: 'Pune', state: 'Maharashtra', stage: 'Execution', phone: '+91 87654 32109', email: 'priya@example.com' },
  { id: '3', createdDate: '2024-02-01', projectCode: 'PRJ-003', projectName: 'Penthouse Design', clientId: '3', clientName: 'Amit Gupta', budget: 4500000, amountReceived: 1800000, city: 'Delhi', state: 'Delhi', stage: 'Sales', phone: '+91 76543 21098', email: 'amit@example.com' },
  { id: '4', createdDate: '2024-02-10', projectCode: 'PRJ-004', projectName: 'Restaurant Makeover', clientId: '4', clientName: 'Sneha Reddy', budget: 3200000, amountReceived: 1280000, city: 'Hyderabad', state: 'Telangana', stage: 'Snags', phone: '+91 65432 10987', email: 'sneha@example.com' },
  { id: '5', createdDate: '2024-02-15', projectCode: 'PRJ-005', projectName: 'Farmhouse Interior', clientId: '5', clientName: 'Vikram Singh', budget: 5000000, amountReceived: 2000000, city: 'Jaipur', state: 'Rajasthan', stage: 'Completed', phone: '+91 54321 09876', email: 'vikram@example.com' },
  { id: '6', createdDate: '2024-03-01', projectCode: 'PRJ-006', projectName: 'Studio Apartment', clientId: '6', clientName: 'Neha Kapoor', budget: 800000, amountReceived: 320000, city: 'Bangalore', state: 'Karnataka', stage: 'Handover', phone: '+91 43210 98765', email: 'neha@example.com' },
  { id: '7', createdDate: '2024-03-10', projectCode: 'PRJ-007', projectName: 'Corporate HQ', clientId: '7', clientName: 'Rajesh Iyer', budget: 8000000, amountReceived: 3200000, city: 'Chennai', state: 'Tamil Nadu', stage: 'Designing', phone: '+91 32109 87654', email: 'rajesh@example.com' },
  { id: '8', createdDate: '2024-03-15', projectCode: 'PRJ-008', projectName: 'Boutique Hotel Lobby', clientId: '8', clientName: 'Ananya Das', budget: 6500000, amountReceived: 2600000, city: 'Kolkata', state: 'West Bengal', stage: 'Execution', phone: '+91 21098 76543', email: 'ananya@example.com' },
  { id: '9', createdDate: '2024-04-01', projectCode: 'PRJ-009', projectName: 'Urban Apartment Layout', clientId: '1', clientName: 'Rahul Sharma', budget: 1500000, amountReceived: 500000, city: 'Mumbai', state: 'Maharashtra', stage: 'Sales', phone: '+91 98765 43210', email: 'rahul@example.com' },
  { id: '10', createdDate: '2024-04-10', projectCode: 'PRJ-010', projectName: 'Co-working Cafe Design', clientId: '2', clientName: 'Priya Patel', budget: 2200000, amountReceived: 1500000, city: 'Pune', state: 'Maharashtra', stage: 'Completed', phone: '+91 87654 32109', email: 'priya@example.com' },
];

export const mockClients = [
  { id: '1', createdDate: '2024-01-10', legalName: 'Sharma Enterprises Pvt Ltd', clientName: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@example.com', city: 'Mumbai', state: 'Maharashtra', pan: 'ABCPS1234F', gst: '27ABCPS1234F1Z5' },
  { id: '2', createdDate: '2024-01-18', legalName: 'Patel Constructions', clientName: 'Priya Patel', phone: '+91 87654 32109', email: 'priya@example.com', city: 'Pune', state: 'Maharashtra', pan: 'DEFPP5678G', gst: '27DEFPP5678G1Z3' },
  { id: '3', createdDate: '2024-01-25', legalName: 'Gupta Holdings', clientName: 'Amit Gupta', phone: '+91 76543 21098', email: 'amit@example.com', city: 'Delhi', state: 'Delhi', pan: 'GHIAG9012H', gst: '07GHIAG9012H1Z1' },
  { id: '4', createdDate: '2024-02-05', legalName: 'Reddy Foods Pvt Ltd', clientName: 'Sneha Reddy', phone: '+91 65432 10987', email: 'sneha@example.com', city: 'Hyderabad', state: 'Telangana' },
  { id: '5', createdDate: '2024-02-12', legalName: 'Singh Properties', clientName: 'Vikram Singh', phone: '+91 54321 09876', email: 'vikram@example.com', city: 'Jaipur', state: 'Rajasthan' },
  { id: '6', createdDate: '2024-02-20', legalName: 'Kapoor Interiors', clientName: 'Neha Kapoor', phone: '+91 43210 98765', email: 'neha@example.com', city: 'Bangalore', state: 'Karnataka' },
  { id: '7', createdDate: '2024-03-05', legalName: 'Iyer Associates', clientName: 'Rajesh Iyer', phone: '+91 32109 87654', email: 'rajesh@example.com', city: 'Chennai', state: 'Tamil Nadu' },
  { id: '8', createdDate: '2024-03-12', legalName: 'Das Studio', clientName: 'Ananya Das', phone: '+91 21098 76543', email: 'ananya@example.com', city: 'Kolkata', state: 'West Bengal' },
];

export const mockTasks = [
  { id: '1', title: 'Site measurement', projectName: 'Luxury Villa Interior', clientName: 'Rahul Sharma', assignee: 'Arjun M.', createdDate: '2024-03-01', dueDate: '2024-03-15', priority: 'High', status: 'In Progress', type: 'Site Visit' },
  { id: '2', title: 'Design mood board', projectName: 'Luxury Villa Interior', clientName: 'Rahul Sharma', assignee: 'Kavya S.', createdDate: '2024-03-02', dueDate: '2024-03-20', priority: 'Medium', status: 'Created', type: 'Design' },
  { id: '3', title: 'Client presentation', projectName: 'Office Renovation', clientName: 'Priya Patel', assignee: 'Arjun M.', createdDate: '2024-03-05', dueDate: '2024-03-18', priority: 'Urgent', status: 'In Progress', type: 'Meeting' },
  { id: '4', title: 'Material procurement', projectName: 'Penthouse Design', clientName: 'Amit Gupta', assignee: 'Rohan K.', createdDate: '2024-03-08', dueDate: '2024-03-25', priority: 'High', status: 'Created', type: 'Procurement' },
  { id: '5', title: 'Electrical layout', projectName: 'Office Renovation', clientName: 'Priya Patel', assignee: 'Deepak R.', createdDate: '2024-03-10', dueDate: '2024-03-22', priority: 'Medium', status: 'Completed', type: 'Design' },
  { id: '6', title: 'Final walkthrough', projectName: 'Farmhouse Interior', clientName: 'Vikram Singh', assignee: 'Arjun M.', createdDate: '2024-02-28', dueDate: '2024-03-10', priority: 'Low', status: 'Completed', type: 'Site Visit' },
  { id: '7', title: 'Snag list review', projectName: 'Restaurant Makeover', clientName: 'Sneha Reddy', assignee: 'Kavya S.', createdDate: '2024-03-12', dueDate: '2024-03-28', priority: 'High', status: 'On Hold', type: 'Review' },
  { id: '8', title: 'Budget revision', projectName: 'Penthouse Design', clientName: 'Amit Gupta', assignee: 'Rohan K.', createdDate: '2024-03-14', dueDate: '2024-03-30', priority: 'Medium', status: 'Created', type: 'Finance' },
  { id: '9', title: 'Old vendor follow-up', projectName: 'Studio Apartment', clientName: 'Neha Kapoor', assignee: 'Deepak R.', createdDate: '2024-02-20', dueDate: '2024-03-05', priority: 'Low', status: 'Discarded', type: 'Procurement' },
];

export const stages = ['All', 'Sales', 'Designing', 'Execution', 'Snags', 'Handover', 'Completed'];
export const taskStatuses = ['Created', 'In Progress', 'Completed', 'On Hold', 'Discarded'];
export const priorities = ['Low', 'Medium', 'High', 'Urgent'];
export const indianStates = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Rajasthan', 'West Bengal', 'Gujarat', 'Uttar Pradesh', 'Kerala'];
