import { Tag } from 'antd';

const stageColors = {
  Sales: '#1677FF',
  Designing: '#B19625',
  Execution: '#722ED1',
  Snags: '#FF4D4F',
  Handover: '#FAAD14',
  Completed: '#52C41A',
};

const priorityColors = {
  Low: '#52C41A',
  Medium: '#1677FF',
  High: '#FAAD14',
  Urgent: '#FF4D4F',
};

const StatusTag = ({ value, type = 'stage' }) => {
  const colors = type === 'priority' ? priorityColors : stageColors;
  return (
    <Tag
      color={colors[value] || '#888'}
      style={{ borderRadius: 6, fontWeight: 600, fontSize: 11, padding: '2px 8px' }}
    >
      {value}
    </Tag>
  );
};

export default StatusTag;
