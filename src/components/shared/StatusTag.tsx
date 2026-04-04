import React from 'react';
import { Tag } from 'antd';

const stageColors: Record<string, string> = {
  Sales: '#1677FF',
  Designing: '#C8A75D',
  Execution: '#722ED1',
  Snags: '#FF4D4F',
  Handover: '#FAAD14',
  Completed: '#52C41A',
};

const priorityColors: Record<string, string> = {
  Low: '#52C41A',
  Medium: '#1677FF',
  High: '#FAAD14',
  Urgent: '#FF4D4F',
};

interface StatusTagProps {
  value: string;
  type?: 'stage' | 'priority';
}

const StatusTag: React.FC<StatusTagProps> = ({ value, type = 'stage' }) => {
  const colors = type === 'priority' ? priorityColors : stageColors;
  return (
    <Tag
      color={colors[value] || '#888'}
      style={{ borderRadius: 6, fontWeight: 500, fontSize: 12 }}
    >
      {value}
    </Tag>
  );
};

export default StatusTag;
